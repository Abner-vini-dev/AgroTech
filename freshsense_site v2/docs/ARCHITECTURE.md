# Arquitetura da aplicação

## Princípios

1. Páginas apenas compõem seções e funcionalidades.
2. Cada rota possui uma pasta própria em `src/pages`, com seus componentes, estilos e lógica exclusiva.
3. Cálculos e validações ficam em módulos JavaScript puros e testáveis.
4. Componentes compartilhados não dependem de uma página específica.
5. Todo texto traduzível é renderizado pelo contexto React de internacionalização.
6. Estilos globais permanecem em `src/site/styles`; estilos exclusivos ficam junto da página proprietária e são carregados pela entrada global na ordem original.

## Fluxo principal

`src/site/start.jsx` inicializa o React, os estilos e o contexto de idiomas. `src/site/App.jsx` seleciona a página por meio de `useRouter`. `routes.jsx` mantém em um único lugar as rotas, os títulos, a navegação e os dados de busca. O `AppLayout` fornece navegação, busca, tema, rodapé e comportamentos globais. Cada página combina seus módulos exclusivos com os recursos globais de `src/site`.

## Organização

- `pages`: uma pasta por tela, com `Page.jsx`, CSS e módulos exclusivos separados por responsabilidade.
- `site`: inicialização, rotas, layout, interface reutilizável, traduções, dados, armazenamento e estilos globais.

## Funcionalidades

- `risk`: cálculo e simulador de risco alimentar.
- `priority`: cálculo e simulador de prioridade operacional.
- `dashboard`: abas, lotes, sensores, alertas e relatórios.
- `monitoring`: pesquisa, filtros e favoritos persistentes.
- `contact`: formulário e validação.
- `causes`: exploração interativa das causas do problema.
- `profiles`: jornada interativa por perfil de usuário.

## Manutenção

- Uma nova regra de negócio deve ser criada fora do JSX e acompanhada por teste.
- Uma nova página deve ser registrada em `src/site/routes.jsx`.
- Um componente usado por mais de uma página deve ir para `src/site/ui`; componentes exclusivos permanecem na pasta da página.
- Não manipular conteúdo com `innerHTML`, `querySelector` ou scripts externos quando o estado React puder representar a interação.
- Antes de entregar uma alteração, executar `npm.cmd run check`.
