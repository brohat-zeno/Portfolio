const header = document.querySelector("[data-header]");
const navButton = document.querySelector("[data-nav-button]");
const nav = document.querySelector("[data-nav]");

if (header) {
  const syncHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

if (header && navButton && nav) {
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
}

const galleryWheel = document.querySelector("[data-gallery-wheel]");
const galleryTiles = [...document.querySelectorAll("[data-gallery-tile]")];
const galleryCrank = document.querySelector("[data-gallery-crank]");
const galleryTitle = document.querySelector("[data-gallery-title]");
const galleryDescription = document.querySelector("[data-gallery-description]");

if (galleryWheel && galleryTiles.length) {
  const galleryStories = [
    {
      title: "Sunlit Main Character.",
      description: "A bright frame from the archive, all yellow fabric and accidental theatre, caught mid-motion like the day was waiting for applause.",
    },
    {
      title: "Soft Blur, Loud Memory.",
      description: "One of those photos that feels less like evidence and more like atmosphere, carrying the shape of a day even when the details start fading.",
    },
    {
      title: "Blue Hour Exit.",
      description: "A night scene with the color turned dramatic, walking away from the camera like the frame already knows it belongs in a montage.",
    },
    {
      title: "Under The Arches.",
      description: "A quiet tunnel of repeating curves, the kind of place that makes a simple walk feel like a scene from somewhere larger.",
    },
    {
      title: "Rain-Heavy Horizon.",
      description: "Back turned toward the mountains, sky carrying weight, a still moment that feels like it is breathing before the next chapter.",
    },
    {
      title: "The Wall Of Frames.",
      description: "A staircase, a gallery wall, and one paused figure inside a frame full of other frames, memory folding in on itself.",
    },
    {
      title: "Hand Over The Plot.",
      description: "Half-hidden, half-performing, this one keeps its face from the camera and somehow becomes more honest for it.",
    },
    {
      title: "Old Room, Small Legend.",
      description: "A childhood frame with soft domestic clutter around it, carrying the strange seriousness of being small and fully alive.",
    },
    {
      title: "Ceremony In Yellow.",
      description: "A festive flash of color and movement, the kind of memory that refuses to sit quietly in the album.",
    },
    {
      title: "Mirror Weather.",
      description: "A self-facing frame with just enough blur and shadow to feel private, like the camera caught a thought passing by.",
    },
    {
      title: "Low Light Archive.",
      description: "A darker piece of the reel, grainy and moody, holding onto the mood more than the exact edges of the moment.",
    },
    {
      title: "Almost Casual.",
      description: "A loose, everyday frame that survives because it feels unplanned, and that is exactly why it matters.",
    },
    {
      title: "Edited Into Memory.",
      description: "A stylized fragment from the personal canon, polished by time and edits until it becomes its own little poster.",
    },
    {
      title: "Double Take.",
      description: "A familiar frame returning with a slightly different mood, proof that memory repeats but never lands the same way twice.",
    },
    {
      title: "Caught Between Lights.",
      description: "A night-lit pause with reflections and color around the edges, standing still while the world keeps making noise.",
    },
    {
      title: "Nine Lives Of Me.",
      description: "A direct little relic from the archive, simple on the surface and weirdly charged once it becomes part of the wheel.",
    },
    {
      title: "Future Timestamp.",
      description: "A newer memory carrying the feeling of already becoming old, the kind of frame that joins the archive while still warm.",
    },
    {
      title: "Recovered From The Feed.",
      description: "A social-media fossil turned personal artifact, pulled back from the scroll and given a place in the machine.",
    },
  ];

  const state = {
    frame: 0,
    active: 0,
    crank: 0,
  };

  const syncGalleryCopy = () => {
    const story = galleryStories[state.active % galleryStories.length];

    if (galleryTitle) {
      galleryTitle.textContent = story.title;
    }

    if (galleryDescription) {
      galleryDescription.textContent = story.description;
    }
  };

  const getSlotOffset = (index) => {
    const total = galleryTiles.length;
    let offset = index - state.active;

    if (offset > total / 2) {
      offset -= total;
    }

    if (offset < total / -2) {
      offset += total;
    }

    return offset;
  };

  const renderGallery = () => {
    const rect = galleryWheel.getBoundingClientRect();
    const isCompact = window.innerWidth <= 640;
    const radius = Math.min(rect.height * (isCompact ? 0.38 : 0.42), rect.width * (isCompact ? 0.7 : 0.54));
    const centerX = rect.width;
    const centerY = rect.height * 0.5;
    const slotAngle = isCompact ? 31 : 32;
    const scales = {
      0: 1.38,
      1: 0.92,
      2: 0.72,
    };

    galleryTiles.forEach((tile, index) => {
      const offset = getSlotOffset(index);
      const isVisible = offset >= -2 && offset <= 2;
      const distance = Math.abs(offset);
      const angle = 180 + offset * slotAngle;
      const radians = (angle * Math.PI) / 180;
      const x = centerX + Math.cos(radians) * radius;
      const y = centerY + Math.sin(radians) * radius;
      const scale = scales[distance] ?? 0.76;
      const fade = isVisible ? (distance === 0 ? 1 : distance === 1 ? 0.78 : 0.42) : 0;

      tile.style.setProperty("--x", `${x}px`);
      tile.style.setProperty("--y", `${y}px`);
      tile.style.setProperty("--scale", scale.toFixed(3));
      tile.style.setProperty("--fade", fade.toFixed(3));
      tile.style.setProperty("--depth", String(30 - distance * 5));
      tile.style.setProperty("--grayness", distance === 0 ? "0" : distance === 1 ? "0.28" : "0.68");
      tile.style.setProperty("--contrast", distance === 0 ? "1.14" : "1.04");
      tile.style.setProperty("--brightness", distance === 0 ? "1.1" : distance === 1 ? "0.86" : "0.58");
      tile.classList.toggle("is-featured", offset === 0);
      tile.classList.toggle("is-visible", isVisible);
      tile.toggleAttribute("aria-hidden", !isVisible);
    });

    syncGalleryCopy();
  };

  state.frame = requestAnimationFrame(renderGallery);

  if (galleryCrank) {
    galleryCrank.addEventListener("click", () => {
      state.active = (state.active + 1) % galleryTiles.length;
      state.crank += 42;
      galleryCrank.style.setProperty("--crank-rotation", `${state.crank}deg`);
      galleryCrank.classList.toggle("is-red");
      galleryWheel.closest(".gallery-section")?.style.setProperty(
        "--carousel-accent",
        galleryCrank.classList.contains("is-red") ? "var(--red)" : "var(--gold)"
      );
      renderGallery();
    });
  }

  window.addEventListener("resize", () => {
    cancelAnimationFrame(state.frame);
    state.frame = requestAnimationFrame(renderGallery);
  });
}
