(() => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const heroImage = document.querySelector(".hero__frame img[data-parallax]");

  /* Sticky header */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile nav */
  menuToggle?.addEventListener("click", () => {
    header?.classList.toggle("is-open");
    const open = header?.classList.contains("is-open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => header?.classList.remove("is-open"));
  });

  /* Reveal on scroll */
  const reveals = [...document.querySelectorAll(".reveal")];
  const revealIn = (el) => el.classList.add("is-in");

  /* Above-the-fold: show immediately so first paint isn't blank */
  const unlockVisible = () => {
    const viewH = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewH * 0.92 && rect.bottom > 0) revealIn(el);
    });
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealIn(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
    unlockVisible();
    requestAnimationFrame(unlockVisible);
  } else {
    reveals.forEach(revealIn);
  }

  /* Count-up numbers */
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* Soft parallax only in hero */
  if (heroImage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = heroImage.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = (view - rect.top) / (view + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const shift = (clamped - 0.5) * 24;
      heroImage.style.transform = `scale(1.08) translate3d(0, ${shift}px, 0)`;
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", request, { passive: true });
    update();
  }

  /* Form validation + i18n-aware feedback */
  document.querySelectorAll("form[data-lead-form]").forEach((form) => {
    const clearErrors = () => {
      form.querySelectorAll(".field--error").forEach((f) => f.classList.remove("field--error"));
      form.querySelectorAll("[data-error-for]").forEach((el) => {
        el.hidden = true;
        el.textContent = "";
      });
    };

    const showError = (name, message) => {
      const input = form.querySelector(`[name="${name}"]`);
      const field = input?.closest(".field");
      const err = form.querySelector(`[data-error-for="${name}"]`);
      field?.classList.add("field--error");
      if (err) {
        err.textContent = message;
        err.hidden = false;
      }
    };

    const tt = (key) => window.GM_I18N?.t?.(key) || key;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const name = form.querySelector('[name="name"]')?.value.trim() || "";
      const phone = form.querySelector('[name="phone"]')?.value.trim() || "";
      const phoneOk = phone.replace(/\D/g, "").length >= 9;
      let valid = true;

      if (name.length < 2) {
        showError("name", tt("form.errorName"));
        valid = false;
      }
      if (!phoneOk) {
        showError("phone", tt("form.errorPhone"));
        valid = false;
      }
      if (!valid) return;

      const btn = form.querySelector('button[type="submit"]');
      const success = form.querySelector("[data-form-success]");
      if (btn) {
        btn.disabled = true;
        btn.textContent = tt("form.sending");
      }

      setTimeout(() => {
        form.reset();
        if (success) {
          success.hidden = false;
          success.textContent = tt("form.success");
        }
        if (btn) {
          btn.disabled = false;
          btn.textContent = tt("form.submit");
        }
        setTimeout(() => {
          if (success) success.hidden = true;
        }, 3200);
      }, 500);
    });
  });

  /* Services carousel: drag + arrows */
  const carousel = document.querySelector("[data-services-carousel]");
  const track = document.querySelector("[data-services-track]");
  const nav = document.querySelector("[data-services-nav]");

  if (carousel && track) {
    let offset = 0;
    let startX = 0;
    let startOffset = 0;
    let dragging = false;
    let moved = false;

    const maxOffset = () => {
      const overflow = track.scrollWidth - carousel.clientWidth;
      return Math.max(0, overflow);
    };

    const apply = (value, animate = true) => {
      offset = Math.max(0, Math.min(maxOffset(), value));
      track.style.transition = animate ? "" : "none";
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    const step = () => {
      const card = track.querySelector(".service-slide");
      if (!card) return 320;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.gap) || 20;
      return card.getBoundingClientRect().width + gap;
    };

    nav?.querySelectorAll("[data-dir]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dir = Number(btn.getAttribute("data-dir") || 1);
        apply(offset + dir * step() * 1.05, true);
      });
    });

    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startOffset = offset;
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      apply(startOffset - dx, false);
    };

    const onPointerUp = (e) => {
      if (!dragging) return;
      dragging = false;
      carousel.classList.remove("is-dragging");
      apply(offset, true);
      if (moved) {
        const blockClick = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          track.removeEventListener("click", blockClick, true);
        };
        track.addEventListener("click", blockClick, true);
      }
    };

    carousel.addEventListener("pointerdown", onPointerDown);
    carousel.addEventListener("pointermove", onPointerMove);
    carousel.addEventListener("pointerup", onPointerUp);
    carousel.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", () => apply(offset, false));
  }

  /* Marquee: duplicate groups for seamless loop */
  document.querySelectorAll("[data-marquee] .marquee__track").forEach((rowTrack) => {
    if (rowTrack.dataset.marqueeReady === "1") return;
    const group = rowTrack.querySelector(".marquee__group");
    if (!group) return;
    group.style.flexShrink = "0";
    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.style.flexShrink = "0";
    rowTrack.appendChild(clone);
    rowTrack.dataset.marqueeReady = "1";
  });

})();
