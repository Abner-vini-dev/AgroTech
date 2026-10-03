export const destinationTypes = Object.freeze({
  doacao: "Doação",
  venda: "Venda prioritária",
  desconto: "Aplicação de desconto",
  transferencia: "Transferência entre unidades",
});

export const destinationStatus = Object.freeze({
  pendente: "Pendente",
  aprovada: "Aprovada",
  transporte: "Em transporte",
  concluida: "Concluída",
  cancelada: "Cancelada",
});

export const destinationLots = [
  {
    id: "LT-1042",
    product: "Tomate",
    quantity: 380,
    unit: "kg",
    risk: "alto",
    expiryDays: 2,
    origin: "Jundiaí - SP",
    temperature: 11.8,
  },
  {
    id: "LT-1038",
    product: "Morango",
    quantity: 145,
    unit: "kg",
    risk: "medio",
    expiryDays: 3,
    origin: "Atibaia - SP",
    temperature: 6.2,
  },
  {
    id: "LT-1031",
    product: "Alface",
    quantity: 210,
    unit: "kg",
    risk: "baixo",
    expiryDays: 6,
    origin: "Suzano - SP",
    temperature: 4.7,
  },
  {
    id: "LT-1026",
    product: "Uva",
    quantity: 290,
    unit: "kg",
    risk: "baixo",
    expiryDays: 8,
    origin: "Jundiaí - SP",
    temperature: 5.4,
  },
  {
    id: "LT-1020",
    product: "Leite",
    quantity: 520,
    unit: "L",
    risk: "alto",
    expiryDays: 1,
    origin: "Mogi das Cruzes - SP",
    temperature: 9.1,
  },
  {
    id: "LT-1014",
    product: "Cenoura",
    quantity: 330,
    unit: "kg",
    risk: "medio",
    expiryDays: 5,
    origin: "Ibiúna - SP",
    temperature: 7.3,
  },
];

export const institutions = [
  {
    id: "INS-01",
    name: "Banco de Alimentos de São Paulo",
    city: "São Paulo - SP",
    type: "Banco de alimentos",
  },
  {
    id: "INS-02",
    name: "Rede Solidária do Alto Tietê",
    city: "Suzano - SP",
    type: "Organização social",
  },
  {
    id: "INS-03",
    name: "Cozinha Comunitária Esperança",
    city: "Mogi das Cruzes - SP",
    type: "Cozinha comunitária",
  },
  {
    id: "UNI-01",
    name: "Centro de Distribuição Campinas",
    city: "Campinas - SP",
    type: "Unidade FreshSense",
  },
];

export const initialDestinations = [
  {
    id: "DST-2401",
    lotId: "LT-1038",
    product: "Morango",
    type: "doacao",
    quantity: 60,
    unit: "kg",
    recipient: "Rede Solidária do Alto Tietê",
    responsible: "Marina Costa",
    pickupDate: "2026-10-01",
    status: "aprovada",
    createdAt: "28/09/2026 10:40",
    history: [
      { status: "pendente", date: "28/09/2026 10:40" },
      { status: "aprovada", date: "28/09/2026 11:15" },
    ],
  },
];

export function suggestDestination(lot) {
  if (!lot) return null;
  if (lot.risk === "alto" || lot.expiryDays <= 2) {
    return {
      type: "doacao",
      title: "Priorizar destinação imediata",
      reason: "Risco alto ou validade muito próxima exige resposta rápida.",
    };
  }
  if (lot.risk === "medio" || lot.expiryDays <= 4) {
    return {
      type: "desconto",
      title: "Antecipar a saída do lote",
      reason: "Um desconto pode acelerar o giro antes da perda de qualidade.",
    };
  }
  return {
    type: "transferencia",
    title: "Rebalancear o estoque",
    reason: "O lote está estável e pode atender uma unidade com maior demanda.",
  };
}

export function validateDestination(values, lot) {
  const errors = {};
  const quantity = Number(values.quantity);
  if (!lot) errors.lotId = "Selecione um lote.";
  if (!values.type) errors.type = "Escolha uma forma de destinação.";
  if (!Number.isFinite(quantity) || quantity <= 0)
    errors.quantity = "Informe uma quantidade maior que zero.";
  else if (lot && quantity > lot.quantity)
    errors.quantity = `A quantidade máxima disponível é ${lot.quantity} ${lot.unit}.`;
  if (!values.recipient) errors.recipient = "Selecione o destino do lote.";
  if (values.responsible.trim().split(/\s+/).length < 2)
    errors.responsible = "Informe o nome e o sobrenome do responsável.";
  if (!values.pickupDate) errors.pickupDate = "Informe a data prevista.";
  else {
    const selected = new Date(`${values.pickupDate}T23:59:59`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today)
      errors.pickupDate = "A data não pode estar no passado.";
  }
  return errors;
}

export function createDestination(
  values,
  lot,
  recipientName,
  now = new Date(),
) {
  const stamp = now.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  return {
    id: `DST-${String(now.getTime()).slice(-6)}`,
    lotId: lot.id,
    product: lot.product,
    type: values.type,
    quantity: Number(values.quantity),
    unit: lot.unit,
    recipient: recipientName,
    responsible: values.responsible.trim(),
    pickupDate: values.pickupDate,
    notes: values.notes.trim(),
    status: "pendente",
    createdAt: stamp,
    history: [{ status: "pendente", date: stamp }],
  };
}

export function advanceDestination(destination, nextStatus, now = new Date()) {
  const date = now.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  return {
    ...destination,
    status: nextStatus,
    history: [...destination.history, { status: nextStatus, date }],
  };
}

export function formatPickupDate(value) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T12:00:00`));
}
