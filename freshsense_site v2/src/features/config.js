// FASE 5 — escolha uma única opção quando o grupo decidir a nova funcionalidade.
// Deixe como null enquanto o grupo ainda estiver decidindo.
export const ACTIVE_FEATURE = null;

export const FEATURE_OPTIONS = [
  {
    id: 'monitoramento',
    title: 'Monitoramento em tempo real',
    description: 'Painel para acompanhar temperatura, umidade, sensores, lotes e alertas em uma única tela.',
    reactConcepts: ['useState', 'useEffect', 'componentes', 'renderização dinâmica'],
  },
  {
    id: 'filtros',
    title: 'Busca e filtros inteligentes',
    description: 'Busca de lotes com filtros por produto, risco, temperatura e etapa da cadeia.',
    reactConcepts: ['useState', 'props', 'listas', 'renderização condicional'],
  },
  {
    id: 'favoritos',
    title: 'Lotes prioritários / favoritos',
    description: 'Permite marcar lotes importantes e criar uma visão rápida das cargas que exigem atenção.',
    reactConcepts: ['useState', 'componentes reutilizáveis', 'eventos', 'listas'],
  },
  {
    id: 'historico',
    title: 'Histórico visual de sensores',
    description: 'Linha do tempo de temperatura e umidade por lote, com indicação dos momentos críticos.',
    reactConcepts: ['useState', 'props', 'componentes', 'dados dinâmicos'],
  },
];
