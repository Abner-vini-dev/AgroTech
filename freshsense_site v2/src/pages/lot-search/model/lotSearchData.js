export const lotSearchData = [
  {
    id: "LT-1042",
    product: "Tomate",
    category: "Hortaliças",
    risk: "alto",
    temperature: 11.8,
    stage: "Transporte",
    origin: "Jundiaí - SP",
  },
  {
    id: "LT-1038",
    product: "Morango",
    category: "Frutas",
    risk: "medio",
    temperature: 6.2,
    stage: "Armazenamento",
    origin: "Atibaia - SP",
  },
  {
    id: "LT-1031",
    product: "Alface",
    category: "Hortaliças",
    risk: "baixo",
    temperature: 4.7,
    stage: "Distribuição",
    origin: "Suzano - SP",
  },
  {
    id: "LT-1026",
    product: "Uva",
    category: "Frutas",
    risk: "baixo",
    temperature: 5.4,
    stage: "Armazenamento",
    origin: "Jundiaí - SP",
  },
  {
    id: "LT-1020",
    product: "Leite",
    category: "Laticínios",
    risk: "alto",
    temperature: 9.1,
    stage: "Transporte",
    origin: "Mogi das Cruzes - SP",
  },
  {
    id: "LT-1014",
    product: "Cenoura",
    category: "Hortaliças",
    risk: "medio",
    temperature: 7.3,
    stage: "Produção",
    origin: "Ibiúna - SP",
  },
  {
    id: "LT-1009",
    product: "Maçã",
    category: "Frutas",
    risk: "baixo",
    temperature: 3.9,
    stage: "Distribuição",
    origin: "São Joaquim - SC",
  },
  {
    id: "LT-1003",
    product: "Queijo fresco",
    category: "Laticínios",
    risk: "medio",
    temperature: 7.8,
    stage: "Armazenamento",
    origin: "Itu - SP",
  },
];

export const defaultLotFilters = {
  query: "",
  category: "todos",
  risk: "todos",
  temperature: "todas",
  stage: "todas",
};

export function normalizeLotSearch(value) {
  return String(value)
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filterLots(lots, filters) {
  const term = normalizeLotSearch(filters.query.trim());

  return lots.filter((lot) => {
    const searchableFields = [
      lot.id,
      lot.product,
      lot.category,
      lot.origin,
      lot.stage,
    ];
    const matchesQuery =
      !term ||
      searchableFields.some((field) =>
        normalizeLotSearch(field).includes(term),
      );
    const matchesCategory =
      filters.category === "todos" || lot.category === filters.category;
    const matchesRisk = filters.risk === "todos" || lot.risk === filters.risk;
    const matchesStage =
      filters.stage === "todas" || lot.stage === filters.stage;
    const matchesTemperature =
      filters.temperature === "todas" ||
      (filters.temperature === "ate5" && lot.temperature <= 5) ||
      (filters.temperature === "5a8" &&
        lot.temperature > 5 &&
        lot.temperature <= 8) ||
      (filters.temperature === "acima8" && lot.temperature > 8);

    return (
      matchesQuery &&
      matchesCategory &&
      matchesRisk &&
      matchesStage &&
      matchesTemperature
    );
  });
}
