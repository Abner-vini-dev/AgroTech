import { useMemo, useState } from "react";
import {
  advanceDestination,
  destinationStatus,
  destinationTypes,
  formatPickupDate,
} from "../modelo/destinationModel";

const nextStatus = {
  pendente: "aprovada",
  aprovada: "transporte",
  transporte: "concluida",
};

export function DestinationList({ destinations, onUpdate }) {
  const [filter, setFilter] = useState("todos");
  const [expanded, setExpanded] = useState(null);
  const visible = useMemo(
    () =>
      filter === "todos"
        ? destinations
        : destinations.filter((item) => item.status === filter),
    [destinations, filter],
  );

  function advance(item) {
    const status = nextStatus[item.status];
    if (status) onUpdate(advanceDestination(item, status));
  }

  function cancel(item) {
    onUpdate(advanceDestination(item, "cancelada"));
  }

  return (
    <article className="destination-panel destination-list-panel">
      <div className="destination-panel-heading">
        <span>Acompanhamento</span>
        <h3>Destinações registradas</h3>
        <p>Avance cada operação e mantenha um histórico rastreável.</p>
      </div>
      <div className="destination-filters" aria-label="Filtrar destinações">
        {["todos", "pendente", "aprovada", "transporte", "concluida"].map(
          (status) => (
            <button
              key={status}
              type="button"
              className={filter === status ? "active" : ""}
              onClick={() => setFilter(status)}
            >
              {status === "todos" ? "Todas" : destinationStatus[status]}
            </button>
          ),
        )}
      </div>
      <div className="destination-list" aria-live="polite">
        {visible.map((item) => {
          const isExpanded = expanded === item.id;
          const canAdvance = Boolean(nextStatus[item.status]);
          return (
            <article
              className={`destination-item status-${item.status}`}
              key={item.id}
            >
              <button
                type="button"
                className="destination-item-summary"
                aria-expanded={isExpanded}
                onClick={() => setExpanded(isExpanded ? null : item.id)}
              >
                <span className="destination-status-dot" aria-hidden="true" />
                <span>
                  <strong>
                    {item.product} · {item.quantity} {item.unit}
                  </strong>
                  <small>
                    {item.id} · {destinationTypes[item.type]}
                  </small>
                </span>
                <em>{destinationStatus[item.status]}</em>
                <b aria-hidden="true">{isExpanded ? "−" : "+"}</b>
              </button>
              {isExpanded && (
                <div className="destination-item-details">
                  <dl>
                    <div>
                      <dt>Lote</dt>
                      <dd>{item.lotId}</dd>
                    </div>
                    <div>
                      <dt>Destino</dt>
                      <dd>{item.recipient}</dd>
                    </div>
                    <div>
                      <dt>Responsável</dt>
                      <dd>{item.responsible}</dd>
                    </div>
                    <div>
                      <dt>Data prevista</dt>
                      <dd>{formatPickupDate(item.pickupDate)}</dd>
                    </div>
                  </dl>
                  <div className="destination-timeline">
                    {item.history.map((entry, index) => (
                      <div key={`${entry.status}-${entry.date}-${index}`}>
                        <i aria-hidden="true" />
                        <span>
                          <strong>{destinationStatus[entry.status]}</strong>
                          <small>{entry.date}</small>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="destination-actions">
                    {canAdvance && (
                      <button type="button" onClick={() => advance(item)}>
                        Avançar para{" "}
                        {destinationStatus[nextStatus[item.status]]}
                      </button>
                    )}
                    {!["concluida", "cancelada"].includes(item.status) && (
                      <button
                        type="button"
                        className="cancel"
                        onClick={() => cancel(item)}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
        {!visible.length && (
          <div className="destination-empty">
            <strong>Nenhuma destinação encontrada</strong>
            <p>Altere o filtro ou registre um novo plano.</p>
          </div>
        )}
      </div>
    </article>
  );
}
