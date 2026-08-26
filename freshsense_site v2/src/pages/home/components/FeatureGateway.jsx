import { Translated } from "../../../site/translations/I18nContext";

const tools = [
  {
    id: "monitoring",
    number: "01",
    eyebrow: "Controle operacional",
    title: "Central de monitoramento",
    description:
      "Antecipe desvios com telemetria ao vivo, alertas contextualizados e uma visão unificada de unidades, rotas e ativos.",
    capabilities: ["Telemetria ao vivo", "Gestão de incidentes", "Saúde dos ativos"],
    href: "/fase5",
    action: "Abrir central",
  },
  {
    id: "lots",
    number: "02",
    eyebrow: "Histórico por lote",
    title: "Busca de lotes",
    description:
      "Encontre rapidamente o lote certo e consulte condição, origem, etapa e classificação de risco sem cruzar planilhas.",
    capabilities: ["Busca contextual", "Filtros operacionais", "Consulta imediata"],
    href: "/buscar-lotes",
    action: "Buscar lotes",
  },
  {
    id: "risk",
    number: "03",
    eyebrow: "Apoio à decisão",
    title: "Análise de cenários",
    description:
      "Avalie como produto, exposição, controles e qualidade dos dados alteram o risco antes de definir uma resposta.",
    capabilities: ["Risco explicável", "Controles comparáveis", "Plano de resposta"],
    href: "/simulador",
    action: "Analisar cenário",
  },
];

export function FeatureGateway() {
  return (
    <Translated>
      <section className="section home-feature-gateway">
        <div className="container">
          <div className="section-title reveal">
            <span className="tag">Plataforma FreshSense</span>
            <h2>Três módulos operacionais. Uma visão conectada.</h2>
            <p>
              Monitore o que acontece agora, investigue o histórico de cada lote
              e compare respostas para cenários de maior criticidade.
            </p>
          </div>

          <div className="home-feature-gateway-grid">
            {tools.map((tool) => (
              <a
                className={`home-feature-tool tool-${tool.id} reveal`}
                href={tool.href}
                key={tool.id}
              >
                <div className="home-feature-tool-head">
                  <span>{tool.number}</span>
                  <small>{tool.eyebrow}</small>
                </div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <ul>
                  {tool.capabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
                <footer>
                  <strong>{tool.action}</strong>
                  <i aria-hidden="true">→</i>
                </footer>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Translated>
  );
}
