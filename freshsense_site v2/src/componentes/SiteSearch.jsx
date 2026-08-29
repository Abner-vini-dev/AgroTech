import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Translated } from "../traducoes/I18nContext";

const normalizeSearchText = (text) =>
  String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function SiteSearch({ pages, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const results = useMemo(() => {
    const value = normalizeSearchText(query.trim());
    return value
      ? pages.filter((page) =>
          normalizeSearchText(
            `${page.label} ${page.description} ${page.searchTerms}`,
          ).includes(value),
        )
      : pages;
  }, [pages, query]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
      const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement?.tagName,
      );
      if (
        event.key === "/" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !isTyping
      ) {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const trigger = triggerRef.current;
    document.body.classList.toggle("search-is-open", open);
    if (open) setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      document.body.classList.remove("search-is-open");
      if (open) trigger?.focus();
    };
  }, [open]);

  const dialog =
    open &&
    createPortal(
      <Translated>
        <div
          className="search-overlay"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setOpen(false)
          }
        >
          <section
            className="search-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="searchTitle"
          >
            <div className="search-head">
              <div>
                <span>FreshSense</span>
                <h2 id="searchTitle">Buscar no site</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)}>
                Fechar
              </button>
            </div>
            <label className="search-field">
              <span>Digite o que procura</span>
              <input
                ref={inputRef}
                type="search"
                autoComplete="off"
                placeholder="Ex.: sensores, alerta, contato"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="search-scroll-hint" aria-hidden="true">
              <span>Role para consultar todos os resultados</span>
              <i>↓</i>
            </div>
            <div
              className="search-results"
              role="region"
              tabIndex="0"
              aria-label="Resultados da busca. Use a rolagem para ver todos."
            >
              {results.length ? (
                results.map((page) => (
                  <a
                    href={page.path}
                    key={page.path}
                    onClick={() => {
                      setOpen(false);
                      onNavigate();
                    }}
                  >
                    <strong>{page.label}</strong>
                    <span>{page.description}</span>
                  </a>
                ))
              ) : (
                <p>Nenhum resultado encontrado.</p>
              )}
            </div>
          </section>
        </div>
      </Translated>,
      document.body,
    );

  return (
    <Translated>
      <li>
        <button
          ref={triggerRef}
          className="search-button"
          type="button"
          aria-label="Buscar no site"
          onClick={() => setOpen(true)}
        >
          Buscar
        </button>
      </li>
      {dialog}
    </Translated>
  );
}
