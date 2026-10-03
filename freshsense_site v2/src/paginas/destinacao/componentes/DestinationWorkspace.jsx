import { useMemo, useState } from "react";
import {
  readStoredJson,
  storageKeys,
  writeStoredValue,
} from "../../../utilitarios/browserStorage";
import { DestinationForm } from "./DestinationForm";
import { DestinationList } from "./DestinationList";
import {
  destinationLots,
  initialDestinations,
  institutions,
} from "../modelo/destinationModel";

export function DestinationWorkspace() {
  const [destinations, setDestinations] = useState(() =>
    readStoredJson(storageKeys.destinations, initialDestinations),
  );
  const committedQuantity = useMemo(
    () =>
      destinations
        .filter((item) => item.status !== "cancelada")
        .reduce((sum, item) => sum + item.quantity, 0),
    [destinations],
  );
  const completedQuantity = useMemo(
    () =>
      destinations
        .filter((item) => item.status === "concluida")
        .reduce((sum, item) => sum + item.quantity, 0),
    [destinations],
  );

  function persist(next) {
    setDestinations(next);
    writeStoredValue(storageKeys.destinations, JSON.stringify(next));
  }

  function addDestination(item) {
    persist([item, ...destinations]);
  }

  function updateDestination(nextItem) {
    persist(
      destinations.map((item) => (item.id === nextItem.id ? nextItem : item)),
    );
  }

  return (
    <section className="section destination-section">
      <div className="container">
        <div className="destination-kpis" aria-label="Resumo das destinações">
          <article>
            <span>Planos registrados</span>
            <strong>{destinations.length}</strong>
            <small>operações rastreáveis</small>
          </article>
          <article>
            <span>Volume comprometido</span>
            <strong>{committedQuantity}</strong>
            <small>kg/L destinados</small>
          </article>
          <article>
            <span>Volume concluído</span>
            <strong>{completedQuantity}</strong>
            <small>kg/L aproveitados</small>
          </article>
        </div>

        <div className="destination-intro">
          <div>
            <span>Fase 6</span>
            <h2>Da identificação do risco à ação operacional</h2>
          </div>
          <p>
            A recomendação orienta a escolha, enquanto as validações impedem
            quantidades indisponíveis, datas inválidas e registros sem
            responsável.
          </p>
        </div>

        <div className="destination-grid">
          <DestinationForm
            lots={destinationLots}
            institutions={institutions}
            onCreate={addDestination}
          />
          <DestinationList
            destinations={destinations}
            onUpdate={updateDestination}
          />
        </div>
      </div>
    </section>
  );
}
