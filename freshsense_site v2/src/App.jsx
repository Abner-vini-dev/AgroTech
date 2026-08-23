import { useEffect, useState } from 'react';
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
 useEffect(()=>{const click=e=>{const a=e.target.closest('a[href]'); if(!a||a.target||a.origin!==location.origin)return; const href=a.getAttribute('href'); if(href.startsWith('/')&&!href.startsWith('//')){e.preventDefault();history.pushState({},'',href);setPath(href.replace(/\/$/,'')||'/')}}; document.addEventListener('click',click); return()=>document.removeEventListener('click',click)},[]);
 const page=routes[path]||'home';
 const slots={risk:<RiskSimulator/>,causes:<CauseExplorer/>,profile:<ProfileJourney/>,contact:<ContactForm/>};
 if(path==='/fase5') return <Layout page="/fase5"><FeatureHub/></Layout>;
 const html=pageContent[page];
 return <Layout page={path}><StaticPage html={html} slots={slots}/></Layout>;
}
function StaticPage({html,slots}){
 const [mounted,setMounted]=useState(false); useEffect(()=>{setMounted(true); const els=document.querySelectorAll('[data-react-slot]'); els.forEach(el=>{const slot=slots[el.dataset.reactSlot]; if(!slot) return; import('react-dom/client').then(({createRoot})=>{if(!el.__root)el.__root=createRoot(el);el.__root.render(slot);});}); const observer=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12}); document.querySelectorAll('.reveal').forEach(x=>observer.observe(x)); const scroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.scroll-progress')?.style.setProperty('transform',`scaleX(${max>0?scrollY/max:0})`)}; addEventListener('scroll',scroll,{passive:true});scroll();return()=>{observer.disconnect();removeEventListener('scroll',scroll)}},[html]); return <div dangerouslySetInnerHTML={{__html:html}}/>;
}
