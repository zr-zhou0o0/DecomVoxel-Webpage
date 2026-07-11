(() => {
  "use strict";

  if (window.lucide) window.lucide.createIcons();

  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  const updateNav = () => nav.classList.toggle("scrolled", window.scrollY > 36);
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  sectionLinks.forEach((link) => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }));

  document.querySelectorAll('.action-disabled[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const navSections = sectionLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);
  const updateActiveSection = () => {
    const progressLine = window.scrollY + window.innerHeight * 0.32;
    let activeId = "";
    navSections.forEach((section) => {
      if (section.offsetTop <= progressLine) activeId = section.id;
    });
    sectionLinks.forEach((link) => {
      const isActive = link.hash === `#${activeId}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  updateActiveSection();
  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);

  const sceneData = {
    blender: {
      name: "Blender",
      grid: "scenes/blender_grid_vis_ColmapCamera.001.png",
      color: "scenes/debug_colored_ColmapCamera.001.png",
      texture: "scenes/blender_texture_ColmapCamera.001.png",
    },
    nyc: {
      name: "NYC",
      grid: "scenes/nyc_grid_vis_ColmapCamera.004.png",
      color: "scenes/nyc_colored_ColmapCamera.004.png",
      texture: "scenes/nyc_texture_ColmapCamera.004.png",
    },
    berlin: {
      name: "Berlin",
      grid: "scenes/berlin_grid_vis_ColmapCamera.003.png",
      color: "scenes/berlin_colored_ColmapCamera.003.png",
      texture: "scenes/berlin_texture_ColmapCamera.003.png",
    },
    playroom: {
      name: "Playroom",
      grid: "scenes/playroom_grid_vis_ColmapCamera.005.png",
      color: "scenes/playroom_colored_ColmapCamera.005.png",
      texture: "scenes/playroom_texture_ColmapCamera.005.png",
    },
  };

  const sceneCarousel = document.querySelector(".scene-carousel");
  const sceneTabs = [...document.querySelectorAll(".scene-tabs [role=tab]")];
  const compare = document.querySelector(".triple-compare");
  const compareImages = {
    grid: compare.querySelector(".compare-grid img"),
    color: compare.querySelector(".compare-color img"),
    texture: compare.querySelector(".compare-base"),
  };
  let sceneIndex = 0;
  let splitOne = 33;
  let splitTwo = 67;

  const showScene = (index) => {
    sceneIndex = (index + sceneTabs.length) % sceneTabs.length;
    const activeTab = sceneTabs[sceneIndex];
    const scene = sceneData[activeTab.dataset.scene];
    sceneTabs.forEach((tab, tabIndex) => tab.setAttribute("aria-selected", String(tabIndex === sceneIndex)));
    Object.entries(compareImages).forEach(([mode, image]) => {
      image.src = scene[mode];
      image.alt = `${scene.name} scene ${mode} rendering`;
    });
    sceneCarousel.dataset.sceneIndex = String(sceneIndex);
  };

  sceneTabs.forEach((tab, index) => tab.addEventListener("click", () => showScene(index)));
  document.querySelector(".scene-prev").addEventListener("click", () => showScene(sceneIndex - 1));
  document.querySelector(".scene-next").addEventListener("click", () => showScene(sceneIndex + 1));

  const updateSplit = (handle, value) => {
    if (handle === 1) splitOne = Math.max(8, Math.min(value, splitTwo - 8));
    else splitTwo = Math.min(92, Math.max(value, splitOne + 8));
    compare.style.setProperty("--split-one", `${splitOne}%`);
    compare.style.setProperty("--split-two", `${splitTwo}%`);
    compare.querySelector(".handle-one").setAttribute("aria-valuenow", String(Math.round(splitOne)));
    compare.querySelector(".handle-two").setAttribute("aria-valuenow", String(Math.round(splitTwo)));
  };

  const positionFromPointer = (event) => {
    const bounds = compare.getBoundingClientRect();
    return ((event.clientX - bounds.left) / bounds.width) * 100;
  };

  compare.querySelectorAll(".compare-handle").forEach((handle, index) => {
    const handleNumber = index + 1;
    handle.addEventListener("pointerdown", (event) => {
      handle.setPointerCapture(event.pointerId);
      updateSplit(handleNumber, positionFromPointer(event));
    });
    handle.addEventListener("pointermove", (event) => {
      if (handle.hasPointerCapture(event.pointerId)) updateSplit(handleNumber, positionFromPointer(event));
    });
    handle.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const change = event.key === "ArrowLeft" ? -2 : 2;
      updateSplit(handleNumber, (handleNumber === 1 ? splitOne : splitTwo) + change);
    });
  });

  const resultData = [
    { id: "scan2", name: "Replica · Scan 2", dataset: "replica" },
    { id: "scan6", name: "Replica · Scan 6", dataset: "replica" },
    { id: "scan7", name: "Replica · Scan 7", dataset: "replica" },
    { id: "scan3", name: "ScanNet++ · Scan 3", dataset: "scannetpp" },
  ];
  const resultGeometry = document.querySelector("#result-geometry");
  const resultAppearance = document.querySelector("#result-appearance");
  const resultComparisons = [
    { image: document.querySelector("#result-gt"), method: "gt", mode: "appearance", label: "ground truth" },
    { image: document.querySelector("#result-sam3d"), method: "sam3d", mode: "appearance", label: "SAM3D result" },
    { image: document.querySelector("#result-mvsam3d"), method: "mvsam3d", mode: "appearance", label: "MV-SAM3D result" },
    { image: document.querySelector("#result-shaper"), method: "shaper", mode: "geometry", label: "ShapeR result" },
    { image: document.querySelector("#result-simrecon"), method: "simrecon", mode: "appearance", label: "SimRecon result" },
  ];
  const resultName = document.querySelector("#result-name");
  const resultCounter = document.querySelector("#result-counter");
  let resultIndex = 0;

  const showResult = (index) => {
    resultIndex = (index + resultData.length) % resultData.length;
    const result = resultData[resultIndex];
    resultGeometry.classList.add("switching");
    resultAppearance.classList.add("switching");
    resultComparisons.forEach(({ image }) => image.classList.add("switching"));
    window.setTimeout(() => {
      resultGeometry.src = `results/${result.id}-ours-${result.dataset}-geometry_texture.png`;
      resultAppearance.src = `results/${result.id}-ours-${result.dataset}-appearance_texture.png`;
      resultGeometry.alt = `${result.name} geometry result`;
      resultAppearance.alt = `${result.name} appearance result`;
      resultComparisons.forEach(({ image, method, mode, label }) => {
        image.src = `results/${result.id}-${method}-${result.dataset}-${mode}_texture.png`;
        image.alt = `${result.name} ${label}`;
        image.classList.remove("switching");
      });
      resultName.textContent = result.name;
      resultCounter.textContent = `${String(resultIndex + 1).padStart(2, "0")} / ${String(resultData.length).padStart(2, "0")}`;
      resultGeometry.classList.remove("switching");
      resultAppearance.classList.remove("switching");
    }, 160);
  };

  document.querySelector(".result-prev").addEventListener("click", () => showResult(resultIndex - 1));
  document.querySelector(".result-next").addEventListener("click", () => showResult(resultIndex + 1));

  const copyButton = document.querySelector("#copy-bibtex");
  copyButton.addEventListener("click", async () => {
    const label = copyButton.querySelector("span");
    try {
      await navigator.clipboard.writeText(document.querySelector("#bibtex").textContent.trim());
      label.textContent = "Copied";
      window.setTimeout(() => { label.textContent = "Copy"; }, 1500);
    } catch {
      label.textContent = "Select text";
    }
  });
})();