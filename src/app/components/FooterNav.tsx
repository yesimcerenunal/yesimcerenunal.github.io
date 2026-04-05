import { Link, useLocation } from "react-router";
import { useLanguage } from "../context/LanguageContext";

export function FooterNav() {
  const location = useLocation();
  const { messages } = useLanguage();
  const { nav } = messages;

  const links = [
    { path: "/", label: nav.gallery },
    { path: "/about", label: nav.about },
    { path: "/contact", label: nav.contact },
  ];

  return (
    <footer className="border-t border-gray-100/80 bg-[#fafafa] px-7 pb-6 pt-3.5 sm:px-12 sm:pb-7 sm:pt-4 lg:px-14 lg:pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-5">
        <nav
          className="flex flex-wrap gap-5"
          aria-label={messages.aria.primaryNavigation}
        >
          {links.map((link) => {
            const active = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[0.7rem] font-medium uppercase tracking-[0.12em] transition-colors duration-200 ${
                  active
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div
          className="flex select-none items-center gap-4 text-gray-300"
          aria-hidden
        >
          <span className="inline-block h-2 w-2 rounded-full border border-dashed border-gray-300 opacity-80" />
          <span className="text-sm leading-none tracking-[0.3em] text-gray-300">
            ···
          </span>
        </div>
      </div>
    </footer>
  );
}
