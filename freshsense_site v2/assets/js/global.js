// FreshSense / Agrotech - comportamento global
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-site-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const progress = document.querySelector("[data-scroll-progress]");
  const backTop = document.querySelector("[data-back-top]");
  const currentPage = document.body.dataset.page;
  const navMenu = document.querySelector(".nav-menu");
  const translate = (text) => window.FreshSenseI18n?.t(text) || text;

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    if (link.dataset.navLink === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  const syncNavToggleLabel = () => {
    if (!navToggle) return;
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-label", translate(expanded ? "Fechar menu" : "Abrir menu"));
  };

  const setMenuOpen = (open) => {
    navToggle?.setAttribute("aria-expanded", String(open));
    header?.classList.toggle("menu-open", open);
    syncNavToggleLabel();
  };

  syncNavToggleLabel();

  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!expanded);
  });

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!header?.classList.contains("menu-open")) return;
    if (event.target instanceof Node && !header.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && navToggle?.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
    }
  }, { passive: true });

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.textContent = translate(isDark ? "Modo claro" : "Modo escuro");
      themeToggle.setAttribute("aria-label", translate(isDark ? "Ativar modo claro" : "Ativar modo escuro"));
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
  };

  const savedTheme = localStorage.getItem("freshsense-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("freshsense-theme", nextTheme);
    applyTheme(nextTheme);
  });

  document.addEventListener("freshsense:languagechange", () => {
    applyTheme(document.documentElement.dataset.theme || "light");
    syncNavToggleLabel();
  });

  const pagePrefix = window.location.pathname.includes("/pages/") ? "../../" : "./";
  const searchPages = [
    { title: "Início", url: `${pagePrefix}index.html`, description: "Visão geral da FreshSense, problema, solução e simulador de risco.", terms: "home inicio painel simulador risco alimentos perdas" },
    { title: "Problema", url: `${pagePrefix}pages/problema/index.html`, description: "Contexto sobre perdas de alimentos perecíveis e falta de visibilidade.", terms: "problema perdas desperdicio cadeia fria temperatura umidade" },
    { title: "Solução", url: `${pagePrefix}pages/solucao/index.html`, description: "Dashboard, sensores, alertas, lotes e rastreabilidade operacional.", terms: "solucao dashboard sensores alertas lotes rastreabilidade" },
    { title: "Usuários", url: `${pagePrefix}pages/publico-alvo/index.html`, description: "Perfis que usam a FreshSense em produção, transporte e distribuição.", terms: "usuarios publico produtor logistica distribuicao cooperativa" },
    { title: "Fale Conosco", url: `${pagePrefix}pages/contato/index.html`, description: "Formulário para dúvidas, parcerias e implantação operacional.", terms: "contato formulario email mensagem parceria" },
  ];

  const createSearch = () => {
    if (!navMenu || document.querySelector("[data-search-open]")) return;

    const item = document.createElement("li");
    item.innerHTML = `<button class="search-button" type="button" data-search-open aria-label="${translate("Buscar no site")}">${translate("Buscar")}</button>`;
    const themeItem = themeToggle?.closest("li");
    navMenu.insertBefore(item, themeItem || null);

    const overlay = document.createElement("div");
    overlay.className = "search-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="search-panel" role="dialog" aria-modal="true" aria-labelledby="searchTitle">
        <div class="search-head">
          <div>
            <span>FreshSense</span>
            <h2 id="searchTitle">${translate("Buscar no site")}</h2>
          </div>
          <button type="button" data-search-close>${translate("Fechar")}</button>
        </div>
        <label class="search-field">
          <span>${translate("Digite o que procura")}</span>
          <input type="search" data-search-input autocomplete="off" placeholder="${translate("Ex.: sensores, alerta, contato")}">
        </label>
        <div class="search-results" data-search-results></div>
      </section>
    `;
    document.body.appendChild(overlay);

    const openButton = item.querySelector("[data-search-open]");
    const closeButton = overlay.querySelector("[data-search-close]");
    const input = overlay.querySelector("[data-search-input]");
    const results = overlay.querySelector("[data-search-results]");

    const renderResults = () => {
      const query = input.value.trim().toLowerCase();
      const visible = query
        ? searchPages.filter((page) => `${translate(page.title)} ${translate(page.description)} ${page.title} ${page.description} ${page.terms}`.toLowerCase().includes(query))
        : searchPages;

      results.innerHTML = visible.length
        ? visible.map((page) => `<a href="${page.url}"><strong>${translate(page.title)}</strong><span>${translate(page.description)}</span></a>`).join("")
        : `<p>${translate("Nenhum resultado encontrado.")}</p>`;
    };

    const openSearch = () => {
      overlay.hidden = false;
      document.body.classList.add("search-is-open");
      renderResults();
      window.setTimeout(() => input.focus(), 0);
    };

    const closeSearch = () => {
      overlay.hidden = true;
      document.body.classList.remove("search-is-open");
    };

    openButton.addEventListener("click", openSearch);
    closeButton.addEventListener("click", closeSearch);
    input.addEventListener("input", renderResults);
    document.addEventListener("freshsense:languagechange", renderResults);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeSearch();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) closeSearch();
      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        event.preventDefault();
        openSearch();
      }
    });
  };

  createSearch();

  const updateScrollUi = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    backTop?.classList.toggle("visible", window.scrollY > 440);
  };

  window.addEventListener("scroll", updateScrollUi, { passive: true });
  updateScrollUi();

  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }
});
