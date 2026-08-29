# Arquitetura da aplicação

## Princípios

1. Cada rota possui uma pasta própria em `src/paginas`.
2. Componentes exclusivos permanecem na página; componentes reutilizados ficam em `src/componentes`.
3. Regras, dados e hooks exclusivos só recebem pastas próprias quando a página realmente precisa deles.
4. O CSS de cada página fica diretamente na pasta proprietária, preservando a ordem da cascata.
5. Dados e utilitários globais não dependem de páginas.
6. Não são criadas pastas vazias ou camadas genéricas sem responsabilidade real.

## Fluxo principal

`src/main.jsx` inicializa o React, o contexto de idiomas e os estilos globais.
`src/App.jsx` combina a rota atual com o `AppLayout`. `src/routes.jsx` mantém o
cadastro único de rotas, títulos, navegação e busca. Cada página compõe somente
seus módulos locais e os componentes compartilhados necessários.

## Estrutura de `src`

- `App.jsx`, `main.jsx` e `routes.jsx`: entrada, composição e rotas.
- `componentes`: layout, busca, seletor de idioma, assistente global e componentes visuais reutilizados.
- `dados`: dados compartilhados entre funcionalidades.
- `hooks`: hooks globais realmente reutilizáveis.
- `paginas`: uma pasta por página, com seus arquivos exclusivos.
- `estilos`: estilos globais e ordem de carregamento da cascata.
- `traducoes`: contexto e dicionários de idioma.
- `utilitarios`: funções auxiliares compartilhadas.

### Páginas e rotas

| Página                | Rota            | Pasta                        | Entrada                 |
| --------------------- | --------------- | ---------------------------- | ----------------------- |
| Início                | `/`             | `src/paginas/inicio`         | `InicioPage.jsx`        |
| Problema              | `/problema`     | `src/paginas/problema`       | `ProblemaPage.jsx`      |
| Solução               | `/solucao`      | `src/paginas/solucao`        | `SolucaoPage.jsx`       |
| Simulador de risco    | `/simulador`    | `src/paginas/simulador`      | `SimuladorPage.jsx`     |
| Usuários              | `/publico-alvo` | `src/paginas/usuarios`       | `UsuariosPage.jsx`      |
| Fale Conosco          | `/contato`      | `src/paginas/contato`        | `ContatoPage.jsx`       |
| Monitoramento         | `/fase5`        | `src/paginas/monitoramento`  | `MonitoramentoPage.jsx` |
| Buscar lotes          | `/buscar-lotes` | `src/paginas/buscar-lotes`   | `BuscarLotesPage.jsx`   |
| Página não encontrada | rota inválida   | `src/paginas/nao-encontrada` | `NaoEncontradaPage.jsx` |

### Responsabilidades locais

- `*Page.jsx`: composição principal.
- `<pagina>.css`: arquivo único dos estilos locais.
- `componentes/`: componentes usados apenas naquela página.
- `modelo/`: regras e cálculos exclusivos.
- `dados/`: conteúdo estático exclusivo.
- `hooks/`: estado e efeitos exclusivos.

Os arquivos CSS extensos são organizados por seções comentadas dentro do arquivo
único da página. Isso evita subpastas `estilos`, parciais redundantes e mudanças
acidentais na ordem da cascata.

## Componentes compartilhados

- `AppLayout`: estrutura global, cabeçalho, rodapé e comportamentos do site.
- `SiteSearch`: busca global pelas páginas.
- `LanguageSwitcher`: seleção de idioma.
- `PageHero`: cabeçalho reutilizado pelas páginas internas.
- `componentes/copilot`: interface, eventos e modelo do assistente global.

`LiveReading` permanece em `paginas/inicio/componentes`, pois é usado somente pela
página Início.

## Manutenção

- Registrar novas páginas em `src/routes.jsx`.
- Mover um componente para `src/componentes` somente quando houver uso global ou por mais de uma página.
- Manter regras de negócio fora do JSX quando tiverem estado ou cálculos próprios.
- Não criar `servicos`, `utilitarios`, `hooks`, `modelo` ou `dados` sem arquivos que pertençam claramente à responsabilidade.
- Antes de entregar alterações, executar `npm.cmd run check`.
