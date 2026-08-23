// Solução - dashboard, filtros e checklist
document.addEventListener("DOMContentLoaded", () => {
  const translate = (text) => window.FreshSenseI18n?.t(text) || text;
  const dashboard = document.querySelector("[data-dashboard]");
  const tabs = dashboard?.querySelectorAll("[data-view-tab]") || [];
  const views = dashboard?.querySelectorAll("[data-view]") || [];

  const setView = (name) => {
    tabs.forEach((tab) => {
      const isSelected = tab.dataset.viewTab === name;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });
    views.forEach((view) => {
      const isActive = view.dataset.view === name;
      view.classList.toggle("active", isActive);
      view.hidden = !isActive;
    });
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.viewTab)));
  tabs.forEach((tab, index) => {
    tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
    tab.addEventListener("keydown", (event) => {
      const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
      if (!direction) return;

      event.preventDefault();
      const nextIndex = (index + direction + tabs.length) % tabs.length;
      const nextTab = tabs[nextIndex];
      nextTab.focus();
      setView(nextTab.dataset.viewTab);
    });
  });

  let tick = 0;
  const liveTemp = document.querySelector("[data-live-temp]");
  const liveHumidity = document.querySelector("[data-live-humidity]");

  if (liveTemp && liveHumidity) {
    window.setInterval(() => {
      tick += 1;
      liveTemp.textContent = `${(4.2 + Math.sin(tick / 2) * .4).toFixed(1).replace(".", ",")}°C`;
      liveHumidity.textContent = `${Math.round(72 + Math.cos(tick / 3) * 4)}%`;
    }, 1800);
  }

  const filterButtons = document.querySelectorAll("[data-lot-filter]");
  const lotRows = document.querySelectorAll("[data-lot-status]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.lotFilter;

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      lotRows.forEach((row) => {
        row.hidden = filter !== "todos" && row.dataset.lotStatus !== filter;
      });
    });
  });

  const checkItems = document.querySelectorAll("[data-check-item]");
  const progress = document.querySelector("[data-check-progress]");
  const updateChecklistProgress = () => {
    if (!progress || !checkItems.length) return;
    const done = [...checkItems].filter((check) => check.checked).length;
    progress.textContent = `${done}/${checkItems.length} ${translate("concluído")}`;
  };

  checkItems.forEach((item) => {
    item.addEventListener("change", updateChecklistProgress);
  });

  const priorityForm = document.querySelector("[data-priority-form]");

  if (priorityForm) {
    const inputs = {
      product: priorityForm.querySelector('[data-priority-input="product"]'),
      weight: priorityForm.querySelector('[data-priority-input="weight"]'),
      temperature: priorityForm.querySelector('[data-priority-input="temperature"]'),
      exposure: priorityForm.querySelector('[data-priority-input="exposure"]'),
      delay: priorityForm.querySelector('[data-priority-input="delay"]'),
    };

    const output = {
      temp: document.querySelector("[data-priority-temp]"),
      exposure: document.querySelector("[data-priority-exposure]"),
      score: document.querySelector("[data-priority-score]"),
      value: document.querySelector("[data-priority-value]"),
      level: document.querySelector("[data-priority-level]"),
      title: document.querySelector("[data-priority-title]"),
      message: document.querySelector("[data-priority-message]"),
      loss: document.querySelector("[data-priority-loss]"),
      action: document.querySelector("[data-priority-action]"),
    };

    const idealRanges = {
      laticinios: { min: 1, max: 5 },
      carnes: { min: -1, max: 4 },
      hortalicas: { min: 2, max: 7 },
      frutas: { min: 6, max: 12 },
    };

    const numberValue = (field, fallback = 0) => {
      const value = Number(field?.value);
      return Number.isFinite(value) ? value : fallback;
    };

    const getTemperatureDeviation = (temperature, range) => {
      if (temperature < range.min) return range.min - temperature;
      if (temperature > range.max) return temperature - range.max;
      return 0;
    };

    const updatePriority = () => {
      const product = inputs.product.value;
      const weight = numberValue(inputs.weight, 0);
      const temperature = numberValue(inputs.temperature, 0);
      const exposure = numberValue(inputs.exposure, 0);
      const delay = numberValue(inputs.delay, 0);
      const deviation = getTemperatureDeviation(temperature, idealRanges[product]);
      const score = Math.min(98, Math.round(8 + deviation * 8 + exposure * 3.5 + delay));
      const avoidableLoss = Math.round(weight * (score / 100) * .35);

      const state = score >= 70
        ? {
            color: "#f36f56",
            level: "Risco alto",
            title: "Intervenção imediata",
            message: "Priorize descarga, revise refrigeração e registre ação corretiva.",
            action: "Intervir agora",
          }
        : score >= 40
          ? {
              color: "#f3b743",
              level: "Risco médio",
              title: "Prioridade operacional",
              message: "Acompanhe o lote de perto e antecipe a próxima etapa da operação.",
              action: "Priorizar lote",
            }
          : {
              color: "#31c985",
              level: "Risco baixo",
              title: "Monitorar lote",
              message: "Condição estável. Mantenha acompanhamento e registre nova leitura no recebimento.",
              action: "Monitorar",
            };

      output.temp.textContent = `${temperature}°C`;
      output.exposure.textContent = `${exposure}h`;
      output.score.style.setProperty("--priority", `${score}%`);
      output.score.style.setProperty("--priority-color", state.color);
      output.value.textContent = `${score}%`;
      output.level.textContent = translate(state.level);
      output.title.textContent = translate(state.title);
      output.message.textContent = translate(state.message);
      output.loss.textContent = `${avoidableLoss} kg`;
      output.action.textContent = translate(state.action);
    };

    Object.values(inputs).forEach((input) => {
      input.addEventListener("input", updatePriority);
      input.addEventListener("change", updatePriority);
    });

    updatePriority();
    document.addEventListener("freshsense:languagechange", updatePriority);
  }

  updateChecklistProgress();
  document.addEventListener("freshsense:languagechange", updateChecklistProgress);
});
