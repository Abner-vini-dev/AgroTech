import { PageHero } from "../../componentes/PageHero";
import { Translated } from "../../traducoes/I18nContext";
import { DestinationWorkspace } from "./componentes/DestinationWorkspace";

export function DestinacaoPage() {
  return (
    <Translated>
      <PageHero
        className="destination-hero"
        eyebrow="Ação contra o desperdício"
        title="Transforme lotes em risco em decisões rastreáveis"
        text="Planeje doações, vendas prioritárias e transferências, valide cada operação e acompanhe o destino do alimento até a conclusão."
      />
      <DestinationWorkspace />
    </Translated>
  );
}
