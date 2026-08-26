import { Translated } from "../../../site/translations/I18nContext";

const views = [
  {
    id: "overview",
    index: "01",
    label: "Visão geral",
    description: "Indicadores, tendência e alertas",
  },
  {
    id: "operation",
    index: "02",
    label: "Operação",
    description: "Unidades, rotas, estoque e qualidade",
  },
  {
    id: "assets",
    index: "03",
    label: "Ativos e lotes",
    description: "Sensores e rastreabilidade",
  },
];

export function MonitoringViewNav({ activeView, onChange, counts }) {
  return (
    <Translated>
      <nav className="monitoring-view-nav" aria-label="Áreas da central">
        <div className="monitoring-view-intro">
          <span>Navegação da central</span>
          <strong>Escolha o nível de análise</strong>
        </div>
        <div className="monitoring-view-tabs" role="tablist">
          {views.map((view) => (
            <button
              type="button"
              role="tab"
              key={view.id}
              id={`monitoring-tab-${view.id}`}
              aria-selected={activeView === view.id}
              aria-controls={`monitoring-view-${view.id}`}
              className={activeView === view.id ? "active" : ""}
              onClick={() => onChange(view.id)}
            >
              <span className="view-tab-index">{view.index}</span>
              <span className="view-tab-copy">
                <strong>{view.label}</strong>
                <small>{view.description}</small>
              </span>
              {counts[view.id] > 0 && (
                <span className="view-tab-count">{counts[view.id]}</span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </Translated>
  );
}
