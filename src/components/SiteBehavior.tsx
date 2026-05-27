"use client";

import { useEffect } from "react";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

function textValue(form: HTMLFormElement, selector: string, fallback = "Not provided") {
  const element = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(selector);
  const value = element?.value.trim();
  return value || fallback;
}

export function SiteBehavior() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    function hasAnyUTM() {
      return UTM_KEYS.some((key) => params.has(key));
    }

    function applyUTMToUrl(href: string) {
      const url = new URL(href, window.location.origin);
      for (const [key, value] of params.entries()) {
        if (key.toLowerCase().startsWith("utm_")) url.searchParams.set(key, value);
      }
      return url.toString();
    }

    if (hasAnyUTM()) {
      document.querySelectorAll<HTMLAnchorElement>("a.js-keep-utm[href]").forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;
        const lower = href.toLowerCase();
        if (href.startsWith("#") || lower.startsWith("mailto:") || lower.startsWith("tel:")) return;

        try {
          link.setAttribute("href", applyUTMToUrl(href));
        } catch {
          // Ignore malformed hrefs.
        }
      });
    }

    document.querySelectorAll<HTMLFormElement>("form").forEach((form) => {
      for (const key of UTM_KEYS) {
        const input = form.querySelector<HTMLInputElement>(`[name="${key}"], #${CSS.escape(key)}`);
        if (input) input.value = params.get(key) || "";
      }
    });

    const form = document.getElementById("smartQuoteForm") as HTMLFormElement | null;
    if (form) {
      const summary = document.getElementById("q-summary-field") as HTMLTextAreaElement | null;
      const preview = {
        service: document.querySelector("[data-preview-service]"),
        city: document.querySelector("[data-preview-city]"),
        address: document.querySelector("[data-preview-address]"),
        size: document.querySelector("[data-preview-size]"),
        tearout: document.querySelector("[data-preview-tearout]"),
        finish: document.querySelector("[data-preview-finish]"),
        timing: document.querySelector("[data-preview-timing]")
      };

      const update = () => {
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
        summary.value = [
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
        ].join("\n");
      };

      form.addEventListener("input", update);
      form.addEventListener("change", update);
      update();

      return () => {
        form.removeEventListener("input", update);
        form.removeEventListener("change", update);
      };
    }
  }, []);

  useEffect(() => {
    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form?.matches("form")) return;
      form.querySelectorAll<HTMLButtonElement | HTMLInputElement>("button[type='submit'], input[type='submit']").forEach((button) => {
        if (button.disabled) return;
        button.disabled = true;
        button.setAttribute("aria-disabled", "true");
        if (button.tagName === "BUTTON") {
          button.textContent = button.getAttribute("data-sending-text") || "Sending...";
        }
      });
    };

    document.addEventListener("submit", onSubmit);
    return () => document.removeEventListener("submit", onSubmit);
  }, []);

  return null;
}
