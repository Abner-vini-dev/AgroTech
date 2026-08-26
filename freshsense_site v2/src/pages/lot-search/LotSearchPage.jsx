import { PageHero } from "../../site/ui/PageHero";
import { SmartLotSearch } from "./components/SmartLotSearch";
import { Translated } from "../../site/translations/I18nContext";

export function LotSearchPage() {
  return (
    <Translated>
      <PageHero
        className="lot-search-hero"
        eyebrow="Rastreabilidade operacional"
        title="Encontre o lote certo sem procurar em sistemas desconectados"
        text="Consulte produto, origem, condição, etapa da cadeia e classificação de risco em uma busca rápida, criada para apoiar decisões sob pressão."
      />
      <SmartLotSearch />
    </Translated>
  );
}
