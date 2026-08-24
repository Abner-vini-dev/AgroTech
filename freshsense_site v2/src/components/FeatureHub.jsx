import { ACTIVE_FEATURE, FEATURE_OPTIONS } from '../features/config';
import { SmartFilters } from '../features/SmartFilters';

export function FeatureHub(){
 if(ACTIVE_FEATURE==='filtros') return <SmartFilters/>;
 return <section className="section"><div className="container"><div className="section-title centered"><span className="tag">Fase 5 • React</span><h1>Área reservada para a nova funcionalidade</h1><p>O projeto já está estruturado em React. Escolham uma opção abaixo e implementem apenas uma como funcionalidade oficial da Fase 5.</p></div><div className="tech-grid">{FEATURE_OPTIONS.map((f,i)=><article className={`card feature-option ${ACTIVE_FEATURE===f.id?'active':''}`} key={f.id}><span className="tag">Opção {i+1}</span><h3>{f.title}</h3><p>{f.description}</p><strong>React: {f.reactConcepts.join(' • ')}</strong>{ACTIVE_FEATURE===f.id&&<p><strong>ATIVA</strong> — esta é a funcionalidade selecionada no arquivo <code>src/features/config.js</code>.</p>}</article>)}</div><div className="feature-callout"><div><span className="tag">Como ativar</span><strong>Escolham uma opção em config.js</strong><p>Altere <code>ACTIVE_FEATURE</code> de <code>null</code> para o ID escolhido. A implementação pode ser colocada em <code>src/features/</code> sem mexer nas páginas existentes.</p></div></div></div></section>
}
