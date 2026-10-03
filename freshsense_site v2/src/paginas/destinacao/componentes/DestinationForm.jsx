import { useMemo, useState } from "react";
import {
  createDestination,
  destinationTypes,
  suggestDestination,
  validateDestination,
} from "../modelo/destinationModel";

const emptyForm = {
  lotId: "",
  type: "",
  quantity: "",
  recipient: "",
  responsible: "",
  pickupDate: "",
  notes: "",
};

export function DestinationForm({ lots, institutions, onCreate }) {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const selectedLot = useMemo(
    () => lots.find((lot) => lot.id === values.lotId),
    [lots, values.lotId],
  );
  const suggestion = useMemo(
    () => suggestDestination(selectedLot),
    [selectedLot],
  );

  function update(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSuccess("");
  }

  function applySuggestion() {
    if (suggestion) update("type", suggestion.type);
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateDestination(values, selectedLot);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const recipient = institutions.find((item) => item.id === values.recipient);
    const destination = createDestination(values, selectedLot, recipient.name);
    onCreate(destination);
    setSuccess(`${destination.id} registrado com sucesso.`);
    setValues(emptyForm);
  }

  return (
    <article className="destination-panel destination-form-panel">
      <div className="destination-panel-heading">
        <span>Novo plano</span>
        <h3>Registrar destinação</h3>
        <p>Selecione um lote e formalize a ação recomendada.</p>
      </div>
      <form onSubmit={submit} noValidate>
        <label>
          <span>Lote</span>
          <select
            value={values.lotId}
            onChange={(event) => update("lotId", event.target.value)}
            aria-invalid={Boolean(errors.lotId)}
          >
            <option value="">Selecione...</option>
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id}>
                {lot.id} · {lot.product} · {lot.quantity} {lot.unit}
              </option>
            ))}
          </select>
          {errors.lotId && (
            <small className="field-error">{errors.lotId}</small>
          )}
        </label>

        {selectedLot && (
          <div className={`lot-decision-card risk-${selectedLot.risk}`}>
            <div>
              <span>Risco {selectedLot.risk}</span>
              <strong>
                {selectedLot.product} · {selectedLot.id}
              </strong>
              <small>
                {selectedLot.origin} · {selectedLot.temperature} °C · vence em{" "}
                {selectedLot.expiryDays} dias
              </small>
            </div>
            <div>
              <strong>
                {selectedLot.quantity} {selectedLot.unit}
              </strong>
              <small>disponíveis</small>
            </div>
          </div>
        )}

        {suggestion && (
          <div className="destination-suggestion">
            <span>Recomendação FreshSense</span>
            <strong>{suggestion.title}</strong>
            <p>{suggestion.reason}</p>
            <button type="button" onClick={applySuggestion}>
              Aplicar sugestão
            </button>
          </div>
        )}

        <div className="destination-form-grid">
          <label>
            <span>Tipo de destinação</span>
            <select
              value={values.type}
              onChange={(event) => update("type", event.target.value)}
              aria-invalid={Boolean(errors.type)}
            >
              <option value="">Selecione...</option>
              {Object.entries(destinationTypes).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            {errors.type && (
              <small className="field-error">{errors.type}</small>
            )}
          </label>
          <label>
            <span>Quantidade</span>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Ex.: 80"
              value={values.quantity}
              onChange={(event) => update("quantity", event.target.value)}
              aria-invalid={Boolean(errors.quantity)}
            />
            {errors.quantity && (
              <small className="field-error">{errors.quantity}</small>
            )}
          </label>
          <label>
            <span>Destino</span>
            <select
              value={values.recipient}
              onChange={(event) => update("recipient", event.target.value)}
              aria-invalid={Boolean(errors.recipient)}
            >
              <option value="">Selecione...</option>
              {institutions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.city}
                </option>
              ))}
            </select>
            {errors.recipient && (
              <small className="field-error">{errors.recipient}</small>
            )}
          </label>
          <label>
            <span>Data prevista</span>
            <input
              type="date"
              value={values.pickupDate}
              onChange={(event) => update("pickupDate", event.target.value)}
              aria-invalid={Boolean(errors.pickupDate)}
            />
            {errors.pickupDate && (
              <small className="field-error">{errors.pickupDate}</small>
            )}
          </label>
        </div>
        <label>
          <span>Responsável</span>
          <input
            type="text"
            placeholder="Nome e sobrenome"
            value={values.responsible}
            onChange={(event) => update("responsible", event.target.value)}
            aria-invalid={Boolean(errors.responsible)}
          />
          {errors.responsible && (
            <small className="field-error">{errors.responsible}</small>
          )}
        </label>
        <label>
          <span>
            Observações <small>(opcional)</small>
          </span>
          <textarea
            rows="3"
            maxLength="240"
            placeholder="Orientações para retirada, transporte ou conferência..."
            value={values.notes}
            onChange={(event) => update("notes", event.target.value)}
          />
        </label>
        {success && (
          <p className="destination-success" role="status">
            ✓ {success}
          </p>
        )}
        <button className="destination-submit" type="submit">
          Registrar destinação
        </button>
      </form>
    </article>
  );
}
