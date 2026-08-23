// Problema - painel simples de causas
document.addEventListener("DOMContentLoaded", () => {
  const translate = (text) => window.FreshSenseI18n?.t(text) || text;
  const copy = {
    temperatura: {
      label: "Temperatura",
      text: "Quando a temperatura sai da faixa ideal, o lote precisa de ação rápida antes que a perda se torne irreversível.",
    },
    umidade: {
      label: "Umidade",
      text: "Umidade fora do esperado prejudica textura, aparência e vida útil, especialmente em hortaliças e frutas.",
    },
    rota: {
      label: "Rota",
      text: "Paradas e atrasos aumentam o tempo de exposição, tornando a priorização logística essencial.",
    },
  };

  const label = document.querySelector("[data-cause-label]");
  const text = document.querySelector("[data-cause-text]");
  let activeCause = "temperatura";

  const updateCauseDetail = () => {
    const selected = copy[activeCause];
    label.textContent = translate(selected.label);
    text.textContent = translate(selected.text);
  };

  document.querySelectorAll("[data-cause]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-cause]").forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      activeCause = button.dataset.cause;
      updateCauseDetail();
    });
  });

  document.addEventListener("freshsense:languagechange", updateCauseDetail);
  updateCauseDetail();
});
