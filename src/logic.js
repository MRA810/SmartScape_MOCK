// Validation + routing (Dijkstra with lexicographic tie-breaking)
export function validate(d){
 const e=m=>{throw m};
 if(!d||typeof d!=="object")e("not an object");
 if(typeof d.building!=="string"||!d.building.trim())e("building name");
 const N=d.nodes,E=d.edges,S=d.initial_state;
 if(!Array.isArray(N)||N.length<2||N.length>60)e("nodes must be 2-60");
 if(!Array.isArray(E)||E.length<1||E.length>150)e("edges must be 1-150");
 const nm={};
 for(const n of N){if(!n||typeof n.id!=="string"||!n.id||nm[n.id])e("bad/duplicate node id "+(n&&n.id));
  if(typeof n.label!=="string"||!n.label.trim())e("label of "+n.id);
  if(!["room","junction","exit"].includes(n.type))e("type of "+n.id);
  if(!Number.isFinite(n.x)||!Number.isFinite(n.y))e("coords of "+n.id);nm[n.id]=n}
 if(!N.some(n=>n.type==="exit"))e("no exit");if(!N.some(n=>n.type!=="exit"))e("no room/junction");
 const ei={},pr={};
 for(const g of E){if(!g||typeof g.id!=="string"||!g.id||ei[g.id])e("bad/duplicate edge id "+(g&&g.id));ei[g.id]=g;
  if(!nm[g.from]||!nm[g.to])e("edge "+g.id+" unknown node");if(g.from===g.to)e("self-loop "+g.id);
  if(!Number.isInteger(g.cost)||g.cost<=0)e("cost of "+g.id);
  const k=[g.from,g.to].sort().join("|");if(pr[k])e("repeated pair "+k);pr[k]=1}
 if(!S||!Array.isArray(S.blocked_nodes)||!Array.isArray(S.blocked_edges)||!Array.isArray(S.closed_exits))e("initial_state");
 S.blocked_nodes.forEach(i=>{if(!nm[i]||nm[i].type==="exit")e("blocked node "+i)});
 S.blocked_edges.forEach(i=>{if(!ei[i])e("blocked edge "+i)});
 S.closed_exits.forEach(i=>{if(!nm[i]||nm[i].type!=="exit")e("closed exit "+i)});
}
export function dijk(adj,src){const dist={[src]:0},done={};
 for(;;){let u=null;for(const k in dist)if(!done[k]&&(u===null||dist[k]<dist[u]))u=k;if(u===null)return dist;done[u]=1;
  for(const{to,w}of adj[u]||[]){const nd=dist[u]+w;if(dist[to]===undefined||nd<dist[to])dist[to]=nd}}}
export function solve(D,s){
 if(!s.start)return{k:"idle"};
 if(s.bn.has(s.start))return{k:"sb"};
 const nm={};D.nodes.forEach(n=>nm[n.id]=n);
 const ok=id=>!s.bn.has(id)&&!s.cx.has(id),adj={};
 D.nodes.forEach(n=>ok(n.id)&&(adj[n.id]=[]));
 D.edges.forEach(g=>{if(!s.be.has(g.id)&&ok(g.from)&&ok(g.to)){adj[g.from].push({to:g.to,w:g.cost,id:g.id});adj[g.to].push({to:g.from,w:g.cost,id:g.id})}});
 const d=dijk(adj,s.start);let best=null;
 D.nodes.filter(n=>n.type==="exit"&&ok(n.id)&&d[n.id]!==undefined).forEach(n=>{if(best===null||d[n.id]<d[best]||(d[n.id]===d[best]&&n.id<best))best=n.id});
 if(best===null)return{k:"nr"};
 const r=dijk(adj,best),path=[s.start],eds=[];let u=s.start;
 while(u!==best){const c=adj[u].filter(a=>r[a.to]!==undefined&&r[a.to]+a.w===r[u]).sort((a,b)=>a.to<b.to?-1:1)[0];path.push(c.to);eds.push(c.id);u=c.to}
 return{k:"ok",path,eds:new Set(eds),exit:best,cost:d[best]};
}
export const init=D=>({start:null,bn:new Set(D.initial_state.blocked_nodes),be:new Set(D.initial_state.blocked_edges),cx:new Set(D.initial_state.closed_exits)});
export const tog=(S,v)=>{const n=new Set(S);n.has(v)?n.delete(v):n.add(v);return n};
