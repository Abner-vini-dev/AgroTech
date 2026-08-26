import { PageHero } from "../../site/ui/PageHero";
import { CauseExplorer } from "./components/CauseExplorer";
import { Translated } from "../../site/translations/I18nContext";

export function ProblemPage() {
  return (
    <Translated>
      <PageHero
        className="problem-hero"
        eyebrow="O custo da falta de visibilidade"
        title="A cadeia fria se rompe nos pontos que a operação não consegue enxergar"
        text="Entre a origem e o destino, atrasos, variações térmicas e falhas de registro reduzem a janela de resposta. Sem contexto em tempo real, a equipe descobre o desvio quando a qualidade já pode estar comprometida."
      />

      <section className="section surface">
        <div className="container">
          <div
            className="stat-grid reveal"
            aria-label="Indicadores globais de perdas de alimentos"
          >
            <article className="card stat-card">
              <strong>13,3%</strong>
              <span>
                dos alimentos foram perdidos globalmente após a colheita e antes
                do varejo em 2023.
              </span>
              <a href="https://www.fao.org/sustainable-development-goals-data-portal/data/indicators/1231-global-food-losses/en/" target="_blank" rel="noreferrer">
                Fonte: FAO · Indicador 12.3.1 <span aria-hidden="true">↗</span>
              </a>
            </article>
            <article className="card stat-card">
              <strong>25,4%</strong>
              <span>
                das frutas e hortaliças foram perdidas antes do varejo, a maior
                taxa entre os grupos de alimentos.
              </span>
              <a href="https://www.fao.org/sustainable-development-goals-data-portal/data/indicators/1231-global-food-losses/en/" target="_blank" rel="noreferrer">
                Fonte: FAO · estimativa de 2023 <span aria-hidden="true">↗</span>
              </a>
            </article>
            <article className="card stat-card">
              <strong>526 mi t</strong>
              <span>
                de alimentos são perdidos por falta de refrigeração eficaz,
                segundo estimativa citada pela UNEP.
              </span>
              <a href="https://www.unep.org/topics/food-systems/food-loss-and-waste/sustainable-cold-chains" target="_blank" rel="noreferrer">
                Fonte: UNEP · Sustainable Cold Chains <span aria-hidden="true">↗</span>
              </a>
            </article>
            <article className="card stat-card">
              <strong>8–10%</strong>
              <span>
                das emissões globais de gases de efeito estufa estão associadas
                a perdas e desperdício de alimentos.
              </span>
              <a href="https://www.fao.org/policy-support/policy-themes/food-loss-and-food-waste/fao-policy-series--food-loss---food-waste/en" target="_blank" rel="noreferrer">
                Fonte: FAO · Food Loss &amp; Waste <span aria-hidden="true">↗</span>
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title reveal">
            <span className="tag">Onde a visibilidade se perde</span>
            <h2>O risco cresce nos intervalos entre uma etapa e outra</h2>
            <p>
              A cadeia fria é uma sequência de responsabilidades. Quando dados,
              ativos e equipes não permanecem conectados, pequenos desvios se
              acumulam sem dono, sem prioridade e sem resposta.
            </p>
          </div>
          <div className="problem-media-grid">
            <article className="media-card reveal harvest">
              <div>
                <span>Origem e expedição</span>
                <h3>O lote inicia a jornada sem uma referência confiável de condição.</h3>
              </div>
            </article>
            <article className="media-card reveal cold">
              <div>
                <span>Armazenagem</span>
                <h3>Oscilações de ambiente e falhas de equipamento passam sem contexto.</h3>
              </div>
            </article>
            <article className="media-card reveal route">
              <div>
                <span>Rota e recebimento</span>
                <h3>
                  Atrasos e transferências encurtam a janela para preservar a qualidade.
                </h3>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section surface">
        <div className="container impact-layout">
          <div className="section-title reveal">
            <span className="tag">Impacto em cadeia</span>
            <h2>Uma excursão não tratada afeta produto, margem e confiança</h2>
            <p>
              A falta de evidência transforma um desvio operacional em uma
              investigação lenta: equipes procuram registros, decisões são
              adiadas e o destino do lote fica mais incerto.
            </p>
          </div>
          <div className="impact-matrix reveal">
            <article>
              <span>Abastecimento</span>
              <strong>Menos produto aproveitável</strong>
              <p>
                Cada perda reduz a quantidade de alimento que chega em condição
                adequada a mercados, serviços e comunidades.
              </p>
            </article>
            <article>
              <span>Ambiental</span>
              <strong>Impacto incorporado</strong>
              <p>
                Água, solo, energia, refrigeração, embalagem e transporte também
                são desperdiçados quando o produto não é aproveitado.
              </p>
            </article>
            <article>
              <span>Operacional</span>
              <strong>Custo e resposta tardia</strong>
              <p>
                Sem alerta contextualizado, aumenta o esforço para investigar,
                priorizar, reprogramar e tratar a ocorrência.
              </p>
            </article>
            <article>
              <span>Qualidade</span>
              <strong>Integridade sob incerteza</strong>
              <p>
                Sem histórico confiável, fica mais difícil avaliar a exposição
                acumulada e sustentar uma decisão técnica sobre o lote.
              </p>
            </article>
          </div>
        </div>
      </section>

      <CauseExplorer />
    </Translated>
  );
}
