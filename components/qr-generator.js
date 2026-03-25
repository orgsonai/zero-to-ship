import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── QR Encoder (compact) ───
const EC_LEVELS={L:0,M:1,Q:2,H:3};const GF_EXP=new Array(512);const GF_LOG=new Array(256);
(function(){let x=1;for(let i=0;i<255;i++){GF_EXP[i]=x;GF_LOG[x]=i;x=x*2;if(x>=256)x^=0x11d;}for(let i=255;i<512;i++)GF_EXP[i]=GF_EXP[i-255];})();
function gfMul(a,b){if(a===0||b===0)return 0;return GF_EXP[GF_LOG[a]+GF_LOG[b]];}
function polyMul(p,q){const r=new Array(p.length+q.length-1).fill(0);for(let i=0;i<p.length;i++)for(let j=0;j<q.length;j++)r[i+j]^=gfMul(p[i],q[j]);return r;}
function polyRem(d,v){const o=[...d];for(let i=0;i<d.length-v.length+1;i++){if(o[i]===0)continue;const c=o[i];for(let j=1;j<v.length;j++)o[i+j]^=gfMul(v[j],c);}return o.slice(d.length-v.length+1);}
function genPoly(n){let g=[1];for(let i=0;i<n;i++)g=polyMul(g,[1,GF_EXP[i]]);return g;}
const CAP=[null,[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]];
const ECT=[[[19,7,1,19,0,0],[16,10,1,16,0,0],[13,13,1,13,0,0],[9,17,1,9,0,0]],[[34,10,1,34,0,0],[28,16,1,28,0,0],[22,22,1,22,0,0],[16,28,1,16,0,0]],[[55,15,1,55,0,0],[44,26,1,44,0,0],[34,18,2,17,0,0],[26,22,2,13,0,0]],[[80,20,1,80,0,0],[64,18,2,32,0,0],[48,26,2,24,0,0],[36,16,4,9,0,0]],[[108,26,1,108,0,0],[86,24,2,43,0,0],[62,18,2,15,2,16],[46,22,2,11,2,12]],[[136,18,2,68,0,0],[108,16,4,27,0,0],[76,24,4,19,0,0],[60,28,4,15,0,0]],[[156,20,2,78,0,0],[124,18,4,31,0,0],[88,18,2,14,4,15],[66,26,4,13,1,14]],[[194,24,2,97,0,0],[154,22,2,38,2,39],[110,22,4,18,2,19],[86,26,4,14,2,15]],[[232,30,2,116,0,0],[182,22,3,36,2,37],[132,20,4,16,4,17],[100,24,4,12,4,13]],[[274,18,2,68,2,69],[216,26,4,43,1,44],[154,24,6,19,2,20],[122,28,6,15,2,16]],[[324,20,4,81,0,0],[254,30,1,50,4,51],[180,28,4,22,4,23],[140,24,3,12,8,13]],[[370,24,2,92,2,93],[290,22,6,36,2,37],[206,26,4,20,6,21],[158,28,7,14,4,15]],[[428,26,4,107,0,0],[334,22,8,37,1,38],[244,24,8,20,4,21],[180,22,12,11,4,12]],[[461,30,3,115,1,116],[365,24,4,40,5,41],[261,20,11,16,5,17],[197,24,11,12,5,13]],[[523,22,5,87,1,88],[415,24,5,41,5,42],[295,30,5,24,7,25],[223,24,11,12,7,13]],[[589,24,5,98,1,99],[453,28,7,45,3,46],[325,24,15,19,2,20],[253,30,3,15,13,16]],[[647,28,1,107,5,108],[507,28,10,46,1,47],[367,28,1,22,15,23],[283,28,2,14,17,15]],[[721,30,5,120,1,121],[563,26,9,43,4,44],[397,28,17,22,1,23],[313,28,2,14,19,15]],[[795,28,3,113,4,114],[627,26,3,44,11,45],[445,26,17,21,4,22],[341,26,9,13,16,14]],[[861,28,3,107,5,108],[669,26,3,41,13,42],[485,28,15,24,5,25],[385,28,15,15,10,16]],[[932,28,4,116,4,117],[714,26,17,42,0,0],[512,30,17,22,6,23],[406,28,19,16,6,17]],[[1006,28,2,111,7,112],[782,28,17,46,0,0],[568,24,7,24,16,25],[442,30,34,13,0,0]],[[1094,30,4,121,5,122],[860,28,4,47,14,48],[614,30,11,24,14,25],[464,30,16,15,14,16]],[[1174,30,6,117,4,118],[914,28,6,45,14,46],[664,30,11,24,16,25],[514,30,30,16,2,17]],[[1276,26,8,106,4,107],[1000,28,8,47,13,48],[718,30,7,24,22,25],[538,30,22,15,13,16]],[[1370,28,10,114,2,115],[1062,28,19,46,4,47],[754,28,28,22,6,23],[596,30,33,16,4,17]],[[1468,30,8,122,4,123],[1128,28,22,45,3,46],[808,30,8,23,26,24],[628,30,12,15,28,16]],[[1531,30,3,117,10,118],[1193,28,3,45,23,46],[871,30,4,24,31,25],[661,30,11,15,31,16]],[[1631,30,7,116,7,117],[1267,28,21,45,7,46],[911,30,1,23,37,24],[701,30,19,15,26,16]],[[1735,30,5,115,10,116],[1373,28,19,47,10,48],[985,30,15,24,25,25],[745,30,23,15,25,16]],[[1843,30,13,115,3,116],[1455,28,2,46,29,47],[1033,30,42,24,1,25],[793,30,23,15,28,16]],[[1955,30,17,115,0,0],[1541,28,10,46,23,47],[1115,30,10,24,35,25],[845,30,19,15,35,16]],[[2071,30,17,115,1,116],[1631,28,14,46,21,47],[1171,30,29,24,19,25],[901,30,11,15,46,16]],[[2191,30,13,115,6,116],[1725,28,14,46,23,47],[1231,30,44,24,7,25],[961,30,59,16,1,17]],[[2306,30,12,121,7,122],[1812,28,12,47,26,48],[1286,30,39,24,14,25],[986,30,22,15,41,16]],[[2434,30,6,121,14,122],[1914,28,6,47,34,48],[1354,30,46,24,10,25],[1054,30,2,15,64,16]],[[2566,30,17,122,4,123],[1992,28,29,46,14,47],[1426,30,49,24,10,25],[1096,30,24,15,46,16]],[[2702,30,4,122,18,123],[2102,28,13,46,32,47],[1502,30,48,24,14,25],[1142,30,42,15,32,16]],[[2812,30,20,117,4,118],[2216,28,40,47,7,48],[1582,30,43,24,22,25],[1222,30,10,15,67,16]],[[2956,30,19,118,6,119],[2334,28,18,47,31,48],[1666,30,34,24,34,25],[1276,30,20,15,61,16]]];
function getVer(len,ec){const i=EC_LEVELS[ec];for(let v=1;v<=40;v++)if(CAP[v][i]>=len)return v;return 40;}
function getAlign(v){if(v===1)return[];const p=[null,[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]];return p[v]||[];}
function encData(text,ec){const bytes=new TextEncoder().encode(text);const v=getVer(bytes.length,ec);const ei=EC_LEVELS[ec],info=ECT[v-1][ei],tdc=info[0],ecc=info[1];const cc=v<=9?8:16;let b="0100";b+=bytes.length.toString(2).padStart(cc,"0");for(const x of bytes)b+=x.toString(2).padStart(8,"0");const tb=tdc*8;b+="0".repeat(Math.min(4,tb-b.length));while(b.length%8!==0)b+="0";const pb=[0xec,0x11];let pi=0;while(b.length<tb){b+=pb[pi%2].toString(2).padStart(8,"0");pi++;}const dw=[];for(let i=0;i<b.length;i+=8)dw.push(parseInt(b.substring(i,i+8),2));const bl=[],eb=[];let of2=0;const gp=genPoly(ecc);for(let i=0;i<info[2];i++){const bk=dw.slice(of2,of2+info[3]);of2+=info[3];bl.push(bk);eb.push(polyRem([...bk,...new Array(ecc).fill(0)],gp));}for(let i=0;i<info[4];i++){const bk=dw.slice(of2,of2+info[5]);of2+=info[5];bl.push(bk);eb.push(polyRem([...bk,...new Array(ecc).fill(0)],gp));}const ml=Math.max(info[3],info[5]||0),il=[];for(let i=0;i<ml;i++)for(const bk of bl)if(i<bk.length)il.push(bk[i]);for(let i=0;i<ecc;i++)for(const e of eb)if(i<e.length)il.push(e[i]);return{version:v,data:il};}
function mkMatrix(v){const s=v*4+17;return{matrix:Array.from({length:s},()=>new Array(s).fill(null)),reserved:Array.from({length:s},()=>new Array(s).fill(false)),size:s};}
function placeFinder(m,r2,row,col){for(let r=-1;r<=7;r++)for(let c=-1;c<=7;c++){const rr=row+r,cc=col+c;if(rr<0||rr>=m.length||cc<0||cc>=m.length)continue;if(r===-1||r===7||c===-1||c===7)m[rr][cc]=0;else if((r===0||r===6)&&c>=0&&c<=6)m[rr][cc]=1;else if((c===0||c===6)&&r>=0&&r<=6)m[rr][cc]=1;else if(r>=2&&r<=4&&c>=2&&c<=4)m[rr][cc]=1;else m[rr][cc]=0;r2[rr][cc]=true;}}
function placeAlign(m,r2,row,col){for(let r=-2;r<=2;r++)for(let c=-2;c<=2;c++){if(r2[row+r]?.[col+c])return;}for(let r=-2;r<=2;r++)for(let c=-2;c<=2;c++){const rr=row+r,cc=col+c;m[rr][cc]=(Math.abs(r)===2||Math.abs(c)===2||(r===0&&c===0))?1:0;r2[rr][cc]=true;}}
function placeTiming(m,r2,s){for(let i=8;i<s-8;i++){if(!r2[6][i]){m[6][i]=i%2===0?1:0;r2[6][i]=true;}if(!r2[i][6]){m[i][6]=i%2===0?1:0;r2[i][6]=true;}}}
const FMT_INFO=[0x77c4,0x72f3,0x7daa,0x789d,0x662f,0x6318,0x6c41,0x6976,0x5412,0x5125,0x5e7c,0x5b4b,0x45f9,0x40ce,0x4f97,0x4aa0,0x355f,0x3068,0x3f31,0x3a06,0x24b4,0x2183,0x2eda,0x2bed,0x1689,0x13be,0x1ce7,0x19d0,0x0762,0x0255,0x0d0c,0x083b];
const VER_INFO=[null,null,null,null,null,null,null,0x07c94,0x085bc,0x09a99,0x0a4d3,0x0bbf6,0x0c762,0x0d847,0x0e60d,0x0f928,0x10b78,0x1145d,0x12a17,0x13532,0x149a6,0x15683,0x168c9,0x177ec,0x18ec4,0x191e1,0x1afab,0x1b08e,0x1cc1a,0x1d33f,0x1ed75,0x1f250,0x209d5,0x216f0,0x228ba,0x2379f,0x24b0b,0x2542e,0x26a64,0x27541];
function placeFmtInfo(m,r2,s,ec,mp){const b=FMT_INFO[EC_LEVELS[ec]*8+mp];const hp=[0,1,2,3,4,5,7,8,s-8,s-7,s-6,s-5,s-4,s-3,s-2,s-1];for(let i=0;i<15;i++){m[8][hp[i]]=(b>>(14-i))&1;r2[8][hp[i]]=true;}const vp=[s-1,s-2,s-3,s-4,s-5,s-6,s-7,s-8,7,5,4,3,2,1,0];for(let i=0;i<15;i++){m[vp[i]][8]=(b>>(14-i))&1;r2[vp[i]][8]=true;}m[s-8][8]=1;r2[s-8][8]=true;}
function placeVerInfo(m,r2,s,v){if(v<7)return;const i2=VER_INFO[v];for(let i=0;i<18;i++){const b=(i2>>i)&1,r=Math.floor(i/3),c=s-11+(i%3);m[r][c]=b;r2[r][c]=true;m[c][r]=b;r2[c][r]=true;}}
const MF=[(r,c)=>(r+c)%2===0,(r,c)=>r%2===0,(r,c)=>c%3===0,(r,c)=>(r+c)%3===0,(r,c)=>(Math.floor(r/2)+Math.floor(c/3))%2===0,(r,c)=>(r*c)%2+(r*c)%3===0,(r,c)=>((r*c)%2+(r*c)%3)%2===0,(r,c)=>((r+c)%2+(r*c)%3)%2===0];
function placeData(m,r2,s,d){let bi=0;const bits=[];for(const x of d)for(let b=7;b>=0;b--)bits.push((x>>b)&1);let col=s-1,up=true;while(col>=0){if(col===6)col--;const rows=up?Array.from({length:s},(_,i)=>s-1-i):Array.from({length:s},(_,i)=>i);for(const row of rows)for(let c=0;c<=1;c++){const cc=col-c;if(cc<0||r2[row][cc])continue;m[row][cc]=bi<bits.length?bits[bi]:0;bi++;}col-=2;up=!up;}}
function applyMask(m,r2,s,mi){const fn=MF[mi];const o=m.map(r=>[...r]);for(let r=0;r<s;r++)for(let c=0;c<s;c++)if(!r2[r][c]&&fn(r,c))o[r][c]^=1;return o;}
function scoreMask(m,s){let p=0;for(let r=0;r<s;r++){let n=1;for(let c=1;c<s;c++){if(m[r][c]===m[r][c-1])n++;else{if(n>=5)p+=n-2;n=1;}}if(n>=5)p+=n-2;}for(let c=0;c<s;c++){let n=1;for(let r=1;r<s;r++){if(m[r][c]===m[r-1][c])n++;else{if(n>=5)p+=n-2;n=1;}}if(n>=5)p+=n-2;}for(let r=0;r<s-1;r++)for(let c=0;c<s-1;c++){const v=m[r][c];if(v===m[r][c+1]&&v===m[r+1][c]&&v===m[r+1][c+1])p+=3;}return p;}
function generateQR(text,ec="M"){if(!text)return null;try{const{version:v,data:d}=encData(text,ec);const{matrix:m,reserved:r2,size:s}=mkMatrix(v);placeFinder(m,r2,0,0);placeFinder(m,r2,0,s-7);placeFinder(m,r2,s-7,0);placeTiming(m,r2,s);const ap=getAlign(v);for(const r of ap)for(const c of ap){if(r2[r]?.[c])continue;placeAlign(m,r2,r,c);}for(let i=0;i<8;i++){r2[8][i]=true;r2[8][s-1-i]=true;r2[i][8]=true;r2[s-1-i][8]=true;}r2[8][8]=true;placeVerInfo(m,r2,s,v);placeData(m,r2,s,d);let bm=0,bs=Infinity;for(let x=0;x<8;x++){const mk=applyMask(m,r2,s,x);const t2=mk.map(r=>[...r]);const fb=FMT_INFO[EC_LEVELS[ec]*8+x];const hp=[0,1,2,3,4,5,7,8,s-8,s-7,s-6,s-5,s-4,s-3,s-2,s-1];for(let i=0;i<15;i++)t2[8][hp[i]]=(fb>>(14-i))&1;const vp=[s-1,s-2,s-3,s-4,s-5,s-6,s-7,s-8,7,5,4,3,2,1,0];for(let i=0;i<15;i++)t2[vp[i]][8]=(fb>>(14-i))&1;const sc=scoreMask(t2,s);if(sc<bs){bs=sc;bm=x;}}const fm=applyMask(m,r2,s,bm);placeFmtInfo(fm,r2,s,ec,bm);placeVerInfo(fm,r2,s,v);return{matrix:fm,size:s,version:v};}catch(e){console.error("QR err:",e);return null;}}

// ─── Themes ───
const themes={dark:{bg:"#0a0a0b",card:"rgba(255,255,255,0.03)",cb:"rgba(255,255,255,0.06)",text:"#e4e4e7",ts:"#a1a1aa",tm:"#71717a",td:"#52525b",tg:"#3f3f46",tdd:"#27272a",ac:"#22c55e",ab:"rgba(34,197,94,0.1)",acb:"rgba(34,197,94,0.3)",ag:"rgba(34,197,94,0.25)",acd:"#16a34a",warn:"#f59e0b",info:"#3b82f6",danger:"#ef4444",ib:"rgba(255,255,255,0.03)",ibr:"rgba(255,255,255,0.08)",gc:"rgba(34,197,94,0.02)",advb:"rgba(255,255,255,0.015)",advbr:"rgba(255,255,255,0.04)",ov:"rgba(0,0,0,0.4)",ph:"#3f3f46"},light:{bg:"#f8fafb",card:"rgba(0,0,0,0.02)",cb:"rgba(0,0,0,0.07)",text:"#18181b",ts:"#52525b",tm:"#71717a",td:"#a1a1aa",tg:"#d4d4d8",tdd:"#e4e4e7",ac:"#16a34a",ab:"rgba(22,163,74,0.08)",acb:"rgba(22,163,74,0.25)",ag:"rgba(22,163,74,0.15)",acd:"#15803d",warn:"#d97706",info:"#2563eb",danger:"#dc2626",ib:"#ffffff",ibr:"rgba(0,0,0,0.1)",gc:"rgba(22,163,74,0.03)",advb:"rgba(0,0,0,0.01)",advbr:"rgba(0,0,0,0.04)",ov:"rgba(255,255,255,0.6)",ph:"#d4d4d8"}};
const INPUT_TYPES=[{id:"url",label:"URL",icon:"🔗",placeholder:"https://example.com"},{id:"text",label:"テキスト",icon:"📝",placeholder:"自由にテキストを入力..."},{id:"wifi",label:"Wi-Fi",icon:"📶"},{id:"vcard",label:"連絡先",icon:"👤"},{id:"email",label:"メール",icon:"✉️"},{id:"phone",label:"電話",icon:"📞",placeholder:"090-1234-5678"},{id:"sns",label:"SNS",icon:"🌐"},{id:"geo",label:"地図",icon:"📍"}];
const DOT_STYLES=[{id:"square",label:"■ 四角"},{id:"rounded",label:"▢ 角丸"},{id:"circle",label:"● 丸"},{id:"diamond",label:"◆ ダイヤ"},{id:"star",label:"★ 星"},{id:"heart",label:"♥ ハート"},{id:"connected",label:"⊞ コネクト"}];
const CORNER_STYLES=[{id:"square",label:"■ 四角"},{id:"rounded",label:"▢ 角丸"},{id:"circle",label:"● 丸"},{id:"leaf",label:"🍃 リーフ"},{id:"diamond",label:"◆ ダイヤ"}];
const COLOR_PRESETS=[{id:"classic",label:"クラシック",fg:"#000000",bg:"#ffffff",gradient:null},{id:"midnight",label:"ミッドナイト",fg:"#1e293b",bg:"#f1f5f9",gradient:null},{id:"ocean",label:"オーシャン",fg:"#0369a1",bg:"#f0f9ff",gradient:["#0369a1","#06b6d4"]},{id:"sunset",label:"サンセット",fg:"#dc2626",bg:"#fff7ed",gradient:["#dc2626","#f97316"]},{id:"forest",label:"フォレスト",fg:"#15803d",bg:"#f0fdf4",gradient:["#15803d","#22c55e"]},{id:"neon",label:"ネオン",fg:"#a855f7",bg:"#0f0f23",gradient:["#a855f7","#ec4899"]},{id:"sakura",label:"桜",fg:"#be185d",bg:"#fdf2f8",gradient:["#be185d","#f472b6"]},{id:"cyber",label:"サイバー",fg:"#06b6d4",bg:"#0a0a0b",gradient:["#06b6d4","#22c55e"]},{id:"gold",label:"ゴールド",fg:"#92400e",bg:"#fffbeb",gradient:["#92400e","#d97706"]},{id:"monochrome",label:"モノクロ",fg:"#374151",bg:"#f9fafb",gradient:null},{id:"lavender",label:"ラベンダー",fg:"#7c3aed",bg:"#f5f3ff",gradient:["#7c3aed","#8b5cf6"]},{id:"fire",label:"ファイア",fg:"#b91c1c",bg:"#1c1917",gradient:["#b91c1c","#ea580c"]}];
const GRAD_MODES=[{id:"linear",label:"↗ 線形"},{id:"radial",label:"◎ 放射"},{id:"none",label:"なし"}];
const GRAD_ANGLES=[{v:45,label:"↗"},{v:90,label:"→"},{v:135,label:"↘"},{v:180,label:"↓"},{v:225,label:"↙"},{v:270,label:"←"},{v:315,label:"↖"},{v:0,label:"↑"}];
const FRAME_STYLES=[{id:"none",label:"なし",text:""},{id:"scan_me",label:"Scan Me",text:"Scan Me"},{id:"scan_me_jp",label:"スキャンしてね",text:"スキャンしてね"},{id:"follow_me",label:"Follow Me",text:"Follow Me"},{id:"free_wifi",label:"Free Wi-Fi",text:"📶 Free Wi-Fi"},{id:"menu",label:"メニュー",text:"📖 メニューはこちら"},{id:"website",label:"Webサイトへ",text:"🌐 Webサイトへ"},{id:"payment",label:"お支払い",text:"💳 お支払いはこちら"},{id:"reservation",label:"ご予約",text:"📅 ご予約はこちら"},{id:"review",label:"レビュー",text:"⭐ レビューお願いします"},{id:"download",label:"アプリDL",text:"📲 アプリをダウンロード"},{id:"event",label:"イベント",text:"🎪 イベント情報"},{id:"coupon",label:"クーポン",text:"🎫 クーポンをGET"},{id:"custom",label:"カスタム",text:""}];
const SCENE_PRESETS=[{id:"none",label:"なし",desc:"自由にカスタマイズ",settings:null},{id:"instagram",label:"Instagram",desc:"公式グラデ",icon:"📸",settings:{colorPreset:"custom",customFg:"#c13584",customBg:"#ffffff",customGrad1:"#f58529",customGrad2:"#dd2a7b",frameStyle:"follow_me",dotStyle:"rounded",cornerStyle:"rounded"}},{id:"x_twitter",label:"X",desc:"ダークモード",icon:"𝕏",settings:{colorPreset:"custom",customFg:"#ffffff",customBg:"#000000",customGrad1:"",customGrad2:"",frameStyle:"follow_me",dotStyle:"square",cornerStyle:"square"}},{id:"line",label:"LINE",desc:"公式グリーン",icon:"💬",settings:{colorPreset:"custom",customFg:"#06c755",customBg:"#ffffff",customGrad1:"",customGrad2:"",frameStyle:"follow_me",dotStyle:"rounded",cornerStyle:"rounded"}},{id:"youtube",label:"YouTube",desc:"公式レッド",icon:"▶️",settings:{colorPreset:"custom",customFg:"#ff0000",customBg:"#ffffff",customGrad1:"#ff0000",customGrad2:"#cc0000",frameStyle:"follow_me",dotStyle:"rounded",cornerStyle:"rounded"}},{id:"cafe",label:"カフェ",desc:"温かみブラウン",icon:"☕",settings:{colorPreset:"custom",customFg:"#78350f",customBg:"#fffbeb",customGrad1:"#92400e",customGrad2:"#b45309",frameStyle:"menu",dotStyle:"rounded",cornerStyle:"leaf"}},{id:"restaurant",label:"レストラン",desc:"エレガント黒金",icon:"🍽️",settings:{colorPreset:"custom",customFg:"#1c1917",customBg:"#fffbeb",customGrad1:"#78350f",customGrad2:"#1c1917",frameStyle:"menu",dotStyle:"square",cornerStyle:"square"}},{id:"salon",label:"サロン",desc:"上品ローズ",icon:"💇",settings:{colorPreset:"custom",customFg:"#9f1239",customBg:"#fff1f2",customGrad1:"#9f1239",customGrad2:"#be185d",frameStyle:"reservation",dotStyle:"circle",cornerStyle:"rounded"}},{id:"tech_event",label:"テック",desc:"サイバー感",icon:"💻",settings:{colorPreset:"cyber",frameStyle:"event",dotStyle:"square",cornerStyle:"square"}},{id:"wedding",label:"ウェディング",desc:"ゴールド",icon:"💒",settings:{colorPreset:"custom",customFg:"#92400e",customBg:"#fffbeb",customGrad1:"#b45309",customGrad2:"#d97706",frameStyle:"custom",dotStyle:"heart",cornerStyle:"rounded"}},{id:"shop",label:"ショップ",desc:"クリーンブルー",icon:"🛍️",settings:{colorPreset:"custom",customFg:"#1e40af",customBg:"#eff6ff",customGrad1:"#1e40af",customGrad2:"#3b82f6",frameStyle:"website",dotStyle:"rounded",cornerStyle:"rounded"}},{id:"music",label:"音楽",desc:"ネオン",icon:"🎵",settings:{colorPreset:"neon",frameStyle:"event",dotStyle:"circle",cornerStyle:"circle"}}];
const EC_OPTIONS=[{id:"L",label:"L (7%)",desc:"低"},{id:"M",label:"M (15%)",desc:"標準"},{id:"Q",label:"Q (25%)",desc:"ロゴ向き"},{id:"H",label:"H (30%)",desc:"最高"}];
const SNS_PLATFORMS=[{id:"x",label:"X",prefix:"https://x.com/"},{id:"instagram",label:"Instagram",prefix:"https://instagram.com/"},{id:"youtube",label:"YouTube",prefix:"https://youtube.com/@"},{id:"tiktok",label:"TikTok",prefix:"https://tiktok.com/@"},{id:"github",label:"GitHub",prefix:"https://github.com/"},{id:"line",label:"LINE",prefix:"https://line.me/R/ti/p/"},{id:"custom",label:"その他",prefix:""}];
const sGet=async k=>{try{if(window.storage){const r=await window.storage.get(k);if(r?.value)return r.value;}}catch{}try{return localStorage.getItem(k);}catch{}return null;};
const sSet=async(k,v)=>{try{if(window.storage)await window.storage.set(k,v);}catch{}try{localStorage.setItem(k,v);}catch{}};

// ─── Canvas Renderer (v3: connected dots, gradient modes, bg image) ───
function drawQRToCanvas(canvas,qrData,options){
  if(!canvas||!qrData)return;const ctx=canvas.getContext("2d");const{matrix,size:qs}=qrData;
  const{dotStyle="square",cornerStyle="square",fgColor="#000",bgColor="#fff",gradient=null,gradientMode="linear",gradAngle=135,logoImg=null,bgImg=null,bgOpacity=0.3,frameStyle="none",frameText="",canvasSize=1024,quietZone=4}=options;
  const fH=frameStyle!=="none"?Math.round(canvasSize*0.06):0;
  const ms=(canvasSize-fH)/(qs+quietZone*2);
  canvas.width=canvasSize;canvas.height=canvasSize;

  // Background
  ctx.fillStyle=bgColor;ctx.fillRect(0,0,canvasSize,canvasSize);
  if(bgImg){ctx.globalAlpha=bgOpacity;ctx.drawImage(bgImg,0,0,canvasSize,canvasSize-fH);ctx.globalAlpha=1.0;}

  // Frame
  if(frameStyle!=="none"){const fd=FRAME_STYLES.find(f=>f.id===frameStyle);ctx.fillStyle=bgColor;ctx.fillRect(0,canvasSize-fH,canvasSize,fH);ctx.fillStyle=fgColor;ctx.font=`bold ${Math.round(fH*0.42)}px 'Noto Sans JP',sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(frameStyle==="custom"?(frameText||"Scan Me"):(fd?.text||"Scan Me"),canvasSize/2,canvasSize-fH/2);}

  // Fill style
  let fill=fgColor;
  if(gradient?.length===2&&gradientMode!=="none"){
    if(gradientMode==="radial"){const g=ctx.createRadialGradient(canvasSize/2,(canvasSize-fH)/2,0,canvasSize/2,(canvasSize-fH)/2,canvasSize*0.7);g.addColorStop(0,gradient[0]);g.addColorStop(1,gradient[1]);fill=g;}
    else{const rad=gradAngle*Math.PI/180;const cx=canvasSize/2,cy=(canvasSize-fH)/2,len=canvasSize*0.7;const g=ctx.createLinearGradient(cx-Math.cos(rad)*len,cy-Math.sin(rad)*len,cx+Math.cos(rad)*len,cy+Math.sin(rad)*len);g.addColorStop(0,gradient[0]);g.addColorStop(1,gradient[1]);fill=g;}
  }

  const isFinder=(r,c)=>(r<7&&c<7)||(r<7&&c>=qs-7)||(r>=qs-7&&c<7);
  const isOn=(r,c)=>r>=0&&r<qs&&c>=0&&c<qs&&matrix[r][c]===1;

  // Finder patterns
  const drawCorner=(px,py,w,h,isO)=>{const rad=Math.min(w,h)*0.35;switch(cornerStyle){case"rounded":ctx.beginPath();ctx.roundRect(px,py,w,h,isO?rad:rad*0.6);ctx.fill();break;case"circle":ctx.beginPath();ctx.ellipse(px+w/2,py+h/2,w/2,h/2,0,0,Math.PI*2);ctx.fill();break;case"leaf":{ctx.beginPath();const lr=Math.min(w,h)*0.5;ctx.roundRect(px,py,w,h,[lr,isO?4:2,lr,isO?4:2]);ctx.fill();break;}case"diamond":ctx.beginPath();ctx.moveTo(px+w/2,py);ctx.lineTo(px+w,py+h/2);ctx.lineTo(px+w/2,py+h);ctx.lineTo(px,py+h/2);ctx.closePath();ctx.fill();break;default:ctx.fillRect(px,py,w,h);}};
  [[0,0],[qs-7,0],[0,qs-7]].forEach(([cx,cy])=>{const x=(cx+quietZone)*ms,y=(cy+quietZone)*ms;ctx.fillStyle=fill;drawCorner(x,y,ms*7,ms*7,true);ctx.fillStyle=bgImg?`rgba(${parseInt(bgColor.slice(1,3),16)},${parseInt(bgColor.slice(3,5),16)},${parseInt(bgColor.slice(5,7),16)},0.85)`:bgColor;drawCorner(x+ms,y+ms,ms*5,ms*5,false);ctx.fillStyle=fill;drawCorner(x+ms*2,y+ms*2,ms*3,ms*3,false);});

  // Data dots
  const drawDot=(px,py,s,r,c)=>{
    ctx.fillStyle=fill;const h=s/2,p=s*0.1;
    if(dotStyle==="connected"){
      // Connected dot: draw rounded rect that extends toward neighbors
      const top=!isFinder(r-1,c)&&isOn(r-1,c),bot=!isFinder(r+1,c)&&isOn(r+1,c),lft=!isFinder(r,c-1)&&isOn(r,c-1),rgt=!isFinder(r,c+1)&&isOn(r,c+1);
      const rad=s*0.35;const tl=(!top&&!lft)?rad:0,tr=(!top&&!rgt)?rad:0,br=(!bot&&!rgt)?rad:0,bl=(!bot&&!lft)?rad:0;
      ctx.beginPath();ctx.roundRect(px,py,s,s,[tl,tr,br,bl]);ctx.fill();
      return;
    }
    switch(dotStyle){
      case"rounded":ctx.beginPath();ctx.roundRect(px+p/2,py+p/2,s-p,s-p,s*0.25);ctx.fill();break;
      case"circle":ctx.beginPath();ctx.arc(px+h,py+h,h*0.85,0,Math.PI*2);ctx.fill();break;
      case"diamond":ctx.beginPath();ctx.moveTo(px+h,py+p);ctx.lineTo(px+s-p,py+h);ctx.lineTo(px+h,py+s-p);ctx.lineTo(px+p,py+h);ctx.closePath();ctx.fill();break;
      case"star":{ctx.beginPath();for(let i=0;i<5;i++){const a=(i*72-90)*Math.PI/180;ctx.lineTo(px+h+h*0.9*Math.cos(a),py+h+h*0.9*Math.sin(a));const a2=((i*72+36)-90)*Math.PI/180;ctx.lineTo(px+h+h*0.4*Math.cos(a2),py+h+h*0.4*Math.sin(a2));}ctx.closePath();ctx.fill();break;}
      case"heart":{ctx.beginPath();const hs=h*0.8;ctx.moveTo(px+h,py+h+hs*0.6);ctx.bezierCurveTo(px+h-hs,py+h-hs*0.2,px+h-hs,py+h-hs*0.9,px+h,py+h-hs*0.3);ctx.bezierCurveTo(px+h+hs,py+h-hs*0.9,px+h+hs,py+h-hs*0.2,px+h,py+h+hs*0.6);ctx.fill();break;}
      default:ctx.fillRect(px,py,s,s);
    }
  };

  for(let r=0;r<qs;r++)for(let c=0;c<qs;c++){if(isFinder(r,c))continue;if(matrix[r][c]===1)drawDot((c+quietZone)*ms,(r+quietZone)*ms,ms,r,c);}

  // Logo
  if(logoImg){const ls=canvasSize*0.2,lx=(canvasSize-ls)/2,ly=((canvasSize-fH)-ls)/2,pd=ls*0.12;ctx.fillStyle=bgColor;ctx.beginPath();ctx.roundRect(lx-pd,ly-pd,ls+pd*2,ls+pd*2,12);ctx.fill();ctx.drawImage(logoImg,lx,ly,ls,ls);}
}

// ─── SVG Generator ───
function generateSVG(qrData,options){
  if(!qrData)return"";const{matrix,size:qs}=qrData;
  const{dotStyle="square",cornerStyle="square",fgColor="#000",bgColor="#fff",gradient=null,gradientMode="linear",gradAngle=135,frameStyle="none",frameText="",svgSize=1024,quietZone=4}=options;
  const fH=frameStyle!=="none"?Math.round(svgSize*0.06):0;const ms=(svgSize-fH)/(qs+quietZone*2);
  const isFinder=(r,c)=>(r<7&&c<7)||(r<7&&c>=qs-7)||(r>=qs-7&&c<7);const isOn=(r,c)=>r>=0&&r<qs&&c>=0&&c<qs&&matrix[r][c]===1;
  let defs="",fA=`fill="${fgColor}"`;
  if(gradient?.length===2&&gradientMode!=="none"){
    if(gradientMode==="radial")defs=`<defs><radialGradient id="qg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="${gradient[0]}"/><stop offset="100%" stop-color="${gradient[1]}"/></radialGradient></defs>`;
    else{const rad=gradAngle*Math.PI/180;const x1=50-Math.cos(rad)*50,y1=50-Math.sin(rad)*50,x2=50+Math.cos(rad)*50,y2=50+Math.sin(rad)*50;defs=`<defs><linearGradient id="qg" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%"><stop offset="0%" stop-color="${gradient[0]}"/><stop offset="100%" stop-color="${gradient[1]}"/></linearGradient></defs>`;}
    fA=`fill="url(#qg)"`;
  }
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">\n${defs}\n<rect width="${svgSize}" height="${svgSize}" fill="${bgColor}"/>\n`;
  const cR=(x,y,w,h,o)=>{const r2=Math.min(w,h)*0.35;switch(cornerStyle){case"rounded":return`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o?r2:r2*0.6}" ${fA}/>`;case"circle":return`<ellipse cx="${x+w/2}" cy="${y+h/2}" rx="${w/2}" ry="${h/2}" ${fA}/>`;case"diamond":return`<polygon points="${x+w/2},${y} ${x+w},${y+h/2} ${x+w/2},${y+h} ${x},${y+h/2}" ${fA}/>`;default:return`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${fA}/>`;}};
  [[0,0],[qs-7,0],[0,qs-7]].forEach(([cx,cy])=>{const x=(cx+quietZone)*ms,y=(cy+quietZone)*ms;s+=cR(x,y,ms*7,ms*7,true)+cR(x+ms,y+ms,ms*5,ms*5,true).replace(fA,`fill="${bgColor}"`)+cR(x+ms*2,y+ms*2,ms*3,ms*3,false);});
  for(let r=0;r<qs;r++)for(let c=0;c<qs;c++){if(isFinder(r,c)||matrix[r][c]!==1)continue;const px=(c+quietZone)*ms,py=(r+quietZone)*ms,h=ms/2,p=ms*0.1;
    if(dotStyle==="connected"){const top=!isFinder(r-1,c)&&isOn(r-1,c),bot=!isFinder(r+1,c)&&isOn(r+1,c),lft=!isFinder(r,c-1)&&isOn(r,c-1),rgt=!isFinder(r,c+1)&&isOn(r,c+1);const rad=ms*0.35;const tl=(!top&&!lft)?rad:0,tr=(!top&&!rgt)?rad:0,br=(!bot&&!rgt)?rad:0,bl=(!bot&&!lft)?rad:0;const rx=Math.max(tl,tr,br,bl);s+=`<rect x="${px}" y="${py}" width="${ms}" height="${ms}" rx="${rx}" ${fA}/>\n`;continue;}
    switch(dotStyle){case"rounded":s+=`<rect x="${px+p/2}" y="${py+p/2}" width="${ms-p}" height="${ms-p}" rx="${ms*0.25}" ${fA}/>\n`;break;case"circle":s+=`<circle cx="${px+h}" cy="${py+h}" r="${h*0.85}" ${fA}/>\n`;break;case"diamond":s+=`<polygon points="${px+h},${py+p} ${px+ms-p},${py+h} ${px+h},${py+ms-p} ${px+p},${py+h}" ${fA}/>\n`;break;case"star":{let pts="";for(let i=0;i<5;i++){const a=(i*72-90)*Math.PI/180;pts+=`${px+h+h*0.9*Math.cos(a)},${py+h+h*0.9*Math.sin(a)} `;const a2=((i*72+36)-90)*Math.PI/180;pts+=`${px+h+h*0.4*Math.cos(a2)},${py+h+h*0.4*Math.sin(a2)} `;}s+=`<polygon points="${pts.trim()}" ${fA}/>\n`;break;}case"heart":{const hs=h*0.8;s+=`<path d="M${px+h},${py+h+hs*0.6} C${px+h-hs},${py+h-hs*0.2} ${px+h-hs},${py+h-hs*0.9} ${px+h},${py+h-hs*0.3} C${px+h+hs},${py+h-hs*0.9} ${px+h+hs},${py+h-hs*0.2} ${px+h},${py+h+hs*0.6}Z" ${fA}/>\n`;break;}default:s+=`<rect x="${px}" y="${py}" width="${ms}" height="${ms}" ${fA}/>\n`;}}
  if(frameStyle!=="none"){const fd=FRAME_STYLES.find(f=>f.id===frameStyle);const txt=frameStyle==="custom"?(frameText||"Scan Me"):(fd?.text||"Scan Me");s+=`<text x="${svgSize/2}" y="${svgSize-fH/2}" text-anchor="middle" dominant-baseline="middle" font-family="'Noto Sans JP',sans-serif" font-weight="bold" font-size="${Math.round(fH*0.42)}" fill="${fgColor}">${txt}</text>\n`;}
  s+=`</svg>`;return s;
}

// ─── CSV Parser ───
function parseCSV(t){const l=t.split(/\r?\n/).filter(l=>l.trim());if(l.length<2)return[];const h=l[0].split(",").map(h=>h.trim().replace(/^["']|["']$/g,""));return l.slice(1).map(ln=>{const v=[];let c="",q=false;for(let i=0;i<ln.length;i++){const ch=ln[i];if(ch==='"')q=!q;else if(ch===','&&!q){v.push(c.trim());c="";}else c+=ch;}v.push(c.trim());const o={};h.forEach((hd,i)=>{o[hd]=v[i]||"";});return o;});}

function AppLogo({size=40,t}){return(<svg width={size} height={size} viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill={t.ac}/><text x="24" y="20" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="Outfit,sans-serif">QR</text><line x1="12" y1="26" x2="36" y2="26" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/><rect x="12" y="30" width="6" height="6" rx="1" fill="rgba(255,255,255,0.9)"/><rect x="21" y="30" width="6" height="6" rx="1" fill="rgba(255,255,255,0.6)"/><rect x="30" y="30" width="6" height="6" rx="1" fill="rgba(255,255,255,0.3)"/></svg>);}

// ─── Main App ───
export default function App(){
  const[theme,setTheme]=useState("dark");const[inputType,setInputType]=useState("url");const[inputValue,setInputValue]=useState("");
  const[wifiData,setWifiData]=useState({ssid:"",password:"",encryption:"WPA"});const[vcardData,setVcardData]=useState({name:"",phone:"",email:"",org:"",url:""});
  const[emailData,setEmailData]=useState({address:"",subject:"",body:""});const[snsData,setSnsData]=useState({platform:"x",username:""});const[geoData,setGeoData]=useState({lat:"",lng:"",label:""});
  const[dotStyle,setDotStyle]=useState("square");const[cornerStyle,setCornerStyle]=useState("square");const[colorPreset,setColorPreset]=useState("classic");
  const[customFg,setCustomFg]=useState("#000000");const[customBg,setCustomBg]=useState("#ffffff");const[customGrad1,setCustomGrad1]=useState("");const[customGrad2,setCustomGrad2]=useState("");
  const[gradientMode,setGradientMode]=useState("linear");const[gradAngle,setGradAngle]=useState(135);const[ecLevel,setEcLevel]=useState("M");
  const[frameStyle,setFrameStyle]=useState("none");const[frameText,setFrameText]=useState("");const[logoFile,setLogoFile]=useState(null);const[logoImg,setLogoImg]=useState(null);const[exportSize,setExportSize]=useState(1024);
  const[scenePreset,setScenePreset]=useState("none");const[bulkCSV,setBulkCSV]=useState("");const[bulkProgress,setBulkProgress]=useState(null);const[bulkFormat,setBulkFormat]=useState("png");
  const[jsZipLoaded,setJsZipLoaded]=useState(false);const[jsQRLoaded,setJsQRLoaded]=useState(false);
  const[showDesign,setShowDesign]=useState(true);const[copiedMsg,setCopiedMsg]=useState(false);const[activeTab,setActiveTab]=useState("single");
  const[bgFile,setBgFile]=useState(null);const[bgImg,setBgImg]=useState(null);const[bgOpacity,setBgOpacity]=useState(0.3);
  const[scanResult,setScanResult]=useState(null);
  const[savedTemplates,setSavedTemplates]=useState([]); // null | { ok, msg }
  const previewRef=useRef(null);const fileInputRef=useRef(null);const csvInputRef=useRef(null);const bgInputRef=useRef(null);
  const t=themes[theme];

  // Load external libs
  useEffect(()=>{
    if(!window.JSZip){const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";s.onload=()=>setJsZipLoaded(true);document.head.appendChild(s);}else setJsZipLoaded(true);
    if(!window.jsQR){const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js";s.onload=()=>setJsQRLoaded(true);document.head.appendChild(s);}else setJsQRLoaded(true);
  },[]);

  useEffect(()=>{(async()=>{const r=await sGet("qr-gen-v3");if(!r)return;try{const d=JSON.parse(r);if(d.theme)setTheme(d.theme);if(d.templates)setSavedTemplates(d.templates);}catch{}})();},[]);
  const persist=(o={})=>sSet("qr-gen-v3",JSON.stringify({theme,templates:savedTemplates,...o}));

  const applyScene=id=>{setScenePreset(id);const p=SCENE_PRESETS.find(x=>x.id===id);if(!p?.settings)return;const s=p.settings;if(s.colorPreset)setColorPreset(s.colorPreset);if(s.customFg)setCustomFg(s.customFg);if(s.customBg)setCustomBg(s.customBg);if(s.customGrad1!==undefined)setCustomGrad1(s.customGrad1);if(s.customGrad2!==undefined)setCustomGrad2(s.customGrad2);if(s.frameStyle)setFrameStyle(s.frameStyle);if(s.dotStyle)setDotStyle(s.dotStyle);if(s.cornerStyle)setCornerStyle(s.cornerStyle);};

  const getColors=useCallback(()=>{if(colorPreset==="custom")return{fg:customFg,bg:customBg,gradient:customGrad1&&customGrad2?[customGrad1,customGrad2]:null};const p=COLOR_PRESETS.find(x=>x.id===colorPreset);return p?{fg:p.fg,bg:p.bg,gradient:p.gradient}:{fg:"#000",bg:"#fff",gradient:null};},[colorPreset,customFg,customBg,customGrad1,customGrad2]);

  const getQRContent=useCallback(()=>{switch(inputType){case"url":case"text":return inputValue;case"phone":return inputValue?`tel:${inputValue.replace(/[-\s]/g,"")}`:"";case"wifi":return wifiData.ssid?`WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`:"";case"vcard":{if(!vcardData.name)return"";let v="BEGIN:VCARD\nVERSION:3.0\n";v+=`FN:${vcardData.name}\n`;if(vcardData.phone)v+=`TEL:${vcardData.phone}\n`;if(vcardData.email)v+=`EMAIL:${vcardData.email}\n`;if(vcardData.org)v+=`ORG:${vcardData.org}\n`;if(vcardData.url)v+=`URL:${vcardData.url}\n`;v+="END:VCARD";return v;}case"email":{if(!emailData.address)return"";let m=`mailto:${emailData.address}`;const p2=[];if(emailData.subject)p2.push(`subject=${encodeURIComponent(emailData.subject)}`);if(emailData.body)p2.push(`body=${encodeURIComponent(emailData.body)}`);if(p2.length)m+="?"+p2.join("&");return m;}case"sns":{const pl=SNS_PLATFORMS.find(p=>p.id===snsData.platform);if(!pl)return"";if(pl.id==="custom")return snsData.username;return snsData.username?`${pl.prefix}${snsData.username}`:"";}case"geo":return geoData.lat&&geoData.lng?`geo:${geoData.lat},${geoData.lng}${geoData.label?`?q=${encodeURIComponent(geoData.label)}`:""}`:"";default:return"";}},[inputType,inputValue,wifiData,vcardData,emailData,snsData,geoData]);

  const qrContent=getQRContent();const qrData=useMemo(()=>qrContent?generateQR(qrContent,ecLevel):null,[qrContent,ecLevel]);

  // Template save/load
  const saveTemplate=()=>{const tpl={id:Date.now().toString(36),name:`テンプレート ${savedTemplates.length+1}`,dotStyle,cornerStyle,colorPreset,customFg,customBg,customGrad1,customGrad2,gradientMode,gradAngle,frameStyle,frameText,ecLevel};const next=[tpl,...savedTemplates].slice(0,10);setSavedTemplates(next);persist({templates:next});};
  const loadTemplate=tpl=>{setDotStyle(tpl.dotStyle||"square");setCornerStyle(tpl.cornerStyle||"square");setColorPreset(tpl.colorPreset||"classic");setCustomFg(tpl.customFg||"#000000");setCustomBg(tpl.customBg||"#ffffff");setCustomGrad1(tpl.customGrad1||"");setCustomGrad2(tpl.customGrad2||"");setGradientMode(tpl.gradientMode||"linear");setGradAngle(tpl.gradAngle||135);setFrameStyle(tpl.frameStyle||"none");setFrameText(tpl.frameText||"");setEcLevel(tpl.ecLevel||"M");setScenePreset("none");};
  const deleteTemplate=id=>{const next=savedTemplates.filter(t2=>t2.id!==id);setSavedTemplates(next);persist({templates:next});};

  const getOpts=(sz)=>({dotStyle,cornerStyle,fgColor:getColors().fg,bgColor:getColors().bg,gradient:getColors().gradient,gradientMode,gradAngle,logoImg,bgImg,bgOpacity,frameStyle,frameText,canvasSize:sz,quietZone:4});

  useEffect(()=>{if(!previewRef.current||!qrData)return;drawQRToCanvas(previewRef.current,qrData,getOpts(600));setScanResult(null);},[qrData,dotStyle,cornerStyle,colorPreset,customFg,customBg,customGrad1,customGrad2,gradientMode,gradAngle,ecLevel,logoImg,bgImg,bgOpacity,frameStyle,frameText]);

  // ─── Read-back test (jsQR) ───
  const runScanTest=useCallback(()=>{
    if(!jsQRLoaded||!qrData||!previewRef.current)return;
    try{
      const c=document.createElement("canvas");drawQRToCanvas(c,qrData,getOpts(600));
      const ctx=c.getContext("2d");const imgData=ctx.getImageData(0,0,c.width,c.height);
      const result=window.jsQR(imgData.data,c.width,c.height);
      if(result&&result.data){setScanResult({ok:true,msg:`✓ 読取OK`});}
      else{setScanResult({ok:false,msg:"✗ 読取不可 — ロゴが大きすぎるか、デザインが複雑すぎます"});}
    }catch{setScanResult({ok:false,msg:"✗ テストエラー"});}
  },[jsQRLoaded,qrData,dotStyle,cornerStyle,colorPreset,customFg,customBg,customGrad1,customGrad2,gradientMode,gradAngle,ecLevel,logoImg,bgImg,bgOpacity,frameStyle,frameText]);

  const handleLogoUpload=e=>{const f=e.target.files?.[0];if(!f)return;setLogoFile(f);const img=new Image();img.onload=()=>setLogoImg(img);img.src=URL.createObjectURL(f);if(ecLevel!=="H"&&ecLevel!=="Q")setEcLevel("Q");};
  const removeLogo=()=>{setLogoFile(null);setLogoImg(null);if(fileInputRef.current)fileInputRef.current.value="";};
  const handleBgUpload=e=>{const f=e.target.files?.[0];if(!f)return;setBgFile(f);const img=new Image();img.onload=()=>setBgImg(img);img.src=URL.createObjectURL(f);};
  const removeBg=()=>{setBgFile(null);setBgImg(null);if(bgInputRef.current)bgInputRef.current.value="";};

  const handleDownloadPNG=()=>{if(!qrData)return;const o=document.createElement("canvas");drawQRToCanvas(o,qrData,getOpts(exportSize));const l=document.createElement("a");l.download=`qrcode-${Date.now()}.png`;l.href=o.toDataURL("image/png");l.click();};
  const handleDownloadSVG=()=>{if(!qrData)return;const c=getColors();const svg=generateSVG(qrData,{dotStyle,cornerStyle,fgColor:c.fg,bgColor:c.bg,gradient:c.gradient,gradientMode,gradAngle,frameStyle,frameText,svgSize:exportSize,quietZone:4});const b=new Blob([svg],{type:"image/svg+xml"});const l=document.createElement("a");l.download=`qrcode-${Date.now()}.svg`;l.href=URL.createObjectURL(b);l.click();};
  const handleCopyImage=async()=>{if(!qrData)return;try{const o=document.createElement("canvas");drawQRToCanvas(o,qrData,getOpts(exportSize));o.toBlob(async b=>{if(b){await navigator.clipboard.write([new ClipboardItem({"image/png":b})]);setCopiedMsg(true);setTimeout(()=>setCopiedMsg(false),2000);}});}catch{setCopiedMsg(false);}};
  const handleBulkCSVUpload=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>setBulkCSV(ev.target.result);r.readAsText(f);};
  const handleBulkGenerate=async()=>{if(!jsZipLoaded||!bulkCSV.trim())return;const rows=parseCSV(bulkCSV);if(rows.length===0){setBulkProgress({current:0,total:0,status:"CSVが空です"});return;}const hd=Object.keys(rows[0]);const dc=hd.find(h=>/^(url|data|text|content|value|link)$/i.test(h))||hd[0];const nc=hd.find(h=>/^(name|filename|label|id|title)$/i.test(h));setBulkProgress({current:0,total:rows.length,status:"生成中..."});const zip=new window.JSZip();const colors=getColors();for(let i=0;i<rows.length;i++){const ct=rows[i][dc];if(!ct)continue;const qr=generateQR(ct,ecLevel);if(!qr)continue;const fn=nc&&rows[i][nc]?rows[i][nc].replace(/[^a-zA-Z0-9_\-\u3000-\u9fff\uff01-\uff9f]/g,"_"):`qr_${i+1}`;if(bulkFormat==="svg"){zip.file(`${fn}.svg`,generateSVG(qr,{dotStyle,cornerStyle,fgColor:colors.fg,bgColor:colors.bg,gradient:colors.gradient,gradientMode,gradAngle,frameStyle,frameText,svgSize:exportSize,quietZone:4}));}else{const o=document.createElement("canvas");drawQRToCanvas(o,qr,{dotStyle,cornerStyle,fgColor:colors.fg,bgColor:colors.bg,gradient:colors.gradient,gradientMode,gradAngle,logoImg,bgImg,bgOpacity,frameStyle,frameText,canvasSize:exportSize,quietZone:4});zip.file(`${fn}.png`,o.toDataURL("image/png").split(",")[1],{base64:true});}setBulkProgress({current:i+1,total:rows.length,status:"生成中..."});await new Promise(r=>setTimeout(r,10));}setBulkProgress(p=>({...p,status:"ZIP作成中..."}));const blob=await zip.generateAsync({type:"blob"});const l=document.createElement("a");l.download=`qrcodes-bulk-${Date.now()}.zip`;l.href=URL.createObjectURL(blob);l.click();setBulkProgress(p=>({...p,status:`✓ ${p.total}件完了！`}));};

  const sL={display:"block",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:t.td,letterSpacing:2,marginBottom:10,textTransform:"uppercase"};
  const sC=on=>({padding:"8px 14px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Noto Sans JP',sans-serif",transition:"all 0.2s",border:on?`1.5px solid ${t.acb}`:`1.5px solid ${t.cb}`,background:on?t.ab:t.card,color:on?t.ac:t.tm});
  const sI={width:"100%",padding:"12px 14px",fontSize:14,color:t.text,background:t.ib,border:`1px solid ${t.ibr}`,borderRadius:10,fontFamily:"'Noto Sans JP',sans-serif",boxSizing:"border-box"};
  const sS=d=>({marginBottom:28,animation:`fadeUp 0.5s ease ${d}s both`});

  const renderInput=()=>{switch(inputType){
    case"url":case"text":case"phone":return(<div>{inputType==="text"?<textarea value={inputValue} onChange={e=>setInputValue(e.target.value)} placeholder={INPUT_TYPES.find(x=>x.id===inputType)?.placeholder} rows={4} style={{...sI,resize:"vertical",minHeight:80}}/>:<input type={inputType==="url"?"url":"text"} value={inputValue} onChange={e=>setInputValue(e.target.value)} placeholder={INPUT_TYPES.find(x=>x.id===inputType)?.placeholder} style={sI}/>}</div>);
    case"wifi":return(<div style={{display:"flex",flexDirection:"column",gap:8}}><input placeholder="ネットワーク名 (SSID)" value={wifiData.ssid} onChange={e=>setWifiData(p=>({...p,ssid:e.target.value}))} style={sI}/><input placeholder="パスワード" value={wifiData.password} onChange={e=>setWifiData(p=>({...p,password:e.target.value}))} style={sI}/><div style={{display:"flex",gap:6}}>{["WPA","WEP","nopass"].map(enc=><button key={enc} onClick={()=>setWifiData(p=>({...p,encryption:enc}))} style={sC(wifiData.encryption===enc)}>{enc==="nopass"?"なし":enc}</button>)}</div></div>);
    case"vcard":return(<div style={{display:"flex",flexDirection:"column",gap:8}}><input placeholder="名前（必須）" value={vcardData.name} onChange={e=>setVcardData(p=>({...p,name:e.target.value}))} style={sI}/><input placeholder="電話番号" value={vcardData.phone} onChange={e=>setVcardData(p=>({...p,phone:e.target.value}))} style={sI}/><input placeholder="メールアドレス" value={vcardData.email} onChange={e=>setVcardData(p=>({...p,email:e.target.value}))} style={sI}/><input placeholder="会社名" value={vcardData.org} onChange={e=>setVcardData(p=>({...p,org:e.target.value}))} style={sI}/><input placeholder="Webサイト" value={vcardData.url} onChange={e=>setVcardData(p=>({...p,url:e.target.value}))} style={sI}/></div>);
    case"email":return(<div style={{display:"flex",flexDirection:"column",gap:8}}><input placeholder="メールアドレス（必須）" value={emailData.address} onChange={e=>setEmailData(p=>({...p,address:e.target.value}))} style={sI}/><input placeholder="件名" value={emailData.subject} onChange={e=>setEmailData(p=>({...p,subject:e.target.value}))} style={sI}/><textarea placeholder="本文テンプレート" value={emailData.body} onChange={e=>setEmailData(p=>({...p,body:e.target.value}))} rows={3} style={{...sI,resize:"vertical"}}/></div>);
    case"sns":return(<div style={{display:"flex",flexDirection:"column",gap:8}}><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{SNS_PLATFORMS.map(p=><button key={p.id} onClick={()=>setSnsData(prev=>({...prev,platform:p.id}))} style={sC(snsData.platform===p.id)}>{p.label}</button>)}</div><input placeholder={snsData.platform==="custom"?"URL全体を入力":"ユーザー名"} value={snsData.username} onChange={e=>setSnsData(p=>({...p,username:e.target.value}))} style={sI}/>{snsData.platform!=="custom"&&snsData.username&&<div style={{fontSize:11,color:t.td,fontFamily:"'IBM Plex Mono',monospace",wordBreak:"break-all"}}>{SNS_PLATFORMS.find(p=>p.id===snsData.platform)?.prefix}{snsData.username}</div>}</div>);
    case"geo":return(<div style={{display:"flex",flexDirection:"column",gap:8}}><div style={{display:"flex",gap:8}}><input placeholder="緯度" value={geoData.lat} onChange={e=>setGeoData(p=>({...p,lat:e.target.value}))} style={{...sI,flex:1}}/><input placeholder="経度" value={geoData.lng} onChange={e=>setGeoData(p=>({...p,lng:e.target.value}))} style={{...sI,flex:1}}/></div><input placeholder="場所の名前（任意）" value={geoData.label} onChange={e=>setGeoData(p=>({...p,label:e.target.value}))} style={sI}/></div>);
    default:return null;}};

  return(<div style={{minHeight:"100vh",background:t.bg,fontFamily:"'Noto Sans JP',sans-serif",color:t.text,transition:"background 0.4s,color 0.4s"}}>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&family=Outfit:wght@400;600;700;900&display=swap" rel="stylesheet"/>
    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}input:focus,textarea:focus,select:focus{outline:none}input::placeholder,textarea::placeholder{color:${t.ph}}*{scrollbar-width:thin;scrollbar-color:${t.tg} transparent}input[type=range]{-webkit-appearance:none;height:6px;background:${t.cb};border-radius:3px;outline:none}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${t.ac};cursor:pointer}`}</style>
    <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(${t.gc} 1px,transparent 1px),linear-gradient(90deg,${t.gc} 1px,transparent 1px)`,backgroundSize:"40px 40px",pointerEvents:"none"}}/>
    <div style={{position:"relative",maxWidth:480,margin:"0 auto",padding:"32px 16px 100px"}}>

      <header style={{marginBottom:32,animation:"fadeUp 0.5s ease both"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <a href="#" style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:t.ac,textDecoration:"none",letterSpacing:1}}>← Zero to Ship</a>
          <button onClick={()=>{const n=theme==="dark"?"light":"dark";setTheme(n);persist({theme:n});}} style={{width:36,height:36,borderRadius:10,border:`1px solid ${t.cb}`,background:t.card,color:t.ts,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{theme==="dark"?"☀️":"🌙"}</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}><AppLogo size={44} t={t}/><div>
          <div style={{display:"flex",alignItems:"baseline",gap:10}}><h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:26,fontWeight:900,margin:0,color:t.text}}>QRコード生成機</h1><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:t.tg}}>v3.1</span></div>
          <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:t.td,marginTop:2,marginBottom:0}}>QR Code Designer</p>
        </div></div>
      </header>

      {/* Tabs */}
      <section style={sS(0.03)}><div style={{display:"flex",gap:4,background:t.card,borderRadius:10,padding:4,border:`1px solid ${t.cb}`}}>{[{id:"single",label:"単体生成",icon:"📱"},{id:"bulk",label:"一括生成",icon:"📦"}].map(tab=><button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{flex:1,padding:"10px 14px",borderRadius:8,border:"none",background:activeTab===tab.id?t.ab:"transparent",color:activeTab===tab.id?t.ac:t.tm,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Noto Sans JP',sans-serif",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><span>{tab.icon}</span>{tab.label}</button>)}</div></section>

      {/* Single */}
      {activeTab==="single"&&(<>
        <section style={sS(0.05)}><label style={sL}>入力タイプ</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{INPUT_TYPES.map(it=><button key={it.id} onClick={()=>setInputType(it.id)} style={{...sC(inputType===it.id),display:"flex",alignItems:"center",gap:4,padding:"8px 12px"}}><span style={{fontSize:14}}>{it.icon}</span><span>{it.label}</span></button>)}</div></section>
        <section style={sS(0.1)}><label style={sL}>{INPUT_TYPES.find(x=>x.id===inputType)?.icon} {INPUT_TYPES.find(x=>x.id===inputType)?.label}を入力</label>{renderInput()}</section>
        {qrData&&(<section style={{...sS(0.15),display:"flex",justifyContent:"center"}}><div style={{background:getColors().bg,borderRadius:16,padding:12,boxShadow:`0 8px 40px ${t.ov}, 0 2px 8px rgba(0,0,0,0.1)`,border:`1px solid ${t.cb}`,maxWidth:320,transform:"translateY(-2px)",transition:"transform 0.3s, box-shadow 0.3s"}}><canvas ref={previewRef} style={{width:"100%",height:"auto",display:"block",borderRadius:8}}/></div></section>)}
        {/* Scan test result */}
        {qrData&&scanResult&&(<div style={{textAlign:"center",padding:"8px 14px",background:scanResult.ok?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)",border:`1px solid ${scanResult.ok?t.acb:"rgba(239,68,68,0.25)"}`,borderRadius:8,marginBottom:16,fontSize:12,fontFamily:"'IBM Plex Mono',monospace",color:scanResult.ok?t.ac:t.danger}}>{scanResult.msg}</div>)}
        {qrData&&(<section style={sS(0.2)}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={handleDownloadPNG} style={{flex:1,minWidth:70,padding:"14px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${t.acd},${t.ac})`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Noto Sans JP',sans-serif"}}>📥 PNG</button>
            <button onClick={handleDownloadSVG} style={{flex:1,minWidth:70,padding:"14px",borderRadius:10,border:`1px solid ${t.acb}`,background:t.ab,color:t.ac,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Noto Sans JP',sans-serif"}}>📐 SVG</button>
            <button onClick={handleCopyImage} style={{flex:1,minWidth:70,padding:"14px",borderRadius:10,border:`1px solid ${t.cb}`,background:t.card,color:t.ts,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Noto Sans JP',sans-serif"}}>{copiedMsg?"✓ コピー済み":"📋 コピー"}</button>
          </div>
          <div style={{display:"flex",gap:6,marginTop:8,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:10,color:t.td,fontFamily:"'IBM Plex Mono',monospace"}}>サイズ:</span>{[512,1024,2048].map(s=><button key={s} onClick={()=>setExportSize(s)} style={{...sC(exportSize===s),padding:"4px 10px",fontSize:10}}>{s}px</button>)}
            <div style={{flex:1}}/>
            <button onClick={runScanTest} disabled={!jsQRLoaded} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${t.cb}`,background:t.card,color:jsQRLoaded?t.info:t.tg,fontSize:11,fontWeight:600,cursor:jsQRLoaded?"pointer":"not-allowed",fontFamily:"'IBM Plex Mono',monospace"}}>🔍 読取テスト</button>
          </div>
        </section>)}
      </>)}

      {/* Bulk */}
      {activeTab==="bulk"&&(<section style={sS(0.05)}><label style={sL}>📦 一括生成（CSV → ZIP）</label>
        <div style={{padding:16,background:t.card,border:`1px solid ${t.cb}`,borderRadius:12,marginBottom:16}}>
          <div style={{fontSize:12,color:t.ts,marginBottom:12,lineHeight:1.8}}>CSVをアップロードして一括でQRコードを生成。現在のデザイン設定がすべてに適用されます。</div>
          <div style={{fontSize:11,color:t.td,fontFamily:"'IBM Plex Mono',monospace",marginBottom:12,padding:10,background:t.ib,borderRadius:8,border:`1px dashed ${t.cb}`,lineHeight:1.8}}><div style={{color:t.ac,fontWeight:600,marginBottom:4}}>CSVフォーマット例:</div><div>name,url</div><div>会社A,https://example.com</div><div>会社B,https://example.org</div><div style={{marginTop:6,color:t.tg,fontSize:10}}>※ 列名 url/data/text/content → 自動検出。name/filename → ファイル名に使用。</div></div>
          <div style={{display:"flex",gap:8,marginBottom:12}}><button onClick={()=>csvInputRef.current?.click()} style={{...sC(!!bulkCSV),padding:"10px 16px",flex:1}}>{bulkCSV?`✓ CSV読込済 (${parseCSV(bulkCSV).length}件)`:"📎 CSVを選択"}</button><input ref={csvInputRef} type="file" accept=".csv,.tsv,.txt" onChange={handleBulkCSVUpload} style={{display:"none"}}/></div>
          <textarea value={bulkCSV} onChange={e=>setBulkCSV(e.target.value)} placeholder={"name,url\n会社A,https://example.com\n会社B,https://example.org"} rows={5} style={{...sI,resize:"vertical",fontSize:12,fontFamily:"'IBM Plex Mono',monospace",marginBottom:12}}/>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}><span style={{fontSize:11,color:t.td}}>出力形式:</span><button onClick={()=>setBulkFormat("png")} style={sC(bulkFormat==="png")}>PNG</button><button onClick={()=>setBulkFormat("svg")} style={sC(bulkFormat==="svg")}>SVG</button><div style={{flex:1}}/><span style={{fontSize:10,color:t.td,fontFamily:"'IBM Plex Mono',monospace"}}>{exportSize}px</span></div>
          <button onClick={handleBulkGenerate} disabled={!bulkCSV.trim()||!jsZipLoaded||(bulkProgress?.status==="生成中..."||bulkProgress?.status==="ZIP作成中...")} style={{width:"100%",padding:"14px",borderRadius:10,border:"none",background:bulkCSV.trim()&&jsZipLoaded?`linear-gradient(135deg,${t.acd},${t.ac})`:t.card,color:bulkCSV.trim()&&jsZipLoaded?"#fff":t.tg,fontSize:14,fontWeight:700,cursor:bulkCSV.trim()&&jsZipLoaded?"pointer":"not-allowed",fontFamily:"'Noto Sans JP',sans-serif"}}>{!jsZipLoaded?"ライブラリ読込中...":"📦 一括生成してZIPダウンロード"}</button>
          {bulkProgress&&(<div style={{marginTop:12}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:"'IBM Plex Mono',monospace",color:t.ts,marginBottom:6}}><span>{bulkProgress.status}</span><span>{bulkProgress.current}/{bulkProgress.total}</span></div><div style={{height:6,background:t.cb,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:`linear-gradient(90deg,${t.acd},${t.ac})`,borderRadius:3,width:`${bulkProgress.total>0?(bulkProgress.current/bulkProgress.total)*100:0}%`,transition:"width 0.2s"}}/></div></div>)}
        </div>
      </section>)}

      {/* Design */}
      <section style={sS(0.25)}><button onClick={()=>setShowDesign(!showDesign)} style={{width:"100%",padding:"14px 16px",borderRadius:10,border:`1px solid ${showDesign?t.acb:t.advbr}`,background:showDesign?t.ab:t.advb,color:showDesign?t.ac:t.tm,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Noto Sans JP',sans-serif",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>🎨 デザインカスタマイズ</span><span style={{fontSize:10,transform:showDesign?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}>▼</span></button></section>

      {showDesign&&(<>
        <section style={sS(0.28)}><label style={sL}>🏪 シーン・プリセット</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{SCENE_PRESETS.map(p=><button key={p.id} onClick={()=>applyScene(p.id)} style={{...sC(scenePreset===p.id),display:"flex",alignItems:"center",gap:4,padding:"6px 12px"}}>{p.icon&&<span style={{fontSize:14}}>{p.icon}</span>}<span style={{fontSize:11}}>{p.label}</span></button>)}</div>{scenePreset!=="none"&&<div style={{fontSize:10,color:t.ac,marginTop:6,fontFamily:"'IBM Plex Mono',monospace"}}>✓ {SCENE_PRESETS.find(p=>p.id===scenePreset)?.desc} — 自動適用済み</div>}</section>

        <section style={sS(0.3)}><label style={sL}>カラーテーマ</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{COLOR_PRESETS.map(p=><button key={p.id} onClick={()=>{setColorPreset(p.id);setScenePreset("none");}} style={{...sC(colorPreset===p.id),display:"flex",alignItems:"center",gap:6,padding:"6px 12px"}}><span style={{width:14,height:14,borderRadius:3,background:p.gradient?`linear-gradient(135deg,${p.gradient[0]},${p.gradient[1]})`:p.fg,border:`1px solid ${t.cb}`,flexShrink:0}}/><span style={{fontSize:11}}>{p.label}</span></button>)}<button onClick={()=>{setColorPreset("custom");setScenePreset("none");}} style={{...sC(colorPreset==="custom"),padding:"6px 12px",fontSize:11}}>🎨 カスタム</button></div>
          {colorPreset==="custom"&&(<div style={{marginTop:12,padding:14,background:t.card,border:`1px solid ${t.cb}`,borderRadius:10,display:"flex",flexDirection:"column",gap:10}}>{[["前景色",customFg,setCustomFg],["背景色",customBg,setCustomBg],["ｸﾞﾗﾃﾞ①",customGrad1||"",setCustomGrad1],["ｸﾞﾗﾃﾞ②",customGrad2||"",setCustomGrad2]].map(([label,val,setter],i)=><div key={i} style={{display:"flex",gap:12,alignItems:"center"}}><label style={{fontSize:11,color:t.td,minWidth:60}}>{label}</label><input type="color" value={val||"#000000"} onChange={e=>setter(e.target.value)} style={{width:36,height:28,border:"none",cursor:"pointer",background:"transparent"}}/><input type="text" value={val} onChange={e=>setter(e.target.value)} placeholder={i>=2?"空欄=なし":""} style={{...sI,flex:1,padding:"6px 10px",fontSize:12,fontFamily:"'IBM Plex Mono',monospace"}}/></div>)}</div>)}
        </section>

        {/* Gradient mode + angle */}
        <section style={sS(0.32)}><label style={sL}>グラデーション方向</label>
          <div style={{display:"flex",gap:6,marginBottom:gradientMode==="linear"?10:0}}>{GRAD_MODES.map(g=><button key={g.id} onClick={()=>setGradientMode(g.id)} style={sC(gradientMode===g.id)}>{g.label}</button>)}</div>
          {gradientMode==="linear"&&(<div><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:t.td,fontFamily:"'IBM Plex Mono',monospace",marginBottom:6}}><span>角度</span><span>{gradAngle}°</span></div><div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>{GRAD_ANGLES.map(a=><button key={a.v} onClick={()=>setGradAngle(a.v)} style={{...sC(gradAngle===a.v),padding:"6px 10px",fontSize:13,minWidth:36}}>{a.label}</button>)}</div><input type="range" min="0" max="360" step="5" value={gradAngle} onChange={e=>setGradAngle(parseInt(e.target.value))} style={{width:"100%"}}/></div>)}
        </section>

        <section style={sS(0.35)}><label style={sL}>ドット形状</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{DOT_STYLES.map(d=><button key={d.id} onClick={()=>{setDotStyle(d.id);setScenePreset("none");}} style={sC(dotStyle===d.id)}>{d.label}</button>)}</div></section>
        <section style={sS(0.4)}><label style={sL}>コーナーマーク</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{CORNER_STYLES.map(c=><button key={c.id} onClick={()=>{setCornerStyle(c.id);setScenePreset("none");}} style={sC(cornerStyle===c.id)}>{c.label}</button>)}</div></section>

        {/* Logo */}
        <section style={sS(0.45)}><label style={sL}>中央ロゴ</label><div style={{display:"flex",gap:8,alignItems:"center"}}><button onClick={()=>fileInputRef.current?.click()} style={{...sC(!!logoFile),padding:"10px 16px"}}>{logoFile?`✓ ${logoFile.name.slice(0,15)}...`:"📎 画像を選択"}</button>{logoFile&&<button onClick={removeLogo} style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${t.cb}`,background:t.card,color:t.danger,fontSize:11,cursor:"pointer"}}>削除</button>}<input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{display:"none"}}/></div>{logoFile&&<div style={{fontSize:10,color:t.warn,marginTop:6,fontFamily:"'IBM Plex Mono',monospace"}}>⚠ ロゴ挿入時はEC Q以上推奨（自動変更済み）</div>}</section>

        {/* Background image */}
        <section style={sS(0.48)}><label style={sL}>🖼 背景画像</label>
          <div style={{display:"flex",gap:8,alignItems:"center"}}><button onClick={()=>bgInputRef.current?.click()} style={{...sC(!!bgFile),padding:"10px 16px"}}>{bgFile?`✓ ${bgFile.name.slice(0,15)}...`:"📎 背景画像を選択"}</button>{bgFile&&<button onClick={removeBg} style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${t.cb}`,background:t.card,color:t.danger,fontSize:11,cursor:"pointer"}}>削除</button>}<input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} style={{display:"none"}}/></div>
          {bgFile&&(<div style={{marginTop:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:t.td,fontFamily:"'IBM Plex Mono',monospace",marginBottom:4}}><span>透明度</span><span>{Math.round(bgOpacity*100)}%</span></div><input type="range" min="0.05" max="0.8" step="0.05" value={bgOpacity} onChange={e=>setBgOpacity(parseFloat(e.target.value))} style={{width:"100%"}}/></div>)}
        </section>

        <section style={sS(0.5)}><label style={sL}>フレーム</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{FRAME_STYLES.map(f=><button key={f.id} onClick={()=>setFrameStyle(f.id)} style={{...sC(frameStyle===f.id),padding:"6px 10px",fontSize:11}}>{f.label}</button>)}</div>{frameStyle==="custom"&&<input type="text" value={frameText} onChange={e=>setFrameText(e.target.value)} placeholder="フレームテキストを入力" style={{...sI,marginTop:8}}/>}</section>
        <section style={sS(0.55)}><label style={sL}>誤り訂正レベル</label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{EC_OPTIONS.map(e=><button key={e.id} onClick={()=>setEcLevel(e.id)} style={{...sC(ecLevel===e.id),display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 14px"}}><span style={{fontWeight:700}}>{e.label}</span><span style={{fontSize:9,opacity:0.6}}>{e.desc}</span></button>)}</div></section>
        <section style={sS(0.6)}><label style={sL}>出力サイズ</label><div style={{display:"flex",gap:6}}>{[512,1024,2048,4096].map(s=><button key={s} onClick={()=>setExportSize(s)} style={sC(exportSize===s)}>{s}px</button>)}</div></section>

        {/* My Templates */}
        <section style={sS(0.65)}><label style={sL}>💾 マイテンプレート</label>
          <button onClick={saveTemplate} style={{width:"100%",padding:"10px 14px",borderRadius:8,border:`1px dashed ${t.acb}`,background:t.ab,color:t.ac,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Noto Sans JP',sans-serif",marginBottom:savedTemplates.length>0?10:0}}>+ 現在のデザインを保存</button>
          {savedTemplates.length>0&&(<div style={{display:"flex",flexDirection:"column",gap:6}}>{savedTemplates.map(tpl=>(
            <div key={tpl.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:t.card,border:`1px solid ${t.cb}`,borderRadius:8,cursor:"pointer"}} onClick={()=>loadTemplate(tpl)}>
              <div style={{width:20,height:20,borderRadius:4,background:tpl.customGrad1&&tpl.customGrad2?`linear-gradient(135deg,${tpl.customGrad1},${tpl.customGrad2})`:tpl.customFg||"#000",flexShrink:0,border:`1px solid ${t.cb}`}}/>
              <div style={{flex:1,fontSize:12,color:t.ts}}>{tpl.name}<span style={{fontSize:10,color:t.tg,marginLeft:6}}>{tpl.dotStyle} · {tpl.cornerStyle}</span></div>
              <button onClick={e=>{e.stopPropagation();deleteTemplate(tpl.id);}} style={{width:22,height:22,borderRadius:5,border:"none",background:"transparent",color:t.tg,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
          ))}</div>)}
          {savedTemplates.length===0&&<div style={{fontSize:11,color:t.tg,textAlign:"center",padding:8}}>保存済みテンプレートはありません</div>}
        </section>
      </>)}

      {qrData&&activeTab==="single"&&(<div style={{marginTop:8,padding:"10px 14px",background:t.card,border:`1px solid ${t.cb}`,borderRadius:10,fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:t.td,display:"flex",gap:16,flexWrap:"wrap"}}><span>Version: {qrData.version}</span><span>Size: {qrData.size}×{qrData.size}</span><span>EC: {ecLevel}</span><span>Bytes: {new TextEncoder().encode(qrContent).length}</span></div>)}
      {!qrContent&&activeTab==="single"&&(<div style={{textAlign:"center",padding:"40px 20px",color:t.tg,animation:"fadeUp 0.5s ease 0.2s both"}}><div style={{fontSize:48,marginBottom:12}}>📱</div><div style={{fontSize:14,fontWeight:600}}>データを入力するとQRコードが生成されます</div><div style={{fontSize:11,color:t.td,marginTop:4,fontFamily:"'IBM Plex Mono',monospace"}}>すべてブラウザ内で処理 — データ送信なし</div></div>)}
      <div style={{marginTop:60}}/>
    </div></div>);
}
