import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const viewer = document.querySelector(".interactive-viewer");

if (viewer) {
  const stage = viewer.querySelector(".interactive-stage");
  const loading = viewer.querySelector(".scene-loading");
  const loadingTitle = loading.querySelector("strong");
  const loadingDetail = loading.querySelector("small");
  const readout = viewer.querySelector(".object-readout");
  const readoutName = readout.querySelector("strong");
  const statusLabel = viewer.querySelector(".interaction-status strong");
  const statusDetail = viewer.querySelector(".interaction-status em");
  const resetButton = viewer.querySelector(".scene-reset");
  const modelTabs = [...viewer.querySelectorAll("[data-model]")];

  const models = {
    replica6: {
      label: "Replica · Scan 6",
      url: "assets/replica-scan6.glb",
      count: 12,
      accent: 0xd98591,
      postRotationX: -Math.PI / 2,
    },
    scannetpp2: {
      label: "ScanNet++ · Scan 2",
      url: "assets/scannetpp-scan2.glb",
      count: 25,
      accent: 0xc69bd0,
      postRotationX: -Math.PI / 2,
    },
    scannetpp3: {
      label: "ScanNet++ · Scan 3",
      url: "assets/scannetpp-scan3.glb",
      count: 16,
      accent: 0xe29aa0,
      postRotationX: -Math.PI / 2,
    },
    replica1: {
      label: "Replica · Scan 1",
      url: "assets/replica-scan1.glb",
      count: 10,
      accent: 0x79d8c9,
      postRotationX: -Math.PI / 2,
    },
    berlin: {
      label: "Berlin · Scene 6",
      url: "assets/berlin-6-nobg.glb",
      count: 36,
      accent: 0xe29aa0,
      // The GLB roots already contain the required -90° X rotation.
      postRotationX: 0,
    },
    /* Blender Scene 7 is temporarily disabled while its GLB is excluded from Git.
    blender: {
      label: "Blender · Scene 7",
      url: "assets/blender-7-nobg.glb",
      count: 62,
      accent: 0xc69bd0,
      // The GLB root already contains the required -90° X rotation.
      postRotationX: 0,
    },
    */
  };

  let currentModel = "replica6";
  let initialized = false;
  let loadVersion = 0;
  let renderer;
  let scene;
  let environmentTarget;
  let camera;
  let controls;
  let sceneRoot;
  let groundVisual;
  let gridVisual;
  let resizeObserver;
  let visibilityObserver;
  let isViewerVisible = false;
  let selectedEntry = null;
  let hoveredEntry = null;
  let activeGrab = null;
  let selectionBox = null;
  let homeCamera = null;
  let homeTarget = null;
  let lastFrameTime = performance.now();
  let objects = [];

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const tempDelta = new THREE.Vector3();

  function setLoading(title, detail, progress = 10) {
    loading.classList.remove("is-hidden", "is-error");
    loadingTitle.textContent = title;
    loadingDetail.textContent = detail;
    loading.style.setProperty("--load-progress", `${Math.max(4, Math.min(progress, 100))}%`);
  }

  function setStatus(label, detail) {
    statusLabel.textContent = label;
    statusDetail.textContent = detail;
  }

  function formatObjectName(name) {
    const number = String(name || "object").match(/\d+/)?.[0];
    return number ? `Object ${number.padStart(3, "0")}` : String(name || "Scene object").replaceAll("_", " ");
  }

  function updatePointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function raycastObject(event) {
    if (!camera || objects.length === 0) return null;
    updatePointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(objects.map((entry) => entry.mesh), false)[0];
    return hit ? { hit, entry: hit.object.userData.sceneEntry } : null;
  }

  function showReadout(entry) {
    hoveredEntry = entry;
    renderer?.domElement.classList.toggle("object-hover", Boolean(entry));
    readout.classList.toggle("is-visible", Boolean(entry));
    if (entry) readoutName.textContent = formatObjectName(entry.name);
  }

  function selectEntry(entry) {
    selectedEntry = entry;
    if (!selectionBox && scene) {
      selectionBox = new THREE.BoxHelper(entry.mesh, models[currentModel].accent);
      selectionBox.material.depthTest = false;
      selectionBox.material.transparent = true;
      selectionBox.material.opacity = 0.82;
      selectionBox.renderOrder = 5;
      scene.add(selectionBox);
    } else if (selectionBox) {
      selectionBox.setFromObject(entry.mesh);
      selectionBox.material.color.setHex(models[currentModel].accent);
      selectionBox.visible = true;
    }
    showReadout(entry);
  }

  function clearSelection() {
    selectedEntry = null;
    hoveredEntry = null;
    if (selectionBox) selectionBox.visible = false;
    showReadout(null);
  }

  function disposeMaterial(material, disposeTextures = false, disposedMaterials = new Set(), disposedTextures = new Set()) {
    const disposeOne = (item) => {
      if (!item || disposedMaterials.has(item)) return;
      disposedMaterials.add(item);
      if (disposeTextures) {
        Object.values(item).forEach((value) => {
          if (!value?.isTexture || disposedTextures.has(value)) return;
          disposedTextures.add(value);
          const image = value.source?.data;
          value.dispose();
          if (typeof image?.close === "function") image.close();
        });
      }
      item.dispose();
    };
    if (Array.isArray(material)) material.forEach(disposeOne);
    else disposeOne(material);
  }

  function disposeLoadedGltf(gltf) {
    const disposedMaterials = new Set();
    const disposedTextures = new Set();
    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      child.geometry?.dispose();
      disposeMaterial(child.material, true, disposedMaterials, disposedTextures);
    });
  }

  function endGrab() {
    if (!activeGrab) return;
    try {
      if (renderer?.domElement.hasPointerCapture(activeGrab.pointerId)) {
        renderer.domElement.releasePointerCapture(activeGrab.pointerId);
      }
    } catch {
      // Pointer capture can already be gone after a cancelled touch.
    }
    activeGrab = null;
    if (controls) controls.enabled = true;
    renderer?.domElement.classList.remove("is-grabbing");
    setStatus("Direct manipulation", `${objects.length} objects`);
  }

  function clearWorld() {
    const disposedMaterials = new Set();
    const disposedTextures = new Set();
    endGrab();
    clearSelection();
    if (selectionBox) {
      scene?.remove(selectionBox);
      selectionBox.geometry.dispose();
      selectionBox.material.dispose();
      selectionBox = null;
    }
    if (sceneRoot) {
      scene.remove(sceneRoot);
      sceneRoot.traverse((child) => {
        if (!child.isMesh) return;
        child.geometry.dispose();
        disposeMaterial(child.material, true, disposedMaterials, disposedTextures);
      });
      sceneRoot = null;
    }
    if (groundVisual) {
      scene.remove(groundVisual);
      groundVisual.geometry.dispose();
      groundVisual.material.dispose();
      groundVisual = null;
    }
    if (gridVisual) {
      scene.remove(gridVisual);
      gridVisual.geometry.dispose();
      gridVisual.material.dispose();
      gridVisual = null;
    }
    objects = [];
  }

  function prepareMaterial(material) {
    const prepare = (next) => {
      next.side = THREE.DoubleSide;
      if (next.isMeshStandardMaterial || next.isMeshPhysicalMaterial) {
        // These reconstructed GLBs omit metallicFactor, whose glTF default is
        // 1.0. Treat the scene textures as diffuse surfaces instead of metal.
        next.metalness = 0.0;
        next.roughness = 0.82;
        next.envMapIntensity = 0.9;
      }
      Object.values(next).forEach((value) => {
        if (!value?.isTexture) return;
        value.generateMipmaps = false;
        value.minFilter = THREE.LinearFilter;
        value.needsUpdate = true;
      });
      return next;
    };
    return Array.isArray(material) ? material.map(prepare) : prepare(material);
  }

  function prepareObjects(gltf) {
    gltf.scene.updateMatrixWorld(true);
    const prepared = [];
    const geometryUseCount = new Map();
    gltf.scene.traverse((source) => {
      if (!source.isMesh || !source.geometry) return;
      geometryUseCount.set(source.geometry, (geometryUseCount.get(source.geometry) || 0) + 1);
    });
    // source.matrixWorld includes transforms authored inside the GLB. Apply
    // only the model-specific correction that remains after those transforms.
    const postRotation = new THREE.Matrix4().makeRotationX(models[currentModel].postRotationX);
    gltf.scene.traverse((source) => {
      if (!source.isMesh || !source.geometry?.getAttribute("position")) return;
      // Most scene objects own their geometry, so take it over directly. Only
      // clone genuinely shared geometry to avoid transforming it more than once.
      const geometry = geometryUseCount.get(source.geometry) > 1
        ? source.geometry.clone()
        : source.geometry;
      geometry.applyMatrix4(source.matrixWorld);
      geometry.applyMatrix4(postRotation);
      if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      const rawBox = geometry.boundingBox.clone();
      const center = rawBox.getCenter(new THREE.Vector3());
      geometry.translate(-center.x, -center.y, -center.z);
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      const mesh = new THREE.Mesh(geometry, prepareMaterial(source.material));
      mesh.name = source.name || source.parent?.name || `object_${prepared.length + 1}`;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      prepared.push({ mesh, center, rawBox, name: mesh.name });
    });
    return prepared;
  }

  async function buildScene(gltf) {
    const prepared = prepareObjects(gltf);
    if (prepared.length === 0) throw new Error("The GLB does not contain any mesh objects.");

    const bounds = new THREE.Box3();
    prepared.forEach(({ rawBox }) => bounds.union(rawBox));
    const origin = new THREE.Vector3(
      (bounds.min.x + bounds.max.x) * 0.5,
      bounds.min.y,
      (bounds.min.z + bounds.max.z) * 0.5,
    );
    const sceneSize = bounds.getSize(new THREE.Vector3());
    const span = Math.max(sceneSize.x, sceneSize.z, sceneSize.y * 1.35, 2);

    sceneRoot = new THREE.Group();
    sceneRoot.name = `${currentModel}-interactive-objects`;
    scene.add(sceneRoot);

    for (let objectIndex = 0; objectIndex < prepared.length; objectIndex += 1) {
      const preparedObject = prepared[objectIndex];
      const initialPosition = preparedObject.center.clone().sub(origin);
      preparedObject.mesh.position.copy(initialPosition);
      const entry = {
        ...preparedObject,
        initialPosition,
      };
      preparedObject.mesh.userData.sceneEntry = entry;
      sceneRoot.add(preparedObject.mesh);
      objects.push(entry);
      if (objectIndex % 3 === 2 || objectIndex === prepared.length - 1) {
        const built = objectIndex + 1;
        setLoading("Preparing objects", `${built} / ${prepared.length}`, 90 + (built / prepared.length) * 9);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    }

    groundVisual = new THREE.Mesh(
      new THREE.PlaneGeometry(span * 2.9, span * 2.9),
      new THREE.MeshStandardMaterial({ color: 0xe1e1e1, roughness: 0.9, metalness: 0.01 }),
    );
    groundVisual.rotation.x = -Math.PI / 2;
    groundVisual.position.y = -0.018;
    groundVisual.receiveShadow = true;
    scene.add(groundVisual);

    gridVisual = new THREE.GridHelper(span * 2.9, 30, 0xb8b8b8, 0xd0d0d0);
    gridVisual.position.y = -0.012;
    gridVisual.material.transparent = true;
    gridVisual.material.opacity = 0.72;
    scene.add(gridVisual);

    homeTarget = new THREE.Vector3(0, Math.max(sceneSize.y * 0.32, 0.45), 0);
    homeCamera = new THREE.Vector3(span * 0.72, span * 0.58, span * 0.9).add(homeTarget);
    camera.near = Math.max(span / 1000, 0.01);
    camera.far = span * 14;
    camera.updateProjectionMatrix();
    controls.minDistance = span * 0.22;
    controls.maxDistance = span * 3.2;
    controls.target.copy(homeTarget);
    camera.position.copy(homeCamera);
    controls.update();
    renderer.shadowMap.needsUpdate = true;
  }

  async function loadScene(key) {
    const model = models[key];
    const version = ++loadVersion;
    currentModel = key;
    viewer.dataset.activeScene = key;
    modelTabs.forEach((tab) => {
      const selected = tab.dataset.model === key;
      tab.setAttribute("aria-selected", String(selected));
      tab.disabled = true;
    });
    resetButton.disabled = true;
    setStatus("Loading scene", model.label);
    setLoading("Preparing scene", "Starting the 3D viewer…", 8);
    clearWorld();

    try {
      setLoading("Loading reconstruction", model.label, 18);
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(model.url, (event) => {
        if (version !== loadVersion || !event.total) return;
        const progress = 18 + (event.loaded / event.total) * 67;
        setLoading("Loading reconstruction", `${Math.round(event.loaded / 1048576)} / ${Math.round(event.total / 1048576)} MB`, progress);
      });
      if (version !== loadVersion) {
        disposeLoadedGltf(gltf);
        return;
      }
      setLoading("Preparing objects", `${model.count} decomposed objects`, 90);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await buildScene(gltf);
      if (version !== loadVersion) return;
      loading.style.setProperty("--load-progress", "100%");
      setStatus("Viewer ready", `${objects.length} objects`);
      window.setTimeout(() => {
        if (version === loadVersion) loading.classList.add("is-hidden");
      }, 180);
    } catch (error) {
      console.error("Could not initialize the interactive reconstruction:", error);
      loading.classList.add("is-error");
      loadingTitle.textContent = "Scene unavailable";
      loadingDetail.textContent = "This scene could not be loaded. Try selecting it again.";
      setStatus("Viewer error", model.label);
    } finally {
      if (version === loadVersion) {
        modelTabs.forEach((tab) => { tab.disabled = false; });
        resetButton.disabled = objects.length === 0;
      }
    }
  }

  function beginGrab(event, target) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const { entry, hit } = target;
    selectEntry(entry);

    const grabDepth = Math.max(hit.point.clone().sub(raycaster.ray.origin).dot(raycaster.ray.direction), 0.1);
    activeGrab = {
      pointerId: event.pointerId,
      entry,
      depth: grabDepth,
      target: hit.point.clone(),
      anchorPosition: hit.point.clone(),
    };
    controls.enabled = false;
    renderer.domElement.classList.add("is-grabbing");
    renderer.domElement.setPointerCapture(event.pointerId);
    setStatus("Object grabbed", formatObjectName(entry.name));
  }

  function onPointerDown(event) {
    if (activeGrab || event.button !== 0) return;
    const target = raycastObject(event);
    if (target) beginGrab(event, target);
    else clearSelection();
  }

  function onPointerMove(event) {
    if (activeGrab && event.pointerId === activeGrab.pointerId) {
      event.preventDefault();
      updatePointer(event);
      raycaster.setFromCamera(pointer, camera);
      activeGrab.target.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, activeGrab.depth);
      return;
    }
    const target = raycastObject(event);
    showReadout(target?.entry || selectedEntry);
  }

  function onPointerEnd(event) {
    if (activeGrab?.pointerId !== event.pointerId) return;
    event.preventDefault();
    endGrab();
  }

  function resetScene() {
    if (objects.length === 0) return;
    endGrab();
    objects.forEach((entry) => {
      entry.mesh.position.copy(entry.initialPosition);
      entry.mesh.quaternion.identity();
    });
    clearSelection();
    if (homeCamera && homeTarget) {
      camera.position.copy(homeCamera);
      controls.target.copy(homeTarget);
      controls.update();
    }
    renderer.shadowMap.needsUpdate = true;
    setStatus("Scene reset", `${objects.length} decomposed objects`);
  }

  function resizeRenderer() {
    if (!renderer || !camera) return;
    const width = Math.max(stage.clientWidth, 1);
    const height = Math.max(stage.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function updateGrab(deltaTime) {
    if (!activeGrab) return;
    tempDelta.copy(activeGrab.target).sub(activeGrab.anchorPosition);
    const maxStep = Math.max(deltaTime * 7.5, 0.025);
    if (tempDelta.length() > maxStep) tempDelta.setLength(maxStep);
    activeGrab.anchorPosition.add(tempDelta);
    activeGrab.entry.mesh.position.add(tempDelta);
    renderer.shadowMap.needsUpdate = true;
  }

  function renderFrame(now) {
    requestAnimationFrame(renderFrame);
    const deltaTime = Math.min((now - lastFrameTime) / 1000, 1 / 30);
    lastFrameTime = now;
    if (!renderer || !scene || !camera || document.hidden) return;

    if (isViewerVisible) {
      updateGrab(deltaTime);
      if (selectionBox?.visible) selectionBox.setFromObject(selectedEntry.mesh);
    }
    if (isViewerVisible) {
      controls.update();
      renderer.render(scene, camera);
    }
  }

  function initializeViewer() {
    if (initialized) return;
    initialized = true;
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.domElement.tabIndex = 0;
    renderer.domElement.setAttribute("aria-label", "Interactive 3D scene. Drag an object to move it; drag empty space to orbit; scroll to zoom.");
    stage.prepend(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8e8e8);
    scene.fog = new THREE.FogExp2(0xe8e8e8, 0.008);
    const environmentGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    environmentTarget = environmentGenerator.fromScene(roomEnvironment, 0.04);
    scene.environment = environmentTarget.texture;
    scene.environmentIntensity = 0.9;
    roomEnvironment.dispose();
    environmentGenerator.dispose();
    camera = new THREE.PerspectiveCamera(42, 1, 0.01, 100);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI * 0.49;

    // Isaac Sim's new-stage defaultLight is a neutral DistantLight with
    // intensity 3000, angle 1 degree, and X rotation 315 degrees. Three.js
    // uses a different intensity scale, so 3000 maps to roughly 2.6 here;
    // the (0, 10, -10) direction preserves the 45-degree tilt.
    scene.add(new THREE.AmbientLight(0xffffff, 0.92));
    const isaacDefaultLight = new THREE.DirectionalLight(0xffffff, 2.6);
    isaacDefaultLight.name = "IsaacSim_defaultLight";
    isaacDefaultLight.position.set(0, 10, -10);
    isaacDefaultLight.target.position.set(0, 0, 0);
    isaacDefaultLight.castShadow = true;
    isaacDefaultLight.shadow.mapSize.set(2048, 2048);
    isaacDefaultLight.shadow.camera.near = 0.1;
    isaacDefaultLight.shadow.camera.far = 35;
    isaacDefaultLight.shadow.camera.left = -9;
    isaacDefaultLight.shadow.camera.right = 9;
    isaacDefaultLight.shadow.camera.top = 9;
    isaacDefaultLight.shadow.camera.bottom = -9;
    isaacDefaultLight.shadow.bias = -0.00015;
    isaacDefaultLight.shadow.normalBias = 0.018;
    isaacDefaultLight.shadow.radius = 1.25;
    scene.add(isaacDefaultLight, isaacDefaultLight.target);

    renderer.domElement.addEventListener("pointerdown", onPointerDown, { capture: true });
    renderer.domElement.addEventListener("pointermove", onPointerMove, { passive: false });
    renderer.domElement.addEventListener("pointerup", onPointerEnd, { passive: false });
    renderer.domElement.addEventListener("pointercancel", onPointerEnd, { passive: false });
    renderer.domElement.addEventListener("pointerleave", () => {
      if (!activeGrab && !selectedEntry) showReadout(null);
    });
    renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());
    renderer.domElement.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "r") resetScene();
    });

    resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(stage);
    resizeRenderer();
    requestAnimationFrame(renderFrame);
    loadScene(currentModel);
  }

  modelTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.model;
      if (key === currentModel && objects.length > 0) return;
      currentModel = key;
      modelTabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      if (initialized) loadScene(key);
    });
  });
  resetButton.addEventListener("click", resetScene);

  visibilityObserver = new IntersectionObserver((entries) => {
    isViewerVisible = entries[0].isIntersecting;
    if (isViewerVisible && !initialized) initializeViewer();
  }, { rootMargin: "240px 0px", threshold: 0.01 });
  visibilityObserver.observe(viewer);
}
