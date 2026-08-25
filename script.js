const header = document.querySelector("[data-header]");
const navButton = document.querySelector("[data-nav-button]");
const nav = document.querySelector("[data-nav]");

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

navButton.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  navButton.setAttribute("aria-expanded", String(isOpen));
  navButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    header.classList.remove("nav-open");
    navButton.setAttribute("aria-expanded", "false");
    navButton.setAttribute("aria-label", "Open navigation");
  }
});
