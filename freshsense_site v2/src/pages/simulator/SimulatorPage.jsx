import { PageHero } from "../../site/ui/PageHero";
import { RiskSimulator } from "./components/RiskSimulator";
import { Translated } from "../../site/translations/I18nContext";

export function SimulatorPage() {
  return (
    <Translated>
      <PageHero
        className="simulator-hero"
        eyebrow="FreshSense Decision Lab"
        title="Compare risco, incerteza e resposta antes da próxima decisão"
        text="Estruture o cenário do lote, entenda a contribuição de cada fator e avalie como diferentes medidas de controle alteram a prioridade e a janela de resposta."
      />
      <RiskSimulator />
    </Translated>
  );
}
