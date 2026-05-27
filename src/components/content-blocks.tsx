import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function HeroMedia({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="job-photo-wrap">
      <Image src={src} alt={alt} width={1200} height={800} priority />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function ServiceTile({ title, href, image, children }: { title: string; href: string; image: string; children: ReactNode }) {
  return (
    <article className="svc-card">
      <figure className="svc-photo">
        <Image src={image} alt="" width={1200} height={800} />
      </figure>
      <h3>
        <Link href={href}>{title}</Link>
      </h3>
      <p>{children}</p>
    </article>
  );
}

export function TrustBand({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="proof-layer">
      <span aria-hidden="true">✓</span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}

export function LocationSummaryCard({ city, href, children }: { city: string; href: string; children: ReactNode }) {
  return (
    <article className="location-card">
      <h3>
        <Link href={href}>{city}</Link>
      </h3>
      <p>{children}</p>
    </article>
  );
}
