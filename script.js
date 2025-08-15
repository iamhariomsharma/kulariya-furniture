// Utilities
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

const themeToggle = $("#themeToggle");
const hamburger = $("#hamburger");
const navLinks = $("#navLinks");
const year = $("#year");
const modal = $("#modal");
const modalBody = $("#modalBody");

// Year in footer
year.textContent = new Date().getFullYear();

// Mobile nav toggle
hamburger.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("is-open");
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// Catalogue filtering
const filterButtons = $$(".filters [data-filter]");
const cards = $$(".card[data-category]");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.style.display = show ? "" : "none";
    });
  });
});

// Open image modal on catalogue card click or Enter key
cards.forEach(card => {
  const openCard = () => {
    const img = $("img", card);
    openModalImage(img.src, img.alt || "Image");
  };
  card.addEventListener("click", openCard);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openCard();
    }
  });
});

// Videos
const videoCards = $$(".video-card");
videoCards.forEach(vc => {
  vc.addEventListener("click", () => {
    const type = vc.dataset.videoType;
    if (type === "youtube") {
      const id = vc.dataset.videoId;
      const src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      openModalIframe(src, "YouTube video");
    } else if (type === "vimeo") {
      const id = vc.dataset.videoId;
      const src = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
      openModalIframe(src, "Vimeo video");
    } else if (type === "local") {
      const src = vc.dataset.src;
      openModalVideo(src, "Product video");
    }
  });
});

// Modal helpers
function openModalImage(src, alt) {
  modalBody.innerHTML = "";
  const img = new Image();
  img.src = src;
  img.alt = alt;
  modalBody.appendChild(img);
  openModal();
}
function openModalIframe(src, title = "Video") {
  modalBody.innerHTML = "";
  const iframe = document.createElement("iframe");
  iframe.src = src;
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.title = title;
  modalBody.appendChild(iframe);
  openModal();
}
function openModalVideo(src, title = "Video") {
  modalBody.innerHTML = "";
  const vid = document.createElement("video");
  vid.src = src;
  vid.controls = true;
  vid.autoplay = true;
  vid.title = title;
  modalBody.appendChild(vid);
  openModal();
}
function openModal() {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalBody.innerHTML = "";
  document.body.style.overflow = "";
}
modal.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-close-modal")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

// Smooth scroll for same-page anchor links
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href") || "";
    if (id.length > 1) {
      e.preventDefault();
      const el = document.getElementById(id.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      navLinks.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
});
