// Público-alvo - jornada por perfil
document.addEventListener("DOMContentLoaded", () => {
  const translate = (text) => window.FreshSenseI18n?.t(text) || text;
  const profiles = {
    produtor: {
      step: "Cadastro do lote",
      title: "Produtor acompanha a saída do alimento",
      copy: "Define faixa ideal, vincula sensor e garante que o lote saia com histórico ambiental claro.",
    },
    logistica: {
      step: "Ação em rota",
      title: "Logística prioriza entregas sensíveis",
      copy: "Recebe alerta de risco, ajusta rota e confirma ações corretivas durante transporte.",
    },
    qualidade: {
      step: "Controle e auditoria",
      title: "Qualidade analisa estabilidade e conformidade",
      copy: "Compara leituras, acompanha histórico e decide quais lotes exigem prioridade operacional.",
    },
    instituicao: {
      step: "Impacto social",
      title: "Instituições acompanham aproveitamento",
      copy: "Usam relatórios para apoiar distribuição mais eficiente e reduzir perdas alimentares.",
    },
  };

  const step = document.querySelector("[data-profile-step]");
  const title = document.querySelector("[data-profile-title]");
  const copy = document.querySelector("[data-profile-copy]");
  const result = document.getElementById("profile-result");
  const buttons = document.querySelectorAll("[data-user-profile]");
  let activeButton = document.querySelector("[data-user-profile].active") || buttons[0];

  const setProfile = (button) => {
    activeButton = button;
    buttons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle("active", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;
    });

    const profile = profiles[button.dataset.userProfile];
    step.textContent = translate(profile.step);
    title.textContent = translate(profile.title);
    copy.textContent = translate(profile.copy);
    result?.setAttribute("aria-labelledby", button.id);
  };

  buttons.forEach((button, index) => {
    button.tabIndex = button.getAttribute("aria-selected") === "true" ? 0 : -1;
    button.addEventListener("click", () => setProfile(button));
    button.addEventListener("keydown", (event) => {
      const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
      if (!direction) return;

      event.preventDefault();
      const nextButton = buttons[(index + direction + buttons.length) % buttons.length];
      nextButton.focus();
      setProfile(nextButton);
    });
  });

  document.addEventListener("freshsense:languagechange", () => setProfile(activeButton));
  setProfile(activeButton);
});
