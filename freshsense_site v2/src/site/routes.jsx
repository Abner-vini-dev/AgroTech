import { ContactPage } from "../pages/contact/ContactPage";
import { HomePage } from "../pages/home/HomePage";
import { LotSearchPage } from "../pages/lot-search/LotSearchPage";
import { MonitoringPage } from "../pages/monitoring/MonitoringPage";
import { ProblemPage } from "../pages/problem/ProblemPage";
import { SolutionPage } from "../pages/solution/SolutionPage";
import { SimulatorPage } from "../pages/simulator/SimulatorPage";
import { UsersPage } from "../pages/users/UsersPage";

export const appRoutes = [
  {
    path: "/",
    label: "Início",
    title: "Início",
    description:
      "Visibilidade operacional para proteger qualidade, reduzir perdas e tornar cada decisão rastreável.",
    searchTerms: "home cadeia fria telemetria lotes alertas rastreabilidade",
    Component: HomePage,
  },
  {
    path: "/problema",
    label: "Problema",
    title: "Problema",
    description:
      "Onde a cadeia fria perde visibilidade, tempo de resposta e qualidade.",
    searchTerms: "perdas desperdício cadeia fria temperatura umidade",
    Component: ProblemPage,
  },
  {
    path: "/solucao",
    label: "Solução",
    title: "Solução",
    description:
      "Como a FreshSense conecta telemetria, contexto do lote e resposta operacional.",
    searchTerms: "dashboard sensores alertas lotes rastreabilidade",
    Component: SolutionPage,
  },
  {
    path: "/simulador",
    label: "Simulador",
    title: "Simulador de risco",
    description:
      "Análise comparativa de exposição, impacto, incerteza e medidas de controle.",
    searchTerms: "simulador risco temperatura umidade alimento recomendação",
    showInNavigation: false,
    Component: SimulatorPage,
  },
  {
    path: "/publico-alvo",
    label: "Usuários",
    title: "Usuários",
    description:
      "Uma visão compartilhada para produção, logística, qualidade e distribuição.",
    searchTerms: "público produtor logística distribuição cooperativa",
    Component: UsersPage,
  },
  {
    path: "/contato",
    label: "Fale Conosco",
    title: "Fale Conosco",
    description:
      "Converse sobre visibilidade, rastreabilidade e implantação na sua operação.",
    searchTerms: "contato formulário email mensagem parceria",
    isCallToAction: true,
    Component: ContactPage,
  },
  {
    path: "/fase5",
    label: "Monitoramento",
    title: "Monitoramento",
    description:
      "Controle unificado da cadeia fria, com telemetria, alertas, ativos e lotes em tempo real.",
    searchTerms:
      "monitoramento tempo real estoque produção disponibilidade qualidade alertas lotes",
    showInNavigation: false,
    Component: MonitoringPage,
  },
  {
    path: "/buscar-lotes",
    label: "Buscar lotes",
    title: "Buscar lotes",
    description:
      "Localização rápida de lotes por produto, condição, origem, risco e etapa da cadeia.",
    searchTerms:
      "buscar lotes filtros produto risco temperatura origem etapa cadeia",
    showInNavigation: false,
    Component: LotSearchPage,
  },
];

export function findRoute(path) {
  return appRoutes.find((route) => route.path === path);
}
