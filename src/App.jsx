import { useState, useMemo } from 'react'
import { SAMPLE, T } from './data.js'
import { validate, solve, init, tog } from './logic.js'

// JSX-free on purpose: h is React.createElement
const h = (...a) => createElement(...a)
import { createElement } from 'react'

export default function App(){
 const [lang,setLang]=useState("en"),[D,setD]=useState(SAMPLE),[s,setS]=useState(init(SAMPLE)),[mode,setMode]=useState("s"),[err,setErr]=useState("");
 const t=T[lang],R=useMemo(()=>solve(D,s),[D,s]);
 const nm=useMemo(()=>{const o={};D.nodes.forEach(n=>o[n.id]=n);return o},[D]);
 const xs=D.nodes.map(n=>n.x),ys=D.nodes.map(n=>n.y),P=50;
 const x0=Math.min(...xs)-P,y0=Math.min(...ys)-P,W=Math.max(...xs)-x0+P,H=Math.max(...ys)-y0+P;
 const load=d=>{setD(d);setS(init(d));setErr("")};
 const file=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{const d=JSON.parse(r.result);validate(d);load(d)}catch(x){setErr(t.bad+": "+(x.message||x))}};r.readAsText(f);e.target.value=""};
 const clickNode=n=>{
  if(mode==="s"){if(n.type!=="exit"&&!s.bn.has(n.id))setS({...s,start:n.id});return}
  if(n.type==="exit")setS({...s,cx:tog(s.cx,n.id)});else setS({...s,bn:tog(s.bn,n.id)});
 };
 const clickEdge=g=>{if(mode==="h")setS({...s,be:tog(s.be,g.id)})};
 const col=n=>s.bn.has(n.id)||s.cx.has(n.id)?"#ff4b2b":n.type==="room"?"#f0f0f0":n.type==="junction"?"#9a9a9a":"#c8f31d";
 const onR=id=>R.k==="ok"&&R.path.includes(id);
 const label=n=>n.id+" · "+n.label;
 const haz=[...s.bn].map(i=>t.bn+": "+i).concat([...s.be].map(i=>t.be+": "+i),[...s.cx].map(i=>t.cx+": "+i));

 const edges=D.edges.map(g=>{const a=nm[g.from],b=nm[g.to],bl=s.be.has(g.id),on=R.k==="ok"&&R.eds.has(g.id),dead=s.bn.has(g.from)||s.bn.has(g.to)||s.cx.has(g.from)||s.cx.has(g.to);
  const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
  return h("g",{key:g.id,style:{cursor:mode==="h"?"pointer":"default"},onClick:()=>clickEdge(g)},
   h("line",{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:"transparent",strokeWidth:18}),
   on&&h("line",{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:"#c8f31d",strokeWidth:12,opacity:.35}),
   h("line",{className:"ed"+(on?" flow":""),x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:bl?"#ff4b2b":on?"#c8f31d":"#ececec",strokeWidth:on?6:bl?4:3,strokeDasharray:bl?"4 6":undefined,opacity:dead&&!bl?.3:1}),
   h("rect",{x:mx-12,y:my-9,width:24,height:18,rx:2,fill:bl?"#ff4b2b":"#1c1c1c",stroke:on?"#c8f31d":"#ececec",strokeWidth:2}),
   h("text",{x:mx,y:my+4.5,textAnchor:"middle",fontSize:12,fontWeight:800,fill:"#fff",fontFamily:"IBM Plex Mono"},bl?"✕":g.cost));});

 const nodes=D.nodes.map(n=>{const c=col(n),bad=s.bn.has(n.id)||s.cx.has(n.id),sel=s.start===n.id;
  const sh=n.type==="room"?h("rect",{x:-17,y:-17,width:34,height:34,rx:6,fill:c,className:"nd"}):n.type==="junction"?h("circle",{r:18,fill:c,className:"nd"}):h("polygon",{points:"0,-22 20,-8 14,16 -14,16 -20,-8",fill:c,className:"nd"});
  return h("g",{key:n.id,transform:`translate(${n.x},${n.y})`,style:{cursor:"pointer"},onClick:()=>clickNode(n)},
   sel&&h("circle",{r:26,fill:"none",stroke:"#c8f31d",strokeWidth:4,className:"pulse"}),
   onR(n.id)&&!sel&&h("circle",{r:25,fill:"none",stroke:"#c8f31d",strokeWidth:3,strokeDasharray:"5 4"}),
   h("g",{stroke:"#1c1c1c",strokeWidth:4},sh),
   bad&&h("text",{y:7,textAnchor:"middle",fontSize:22,fontWeight:800,fill:"#fff"},n.type==="exit"?"✕":"✕"),
   !bad&&h("text",{y:5,textAnchor:"middle",fontSize:12,fontWeight:800,fill:"#1c1c1c",fontFamily:"IBM Plex Mono"},n.id),
   h("text",{y:38,textAnchor:"middle",fontSize:11,fontWeight:700,fill:"#ececec",stroke:"#1c1c1c",strokeWidth:3,paintOrder:"stroke"},n.label));});

 const res=R.k==="idle"?h("div",{className:"res idle"},t.none):
  R.k==="nr"?h("div",{className:"res bad"},h("div",{className:"big"},""+t.nr)):
  R.k==="sb"?h("div",{className:"res bad"},h("div",{className:"big"},""+t.sb)):
  h("div",{className:"res ok"},h("div",{className:"big"},t.cost+": "+R.cost),
   h("div",null,t.exit+": "+label(nm[R.exit])),h("div",null,t.path+":"),
   h("div",{className:"chips"},R.path.flatMap((id,i)=>[i>0&&h("span",{key:"a"+i},"→"),h("span",{className:"chip",key:id,style:{animationDelay:i*60+"ms"}},id)])));

 return h("div",null,
  h("div",{className:"mq"},h("span",null,t.mq.repeat(3))),h("div",{className:"key"}),
  h("div",{className:"wrap"},
   h("header",null,h("div",null,h("h1",null,t.title),h("div",{className:"sub"},t.sub+" · "+D.building)),
    h("div",{className:"row"},h("button",{className:"warn",onClick:()=>setLang(lang==="en"?"bn":"en")},""+t.lang))),
   h("div",{className:"grid"},
    h("div",{className:"card"},h("div",{className:"vt"},"ESC.3"),h("h2",null,""+t.map),
     h("div",{className:"row",style:{marginBottom:10}},
      h("button",{className:mode==="s"?"on":"",onClick:()=>setMode("s")},""+t.ms),
      h("button",{className:mode==="h"?"on":"",onClick:()=>setMode("h")},""+t.mh),
      h("button",{className:"alt",onClick:()=>{setS(init(D));setErr("")}},""+t.reset),
      h("label",{className:"btn"},""+t.imp,h("input",{type:"file",accept:".json,application/json",onChange:file,hidden:true})),
      h("button",{className:"warn",onClick:()=>load(SAMPLE)},t.sample)),
     h("svg",{className:"map",viewBox:`${x0} ${y0} ${W} ${H}`,role:"img","aria-label":t.map},edges,nodes),
     h("p",{style:{fontSize:13,fontWeight:700,margin:"10px 0 0"}},t.inst),
     err&&h("div",{className:"err"},"⚠ "+err)),
    h("div",{className:"stack"},
     h("div",{className:"card"},h("h2",null,""+t.res),
      s.start&&h("div",{style:{marginBottom:8,fontWeight:700}},t.start+": "+label(nm[s.start])),res),
     h("div",{className:"card"},h("h2",null,""+t.hz),
      haz.length?h("div",{className:"chips"},haz.map(x=>h("span",{className:"chip",key:x,style:{color:"#ff8a70"}},x))):h("div",null,"—")),
     h("div",{className:"card"},h("h2",null,""+t.leg),
      h("div",{className:"leg"},
       [["#f0f0f0",t.room],["#9a9a9a",t.junction],["#c8f31d",t.exitT],["#ff4b2b",t.bn+" / "+t.cx],["#c8f31d",t.rt],["#1c1c1c",t.cost]].map(([c,l])=>h("div",{key:l},h("i",{style:{background:c}}),l)))))))); }
