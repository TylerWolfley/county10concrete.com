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

  function initFiles() {
    const input = document.getElementById("q-photos");
    const list = document.getElementById("fileList");
    if (!input || !list) return;

    input.addEventListener("change", () => {
      const files = Array.from(input.files || []).slice(0, 5);
      if (!files.length) {
        list.textContent = "";
        return;
      }
      list.textContent = files.map((file) => file.name).join(", ");
    });
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
      timing: document.querySelector("[data-preview-timing]"),
      photos: document.querySelector("[data-preview-photos]")
    };

    function update() {
      const service = textValue(form, "#q-service", "Choose a service");
      const city = textValue(form, "#q-city", "City not set");
      const address = textValue(form, "#q-address", "Address not set");
      const timing = textValue(form, "#q-timing", "Flexible");
      const photos = form.querySelector("#q-photos")?.files?.length || 0;

      if (preview.service) preview.service.textContent = service;
      if (preview.city) preview.city.textContent = city;
      if (preview.address) preview.address.textContent = address;
      if (preview.timing) preview.timing.textContent = timing;
      if (preview.photos) preview.photos.textContent = photos ? `${photos} attached` : "None yet";

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
        `Customer type: ${textValue(form, "#q-customer")}`,
        `Project size: ${textValue(form, "#q-size")}`,
        `Finish type: ${textValue(form, "#q-finish")}`,
        `Existing surface: ${textValue(form, "#q-existing")}`,
        `Timing: ${timing}`,
        `Access notes: ${textValue(form, "#q-access")}`,
        `Tear-out / prep notes: ${textValue(form, "#q-demo")}`,
        "",
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
          alert("Formspree endpoint is not set yet. Replace YOUR_FORMSPREE_ID with the County 10 Concrete form ID.");
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
    initFiles();
    initQuoteSummary();
    initForms();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
