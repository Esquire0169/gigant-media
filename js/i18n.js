(() => {
  const STORE_KEY = "gm-lang";
  const content = window.GM_CONTENT;
  if (!content) return;

  const getLang = () => {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved && content.langs.includes(saved)) return saved;
    return content.defaultLang || "ru";
  };

  const t = (lang, key) => {
    const dict = content.dict[lang] || content.dict.ru;
    return dict[key] ?? content.dict.ru[key] ?? key;
  };

  const apply = (lang) => {
    document.documentElement.lang = lang === "uz" ? "uz" : lang;
    localStorage.setItem(STORE_KEY, lang);

    const meta = content.meta[lang] || content.meta.ru;
    if (meta?.title) document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && meta?.description) desc.setAttribute("content", meta.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogTitle && meta?.title) ogTitle.setAttribute("content", meta.title);
    if (ogDesc && meta?.description) ogDesc.setAttribute("content", meta.description);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const value = t(lang, key);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") return;
      el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (key) el.innerHTML = t(lang, key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(lang, key));
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (key) el.setAttribute("aria-label", t(lang, key));
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (key) el.setAttribute("alt", t(lang, key));
    });

    document.querySelectorAll("[data-lang-option]").forEach((btn) => {
      const active = btn.getAttribute("data-lang-option") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    window.GM_I18N = {
      lang,
      t: (key) => t(lang, key),
      setLang: apply,
    };

    document.dispatchEvent(new CustomEvent("gm:langchange", { detail: { lang } }));
  };

  const init = () => {
    document.querySelectorAll("[data-lang-option]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang-option");
        if (lang) apply(lang);
      });
    });
    apply(getLang());
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
