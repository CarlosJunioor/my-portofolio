"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  items?: NavItem[];
}

const DEFAULT_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Posts", href: "/posts" },
  { label: "About", href: "/about" },
];

export function Navbar({ items = DEFAULT_ITEMS }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          "flex w-full max-w-3xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300",
          scrolled ? "glass shadow-lg shadow-black/30" : "border border-transparent",
        )}
      >
        <Link
          href="/"
          className="font-mono text-sm font-bold tracking-tight text-star"
          aria-label="Carlos Junior — home"
        >
          CJ<span className="text-[var(--color-nebula-cyan)]"> // </span>dev
        </Link>

        {/* desktop */}
        <ul className="hidden items-center gap-1 sm:flex">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
                    active
                      ? "text-star"
                      : "text-muted hover:text-star",
                  )}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-white/[0.06] ring-1 ring-[var(--color-nebula-cyan)]/30" />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-star sm:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* mobile dropdown */}
      {open && (
        <div className="glass absolute top-[4.5rem] left-4 right-4 rounded-2xl p-2 sm:hidden">
          <ul className="flex flex-col">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-xl px-4 py-3 font-mono text-sm uppercase tracking-wider transition-colors",
                      active ? "bg-white/[0.06] text-star" : "text-muted hover:text-star",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
