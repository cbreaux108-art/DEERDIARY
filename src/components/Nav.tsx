import { useState } from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Camp", end: true },
  { to: "/field-guide", label: "Field Guide" },
  { to: "/sightings", label: "Sightings" },
  { to: "/trophies", label: "Trophy Room" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-amber-300/10 bg-ink-900/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <svg width="30" height="30" viewBox="0 0 64 64" fill="none" className="shrink-0">
            <rect width="64" height="64" rx="14" fill="#142016" />
            <path d="M32 46V27" stroke="#e8c27a" strokeWidth="3" strokeLinecap="round" />
            <path d="M32 27C29 27 26.5 25 26 21C25.6 18 27 15 24 12" stroke="#e8c27a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M26 21c-2 1-5 .5-6.5-1.5" stroke="#e8c27a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M32 27C35 27 37.5 25 38 21C38.4 18 37 15 40 12" stroke="#e8c27a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 21c2 1 5 .5 6.5-1.5" stroke="#e8c27a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-brand text-2xl leading-none text-amber-300">DeerDiary</span>
        </NavLink>

        <nav className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? "bg-fern-600/25 text-amber-200"
                    : "text-parchment/70 hover:bg-ink-700/60 hover:text-parchment"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-amber-300/20 text-amber-200 sm:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-amber-300/10 px-4 py-3 sm:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-fern-600/25 text-amber-200" : "text-parchment/75"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
