import { useEffect, useRef, useState } from "react";
import { Translated } from "../translations/I18nContext";
import { LanguageSwitcher } from "../translations/LanguageSwitcher";
import {
  readStoredValue,
  storageKeys,
  writeStoredValue,
} from "../storage/browserStorage";
import { SiteSearch } from "./SiteSearch";

export function AppLayout({ currentPath, routes, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(
    () => readStoredValue(storageKeys.theme) === "dark",
  );
  const [showBackTop, setShowBackTop] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    writeStoredValue(storageKeys.theme, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentPath]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const closeOnResize = () => window.innerWidth > 980 && setMenuOpen(false);
    window.addEventListener("resize", closeOnResize, { passive: true });
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty(
        "transform",
        `scaleX(${max > 0 ? window.scrollY / max : 0})`,
      );
      setShowBackTop(window.scrollY > 440);
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [currentPath]);

  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("visible"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [currentPath]);

  return (
    <Translated>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <header className={`site-header ${menuOpen ? "menu-open" : ""}`}>
        <nav className="site-nav container" aria-label="Navegação principal">
          <a className="brand" href="/" onClick={() => setMenuOpen(false)}>
            <span>Fresh</span>Sense
          </a>
          <button
            className="nav-toggle"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            <span aria-hidden="true">☰</span>
            <span>Menu</span>
          </button>
          <ul className="nav-menu" id="primary-navigation">
            {routes
              .filter((route) => route.showInNavigation !== false)
              .map((route) => (
                <li key={route.path}>
                  <a
                    className={`nav-link ${route.isCallToAction ? "nav-cta" : ""}`}
                    aria-current={
                      currentPath === route.path ? "page" : undefined
                    }
                    href={route.path}
                    onClick={() => setMenuOpen(false)}
                  >
                    {route.label}
                  </a>
                </li>
              ))}
            <SiteSearch pages={routes} onNavigate={() => setMenuOpen(false)} />
            <LanguageSwitcher />
            <li>
              <button
                className="theme-toggle"
                type="button"
                onClick={() => setDark((value) => !value)}
                aria-pressed={dark}
              >
                {dark ? "Modo claro" : "Modo escuro"}
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main id="conteudo">{children}</main>
      <footer className="footer">
        <div className="container footer-grid">
          <strong>FreshSense • Inteligência para cadeia fria</strong>
          <span>Visibilidade contínua. Resposta coordenada. Qualidade preservada.</span>
        </div>
      </footer>
      <button
        className={`back-to-top ${showBackTop ? "visible" : ""}`}
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Voltar ao topo"
      >
        ↑
      </button>
    </Translated>
  );
}
