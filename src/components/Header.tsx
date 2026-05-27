"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/site";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link className="brand" href="/" aria-label="County 10 Concrete home">
          <Image
            className="brand-logo"
            src="/county-10-concrete-logo-USE-THIS.svg"
            alt="County 10 Concrete"
            width={220}
            height={62}
            priority
          />
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-controls="site-nav"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="nav-toggle-bars" aria-hidden="true" />
        </button>
        <nav className="nav" id="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${item.cta ? "btn btn-primary js-keep-utm" : ""}${isActive(pathname, item.href) ? " active" : ""}`.trim()}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              aria-label={item.cta ? "Get a quote" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
