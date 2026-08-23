// Home - simulador de risco de perda
document.addEventListener("DOMContentLoaded", () => {
  const translate = (text) => window.FreshSenseI18n?.t(text) || text;
  const liveTemp = document.querySelector("[data-live-temp]");
  const liveHumidity = document.querySelector("[data-live-humidity]");
  let tick = 0;

  if (liveTemp && liveHumidity) {
    window.setInterval(() => {
      tick += 1;
      const temp = (4.2 + Math.sin(tick / 2) * .35).toFixed(1).replace(".", ",");
      const humidity = Math.round(72 + Math.cos(tick / 3) * 3);
      liveTemp.textContent = `${temp}°C`;
      liveHumidity.textContent = `${humidity}%`;
    }, 1800);
  }

  const form = document.querySelector("[data-risk-form]");
  if (!form) return;

  const fields = {
    produto: form.querySelector("[data-risk-input='produto']"),
    temperatura: form.querySelector("[data-risk-input='temperatura']"),
    umidade: form.querySelector("[data-risk-input='umidade']"),
    tempo: form.querySelector("[data-risk-input='tempo']"),
    etapa: form.querySelector("[data-risk-input='etapa']"),
    sensor: form.querySelector("[data-risk-input='sensor']"),
  };

  const output = {
    result: document.querySelector("[data-risk-result]"),
    errors: document.querySelector("[data-risk-errors]"),
    score: document.querySelector("[data-risk-value]"),
    label: document.querySelector("[data-risk-label]"),
    bar: document.querySelector("[data-risk-bar]"),
    diagnosis: document.querySelector("[data-risk-diagnosis]"),
    action: document.querySelector("[data-risk-action]"),
    factor: document.querySelector("[data-risk-factor]"),
    tempStatus: document.querySelector("[data-risk-temp-status]"),
    humidityStatus: document.querySelector("[data-risk-humidity-status]"),
    timeStatus: document.querySelector("[data-risk-time-status]"),
    sensorStatus: document.querySelector("[data-risk-sensor-status]"),
    history: document.querySelector("[data-risk-history]"),
  };

  const simulations = [];

  const foodProfiles = {
    frutas: { label: "Frutas", sensitivity: 10, temp: [6, 12], humidity: [70, 90], maxTime: 18 },
    verduras: { label: "Verduras", sensitivity: 14, temp: [2, 7], humidity: [82, 96], maxTime: 12 },
    laticinios: { label: "Laticínios", sensitivity: 22, temp: [1, 5], humidity: [60, 78], maxTime: 8 },
    carnes: { label: "Carnes", sensitivity: 26, temp: [-1, 4], humidity: [60, 75], maxTime: 6 },
    graos: { label: "Grãos", sensitivity: 6, temp: [12, 25], humidity: [45, 65], maxTime: 72 },
    outros: { label: "Outros", sensitivity: 12, temp: [4, 14], humidity: [55, 80], maxTime: 16 },
  };

  const stageProfiles = {
    producao: { label: "Produção", risk: 2 },
    armazenamento: { label: "Armazenamento", risk: 7 },
    transporte: { label: "Transporte", risk: 15 },
    distribuicao: { label: "Distribuição", risk: 13 },
  };

  const sensorProfiles = {
    normal: { label: "Normal", risk: 0 },
    instavel: { label: "Instável", risk: 12 },
    "sem-sinal": { label: "Sem sinal", risk: 26 },
  };

  const numberValue = (field) => Number(String(field.value).replace(",", "."));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const classifyRisk = (score) => {
    if (score <= 35) {
      return { key: "low", label: "Risco baixo", className: "risk-low" };
    }

    if (score <= 70) {
      return { key: "medium", label: "Risco médio", className: "risk-medium" };
    }

    return { key: "high", label: "Risco alto", className: "risk-high" };
  };

  const validateFields = () => {
    const errors = [];
    const empty = (field) => String(field.value).trim() === "";
    const values = {
      produto: fields.produto.value,
      temperatura: numberValue(fields.temperatura),
      umidade: numberValue(fields.umidade),
      tempo: numberValue(fields.tempo),
      etapa: fields.etapa.value,
      sensor: fields.sensor.value,
    };

    const validations = [
      {
        field: fields.temperatura,
        invalid: empty(fields.temperatura) || !Number.isFinite(values.temperatura) || values.temperatura < -10 || values.temperatura > 40,
        message: "Informe uma temperatura entre -10°C e 40°C.",
      },
      {
        field: fields.umidade,
        invalid: empty(fields.umidade) || !Number.isFinite(values.umidade) || values.umidade < 0 || values.umidade > 100,
        message: "Informe uma umidade entre 0% e 100%.",
      },
      {
        field: fields.tempo,
        invalid: empty(fields.tempo) || !Number.isFinite(values.tempo) || values.tempo <= 0 || values.tempo > 240,
        message: "Informe um tempo maior que 0 e até 240 horas.",
      },
    ];

    validations.forEach(({ field, invalid, message }) => {
      field.classList.toggle("is-invalid", invalid);
      field.classList.toggle("is-valid", !invalid);
      field.setAttribute("aria-invalid", String(invalid));
      if (invalid) errors.push(message);
    });

    return { values, errors };
  };

  const deviationFromRange = (value, [min, max]) => {
    if (value < min) return min - value;
    if (value > max) return value - max;
    return 0;
  };

  const rangeStatus = (value, [min, max], lowText, highText, okText) => {
    if (value < min) return lowText;
    if (value > max) return highText;
    return okText;
  };

  const calculateRisk = (values) => {
    const food = foodProfiles[values.produto];
    const stage = stageProfiles[values.etapa];
    const sensor = sensorProfiles[values.sensor];
    const tempDeviation = deviationFromRange(values.temperatura, food.temp);
    const humidityDeviation = deviationFromRange(values.umidade, food.humidity);
    const tempRisk = clamp(tempDeviation * (food.sensitivity >= 20 ? 3.2 : 2.4), 0, 30);
    const humidityRisk = clamp(humidityDeviation * .85, 0, 20);
    const timeRisk = clamp((values.tempo / food.maxTime) * 18, 0, 26);

    const factors = [
      { key: "Sensibilidade do alimento", points: food.sensitivity },
      { key: "Temperatura fora da faixa ideal", points: tempRisk },
      { key: "Umidade fora da faixa ideal", points: humidityRisk },
      { key: "Tempo elevado de exposição", points: timeRisk },
      { key: "Etapa com maior exposição", points: stage.risk },
      { key: sensor.label === "Sem sinal" ? "Sensor sem sinal" : "Sensor instável", points: sensor.risk },
    ];

    const score = Math.round(clamp(
      food.sensitivity + tempRisk + humidityRisk + timeRisk + stage.risk + sensor.risk,
      0,
      100,
    ));

    const mainFactor = factors.reduce((highest, factor) => (factor.points > highest.points ? factor : highest), factors[0]);

    return {
      score,
      level: classifyRisk(score),
      food,
      stage,
      sensor,
      mainFactor,
      tempStatus: rangeStatus(values.temperatura, food.temp, "Abaixo da faixa ideal", "Acima da faixa ideal", "Dentro da faixa"),
      humidityStatus: rangeStatus(values.umidade, food.humidity, "Baixa para o alimento", "Alta para o alimento", "Dentro da faixa"),
      timeStatus: values.tempo > food.maxTime ? "Tempo acima do recomendado" : "Tempo controlado",
    };
  };

  const getRecommendation = (result) => {
    if (result.sensor.label === "Sem sinal") return "Conferir sensor imediatamente";
    if (result.level.key === "high" && result.stage.label === "Transporte") return "Interromper transporte e revisar condição do lote";
    if (result.level.key === "high" && result.stage.label === "Distribuição") return "Priorizar entrega do lote";
    if (result.mainFactor.key === "Temperatura fora da faixa ideal") return "Transferir para câmara fria";
    if (result.mainFactor.key === "Umidade fora da faixa ideal") return "Verificar umidade do ambiente";
    if (result.mainFactor.key === "Tempo elevado de exposição") return "Priorizar entrega do lote";
    if (result.sensor.label === "Instável") return "Conferir sensor imediatamente";
    if (result.level.key === "medium") return "Revisar temperatura da câmara";
    return "Manter monitoramento contínuo";
  };

  const getDiagnosis = (values, result) => {
    if (result.level.key === "high") {
      return "Risco elevado para o lote. A condição atual exige ação imediata para evitar perda de qualidade.";
    }

    if (result.level.key === "medium") {
      return "Condição de atenção. O principal desvio precisa ser acompanhado antes da próxima etapa.";
    }

    return "Condição estável. Mantenha leituras regulares e monitoramento contínuo.";
  };

  const updateResult = (values, result) => {
    const recommendation = getRecommendation(result);
    output.result.classList.remove("risk-low", "risk-medium", "risk-high");
    output.result.classList.add(result.level.className);
    output.score.textContent = result.score;
    output.label.textContent = translate(result.level.label);
    output.bar.style.width = `${result.score}%`;
    output.diagnosis.textContent = translate(getDiagnosis(values, result));
    output.action.textContent = translate(recommendation);
    output.factor.textContent = translate(result.mainFactor.key);
    output.tempStatus.textContent = translate(result.tempStatus);
    output.humidityStatus.textContent = translate(result.humidityStatus);
    output.timeStatus.textContent = translate(result.timeStatus);
    output.sensorStatus.textContent = translate(result.sensor.label);
  };

  const renderErrors = (errors) => {
    output.errors.textContent = errors.map(translate).join(" ");
  };

  const renderHistory = () => {
    if (!simulations.length) {
      output.history.innerHTML = `<p>${translate("Nenhuma simulação registrada nesta sessão.")}</p>`;
      return;
    }

    output.history.innerHTML = simulations.map((simulation) => `
      <article class="history-item ${simulation.level.className}">
        <div>
          <strong>${translate(simulation.food.label)}</strong>
          <span>${simulation.time}</span>
        </div>
        <span class="history-pill">${translate(simulation.level.label)} · ${simulation.score}</span>
      </article>
    `).join("");
  };

  const saveSimulation = (values, result) => {
    const time = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

    simulations.unshift({
      food: result.food,
      level: result.level,
      score: result.score,
      time,
    });
    simulations.splice(5);
    renderHistory();
  };

  const runSimulation = ({ save = false, showErrors = false } = {}) => {
    const { values, errors } = validateFields();

    if (errors.length) {
      if (showErrors) renderErrors(errors);
      return null;
    }

    renderErrors([]);
    const result = calculateRisk(values);
    updateResult(values, result);

    if (save) saveSimulation(values, result);
    return result;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSimulation({ save: true, showErrors: true });
  });

  Object.values(fields).forEach((field) => {
    field.addEventListener("input", () => runSimulation({ save: false, showErrors: Boolean(output.errors.textContent) }));
    field.addEventListener("change", () => runSimulation({ save: false, showErrors: Boolean(output.errors.textContent) }));
  });

  document.addEventListener("freshsense:languagechange", () => {
    runSimulation({ save: false, showErrors: Boolean(output.errors.textContent) });
    renderHistory();
  });

  runSimulation();
  renderHistory();
});
