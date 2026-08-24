import { useMemo, useState } from 'react';

const LOTES = [
  { id: 'LT-1042', produto: 'Tomate', categoria: 'Hortaliças', risco: 'alto', temperatura: 11.8, etapa: 'Transporte', origem: 'Jundiaí - SP' },
  { id: 'LT-1038', produto: 'Morango', categoria: 'Frutas', risco: 'medio', temperatura: 6.2, etapa: 'Armazenamento', origem: 'Atibaia - SP' },
  { id: 'LT-1031', produto: 'Alface', categoria: 'Hortaliças', risco: 'baixo', temperatura: 4.7, etapa: 'Distribuição', origem: 'Suzano - SP' },
  { id: 'LT-1026', produto: 'Uva', categoria: 'Frutas', risco: 'baixo', temperatura: 5.4, etapa: 'Armazenamento', origem: 'Jundiaí - SP' },
  { id: 'LT-1020', produto: 'Leite', categoria: 'Laticínios', risco: 'alto', temperatura: 9.1, etapa: 'Transporte', origem: 'Mogi das Cruzes - SP' },
  { id: 'LT-1014', produto: 'Cenoura', categoria: 'Hortaliças', risco: 'medio', temperatura: 7.3, etapa: 'Produção', origem: 'Ibiúna - SP' },
  { id: 'LT-1009', produto: 'Maçã', categoria: 'Frutas', risco: 'baixo', temperatura: 3.9, etapa: 'Distribuição', origem: 'São Joaquim - SC' },
  { id: 'LT-1003', produto: 'Queijo fresco', categoria: 'Laticínios', risco: 'medio', temperatura: 7.8, etapa: 'Armazenamento', origem: 'Itu - SP' },
];

const normalize = (value) => value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function SmartFilters() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [risco, setRisco] = useState('todos');
  const [etapa, setEtapa] = useState('todas');
  const [temperatura, setTemperatura] = useState('todas');

  const resultados = useMemo(() => LOTES.filter((lote) => {
    const termo = normalize(busca.trim());
    const correspondeBusca = !termo || [lote.id, lote.produto, lote.categoria, lote.origem, lote.etapa]
      .some((campo) => normalize(campo).includes(termo));
    const correspondeCategoria = categoria === 'todos' || lote.categoria === categoria;
    const correspondeRisco = risco === 'todos' || lote.risco === risco;
    const correspondeEtapa = etapa === 'todas' || lote.etapa === etapa;
    const correspondeTemperatura = temperatura === 'todas'
      || (temperatura === 'ate5' && lote.temperatura <= 5)
      || (temperatura === '5a8' && lote.temperatura > 5 && lote.temperatura <= 8)
      || (temperatura === 'acima8' && lote.temperatura > 8);

    return correspondeBusca && correspondeCategoria && correspondeRisco && correspondeEtapa && correspondeTemperatura;
  }), [busca, categoria, risco, etapa, temperatura]);

  function limparFiltros() {
    setBusca('');
    setCategoria('todos');
    setRisco('todos');
    setEtapa('todas');
    setTemperatura('todas');
  }

  return (
    <section className="section smart-filters-section">
      <div className="container">
        <div className="section-title centered">
          <span className="tag">Fase 5 • React</span>
          <h1>Busca e filtros inteligentes</h1>
          <p>Encontre rapidamente os lotes que precisam de atenção usando busca e filtros combinados.</p>
        </div>

        <div className="panel smart-filter-panel">
          <div className="smart-filter-grid">
            <div className="form-field smart-search-field">
              <label htmlFor="busca-lote">Buscar lote ou produto</label>
              <input
                id="busca-lote"
                type="search"
                placeholder="Ex.: tomate, LT-1042, Jundiaí..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="categoria">Produto</label>
              <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="Frutas">Frutas</option>
                <option value="Hortaliças">Hortaliças</option>
                <option value="Laticínios">Laticínios</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="risco">Risco</label>
              <select id="risco" value={risco} onChange={(e) => setRisco(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="temperatura">Temperatura</label>
              <select id="temperatura" value={temperatura} onChange={(e) => setTemperatura(e.target.value)}>
                <option value="todas">Todas</option>
                <option value="ate5">Até 5 °C</option>
                <option value="5a8">De 5 °C a 8 °C</option>
                <option value="acima8">Acima de 8 °C</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="etapa">Etapa da cadeia</label>
              <select id="etapa" value={etapa} onChange={(e) => setEtapa(e.target.value)}>
                <option value="todas">Todas</option>
                <option value="Produção">Produção</option>
                <option value="Armazenamento">Armazenamento</option>
                <option value="Transporte">Transporte</option>
                <option value="Distribuição">Distribuição</option>
              </select>
            </div>
          </div>

          <div className="smart-filter-summary">
            <p><strong>{resultados.length}</strong> {resultados.length === 1 ? 'lote encontrado' : 'lotes encontrados'}</p>
            <button className="btn-soft clear-filters-btn" type="button" onClick={limparFiltros}><span aria-hidden="true">↻</span> Limpar filtros</button>
          </div>
        </div>

        {resultados.length > 0 ? (
          <div className="smart-results-grid" aria-live="polite">
            {resultados.map((lote) => (
              <article className="card smart-lot-card" key={lote.id}>
                <div className="smart-lot-head">
                  <div>
                    <span className="tag">{lote.id}</span>
                    <h3>{lote.produto}</h3>
                  </div>
                  <span className={`status-pill risk-badge risk-${lote.risco}`}>
                    <span className="risk-dot" aria-hidden="true" />
                    Risco {lote.risco === 'medio' ? 'médio' : lote.risco}
                  </span>
                </div>
                <dl className="smart-lot-info">
                  <div><dt>Categoria</dt><dd>{lote.categoria}</dd></div>
                  <div><dt>Temperatura</dt><dd>{lote.temperatura.toFixed(1).replace('.', ',')} °C</dd></div>
                  <div><dt>Etapa</dt><dd>{lote.etapa}</dd></div>
                  <div><dt>Origem</dt><dd>{lote.origem}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel smart-empty-state" aria-live="polite">
            <h3>Nenhum lote encontrado</h3>
            <p>Tente remover algum filtro ou pesquisar por outro termo.</p>
            <button className="btn-soft" type="button" onClick={limparFiltros}>Mostrar todos os lotes</button>
          </div>
        )}
      </div>
    </section>
  );
}
