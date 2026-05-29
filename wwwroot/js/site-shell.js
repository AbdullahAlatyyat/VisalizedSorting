(() => {
  const nav = document.querySelector("[data-vs-nav]");
  if (!nav) return;

  const toggle = nav.querySelector(".vs-nav-toggle");
  const menu = nav.querySelector(".vs-nav-menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    nav.classList.toggle("vs-nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
  }

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("vs-nav-open"));
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 901px)").matches) setOpen(false);
  });
})();
