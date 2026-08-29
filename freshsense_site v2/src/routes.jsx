import { BuscarLotesPage } from "./paginas/buscar-lotes/BuscarLotesPage";
import { ContatoPage } from "./paginas/contato/ContatoPage";
import { InicioPage } from "./paginas/inicio/InicioPage";
import { MonitoramentoPage } from "./paginas/monitoramento/MonitoramentoPage";
import { ProblemaPage } from "./paginas/problema/ProblemaPage";
import { SimuladorPage } from "./paginas/simulador/SimuladorPage";
import { SolucaoPage } from "./paginas/solucao/SolucaoPage";
import { UsuariosPage } from "./paginas/usuarios/UsuariosPage";

export const appRoutes = [
  {
    path: "/",
    label: "Início",
    title: "Início",
    description:
      "Visibilidade operacional para proteger qualidade, reduzir perdas e tornar cada decisão rastreável.",
    searchTerms: "home cadeia fria telemetria lotes alertas rastreabilidade",
    Component: InicioPage,
  },
  {
    path: "/problema",
    label: "Problema",
    title: "Problema",
    description:
      "Onde a cadeia fria perde visibilidade, tempo de resposta e qualidade.",
    searchTerms: "perdas desperdício cadeia fria temperatura umidade",
    Component: ProblemaPage,
  },
  {
    path: "/solucao",
    label: "Solução",
    title: "Solução",
    description:
      "Como a FreshSense conecta telemetria, contexto do lote e resposta operacional.",
    searchTerms: "dashboard sensores alertas lotes rastreabilidade",
    Component: SolucaoPage,
  },
  {
    path: "/simulador",
    label: "Simulador",
    title: "Simulador de risco",
    description:
      "Análise comparativa de exposição, impacto, incerteza e medidas de controle.",
    searchTerms: "simulador risco temperatura umidade alimento recomendação",
    showInNavigation: false,
    Component: SimuladorPage,
  },
  {
    path: "/publico-alvo",
    label: "Usuários",
    title: "Usuários",
    description:
      "Uma visão compartilhada para produção, logística, qualidade e distribuição.",
    searchTerms: "público produtor logística distribuição cooperativa",
    Component: UsuariosPage,
  },
  {
    path: "/contato",
    label: "Fale Conosco",
    title: "Fale Conosco",
    description:
      "Converse sobre visibilidade, rastreabilidade e implantação na sua operação.",
    searchTerms: "contato formulário email mensagem parceria",
    isCallToAction: true,
    Component: ContatoPage,
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
    Component: MonitoramentoPage,
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
    Component: BuscarLotesPage,
  },
];

export function findRoute(path) {
  return appRoutes.find((route) => route.path === path);
}
