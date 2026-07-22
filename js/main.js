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

  /* Scroll helpers → contacts */
  const scrollToContacts = () => {
    const target = document.querySelector("#contacts");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    const focusable = target.querySelector("#name, [name='name']");
    window.setTimeout(() => focusable?.focus?.({ preventScroll: true }), 450);
  };

  document.querySelectorAll("[data-scroll-contacts]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const label = (el.textContent || "").trim();
      const task = document.querySelector('#contacts [name="task"]');
      const msg = document.querySelector('#contacts [name="message"]');
      if (task && !task.value) task.value = "other";
      if (msg && label && !msg.value.trim()) {
        msg.value = label;
      }
      scrollToContacts();
    });
  });

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
      const task = form.querySelector('[name="task"]')?.value.trim() || "";
      const deadline = form.querySelector('[name="deadline"]')?.value.trim() || "";
      const message = form.querySelector('[name="message"]')?.value.trim() || "";
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
      if (!task) {
        showError("task", tt("form.errorTask"));
        valid = false;
      }
      if (!valid) return;

      const btn = form.querySelector('button[type="submit"]');
      const success = form.querySelector("[data-form-success]");
      const successMsg = success?.querySelector("p");
      const waLink = success?.querySelector('a[href*="wa.me"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = tt("form.sending");
      }

      const taskLabel =
        form.querySelector('[name="task"] option:checked')?.textContent?.trim() || task;
      const waText = [
        "Заявка GIGANT MEDIA",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Задача: ${taskLabel}`,
        deadline ? `Срок: ${deadline}` : "",
        message ? `Комментарий: ${message}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      const waUrl = `https://wa.me/998908056692?text=${encodeURIComponent(waText)}`;

      setTimeout(() => {
        if (success) {
          if (successMsg) successMsg.textContent = tt("form.success");
          if (waLink) waLink.setAttribute("href", waUrl);
          success.hidden = false;
        }
        if (btn) {
          btn.disabled = false;
          btn.textContent = tt("form.submit");
        }
        // Open WhatsApp with prefilled brief (real handoff)
        window.open(waUrl, "_blank", "noopener");
        form.reset();
      }, 400);
    });
  });

  /* Sticky mobile CTA */
  const stickyCta = document.querySelector("[data-sticky-cta]");
  const contactsSection = document.querySelector("#contacts");
  if (stickyCta) {
    const updateSticky = () => {
      const scrolled = window.scrollY > 420;
      const nearContacts = contactsSection
        ? contactsSection.getBoundingClientRect().top < window.innerHeight * 0.72
        : false;
      const show = scrolled && !nearContacts && window.matchMedia("(max-width: 720px)").matches;
      stickyCta.hidden = !show;
      document.body.classList.toggle("has-sticky-cta", show);
    };
    updateSticky();
    window.addEventListener("scroll", updateSticky, { passive: true });
    window.addEventListener("resize", updateSticky);
  }

  /* Services carousel: drag + arrows + infinite loop */
  const carousel = document.querySelector("[data-services-carousel]");
  const track = document.querySelector("[data-services-track]");
  const nav = document.querySelector("[data-services-nav]");

  if (carousel && track) {
    const originals = [...track.querySelectorAll(".service-slide")];
    if (originals.length && track.dataset.loopReady !== "1") {
      originals.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.tabIndex = -1;
        track.appendChild(clone);
      });
      track.dataset.loopReady = "1";
    }

    let offset = 0;
    let startX = 0;
    let startOffset = 0;
    let dragging = false;
    let moved = false;
    let busy = false;

    const step = () => {
      const card = track.querySelector(".service-slide");
      if (!card) return 320;
      const gap = parseFloat(getComputedStyle(track).gap) || 20;
      return card.getBoundingClientRect().width + gap;
    };

    const setWidth = () => {
      const slides = track.querySelectorAll(".service-slide");
      const first = slides[0];
      const clone = slides[originals.length];
      if (!first || !clone) return originals.length * step();
      return clone.offsetLeft - first.offsetLeft;
    };
    const render = (value, animate = true) => {
      offset = value;
      track.style.transition = animate ? "" : "none";
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      if (!animate) {
        void track.offsetWidth;
        track.style.transition = "";
      }
    };

    const normalize = () => {
      const one = setWidth();
      if (one <= 0) return;
      while (offset >= one) render(offset - one, false);
      while (offset < 0) render(offset + one, false);
    };

    const moveBy = (dir) => {
      if (busy) return;
      const one = setWidth();
      if (one <= 0) return;
      busy = true;
      render(offset + dir * step(), true);
      window.setTimeout(() => {
        normalize();
        busy = false;
      }, 520);
    };

    nav?.querySelectorAll("[data-dir]").forEach((btn) => {
      btn.addEventListener("click", () => {
        moveBy(Number(btn.getAttribute("data-dir") || 1));
      });
    });

    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (busy) return;
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
      render(startOffset - dx, false);
    };

    const onPointerUp = (e) => {
      if (!dragging) return;
      dragging = false;
      carousel.classList.remove("is-dragging");
      const traveled = offset - startOffset;

      if (moved && Math.abs(traveled) > 40) {
        const dir = traveled > 0 ? 1 : -1;
        busy = true;
        render(startOffset + dir * step(), true);
        window.setTimeout(() => {
          normalize();
          busy = false;
        }, 520);
      } else {
        render(startOffset, true);
      }

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
    window.addEventListener("resize", () => {
      normalize();
      render(offset, false);
    });
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

  /* FAQ accordion: smooth open/close + icon state */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const panel = item.querySelector(".faq-item__panel");
    const inner = item.querySelector(".faq-item__panel-inner");
    if (!panel || !inner) return;

    const setOpen = (open) => {
      if (open) {
        panel.style.gridTemplateRows = "1fr";
        item.setAttribute("open", "");
      } else {
        panel.style.gridTemplateRows = "0fr";
        window.setTimeout(() => {
          if (panel.style.gridTemplateRows === "0fr") item.removeAttribute("open");
        }, 400);
      }
    };

    if (item.open) panel.style.gridTemplateRows = "1fr";
    else panel.style.gridTemplateRows = "0fr";

    item.addEventListener("click", (e) => {
      const summary = e.target.closest("summary");
      if (!summary || !item.contains(summary)) return;
      e.preventDefault();
      const willOpen = !item.hasAttribute("open") || panel.style.gridTemplateRows === "0fr";
      if (willOpen) {
        document.querySelectorAll(".faq-item[open]").forEach((other) => {
          if (other === item) return;
          const otherPanel = other.querySelector(".faq-item__panel");
          if (otherPanel) otherPanel.style.gridTemplateRows = "0fr";
          window.setTimeout(() => {
            if (otherPanel && otherPanel.style.gridTemplateRows === "0fr") {
              other.removeAttribute("open");
            }
          }, 400);
        });
        setOpen(true);
      } else {
        setOpen(false);
      }
    });
  });

})();
