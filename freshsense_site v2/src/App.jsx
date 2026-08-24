import { useEffect, useLayoutEffect, useState } from 'react';
import pageContent from './pageContent.json';
import { Layout } from './components/Layout';
import { CauseExplorer, ContactForm, ProfileJourney, RiskSimulator } from './components/Interactive';
import { FeatureHub } from './components/FeatureHub';
import './app.css';
import '../assets/css/global.css';
import '../assets/css/components.css';
import '../pages/home/home.css';
import '../pages/problema/problema.css';
import '../pages/solucao/solucao.css';
import '../pages/publico-alvo/publico-alvo.css';
import '../pages/contato/contato.css';

const routes={'/':'home','/problema':'problema','/solucao':'solucao','/publico-alvo':'publico','/contato':'contato'};
export default function App(){
 const [path,setPath]=useState(window.location.pathname.replace(/\/$/,'')||'/');
 useEffect(()=>{const on=()=>setPath(window.location.pathname.replace(/\/$/,'')||'/'); window.addEventListener('popstate',on); return()=>window.removeEventListener('popstate',on)},[]);
 useLayoutEffect(()=>{
  if(path==='/fase5'){
   history.replaceState({},'', '/buscar-lotes');
   setPath('/buscar-lotes');
  }
 },[path]);
 useEffect(()=>{const click=e=>{const a=e.target.closest('a[href]'); if(!a||a.target||a.origin!==location.origin)return; const href=a.getAttribute('href'); if(href.startsWith('/')&&!href.startsWith('//')){e.preventDefault();history.pushState({},'',href);setPath(href.replace(/\/$/,'')||'/')}}; document.addEventListener('click',click); return()=>document.removeEventListener('click',click)},[]);
 const page=routes[path]||'home';
 const slots={risk:<RiskSimulator/>,causes:<CauseExplorer/>,profile:<ProfileJourney/>,contact:<ContactForm/>};
 if(path==='/buscar-lotes'||path==='/fase5') return <Layout page="/buscar-lotes"><FeatureHub/></Layout>;
 const html=pageContent[page];
 return <Layout page={path}><StaticPage html={html} slots={slots}/></Layout>;
}
function StaticPage({html,slots}){
 useLayoutEffect(()=>{
  const els=document.querySelectorAll('[data-react-slot]');
  els.forEach(el=>{
   const slot=slots[el.dataset.reactSlot];
   if(!slot) return;
   import('react-dom/client').then(({createRoot})=>{
    if(!el.__root)el.__root=createRoot(el);
    el.__root.render(slot);
   });
  });

  const revealEls=[...document.querySelectorAll('.reveal')];
  // Elementos que já estão visíveis no primeiro carregamento não devem começar ocultos.
  // Isso evita a tela inicial aparecer vazia até ocorrer uma navegação/reflow.
  revealEls.forEach(el=>{
   const rect=el.getBoundingClientRect();
   if(rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('visible');
  });

  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){
     entry.target.classList.add('visible');
     observer.unobserve(entry.target);
    }
   });
  },{threshold:.12,rootMargin:'0px 0px -24px 0px'});
  revealEls.filter(el=>!el.classList.contains('visible')).forEach(el=>observer.observe(el));

  return()=>{observer.disconnect()};
 },[html]);
 return <div dangerouslySetInnerHTML={{__html:html}}/>;
}
