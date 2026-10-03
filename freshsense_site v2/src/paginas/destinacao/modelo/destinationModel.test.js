import test from "node:test";
import assert from "node:assert/strict";
import {
  createDestination,
  destinationLots,
  suggestDestination,
  validateDestination,
} from "./destinationModel.js";

test("sugere resposta imediata para lote de alto risco", () => {
  assert.equal(suggestDestination(destinationLots[0]).type, "doacao");
});

test("impede destinar quantidade maior que a disponível", () => {
  const lot = destinationLots[0];
  const errors = validateDestination(
    {
      lotId: lot.id,
      type: "doacao",
      quantity: 999,
      recipient: "INS-01",
      responsible: "Ana Souza",
      pickupDate: "2099-01-01",
    },
    lot,
  );
  assert.match(errors.quantity, /máxima disponível/);
});

test("cria destinação pendente com histórico inicial", () => {
  const lot = destinationLots[0];
  const item = createDestination(
    {
      type: "doacao",
      quantity: "50",
      responsible: "Ana Souza",
      pickupDate: "2099-01-01",
      notes: "",
    },
    lot,
    "Banco de Alimentos",
    new Date("2026-09-28T15:00:00"),
  );
  assert.equal(item.status, "pendente");
  assert.equal(item.quantity, 50);
  assert.equal(item.history.length, 1);
});
