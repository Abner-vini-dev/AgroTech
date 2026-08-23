import { useEffect, useMemo, useState } from 'react';

const foodProfiles = {
  frutas: { label:'Frutas', sensitivity:10, temp:[6,12], humidity:[70,90], maxTime:18 },
  verduras: { label:'Verduras', sensitivity:14, temp:[2,7], humidity:[82,96], maxTime:12 },
  laticinios: { label:'Laticínios', sensitivity:22, temp:[1,5], humidity:[60,78], maxTime:8 },
  carnes: { label:'Carnes', sensitivity:26, temp:[-1,4], humidity:[60,75], maxTime:6 },
  graos: { label:'Grãos', sensitivity:6, temp:[12,25], humidity:[45,65], maxTime:72 },
  outros: { label:'Outros', sensitivity:12, temp:[4,14], humidity:[55,80], maxTime:16 },
};
const stageProfiles = { producao:['Produção',2], armazenamento:['Armazenamento',7], transporte:['Transporte',15], distribuicao:['Distribuição',13] };
const sensorProfiles = { normal:['Normal',0], instavel:['Instável',12], 'sem-sinal':['Sem sinal',26] };
const clamp=(v,min,max)=>Math.min(Math.max(v,min),max);
const deviation=(v,[min,max])=>v<min?min-v:v>max?v-max:0;

function calculate(values){
  const food=foodProfiles[values.produto], stage=stageProfiles[values.etapa], sensor=sensorProfiles[values.sensor];
  const tempRisk=clamp(deviation(values.temperatura,food.temp)*(food.sensitivity>=20?3.2:2.4),0,30);
  const humidityRisk=clamp(deviation(values.umidade,food.humidity)*.85,0,20);
  const timeRisk=clamp((values.tempo/food.maxTime)*18,0,26);
  const score=Math.round(clamp(food.sensitivity+tempRisk+humidityRisk+timeRisk+stage[1]+sensor[1],0,100));
  const level=score<=35?['Risco baixo','risk-low']:score<=70?['Risco médio','risk-medium']:['Risco alto','risk-high'];
  const factors=[['Sensibilidade do alimento',food.sensitivity],['Temperatura fora da faixa ideal',tempRisk],['Umidade fora da faixa ideal',humidityRisk],['Tempo elevado de exposição',timeRisk],['Etapa com maior exposição',stage[1]],['Sensor',sensor[1]]];
  const factor=factors.reduce((a,b)=>b[1]>a[1]?b:a,factors[0]);
  let action='Manter monitoramento contínuo';
  if(sensor[0]==='Sem sinal') action='Conferir sensor imediatamente';
  else if(level[1]==='risk-high'&&stage[0]==='Transporte') action='Interromper transporte e revisar condição do lote';
  else if(level[1]==='risk-high'&&stage[0]==='Distribuição') action='Priorizar entrega do lote';
  else if(factor[0].startsWith('Temperatura')) action='Transferir para câmara fria';
  else if(factor[0].startsWith('Umidade')) action='Verificar umidade do ambiente';
  else if(factor[0].startsWith('Tempo')) action='Priorizar entrega do lote';
  else if(sensor[0]==='Instável') action='Conferir sensor imediatamente';
  else if(level[1]==='risk-medium') action='Revisar temperatura da câmara';
  return {score,level,food,stage,sensor,factor,action};
}

export function RiskSimulator(){
  const [values,setValues]=useState({produto:'frutas',temperatura:7,umidade:68,tempo:8,etapa:'producao',sensor:'normal'});
  const [result,setResult]=useState(null); const [history,setHistory]=useState([]); const [errors,setErrors]=useState([]);
  const update=(k,v)=>setValues(x=>({...x,[k]:v}));
  const submit=e=>{e.preventDefault(); const n={...values,temperatura:Number(values.temperatura),umidade:Number(values.umidade),tempo:Number(values.tempo)}; const es=[]; if(n.temperatura<-10||n.temperatura>40) es.push('Temperatura deve estar entre -10°C e 40°C.'); if(n.umidade<0||n.umidade>100) es.push('Umidade deve estar entre 0% e 100%.'); if(n.tempo<=0||n.tempo>240) es.push('Tempo deve ser maior que 0 e até 240 horas.'); setErrors(es); if(es.length)return; const r=calculate(n); setResult(r); setHistory(h=>[{...r,time:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})},...h].slice(0,5));};
  return <section className="section" id="simulador-risco"><div className="container simulator-layout">
    <div className="section-title reveal"><span className="tag">Análise operacional</span><h2>Simulador de risco de perda de alimentos</h2><p>Informe as condições do lote para estimar risco, identificar o fator mais crítico e receber uma recomendação operacional.</p></div>
    <form className="risk-simulator card reveal" onSubmit={submit}><div className="simulator-card-head"><span className="tag">Parâmetros do lote</span><strong>Condição atual do alimento</strong></div><div className="form-grid">
      <Field label="Tipo de alimento"><select value={values.produto} onChange={e=>update('produto',e.target.value)}>{Object.entries(foodProfiles).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></Field>
      <Field label="Temperatura atual (°C)"><input type="number" step="0.1" value={values.temperatura} onChange={e=>update('temperatura',e.target.value)}/></Field>
      <Field label="Umidade atual (%)"><input type="number" step="1" value={values.umidade} onChange={e=>update('umidade',e.target.value)}/></Field>
      <Field label="Tempo de transporte ou armazenamento (h)"><input type="number" step="0.5" value={values.tempo} onChange={e=>update('tempo',e.target.value)}/></Field>
      <Field label="Etapa da cadeia"><select value={values.etapa} onChange={e=>update('etapa',e.target.value)}>{Object.entries(stageProfiles).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select></Field>
      <Field label="Condição do sensor"><select value={values.sensor} onChange={e=>update('sensor',e.target.value)}>{Object.entries(sensorProfiles).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select></Field>
      <p className="risk-errors" role="alert">{errors.join(' ')}</p><button className="btn-fresh btn-block" type="submit">Calcular risco</button>
    </div></form>
    <aside className={`risk-result panel reveal ${result?.level?.[1]||'risk-low'}`} aria-live="polite"><div className="risk-result-head"><span className="tag">Diagnóstico FreshSense</span><strong>{result?.level?.[0]||'Risco baixo'}</strong></div><div className="risk-score-row"><div className="risk-score-card"><span>Pontuação</span><b>{result?.score||0}</b></div><div className="risk-progress"><i style={{width:`${result?.score||0}%`}}/></div></div><div className="risk-analysis-copy"><span>Resumo do diagnóstico</span><p>{result?result.level[1]==='risk-high'?'Risco elevado para o lote. A condição atual exige ação imediata para evitar perda de qualidade.':result.level[1]==='risk-medium'?'Condição de atenção. O principal desvio precisa ser acompanhado antes da próxima etapa.':'Condição estável. Mantenha leituras regulares e monitoramento contínuo.':'Preencha os dados do lote e calcule o risco para receber a análise.'}</p></div><div className="risk-impact"><div><span>Recomendação operacional</span><strong>{result?.action||'Manter monitoramento contínuo'}</strong></div><div><span>Principal fator de risco</span><strong>{result?.factor?.[0]||'Sem fator crítico'}</strong></div></div><div className="risk-factor-grid"><div><span>Temperatura</span><strong>{result?'Analisada':'Dentro da faixa'}</strong></div><div><span>Umidade</span><strong>{result?'Analisada':'Dentro da faixa'}</strong></div><div><span>Tempo</span><strong>{result?'Analisado':'Controlado'}</strong></div><div><span>Sensor</span><strong>{result?.sensor?.[0]||'Normal'}</strong></div></div></aside>
    <aside className="risk-history card reveal"><div className="simulator-card-head"><span className="tag">Histórico</span><strong>Últimas simulações</strong></div><div className="history-list">{history.length?history.map((x,i)=><article key={i} className={`history-item ${x.level[1]}`}><div><strong>{x.food.label}</strong><span>{x.time}</span></div><span className="history-pill">{x.level[0]} · {x.score}</span></article>):<p>Nenhuma simulação registrada nesta sessão.</p>}</div></aside>
  </div></section>
}
function Field({label,children}){return <div className="form-field"><label>{label}</label>{children}</div>}

export function ProfileJourney(){
 const profiles={produtor:['Cadastro do lote','Produtor acompanha a saída do alimento','Define faixa ideal, vincula sensor e garante que o lote saia com histórico ambiental claro.'],logistica:['Ação em rota','Logística prioriza entregas sensíveis','Recebe alerta de risco, ajusta rota e confirma ações corretivas durante transporte.'],qualidade:['Controle e auditoria','Qualidade analisa estabilidade e conformidade','Compara leituras, acompanha histórico e decide quais lotes exigem prioridade operacional.'],instituicao:['Impacto social','Instituições acompanham aproveitamento','Usam relatórios para apoiar distribuição mais eficiente e reduzir perdas alimentares.']};
 const [active,setActive]=useState('produtor'); const p=profiles[active];
 return <section className="section surface"><div className="container user-journey"><div className="section-title reveal"><span className="tag">Jornada por perfil</span><h2>Selecione um usuário para ver a decisão principal</h2></div><div className="journey-picker reveal" role="tablist">{Object.keys(profiles).map(k=><button key={k} className={`btn-soft ${active===k?'active':''}`} role="tab" aria-selected={active===k} onClick={()=>setActive(k)}>{k[0].toUpperCase()+k.slice(1)}</button>)}</div><article className="journey-result card reveal" role="tabpanel"><span className="tag">{p[0]}</span><h3>{p[1]}</h3><p>{p[2]}</p></article></div></section>
}

export function CauseExplorer(){
 const causes={temperatura:['Temperatura','Quando a temperatura sai da faixa ideal, o lote precisa de ação rápida antes que a perda se torne irreversível.'],umidade:['Umidade','Produtos frescos podem perder textura, segurança e vida útil quando a umidade sai da faixa adequada.'],rota:['Rota','Atrasos e paradas aumentam a exposição ambiental e podem transformar uma condição controlável em perda.']};
 const [active,setActive]=useState('temperatura'); const c=causes[active];
 return <section className="section surface"><div className="container two-column"><div className="section-title reveal"><span className="tag">Causas principais</span><h2>Falta de dados transforma prevenção em reação tardia</h2><p>Sem sensores e rastreabilidade, a equipe descobre o problema quando ele já chegou ao estoque, ao ponto de venda ou ao descarte.</p><div className="button-row"><a className="btn-fresh" href="/solucao">Ver como a FreshSense resolve</a></div></div><div className="cause-list reveal">{Object.entries(causes).map(([k,v])=><button key={k} type="button" className={`cause-item ${active===k?'active':''}`} aria-pressed={active===k} onClick={()=>setActive(k)}><strong>{v[0]}</strong><span>{k==='temperatura'?'Leituras fora da faixa ideal aceleram a deterioração.':k==='umidade'?'Produtos frescos perdem textura, segurança e vida útil.':'Atrasos e paradas aumentam exposição ambiental.'}</span></button>)}<div className="cause-detail" aria-live="polite"><span>{c[0]}</span><p>{c[1]}</p></div></div></div></section>
}

export function ContactForm(){
 const [data,setData]=useState({nome:'',email:'',perfil:'',assunto:'',operacao:'',mensagem:''}); const [status,setStatus]=useState('');
 const update=(k,v)=>{setData(d=>({...d,[k]:v}));setStatus('');};
 const submit=e=>{e.preventDefault(); const name=/^[A-Za-zÀ-ÖØ-öø-ÿ'-]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ'-]+)+$/.test(data.nome.trim()); const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()); if(!name||!email||!data.mensagem.trim()||data.mensagem.length>500){setStatus('Revise os campos obrigatórios antes de enviar.');return;} setStatus('Mensagem validada com sucesso. A equipe FreshSense recebeu sua solicitação.'); setData({nome:'',email:'',perfil:'',assunto:'',operacao:'',mensagem:''});};
 return <section className="section surface"><div className="container contact-layout"><aside className="contact-panel card reveal"><span className="tag">Atendimento FreshSense</span><h2>Como podemos ajudar</h2><p>Compartilhe sua necessidade e receba um retorno direcionado para operações com alimentos perecíveis.</p><div className="contact-list"><div><strong>Parcerias</strong><span>Produtores, cooperativas e centros de distribuição.</span></div><div><strong>Dúvidas técnicas</strong><span>Sensores, alertas, rastreabilidade e relatórios.</span></div><div><strong>Implantação operacional</strong><span>Diagnóstico de cadeia fria, prioridades e indicadores.</span></div></div></aside><form className="contact-form card reveal" onSubmit={submit}><div className="form-head"><span className="tag">Mensagem</span><h2>Envie sua solicitação</h2><p>Preencha os dados principais para que a equipe FreshSense entenda seu contexto.</p></div><div className="form-grid"><Field label="Nome completo *"><input value={data.nome} onChange={e=>update('nome',e.target.value)} /></Field><Field label="E-mail *"><input type="email" value={data.email} onChange={e=>update('email',e.target.value)} /></Field><Field label="Perfil"><select value={data.perfil} onChange={e=>update('perfil',e.target.value)}><option value="">Selecione uma opção</option><option>Produtor ou cooperativa</option><option>Transporte e logística</option><option>Armazenagem e distribuição</option><option>Instituição pública ou social</option><option>Equipe de qualidade alimentar</option></select></Field><Field label="Assunto"><select value={data.assunto} onChange={e=>update('assunto',e.target.value)}><option value="">Selecione uma opção</option><option>Parceria ou projeto piloto</option><option>Dúvidas sobre sensores</option><option>Rastreabilidade e alertas</option><option>Relatórios e impacto social</option></select></Field><Field label="Tamanho da operação"><select value={data.operacao} onChange={e=>update('operacao',e.target.value)}><option value="">Selecione uma opção</option><option>Pequena operação local</option><option>Cooperativa ou produtor recorrente</option><option>Centro de distribuição</option><option>Rede com múltiplas rotas</option></select></Field><div className="form-field full"><label>Descrição da mensagem *</label><textarea rows="6" maxLength="500" value={data.mensagem} onChange={e=>update('mensagem',e.target.value)} /><div className="field-meta"><small className="field-error">{status}</small><small className="field-counter">{data.mensagem.length}/500 caracteres</small></div></div><button className="btn-fresh btn-block" type="submit">Enviar mensagem</button></div></form></div></section>
}
