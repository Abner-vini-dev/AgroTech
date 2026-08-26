import { PageHero } from "../../site/ui/PageHero";
import { SolutionArchitecture } from "./components/SolutionArchitecture";
import { SolutionDeployment } from "./components/SolutionDeployment";
import { SolutionEvidence } from "./components/SolutionEvidence";
import { SolutionJourney } from "./components/SolutionJourney";
import { Translated } from "../../site/translations/I18nContext";

export function SolutionPage() {
  return (
    <Translated>
      <PageHero
        className="solution-hero"
        eyebrow="Plataforma FreshSense"
        title="Transforme sinais da cadeia fria em respostas que protegem o produto"
        text="A FreshSense unifica telemetria, localização, contexto do lote e fluxos de tratamento para que cada desvio chegue à equipe certa, com prioridade, evidência e tempo para agir."
      />

      <SolutionEvidence />

      <SolutionJourney />

      <SolutionArchitecture />

      <SolutionDeployment />
    </Translated>
  );
}
