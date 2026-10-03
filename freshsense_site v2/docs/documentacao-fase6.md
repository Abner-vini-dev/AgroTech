# FreshSense — Documentação da Fase 6

## Nova funcionalidade

A Destinação Inteligente de Lotes transforma os alertas do monitoramento em
ações operacionais. O usuário seleciona um lote, consulta risco, validade e
volume disponível, recebe uma sugestão e registra uma das seguintes ações:

- doação;
- venda prioritária;
- aplicação de desconto;
- transferência entre unidades.

O formulário impede quantidade superior ao estoque, data passada, registro sem
destino e responsável sem nome completo. Depois do cadastro, a operação pode
avançar de pendente para aprovada, em transporte e concluída. Cada mudança fica
registrada no histórico e os dados permanecem salvos no navegador.

## Explicação do diagrama UML

- `Usuario`: representa quem registra e acompanha a operação.
- `Lote`: armazena produto, quantidade, unidade, risco e validade.
- `Destinacao`: reúne a decisão, quantidade, data e status da operação.
- `Instituicao`: representa o destino que recebe o lote.
- `HistoricoStatus`: registra cada alteração de status da destinação.

### Relacionamentos

- Um usuário pode registrar nenhuma ou várias destinações.
- Um lote pode originar nenhuma ou várias destinações.
- Uma instituição pode receber nenhuma ou várias destinações.
- Uma destinação é composta por um ou vários registros de histórico. Se a
  destinação deixar de existir, seu histórico também deixa de existir.

O arquivo `diagrama-classes-fase6.png` está pronto para ser inserido no PDF da
entrega. O arquivo `diagrama-classes-fase6.puml` mantém a versão editável.

## Pendências externas

Antes da entrega final ainda será necessário publicar o novo pitch, substituir
o link do vídeo na Home, atualizar o deploy e montar o PDF com integrantes,
diagrama, link do vídeo e link do deploy.
