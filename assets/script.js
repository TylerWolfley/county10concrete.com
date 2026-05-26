// County 10 Concrete - shared site behavior.
(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  function hasAnyUTM() {
    return UTM_KEYS.some((key) => params.has(key));
  }

  function applyUTMToUrl(href) {
    const url = new URL(href, window.location.origin);
    for (const [key, value] of params.entries()) {
      if (key.toLowerCase().startsWith("utm_")) url.searchParams.set(key, value);
    }
    return url.toString();
  }

  function preserveUTMLinks() {
    if (!hasAnyUTM()) return;

    document.querySelectorAll("a.js-keep-utm[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const lower = href.toLowerCase();
      if (
        href.startsWith("#") ||
        lower.startsWith("mailto:") ||
        lower.startsWith("tel:") ||
        lower.startsWith("sms:")
      ) return;

      try {
        link.setAttribute("href", applyUTMToUrl(href));
      } catch (_) {}
    });
  }

  function fillUTMInputs() {
    document.querySelectorAll("form").forEach((form) => {
      for (const key of UTM_KEYS) {
        const el = form.querySelector(`[name="${key}"]`) || form.querySelector(`#${CSS.escape(key)}`);
        if (el) el.value = params.get(key) || "";
      }
    });
  }

  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    if (!toggle.hasAttribute("aria-expanded")) toggle.setAttribute("aria-expanded", "false");
    if (!toggle.hasAttribute("aria-label")) toggle.setAttribute("aria-label", "Open menu");

    function closeMenu() {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }

    function openMenu() {
      document.body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      document.body.classList.contains("nav-open") ? closeMenu() : openMenu();
    });

    document.addEventListener("click", (event) => {
      if (!document.body.classList.contains("nav-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  }

  function textValue(form, selector, fallback = "Not provided") {
    const el = form.querySelector(selector);
    if (!el) return fallback;
    const value = (el.value || "").trim();
    return value || fallback;
  }

  function initQuoteSummary() {
    const form = document.getElementById("smartQuoteForm");
    if (!form) return;

    const summary = document.getElementById("q-summary-field");
    const preview = {
      service: document.querySelector("[data-preview-service]"),
      city: document.querySelector("[data-preview-city]"),
      address: document.querySelector("[data-preview-address]"),
      size: document.querySelector("[data-preview-size]"),
      tearout: document.querySelector("[data-preview-tearout]"),
      finish: document.querySelector("[data-preview-finish]"),
      timing: document.querySelector("[data-preview-timing]")
    };

    function update() {
      const service = textValue(form, "#q-service", "Choose a service");
      const city = textValue(form, "#q-city", "City not set");
      const address = textValue(form, "#q-address", "Address not set");
      const size = textValue(form, "#q-size", "Size not set");
      const tearout = textValue(form, "#q-tearout", "Not sure");
      const finish = textValue(form, "#q-finish", "Not sure yet");
      const timing = textValue(form, "#q-timing", "Flexible");

      if (preview.service) preview.service.textContent = service;
      if (preview.city) preview.city.textContent = city;
      if (preview.address) preview.address.textContent = address;
      if (preview.size) preview.size.textContent = size;
      if (preview.tearout) preview.tearout.textContent = tearout;
      if (preview.finish) preview.finish.textContent = finish;
      if (preview.timing) preview.timing.textContent = timing;

      if (!summary) return;
      const lines = [
        "County 10 Concrete quote request",
        "",
        `Name: ${textValue(form, "#q-name")}`,
        `Phone: ${textValue(form, "#q-phone")}`,
        `Email: ${textValue(form, "#q-email")}`,
        `City / town: ${city}`,
        `Project address: ${address}`,
        `Service type: ${service}`,
        `Project size: ${size}`,
        `Tear-out needed: ${tearout}`,
        `Finish type: ${finish}`,
        `Timing: ${timing}`,
        "Project details:",
        textValue(form, "#q-details")
      ];
      summary.value = lines.join("\n");
    }

    form.addEventListener("input", update);
    form.addEventListener("change", update);
    update();
  }

  function initForms() {
    document.querySelectorAll("form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        const action = form.getAttribute("action") || "";
        if (action.includes("YOUR_FORMSPREE_ID")) {
          event.preventDefault();
          const summary = form.querySelector("#q-summary-field")?.value || "County 10 Concrete quote request";
          const subject = encodeURIComponent("County 10 Concrete quote request");
          const body = encodeURIComponent(`${summary}\n\nPhotos do not attach automatically from this fallback email. Please attach them here or text them to 307-349-4694.`);
          window.location.href = `mailto:county10concrete@gmail.com?subject=${subject}&body=${body}`;
          return;
        }

        form.querySelectorAll("button[type='submit'], input[type='submit']").forEach((button) => {
          if (button.disabled) return;
          button.disabled = true;
          button.setAttribute("aria-disabled", "true");
          if (button.tagName === "BUTTON") {
            button.textContent = button.getAttribute("data-sending-text") || "Sending...";
          }
        });
      });
    });
  }

  function init() {
    preserveUTMLinks();
    fillUTMInputs();
    initMobileNav();
    initQuoteSummary();
    initForms();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
