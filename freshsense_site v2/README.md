# FreshSense — Fase 6 React

Versão React construída sobre o projeto da Fase 5. A nova funcionalidade de
Destinação Inteligente permite selecionar lotes em risco, validar a quantidade,
registrar uma ação contra o desperdício e acompanhar seu status.

## Executar

```cmd
npm.cmd install
npm.cmd run dev
```

## Validar

```cmd
npm.cmd run check
```

O comando `check` executa lint, verificação de formatação, testes unitários,
testes de interface e o build de produção.

Comandos individuais:

```cmd
npm.cmd run lint
npm.cmd run format
npm.cmd run test:unit
npm.cmd run test:ui
npm.cmd run build
```

## Estrutura

- `src/main.jsx`, `src/App.jsx` e `src/routes.jsx`: inicialização, composição e
  cadastro das rotas.
- `src/componentes`: componentes globais ou utilizados por mais de uma página.
- `src/paginas`: uma pasta por página, reunindo JSX, um CSS local e módulos exclusivos.
  - `componentes`: componentes usados somente pela página.
  - `modelo`, `dados` e `hooks`: criados apenas quando a página realmente precisa.
  - `<pagina>.css`: arquivo único mantido diretamente na pasta da página e
    organizado internamente por seções nas telas extensas.
- `src/dados`, `src/hooks`, `src/traducoes` e `src/utilitarios`: recursos globais
  com responsabilidades específicas.
- `src/estilos`: estilos globais e ordem da cascata.

Todo o comportamento da aplicação está em componentes, hooks e contextos React dentro de `src`.

## Nova funcionalidade da Fase 6

- Doação, venda prioritária, desconto ou transferência de lotes.
- Validações de quantidade, responsável, destino e data de retirada.
- Sugestão automática de ação conforme risco e validade.
- Histórico de status e atualização do volume destinado.
- Persistência das destinações no armazenamento local do navegador.
- Diagrama de classes em `docs/diagrama-classes-fase6.png`.
