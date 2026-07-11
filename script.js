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

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
    });
  }, { threshold: 0.2, rootMargin: "-20% 0px -65%" });
  document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

  const tabs = [...document.querySelectorAll('.method-tabs [role="tab"]')];
  const methodImage = document.querySelector("#method-image");
  const methodTitle = document.querySelector("#method-title");
  const methodDescription = document.querySelector("#method-description");

  tabs.forEach((tab) => tab.addEventListener("click", () => {
    if (tab.getAttribute("aria-selected") === "true") return;
    tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
    methodImage.classList.add("switching");
    window.setTimeout(() => {
      methodImage.src = tab.dataset.image;
      methodImage.alt = `${tab.dataset.title} analysis plot`;
      methodTitle.textContent = tab.dataset.title;
      methodDescription.textContent = tab.dataset.description;
      methodImage.classList.remove("switching");
    }, 180);
  }));

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