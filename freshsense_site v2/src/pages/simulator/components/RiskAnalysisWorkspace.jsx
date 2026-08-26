import { useId, useState } from "react";
import { Translated } from "../../../site/translations/I18nContext";
import { mitigationOptions } from "../model/riskModel";

const views = [
  { id: "diagnosis", label: "Diagnóstico" },
  { id: "matrix", label: "Matriz 5 × 5" },
  { id: "plan", label: "Plano de resposta" },
];

const scaleLabels = ["Muito baixo", "Baixo", "Moderado", "Alto", "Muito alto"];

function cellLevel(score) {
  if (score <= 4) return "low";
  if (score <= 9) return "medium";
  if (score <= 16) return "high";
  return "critical";
}

function RiskMatrix({ result }) {
  return (
    <Translated>
      <div className="risk-matrix-layout">
        <div className="risk-matrix-copy">
          <span className="risk-kicker">Probabilidade × impacto</span>
          <h3>Posição atual: {result.matrixScore} de 25</h3>
          <p>
            A matriz cruza a probabilidade estimada com a dimensão potencial do
            impacto para tornar a prioridade comparável entre cenários.
          </p>
          <dl>
            <div>
              <dt>Probabilidade</dt>
              <dd>{scaleLabels[result.likelihood - 1]}</dd>
            </div>
            <div>
              <dt>Impacto</dt>
              <dd>{scaleLabels[result.impact - 1]}</dd>
            </div>
            <div>
              <dt>Classificação</dt>
              <dd>{result.level.label}</dd>
            </div>
          </dl>
        </div>

        <div className="risk-matrix-wrap">
          <span className="risk-matrix-y">Probabilidade</span>
          <div
            className="risk-matrix"
            role="grid"
            aria-label="Matriz de risco 5 por 5"
          >
            {[5, 4, 3, 2, 1].map((likelihood) =>
              [1, 2, 3, 4, 5].map((impact) => {
                const score = likelihood * impact;
                const current =
                  likelihood === result.likelihood && impact === result.impact;
                return (
                  <div
                    role="gridcell"
                    className={`risk-matrix-cell ${cellLevel(score)} ${current ? "current" : ""}`}
                    aria-label={`Probabilidade ${likelihood}, impacto ${impact}, nível ${score}${current ? ", cenário atual" : ""}`}
                    key={`${likelihood}-${impact}`}
                  >
                    <span>{score}</span>
                    {current && <strong>Atual</strong>}
                  </div>
                );
              }),
            )}
          </div>
          <span className="risk-matrix-x">Impacto →</span>
        </div>
      </div>
    </Translated>
  );
}

function RiskDiagnosis({ result }) {
  const thresholds = result.thresholds;

  return (
    <Translated>
      <div className="risk-diagnosis-grid">
        <section className="risk-factor-section">
          <div className="risk-section-heading">
            <div>
              <span className="risk-kicker">Composição do índice</span>
              <h3>Contribuição por fator</h3>
            </div>
            <span>pontos ponderados</span>
          </div>
          <div className="risk-factor-list">
            {result.factors.map((factor) => (
              <div className="risk-factor-row" key={factor.id}>
                <div>
                  <span>{factor.label}</span>
                  <strong>
                    {String(factor.value).replace(".", ",")} / {factor.max}
                  </strong>
                </div>
                <div className="risk-factor-track" aria-hidden="true">
                  <i style={{ width: `${factor.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="risk-threshold-section">
          <div className="risk-section-heading">
            <div>
              <span className="risk-kicker">Condições observadas</span>
              <h3>Leituras e referências</h3>
            </div>
          </div>
          <div className="risk-threshold-list">
            <article>
              <span>Temperatura</span>
              <strong>{thresholds.currentTemperature}°C</strong>
              <small>
                Perfil: {thresholds.temperature[0]}°C a{" "}
                {thresholds.temperature[1]}°C
              </small>
              <i className={thresholds.tempDeviation ? "outside" : "inside"}>
                {thresholds.tempDeviation ? "Fora da faixa" : "Dentro da faixa"}
              </i>
            </article>
            <article>
              <span>Umidade</span>
              <strong>{thresholds.currentHumidity}%</strong>
              <small>
                Perfil: {thresholds.humidity[0]}% a {thresholds.humidity[1]}%
              </small>
              <i
                className={thresholds.humidityDeviation ? "outside" : "inside"}
              >
                {thresholds.humidityDeviation
                  ? "Fora da faixa"
                  : "Dentro da faixa"}
              </i>
            </article>
            <article>
              <span>Exposição</span>
              <strong>{thresholds.currentTime} h</strong>
              <small>Janela do perfil: até {thresholds.maxTime} h</small>
              <i
                className={
                  thresholds.currentTime > thresholds.maxTime
                    ? "outside"
                    : "inside"
                }
              >
                {thresholds.currentTime > thresholds.maxTime
                  ? "Acima da janela"
                  : "Dentro da janela"}
              </i>
            </article>
            <article>
              <span>Telemetria</span>
              <strong>{result.sensor.label}</strong>
              <small>{result.coverage.label}</small>
              <i className={result.confidence >= 80 ? "inside" : "outside"}>
                Confiança {result.confidence}%
              </i>
            </article>
          </div>
        </section>
      </div>
    </Translated>
  );
}

function RiskResponsePlan({
  result,
  mitigatedResult,
  selectedControls,
  onToggleControl,
}) {
  const reduction = Math.max(result.score - mitigatedResult.score, 0);

  return (
    <Translated>
      <div className="risk-response-layout">
        <section className="risk-mitigation-section">
          <div className="risk-section-heading">
            <div>
              <span className="risk-kicker">Comparação de controles</span>
              <h3>Avalie respostas antes de aplicá-las</h3>
            </div>
          </div>
          <p>
            Selecione ações para projetar o risco residual e comparar
            alternativas. O cenário analisado permanece preservado para revisão.
          </p>
          <div className="risk-control-list">
            {mitigationOptions.map((control) => {
              const checked = selectedControls.includes(control.id);
              return (
                <label className={checked ? "selected" : ""} key={control.id}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleControl(control.id)}
                  />
                  <span>
                    <strong>{control.label}</strong>
                    <small>{control.description}</small>
                  </span>
                </label>
              );
            })}
          </div>

          <div className="risk-residual-comparison" aria-live="polite">
            <div>
              <span>Risco atual</span>
              <strong>{result.score}</strong>
              <small>{result.level.label}</small>
            </div>
            <i aria-hidden="true">→</i>
            <div>
              <span>Risco residual</span>
              <strong>{mitigatedResult.score}</strong>
              <small>{mitigatedResult.level.label}</small>
            </div>
            <p>
              {selectedControls.length ? (
                <>
                  Variação projetada: <strong>{reduction} pontos</strong>.
                </>
              ) : (
                "Selecione pelo menos uma medida para comparar."
              )}
            </p>
          </div>
        </section>

        <section className="risk-action-plan-section">
          <div className="risk-section-heading">
            <div>
              <span className="risk-kicker">Sequência recomendada</span>
              <h3>Plano de resposta</h3>
            </div>
          </div>
          <ol className="risk-action-list">
            {result.actionPlan.map((action) => (
              <li key={action.order}>
                <span>{action.order}</span>
                <div>
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                  <small>
                    {action.owner} · {action.deadline}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Translated>
  );
}

export function RiskAnalysisWorkspace({
  result,
  mitigatedResult,
  selectedControls,
  onToggleControl,
}) {
  const prefix = useId();
  const [activeView, setActiveView] = useState(views[0].id);

  function handleTabKey(event, index) {
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key)
      ? 1
      : ["ArrowLeft", "ArrowUp"].includes(event.key)
        ? -1
        : 0;
    if (!direction) return;

    event.preventDefault();
    const nextView = views[(index + direction + views.length) % views.length];
    setActiveView(nextView.id);
    requestAnimationFrame(() =>
      document.getElementById(`${prefix}-analysis-${nextView.id}`)?.focus(),
    );
  }

  return (
    <Translated>
      <section className="risk-analysis-workspace">
        <div className="risk-analysis-header">
          <div>
            <span className="risk-kicker">Exploração do resultado</span>
            <h2>Entenda o risco antes de agir</h2>
          </div>
          <div
            className="risk-analysis-tabs"
            role="tablist"
            aria-label="Visualizações da análise de risco"
          >
            {views.map((view, index) => (
              <button
                type="button"
                role="tab"
                id={`${prefix}-analysis-${view.id}`}
                aria-selected={activeView === view.id}
                aria-controls={`${prefix}-analysis-panel`}
                tabIndex={activeView === view.id ? 0 : -1}
                className={activeView === view.id ? "active" : ""}
                onClick={() => setActiveView(view.id)}
                onKeyDown={(event) => handleTabKey(event, index)}
                key={view.id}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="risk-analysis-content"
          role="tabpanel"
          id={`${prefix}-analysis-panel`}
          aria-labelledby={`${prefix}-analysis-${activeView}`}
          key={activeView}
        >
          {activeView === "diagnosis" && <RiskDiagnosis result={result} />}
          {activeView === "matrix" && <RiskMatrix result={result} />}
          {activeView === "plan" && (
            <RiskResponsePlan
              result={result}
              mitigatedResult={mitigatedResult}
              selectedControls={selectedControls}
              onToggleControl={onToggleControl}
            />
          )}
        </div>
      </section>
    </Translated>
  );
}
