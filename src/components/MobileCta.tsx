import Link from "next/link";
import { PHONE_HREF } from "@/lib/site";

export function MobileCta() {
  return (
    <div className="sticky-bar" role="region" aria-label="Quick contact">
      <Link className="sticky-btn js-keep-utm" href="/quote/" aria-label="Get a quote">
        Get a Quote
      </Link>
      <a className="sticky-btn sticky-btn-primary" href={PHONE_HREF} aria-label="Call County 10 Concrete">
        Call Now
      </a>
    </div>
  );
}
