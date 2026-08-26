import { PageHero } from "../../site/ui/PageHero";
import { ProfileJourney } from "./components/ProfileJourney";
import { Translated } from "../../site/translations/I18nContext";

export function UsersPage() {
  return (
    <Translated>
      <PageHero
        className="users-hero"
        eyebrow="Uma plataforma, decisões diferentes"
        title="Contexto compartilhado para todas as equipes que protegem o lote"
        text="Da expedição ao recebimento, a FreshSense entrega a cada perfil a visão necessária para agir — sem fragmentar dados, responsabilidades ou histórico."
      />

      <section className="section surface">
        <div className="container">
          <div className="section-title reveal">
            <span className="tag">Experiência orientada por função</span>
            <h2>A mesma verdade operacional, apresentada para cada decisão</h2>
            <p>
              Indicadores executivos, alertas em rota, condição dos ativos e
              evidências de qualidade permanecem conectados, mas ganham o nível
              de detalhe certo para cada responsabilidade.
            </p>
          </div>
          <div className="persona-grid">
            <article className="persona-card card reveal">
              <div className="persona-img producer"></div>
              <span className="tag">Origem</span>
              <h3>Produção e cooperativas</h3>
              <p>
                Registram origem, produto, faixa esperada e condição de saída
                para iniciar a jornada com contexto confiável.
              </p>
            </article>
            <article className="persona-card card reveal">
              <div className="persona-img driver"></div>
              <span className="tag">Transporte</span>
              <h3>Logística e torre de controle</h3>
              <p>
                Acompanham rotas, exceções e prazos de resposta para intervir
                durante o transporte, não apenas depois da entrega.
              </p>
            </article>
            <article className="persona-card card reveal">
              <div className="persona-img storage"></div>
              <span className="tag">Distribuição</span>
              <h3>Armazéns e centros de distribuição</h3>
              <p>
                Priorizam recebimento, conferência e armazenagem conforme a
                condição acumulada e a sensibilidade de cada lote.
              </p>
            </article>
            <article className="persona-card card reveal">
              <div className="persona-img institution"></div>
              <span className="tag">Planejamento</span>
              <h3>Abastecimento e planejamento</h3>
              <p>
                Comparam disponibilidade, risco e destino para reduzir
                remanejamentos tardios e proteger o nível de serviço.
              </p>
            </article>
            <article className="persona-card card reveal">
              <div className="persona-img market"></div>
              <span className="tag">Varejo</span>
              <h3>Varejo e operações comerciais</h3>
              <p>
                Consultam histórico de recebimento e condição para apoiar giro,
                priorização de estoque e tratamento de ocorrências.
              </p>
            </article>
            <article className="persona-card card reveal">
              <div className="persona-img quality"></div>
              <span className="tag">Qualidade</span>
              <h3>Qualidade e segurança dos alimentos</h3>
              <p>
                Investigam excursões, verificam registros e sustentam decisões
                técnicas com uma trilha organizada de evidências.
              </p>
            </article>
            <article className="persona-card card reveal">
              <div className="persona-img social"></div>
              <span className="tag">Sustentabilidade</span>
              <h3>ESG e redução de perdas</h3>
              <p>
                Acompanham causas recorrentes, volume potencialmente protegido e
                oportunidades de melhoria com metodologia transparente.
              </p>
            </article>
            <article className="persona-card card reveal persona-highlight">
              <div className="persona-img integration"></div>
              <span className="tag">Liderança</span>
              <h3>Gestão operacional</h3>
              <p>
                Enxerga desempenho, criticidade, disponibilidade de ativos e
                tempos de resposta em uma visão consolidada da rede.
              </p>
            </article>
          </div>
        </div>
      </section>

      <ProfileJourney />

      <section className="section dark">
        <div className="container">
          <div className="section-title centered reveal">
            <span className="tag">Uma jornada compartilhada</span>
            <h2>Do primeiro registro à melhoria contínua</h2>
          </div>
          <div className="flow-grid">
            <article className="card reveal">
              <span className="tag">1</span>
              <h3>Contextualizar</h3>
              <p>Identidade, produto, origem, destino, condição esperada e sensor.</p>
            </article>
            <article className="card reveal">
              <span className="tag">2</span>
              <h3>Observar</h3>
              <p>
                Leituras e eventos atualizam a condição do lote ao longo da jornada.
              </p>
            </article>
            <article className="card reveal">
              <span className="tag">3</span>
              <h3>Responder</h3>
              <p>Alertas conectam criticidade, responsável e procedimento de tratamento.</p>
            </article>
            <article className="card reveal">
              <span className="tag">4</span>
              <h3>Aprimorar</h3>
              <p>
                Indicadores revelam recorrências, gargalos e oportunidades de melhoria.
              </p>
            </article>
          </div>
        </div>
      </section>
    </Translated>
  );
}
