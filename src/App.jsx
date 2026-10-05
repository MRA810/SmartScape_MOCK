import { useState, useMemo } from 'react'
import { SAMPLE, T } from './data.js'
import { validate, solve, init, tog } from './logic.js'

// JSX-free on purpose: h is React.createElement
const h = (...a) => createElement(...a)
import { createElement } from 'react'

/* ---------- small visual helpers ---------- */
const FL = "M0,-18 C6,-10 9,-5 7,0 C6,3 3,5 0,5 C-3,5 -6,3 -7,0 C-9,-5 -4,-8 0,-18Z"
const I = (e, c) => h("span", { className: "ic" + (c ? " " + c : "") }, e)

// one flickering flame (outer orange + inner yellow)
const Flame = (k, x, y, sc, d) =>
 h("g", { key: k, transform: `translate(${x},${y}) scale(${sc})` },
  h("g", { className: "flame", style: { animationDelay: d + "s" } },
   h("path", { d: FL, fill: "#ff6a13" }),
   h("path", { d: FL, fill: "#ffd23f", transform: "translate(0,1.5) scale(.55)" })))

// fire sitting on top of a node: glow + 3 flames + rising embers
const fire = ofs =>
 h("g", { style: { pointerEvents: "none" } },
  h("circle", { cy: ofs - 8, r: 20, fill: "#ff7a18", className: "heat" }),
  Flame("a", 0, ofs, 1.1, 0), Flame("b", -11, ofs + 3, .7, .25), Flame("c", 11, ofs + 3, .75, .5),
  [-6, 2, 8].map((x, i) => h("circle", { key: "e" + i, cx: x, cy: ofs - 6, r: 1.8, fill: "#ffd23f", className: "ember", style: { animationDelay: i * .45 + "s" } })))

// deflect effect: ripples + arrows bouncing away from the blocked node
const deflect = () =>
 h("g", { style: { pointerEvents: "none" } },
  [0, .8].map(d => h("circle", { key: d, r: 20, fill: "none", stroke: "#ff4b2b", strokeWidth: 3, className: "ripple", style: { animationDelay: d + "s" } })),
  [45, 135, 225, 315].map(a =>
   h("g", { key: a, transform: `rotate(${a}) translate(26,0)` },
    h("path", { d: "M0,0H9M5,-4L9,0L5,4", stroke: "#ff4b2b", strokeWidth: 2.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round", className: "bounce" }))))

// icon per node type (door / crossroad / exit)
const ico = type => {
 const p = { fill: "none", stroke: "#1c1c1c", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }
 const d = type === "room" ? "M-5,7V-7H5V7ZM2,1H3"
  : type === "junction" ? "M-7,0H7M0,-7V7M-7,0L-4,-3M-7,0L-4,3M7,0L4,-3M7,0L4,3"
  : "M-8,0H1M-2,-4L2,0L-2,4M4,-7H8V7H4"
 return h("path", { ...p, d, transform: "translate(0,-6)" })
}
const topOf = type => type === "room" ? -17 : type === "junction" ? -18 : -22

export default function App(){
 const [lang,setLang]=useState("en"),[D,setD]=useState(SAMPLE),[s,setS]=useState(init(SAMPLE)),[mode,setMode]=useState("s"),[err,setErr]=useState("");
 const t=T[lang],R=useMemo(()=>solve(D,s),[D,s]);
 const nm=useMemo(()=>{const o={};D.nodes.forEach(n=>o[n.id]=n);return o},[D]);
 const xs=D.nodes.map(n=>n.x),ys=D.nodes.map(n=>n.y),P=50;
 const x0=Math.min(...xs)-P,y0=Math.min(...ys)-P,W=Math.max(...xs)-x0+P,H=Math.max(...ys)-y0+P;
 const rm=typeof window!=="undefined"&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
 const haz=[...s.bn].map(i=>({k:"n"+i,fire:1,x:t.bn+": "+i}))
  .concat([...s.be].map(i=>({k:"e"+i,ic:"🚧",x:t.be+": "+i})),[...s.cx].map(i=>({k:"x"+i,fire:1,x:t.cx+": "+i})));

 const edges=D.edges.map(g=>{const a=nm[g.from],b=nm[g.to],bl=s.be.has(g.id),on=R.k==="ok"&&R.eds.has(g.id),dead=s.bn.has(g.from)||s.bn.has(g.to)||s.cx.has(g.from)||s.cx.has(g.to);
  const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
  return h("g",{key:g.id,style:{cursor:mode==="h"?"pointer":"default"},onClick:()=>clickEdge(g)},
   h("line",{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:"transparent",strokeWidth:18}),
   on&&h("line",{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:"#c8f31d",strokeWidth:12,opacity:.35}),
   h("line",{className:"ed"+(on?" flow":""),x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:bl?"#ff4b2b":on?"#c8f31d":"#ececec",strokeWidth:on?6:bl?4:3,strokeDasharray:bl?"4 6":undefined,opacity:dead&&!bl?.3:1}),
   h("rect",{x:mx-12,y:my-9,width:24,height:18,rx:2,fill:bl?"#ff4b2b":"#1c1c1c",stroke:on?"#c8f31d":"#ececec",strokeWidth:2}),
   h("text",{x:mx,y:my+4.5,textAnchor:"middle",fontSize:12,fontWeight:800,fill:"#fff",fontFamily:"IBM Plex Mono"},bl?"✕":g.cost),
   bl&&h("g",{transform:`translate(${mx},${my-8}) `,style:{pointerEvents:"none"}},Flame("f",0,0,.6,0)));});

 const nodes=D.nodes.map(n=>{const c=col(n),bad=s.bn.has(n.id)||s.cx.has(n.id),sel=s.start===n.id;
  const sh=n.type==="room"?h("rect",{x:-17,y:-17,width:34,height:34,rx:6,fill:c,className:"nd"}):n.type==="junction"?h("circle",{r:18,fill:c,className:"nd"}):h("polygon",{points:"0,-22 20,-8 14,16 -14,16 -20,-8",fill:c,className:"nd"});
  return h("g",{key:n.id,transform:`translate(${n.x},${n.y})`,style:{cursor:"pointer"},onClick:()=>clickNode(n)},
   bad&&deflect(),
   sel&&h("circle",{r:26,fill:"none",stroke:"#c8f31d",strokeWidth:4,className:"pulse"}),
   onR(n.id)&&!sel&&h("circle",{r:25,fill:"none",stroke:"#c8f31d",strokeWidth:3,strokeDasharray:"5 4"}),
   h("g",{stroke:"#1c1c1c",strokeWidth:4,className:bad?"shake":undefined},sh),
   bad&&h("text",{y:7,textAnchor:"middle",fontSize:22,fontWeight:800,fill:"#fff"},"✕"),
   !bad&&ico(n.type),
   !bad&&h("text",{y:13,textAnchor:"middle",fontSize:10,fontWeight:800,fill:"#1c1c1c",fontFamily:"IBM Plex Mono"},n.id),
   bad&&fire(topOf(n.type)),
   h("text",{y:38,textAnchor:"middle",fontSize:11,fontWeight:700,fill:"#ececec",stroke:"#1c1c1c",strokeWidth:3,paintOrder:"stroke"},n.label));});

 // runner dot that follows the currently available road
 const runner=R.k==="ok"&&R.path.length>1&&!rm?(()=>{
  const d="M"+R.path.map(id=>nm[id].x+","+nm[id].y).join(" L");
  return h("g",{key:d,style:{pointerEvents:"none"}},
   h("circle",{r:11,fill:"#c8f31d",opacity:.35,className:"pulse"},h("animateMotion",{dur:Math.max(2,(R.path.length-1)*1.1)+"s",repeatCount:"indefinite",path:d})),
   h("circle",{r:6,fill:"#fff",stroke:"#c8f31d",strokeWidth:3},h("animateMotion",{dur:Math.max(2,(R.path.length-1)*1.1)+"s",repeatCount:"indefinite",path:d})))})():null;

 const res=R.k==="idle"?h("div",{className:"res idle"},I("🧭"),t.none):
  R.k==="nr"?h("div",{className:"res bad"},h("div",{className:"big"},I("⛔","shake2"),""+t.nr)):
  R.k==="sb"?h("div",{className:"res bad"},h("div",{className:"big"},I("⚠️","shake2"),""+t.sb)):
  h("div",{className:"res ok"},h("div",{className:"big"},I("🏃","run"),t.cost+": "+R.cost),
   h("div",null,I("🚪"),t.exit+": "+label(nm[R.exit])),h("div",null,I("🛣️"),t.path+":"),
   h("div",{className:"chips"},R.path.flatMap((id,i)=>[i>0&&h("span",{key:"a"+i},"→"),h("span",{className:"chip",key:id,style:{animationDelay:i*60+"ms"}},id)])));

 return h("div",null,
  h("div",{className:"mq"},h("span",null,t.mq.repeat(3))),h("div",{className:"key"}),
  h("div",{className:"wrap"},
   h("header",null,h("div",null,h("h1",null,t.title),h("div",{className:"sub"},t.sub+" · "+D.building)),
    h("div",{className:"row"},h("button",{className:"warn",onClick:()=>setLang(lang==="en"?"bn":"en")},I("🌐"),""+t.lang))),
   h("div",{className:"grid"},
    h("div",{className:"card"},h("div",{className:"vt"},"ESC.3"),h("h2",null,h("span",null,I("🗺️"),""+t.map)),
     h("div",{className:"row",style:{marginBottom:10}},
      h("button",{className:mode==="s"?"on":"",onClick:()=>setMode("s")},I("📍"),""+t.ms),
      h("button",{className:mode==="h"?"on":"",onClick:()=>setMode("h")},I("🔥","flick"),""+t.mh),
      h("button",{className:"alt",onClick:()=>{setS(init(D));setErr("")}},I("↺"),""+t.reset),
      h("label",{className:"btn"},I("📂"),""+t.imp,h("input",{type:"file",accept:".json,application/json",onChange:file,hidden:true})),
      h("button",{className:"warn",onClick:()=>load(SAMPLE)},I("🏢"),t.sample)),
     h("svg",{className:"map",viewBox:`${x0} ${y0} ${W} ${H}`,role:"img","aria-label":t.map},edges,nodes,runner),
     h("p",{style:{fontSize:13,fontWeight:700,margin:"10px 0 0"}},t.inst),
     err&&h("div",{className:"err"},"⚠ "+err)),
    h("div",{className:"stack"},
     h("div",{className:"card"},h("h2",null,h("span",null,I("🧭"),""+t.res)),
      s.start&&h("div",{style:{marginBottom:8,fontWeight:700}},I("📍"),t.start+": "+label(nm[s.start])),res),
     h("div",{className:"card"},h("h2",null,h("span",null,I("🔥","flick"),""+t.hz)),
      haz.length?h("div",{className:"chips"},haz.map(x=>h("span",{className:"chip hz",key:x.k,style:{color:"#ff8a70"}},x.fire?I("🔥","flick"):I(x.ic),x.x))):h("div",null,"—")),
     h("div",{className:"card"},h("h2",null,h("span",null,I("🔖"),""+t.leg)),
      h("div",{className:"leg"},
       [["#f0f0f0",t.room],["#9a9a9a",t.junction],["#c8f31d",t.exitT],["#ff4b2b",t.bn+" / "+t.cx],["#c8f31d",t.rt],["#1c1c1c",t.cost]].map(([c,l])=>h("div",{key:l},h("i",{style:{background:c}}),l)))))))); }