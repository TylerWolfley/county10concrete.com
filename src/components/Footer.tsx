import Link from "next/link";
import { BUSINESS_NAME, EMAIL, footerLinks, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-info">
          <strong>{BUSINESS_NAME}</strong> &middot; <a href={PHONE_HREF}>{PHONE_DISPLAY}</a> &middot;{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a> &middot;{" "}
          <span className="footer-secondary">Licensed &amp; Insured &middot; Fremont County &amp; Natrona County &middot; Free estimates</span>
        </p>
        <nav aria-label="Footer navigation">
          {footerLinks.map((link) =>
            link.external ? (
              <a key={link.href} href={link.href} target="_blank" rel="noopener">
                {link.label}
              </a>
            ) : (
              <Link key={link.href} className={link.keepUtm ? "js-keep-utm" : undefined} href={link.href}>
                {link.label}
              </Link>
            )
          )}
        </nav>
        <p className="micro">&copy; 2026 County 10 Concrete. Professional concrete crew serving Fremont County and Natrona County.</p>
      </div>
    </footer>
  );
}
