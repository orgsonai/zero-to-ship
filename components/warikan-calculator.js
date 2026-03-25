import { useState, useEffect, useCallback } from "react";

// ─── Helpers ───
function gid() { return Math.random().toString(36).slice(2, 8); }
function mkMember(name) { return { id: gid(), name, weight: 1, paid: false, isPayer: false, adjustItems: [] }; }
function mkItem(label, amount, taxRate) { return { id: gid(), label, amount, taxRate: taxRate ?? null }; }
const fmt = (n) => (!n && n !== 0 ? "" : n.toLocaleString("ja-JP"));
const fmtS = (n) => (n > 0 ? `+¥${fmt(n)}` : n < 0 ? `-¥${fmt(Math.abs(n))}` : "±0");
const ROUND_OPTS = [{ l: "1円", v: 1 }, { l: "10円", v: 10 }, { l: "100円", v: 100 }, { l: "500円", v: 500 }, { l: "1000円", v: 1000 }];
const ROUND_METHODS = [{ l: "切り上げ", id: "ceil", d: "多めに集まる" }, { l: "切り捨て", id: "floor", d: "少なめに集まる" }, { l: "四捨五入", id: "round", d: "一番近い額" }];

// ─── Themes ───
const themes = {
  dark: { bg:"#0a0a0b",card:"rgba(255,255,255,0.03)",cb:"rgba(255,255,255,0.06)",text:"#e4e4e7",ts:"#a1a1aa",tm:"#71717a",td:"#52525b",tg:"#3f3f46",tdd:"#27272a",ac:"#22c55e",ab:"rgba(34,197,94,0.1)",acb:"rgba(34,197,94,0.3)",ag:"rgba(34,197,94,0.25)",acd:"#16a34a",warn:"#f59e0b",info:"#3b82f6",danger:"#ef4444",ib:"rgba(255,255,255,0.03)",ibr:"rgba(255,255,255,0.08)",gc:"rgba(34,197,94,0.02)",rb:"rgba(34,197,94,0.06)",rbr:"rgba(34,197,94,0.15)",pb:"rgba(34,197,94,0.06)",pbr:"rgba(34,197,94,0.2)",ph:"#3f3f46",pyb:"rgba(245,158,11,0.08)",pybr:"rgba(245,158,11,0.25)",advb:"rgba(255,255,255,0.015)",advbr:"rgba(255,255,255,0.04)",ov:"rgba(0,0,0,0.4)" },
  light: { bg:"#f8fafb",card:"rgba(0,0,0,0.02)",cb:"rgba(0,0,0,0.07)",text:"#18181b",ts:"#52525b",tm:"#71717a",td:"#a1a1aa",tg:"#d4d4d8",tdd:"#e4e4e7",ac:"#16a34a",ab:"rgba(22,163,74,0.08)",acb:"rgba(22,163,74,0.25)",ag:"rgba(22,163,74,0.15)",acd:"#15803d",warn:"#d97706",info:"#2563eb",danger:"#dc2626",ib:"#ffffff",ibr:"rgba(0,0,0,0.1)",gc:"rgba(22,163,74,0.03)",rb:"rgba(22,163,74,0.06)",rbr:"rgba(22,163,74,0.15)",pb:"rgba(22,163,74,0.06)",pbr:"rgba(22,163,74,0.2)",ph:"#d4d4d8",pyb:"rgba(217,119,6,0.06)",pybr:"rgba(217,119,6,0.2)",advb:"rgba(0,0,0,0.01)",advbr:"rgba(0,0,0,0.04)",ov:"rgba(255,255,255,0.6)" },
};

function AppLogo({ size = 40, t }) {
  return (<svg width={size} height={size} viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill={t.ac}/><text x="24" y="20" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="Outfit,sans-serif">W</text><line x1="12" y1="26" x2="36" y2="26" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/><text x="14" y="38" fontSize="8" fontWeight="600" fill="rgba(255,255,255,0.9)" fontFamily="'IBM Plex Mono',monospace">¥</text><text x="24" y="38" fontSize="8" fontWeight="600" fill="rgba(255,255,255,0.9)" fontFamily="'IBM Plex Mono',monospace">÷</text><text x="34" y="38" fontSize="8" fontWeight="600" fill="rgba(255,255,255,0.9)" fontFamily="'IBM Plex Mono',monospace">人</text></svg>);
}
function QRImg({ text, size = 180 }) {
  if (!text) return null;
  return <img src={`https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(text)}&choe=UTF-8`} alt="QR" width={size} height={size} style={{ borderRadius: 8 }} />;
}

// ─── Storage ───
const sGet = async (k) => { try { if (window.storage) { const r = await window.storage.get(k); if (r?.value) return r.value; } } catch {} try { return localStorage.getItem(k); } catch {} return null; };
const sSet = async (k, v) => { try { if (window.storage) await window.storage.set(k, v); } catch {} try { localStorage.setItem(k, v); } catch {} };

// ─── Main ───
export default function App() {
  // Settings (persisted)
  const [theme, setTheme] = useState("dark");
  const [taxRates, setTaxRates] = useState([0, 8, 10]);
  const [pdfShowDate, setPdfShowDate] = useState(true);
  const [pdfDateFmt, setPdfDateFmt] = useState("yyyy-MM-dd HH:mm:ss");
  const [pdfAuthorOn, setPdfAuthorOn] = useState(false);
  const [pdfAuthor, setPdfAuthor] = useState("");

  // Core
  const [total, setTotal] = useState("");
  const [taxIdx, setTaxIdx] = useState(0); // index into taxRates
  const [roundUnit, setRoundUnit] = useState(100);
  const [roundMethod, setRoundMethod] = useState("ceil");
  const [members, setMembers] = useState([mkMember("メンバー 1"), mkMember("メンバー 2")]);
  const [newName, setNewName] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [remainderAssignees, setRemainderAssignees] = useState([]);
  const [adjInputs, setAdjInputs] = useState({});

  const t = themes[theme];
  const taxRate = (taxRates[taxIdx] || 0) / 100;
  const totalRaw = parseInt((total || "0").replace(/,/g, ""), 10) || 0;
  const totalNum = taxRate > 0 ? Math.round(totalRaw * (1 + taxRate)) : totalRaw;
  const payer = members.find((m) => m.isPayer);

  // ─── Load settings & history ───
  useEffect(() => {
    (async () => {
      const raw = await sGet("warikan-v5");
      if (!raw) return;
      try {
        const d = JSON.parse(raw);
        if (d.history) setHistory(d.history);
        if (d.paymentId) setPaymentId(d.paymentId);
        if (d.theme) setTheme(d.theme);
        if (d.taxRates) setTaxRates(d.taxRates);
        if (d.pdfShowDate !== undefined) setPdfShowDate(d.pdfShowDate);
        if (d.pdfDateFmt) setPdfDateFmt(d.pdfDateFmt);
        if (d.pdfAuthorOn !== undefined) setPdfAuthorOn(d.pdfAuthorOn);
        if (d.pdfAuthor) setPdfAuthor(d.pdfAuthor);
      } catch {}
    })();
  }, []);

  const persist = (overrides = {}) => {
    const data = { history, paymentId, theme, taxRates, pdfShowDate, pdfDateFmt, pdfAuthorOn, pdfAuthor, ...overrides };
    sSet("warikan-v5", JSON.stringify(data));
  };

  // Persist on settings change
  useEffect(() => { persist(); }, [theme, taxRates, pdfShowDate, pdfDateFmt, pdfAuthorOn, pdfAuthor]);

  const saveHist = (h) => { setHistory(h); persist({ history: h }); };

  // ─── Handlers ───
  const handleTotal = (e) => { const r = e.target.value.replace(/[^0-9]/g, ""); setTotal(r ? parseInt(r, 10).toLocaleString("ja-JP") : ""); };
  const addMember = () => { setMembers((p) => [...p, mkMember(newName.trim() || `メンバー ${p.length + 1}`)]); setNewName(""); };
  const rmMember = (id) => { if (members.length <= 2) return; setMembers((p) => p.filter((m) => m.id !== id)); };
  const upMember = (id, f, v) => { setMembers((p) => p.map((m) => m.id === id ? { ...m, [f]: v } : m)); };
  const setPayerFn = (id) => {
    setMembers((p) => p.map((m) => ({ ...m, isPayer: m.id === id ? !m.isPayer : false })));
    // 支払い担当を設定したら端数おまけもデフォルトでその人に
    const wasPayer = members.find((m) => m.id === id)?.isPayer;
    if (!wasPayer) {
      setRemainderAssignees([id]);
    } else {
      setRemainderAssignees([]);
    }
  };

  const addAdj = (mid, label, amount, itemTaxRate) => {
    setMembers((p) => p.map((m) => m.id === mid ? { ...m, adjustItems: [...m.adjustItems, mkItem(label, amount, itemTaxRate)] } : m));
  };
  const rmAdj = (mid, iid) => {
    setMembers((p) => p.map((m) => m.id === mid ? { ...m, adjustItems: m.adjustItems.filter((i) => i.id !== iid) } : m));
  };

  // ─── Rounding ───
  const applyR = (v) => {
    if (roundMethod === "ceil") return Math.ceil(v / roundUnit) * roundUnit;
    if (roundMethod === "floor") return Math.floor(v / roundUnit) * roundUnit;
    return Math.round(v / roundUnit) * roundUnit;
  };

  // ─── Core Calculation ───
  // 1. Sum all adjust items (with individual tax if set)
  // 2. Subtract from total → shared pool
  // 3. Divide shared pool by weight
  // 4. Add each member's adjust items back to their share
  const calculate = useCallback(() => {
    if (members.length === 0 || totalNum <= 0) return [];

    // Each member's total adjustment (with per-item tax applied)
    const memberAdj = members.map((m) => {
      const adjTotal = m.adjustItems.reduce((s, it) => {
        const itemTax = it.taxRate !== null ? it.taxRate / 100 : 0;
        const withTax = itemTax > 0 ? Math.round(it.amount * (1 + itemTax)) : it.amount;
        return s + withTax;
      }, 0);
      return { ...m, adjTotal };
    });

    const allAdjSum = memberAdj.reduce((s, m) => s + m.adjTotal, 0);
    const sharedPool = totalNum - allAdjSum;
    const totalWeight = memberAdj.reduce((s, m) => s + m.weight, 0);

    let splits = memberAdj.map((m) => {
      const shareOfPool = (sharedPool * m.weight) / totalWeight;
      const finalAmount = shareOfPool + m.adjTotal;
      return { ...m, amount: applyR(finalAmount), shareOfPool: applyR(shareOfPool) };
    });

    return splits;
  }, [members, totalNum, roundUnit, roundMethod]);

  const splits = calculate();
  const grandTotal = splits.reduce((s, x) => s + x.amount, 0);
  const paidCount = members.filter((m) => m.paid).length;
  const canCalc = totalNum > 0;
  // 共通支払額（個別調整を除いた1人あたりのベース額）
  const allAdjSum = members.reduce((s, m) => m.adjustItems.reduce((ss, it) => { const ix = it.taxRate !== null ? it.taxRate / 100 : 0; return ss + (ix > 0 ? Math.round(it.amount * (1 + ix)) : it.amount); }, s), 0);
  const sharedPool = totalNum - allAdjSum;
  const totalWeight = members.reduce((s, m) => s + m.weight, 0);
  const basePerPerson = canCalc && totalWeight > 0 ? applyR(sharedPool / totalWeight) : 0;
  const hasAnyAdj = members.some((m) => m.adjustItems.length > 0);
  const hasWeightDiff = members.some((m) => m.weight !== 1);
  // 丸めによる差額（端数）
  const rawRemainder = canCalc ? grandTotal - totalNum : 0;

  // 端数おまけ
  const validAsgn = remainderAssignees.filter((id) => splits.some((s) => s.id === id));
  const adjSplits = (rawRemainder !== 0 && validAsgn.length > 0) ? (() => {
    const pp = Math.floor(rawRemainder / validAsgn.length);
    const lo = rawRemainder - pp * validAsgn.length;
    let c = 0;
    return splits.map((s) => {
      if (validAsgn.includes(s.id)) { const ex = c < lo ? 1 : 0; c++; return { ...s, amount: s.amount - pp - ex, omake: true }; }
      return s;
    });
  })() : splits;
  const adjGrand = adjSplits.reduce((s, x) => s + x.amount, 0);
  const remainder = canCalc ? adjGrand - totalNum : 0;

  const toggleAsgn = (id) => { setRemainderAssignees((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]); };

  // ─── Date formatting ───
  const formatDate = (d, f) => {
    const pad = (n, len = 2) => String(n).padStart(len, "0");
    return f.replace("yyyy", d.getFullYear()).replace("MM", pad(d.getMonth() + 1)).replace("dd", pad(d.getDate())).replace("HH", pad(d.getHours())).replace("mm", pad(d.getMinutes())).replace("ss", pad(d.getSeconds()));
  };

  // ─── History ───
  const saveToHist = () => {
    const e = { id: gid(), date: new Date().toISOString(), total: totalNum, mc: members.length, splits: adjSplits.map((s) => ({ name: s.name, amount: s.amount, isPayer: s.isPayer })) };
    saveHist([e, ...history].slice(0, 20));
  };
  const loadHist = (e) => { setShowHistory(false); setShowResult(false); setTotal(fmt(e.total)); setMembers(e.splits.map((s) => { const m = mkMember(s.name); m.isPayer = s.isPayer || false; return m; })); };

  // ─── Share text ───
  const shareText = () => {
    let tx = `💰 割り勘結果\n━━━━━━━━━━━━\n合計: ¥${fmt(totalNum)}`;
    if (taxRate > 0) tx += ` (税${Math.round(taxRate * 100)}%込)`;
    tx += `\n人数: ${members.length}人`;
    if (payer) tx += `\n支払者: ${payer.name}`;
    tx += `\n━━━━━━━━━━━━\n`;
    adjSplits.forEach((s) => {
      const isP = s.isPayer && !!payer;
      if (isP) { const rv = adjSplits.filter((x) => !x.isPayer).reduce((a, x) => a + x.amount, 0); tx += `👑 ${s.name}: ¥${fmt(rv)} 受取 (自分: ¥${fmt(s.amount)})\n`; }
      else if (payer) tx += `${s.name}: ¥${fmt(s.amount)} → ${payer.name}\n`;
      else tx += `${s.name}: ¥${fmt(s.amount)}${s.adjTotal ? ` (個別: ${fmtS(s.adjTotal)})` : ""}\n`;
    });
    if (remainder !== 0) tx += `\n端数: ${fmtS(remainder)}\n`;
    if (paymentId) tx += `\n💳 送金先: ${paymentId}\n`;
    tx += `━━━━━━━━━━━━\nZero to Ship`;
    return tx;
  };
  const handleCopy = async () => { try { await navigator.clipboard.writeText(shareText()); setCopiedMsg(true); setTimeout(() => setCopiedMsg(false), 2000); } catch {} };
  const handleReset = () => { setShowResult(false); setTotal(""); setMembers([mkMember("メンバー 1"), mkMember("メンバー 2")]); setTaxIdx(0); setAdjInputs({}); setRemainderAssignees([]); };

  // ─── PDF ───
  const handlePDF = () => {
    const now = new Date();
    const dateStr = pdfShowDate ? formatDate(now, pdfDateFmt) : "";
    let rows = "";
    adjSplits.forEach((s) => {
      const isP = s.isPayer && !!payer;
      const rv = isP ? adjSplits.filter((x) => !x.isPayer).reduce((a, x) => a + x.amount, 0) : 0;
      const adjStr = s.adjustItems.length > 0 ? s.adjustItems.map((i) => `${i.label}(${fmtS(i.amount)})`).join(", ") : "";
      rows += `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px">${isP ? "👑 " : ""}${s.name}${s.weight !== 1 ? ` [比重${s.weight}]` : ""}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;text-align:right;font-weight:bold">¥${s.amount.toLocaleString()}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:11px;color:#6b7280">${isP ? `受取: ¥${rv.toLocaleString()}` : payer ? `→ ${payer.name}` : ""}${adjStr ? (payer ? " / " : "") + adjStr : ""}</td></tr>`;
    });
    const qr = paymentId ? `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(paymentId)}&choe=UTF-8` : "";
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:24mm}body{font-family:"Helvetica Neue","Noto Sans JP",sans-serif;color:#111;margin:0;padding:40px}h1{font-size:24px;margin:0 0 4px}.sub{font-size:12px;color:#6b7280;margin-bottom:24px}.summary{display:flex;gap:32px;margin-bottom:24px;padding:16px;background:#f9fafb;border-radius:8px}.summary div{text-align:center}.summary .label{font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px}.summary .value{font-size:22px;font-weight:bold;margin-top:2px}table{width:100%;border-collapse:collapse}th{text-align:left;padding:8px 12px;border-bottom:2px solid #111;font-size:11px;text-transform:uppercase;color:#6b7280}th:nth-child(2){text-align:right}.total-row td{padding:10px 12px;border-top:2px solid #111;font-weight:bold;font-size:15px}.qr-section{margin:24px 0;padding:20px;background:#f9fafb;border-radius:8px;display:flex;align-items:center;gap:20px}.footer{margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:10px;color:#9ca3af;display:flex;justify-content:space-between}</style></head><body><h1>💰 割り勘結果</h1><div class="sub">${dateStr}${pdfAuthorOn && pdfAuthor ? ` · 作成者: ${pdfAuthor}` : ""}${taxRate > 0 ? ` · 税${Math.round(taxRate * 100)}%` : ""}</div><div class="summary"><div><div class="label">合計</div><div class="value" style="color:#16a34a">¥${totalNum.toLocaleString()}</div></div><div><div class="label">支払合計</div><div class="value">¥${adjGrand.toLocaleString()}</div></div><div><div class="label">人数</div><div class="value">${members.length}人</div></div>${payer ? `<div><div class="label">支払者</div><div class="value" style="font-size:16px">👑 ${payer.name}</div></div>` : ""}${remainder !== 0 ? `<div><div class="label">差額</div><div class="value" style="font-size:16px;color:${remainder > 0 ? "#16a34a" : "#dc2626"}">${fmtS(remainder)}</div></div>` : ""}</div><table><thead><tr><th>名前</th><th>支払額</th><th>備考</th></tr></thead><tbody>${rows}<tr class="total-row"><td>合計</td><td style="text-align:right">¥${adjGrand.toLocaleString()}</td><td></td></tr></tbody></table>${paymentId ? `<div class="qr-section"><img src="${qr}" width="120" height="120" style="border-radius:6px"/><div style="flex:1"><h3 style="margin:0 0 4px;font-size:14px">💳 送金先</h3>${paymentId.startsWith("http") ? `<a href="${paymentId}" target="_blank" style="display:inline-block;margin-top:8px;padding:6px 14px;background:#16a34a;color:#fff;border-radius:6px;text-decoration:none;font-size:12px;font-weight:bold">送金ページを開く →</a>` : `<p style="font-weight:bold;margin-top:8px">${paymentId}</p>`}</div></div>` : ""}<div class="footer"><span>Zero to Ship — Split Bill Calculator</span></div></body></html>`;
    const w = window.open(URL.createObjectURL(new Blob([html], { type: "text/html" })), "_blank");
    if (w) w.onload = () => setTimeout(() => w.print(), 500);
  };

  // ─── Styles ───
  const sL = { display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.td, letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" };
  const sC = (on) => ({ padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans JP',sans-serif", transition: "all 0.2s", border: on ? `1.5px solid ${t.acb}` : `1.5px solid ${t.cb}`, background: on ? t.ab : t.card, color: on ? t.ac : t.tm });
  const sS = (d) => ({ marginBottom: 28, animation: `fadeUp 0.5s ease ${d}s both` });

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Noto Sans JP',sans-serif", color: t.text, transition: "background 0.4s,color 0.4s" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&family=Outfit:wght@400;600;700;900&display=swap" rel="stylesheet" />
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes checkPop{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}input:focus{outline:none}input::placeholder{color:${t.ph}}`}</style>
      <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${t.gc} 1px,transparent 1px),linear-gradient(90deg,${t.gc} 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />

      <div style={{ position: "relative", maxWidth: 480, margin: "0 auto", padding: "32px 16px 100px" }}>

        {/* Header */}
        <header style={{ marginBottom: 32, animation: "fadeUp 0.5s ease both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <a href="#" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.ac, textDecoration: "none", letterSpacing: 1 }}>← Zero to Ship</a>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => setShowHistory(!showHistory)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${t.cb}`, background: t.card, color: t.tm, fontSize: 11, cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace" }}>📋{history.length > 0 && ` ${history.length}`}</button>
              <button onClick={() => setShowSettings(!showSettings)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${t.cb}`, background: t.card, color: t.tm, fontSize: 11, cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace" }}>⚙️</button>
              <button onClick={() => { const nxt = theme === "dark" ? "light" : "dark"; setTheme(nxt); persist({ theme: nxt }); }} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.cb}`, background: t.card, color: t.ts, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{theme === "dark" ? "☀️" : "🌙"}</button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <AppLogo size={44} t={t} />
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 26, fontWeight: 900, margin: 0, color: t.text }}>割り勘計算機</h1>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.tg }}>v5.0</span>
              </div>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.td, marginTop: 2, marginBottom: 0 }}>Split Bill Calculator</p>
            </div>
          </div>
        </header>

        {/* Settings Panel */}
        {showSettings && (
          <section style={{ marginBottom: 28, background: t.advb, border: `1px solid ${t.advbr}`, borderRadius: 12, padding: 16, animation: "fadeUp 0.3s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ ...sL, margin: 0, color: t.ac }}>Settings</h2>
              <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", color: t.tg, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>

            {/* Tax rates */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: t.td, fontFamily: "'IBM Plex Mono',monospace", display: "block", marginBottom: 6 }}>税率設定（%）— カンマ区切りで入力</label>
              <input type="text" value={taxRates.join(", ")} onChange={(e) => { const arr = e.target.value.split(",").map((x) => parseInt(x.trim(), 10)).filter((x) => !isNaN(x) && x >= 0); if (arr.length > 0) { setTaxRates(arr); persist({ taxRates: arr }); } }} style={{ width: "100%", padding: "8px 12px", fontSize: 13, color: t.text, background: t.ib, border: `1px solid ${t.ibr}`, borderRadius: 8, fontFamily: "'IBM Plex Mono',monospace", boxSizing: "border-box" }} />
              <div style={{ fontSize: 10, color: t.tg, marginTop: 4 }}>例: 0, 8, 10 → 税込み / 8% / 10% の選択肢になります</div>
            </div>

            {/* PDF date format */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: t.td, fontFamily: "'IBM Plex Mono',monospace", display: "block", marginBottom: 6 }}>PDF 日時フォーマット</label>
              <input type="text" value={pdfDateFmt} onChange={(e) => setPdfDateFmt(e.target.value)} style={{ width: "100%", padding: "8px 12px", fontSize: 13, color: t.text, background: t.ib, border: `1px solid ${t.ibr}`, borderRadius: 8, fontFamily: "'IBM Plex Mono',monospace", boxSizing: "border-box" }} />
              <div style={{ fontSize: 9, color: t.tg, marginTop: 4 }}>yyyy=年 MM=月 dd=日 HH=時 mm=分 ss=秒</div>
            </div>
          </section>
        )}

        {/* History */}
        {showHistory && (
          <section style={{ marginBottom: 28, animation: "fadeUp 0.3s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <h2 style={{ ...sL, margin: 0, color: t.ac }}>History</h2>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${t.acb},transparent)` }} />
            </div>
            {history.length === 0 ? <div style={{ textAlign: "center", padding: 32, color: t.tg, fontSize: 13 }}>まだ履歴がありません</div> : history.map((h) => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, background: t.card, border: `1px solid ${t.cb}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", marginBottom: 6 }} onClick={() => loadHist(h)}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>¥{fmt(h.total)}<span style={{ fontSize: 11, color: t.td, marginLeft: 8 }}>{h.mc}人</span></div>
                  <div style={{ fontSize: 10, color: t.tg, fontFamily: "'IBM Plex Mono',monospace", marginTop: 2 }}>{new Date(h.date).toLocaleDateString("ja-JP")} {new Date(h.date).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); saveHist(history.filter((x) => x.id !== h.id)); }} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", color: t.tg, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            ))}
          </section>
        )}

        {/* Tax */}
        <section style={sS(0.05)}>
          <label style={sL}>Tax</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {taxRates.map((r, i) => <button key={i} onClick={() => setTaxIdx(i)} style={sC(taxIdx === i)}>{r === 0 ? "税込み" : `税抜(${r}%)`}</button>)}
          </div>
        </section>

        {/* Total */}
        <section style={sS(0.1)}>
          <label style={sL}>合計金額{taxRate > 0 && <span style={{ color: t.ac, marginLeft: 8, letterSpacing: 0 }}>+{Math.round(taxRate * 100)}% = ¥{fmt(totalNum)}</span>}</label>
          <div style={{ position: "relative", background: t.ib, border: `1px solid ${t.ibr}`, borderRadius: 12, overflow: "hidden" }}>
            <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 24, fontWeight: 700, color: t.ac, fontFamily: "'Outfit',sans-serif" }}>¥</span>
            <input type="text" inputMode="numeric" value={total} onChange={handleTotal} placeholder="0" style={{ width: "100%", padding: "20px 18px 20px 48px", fontSize: 32, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: t.text, background: "transparent", border: "none", boxSizing: "border-box" }} />
          </div>
        </section>

        {/* Rounding */}
        <section style={sS(0.15)}>
          <label style={sL}>端数処理</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {ROUND_OPTS.map((o) => <button key={o.v} onClick={() => setRoundUnit(o.v)} style={sC(roundUnit === o.v)}>{o.l}</button>)}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ROUND_METHODS.map((r) => <button key={r.id} onClick={() => setRoundMethod(r.id)} style={{ ...sC(roundMethod === r.id), display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 16px" }}><span>{r.l}</span><span style={{ fontSize: 9, opacity: 0.6, fontWeight: 400 }}>{r.d}</span></button>)}
          </div>
        </section>

        {/* Members */}
        <section style={sS(0.2)}>
          <label style={sL}>メンバー ({members.length}){payer && <span style={{ color: t.warn, marginLeft: 8, letterSpacing: 0 }}>👑 {payer.name}</span>}</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {members.map((m, idx) => {
              const adjSum = m.adjustItems.reduce((s, it) => { const itx = it.taxRate !== null ? it.taxRate / 100 : 0; return s + (itx > 0 ? Math.round(it.amount * (1 + itx)) : it.amount); }, 0);
              return (
                <div key={m.id} style={{ background: m.isPayer ? t.pyb : t.card, border: `1px solid ${m.isPayer ? t.pybr : t.cb}`, borderRadius: 12, padding: "10px 12px", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: t.tg, minWidth: 18 }}>{String(idx + 1).padStart(2, "0")}</span>
                    <button onClick={() => setPayerFn(m.id)} style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: m.isPayer ? "rgba(245,158,11,0.2)" : "transparent", color: m.isPayer ? t.warn : t.tg, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>👑</button>
                    <input type="text" value={m.name} onChange={(e) => upMember(m.id, "name", e.target.value)} style={{ flex: 1, padding: "6px 4px", fontSize: 14, color: t.text, background: "transparent", border: "none", fontFamily: "'Noto Sans JP',sans-serif", minWidth: 0 }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 3, background: t.ov, borderRadius: 8, padding: "2px 4px" }}>
                      <button onClick={() => upMember(m.id, "weight", Math.max(1, m.weight - 1))} style={{ width: 24, height: 24, borderRadius: 5, border: "none", background: "transparent", color: t.tm, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, fontWeight: 600, color: m.weight > 1 ? t.warn : t.tm, minWidth: 20, textAlign: "center" }}>{m.weight}</span>
                      <button onClick={() => upMember(m.id, "weight", Math.min(10, m.weight + 1))} style={{ width: 24, height: 24, borderRadius: 5, border: "none", background: "transparent", color: t.tm, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                    <button onClick={() => rmMember(m.id)} disabled={members.length <= 2} style={{ width: 24, height: 24, borderRadius: 5, border: "none", background: "transparent", color: members.length <= 2 ? t.tdd : t.td, fontSize: 12, cursor: members.length <= 2 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                  </div>
                  {m.weight !== 1 && <div style={{ marginLeft: 50, marginTop: 4, fontSize: 10, color: t.warn, fontFamily: "'IBM Plex Mono',monospace" }}>比重 {m.weight}</div>}

                  {/* Adjust items */}
                  {m.adjustItems.length > 0 && (
                    <div style={{ marginLeft: 50, marginTop: 6 }}>
                      {m.adjustItems.map((it) => {
                        const itx = it.taxRate !== null ? it.taxRate / 100 : 0;
                        const withTax = itx > 0 ? Math.round(it.amount * (1 + itx)) : it.amount;
                        return (
                          <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", fontSize: 11 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: it.amount >= 0 ? t.info : t.danger, flexShrink: 0 }} />
                            <span style={{ color: t.ts, flex: 1 }}>{it.label}</span>
                            <span style={{ color: it.amount >= 0 ? t.info : t.danger, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600 }}>{fmtS(it.amount)}</span>
                            {it.taxRate !== null && <span style={{ fontSize: 9, color: t.tg }}>税{it.taxRate}%→{fmtS(withTax)}</span>}
                            <button onClick={() => rmAdj(m.id, it.id)} style={{ width: 18, height: 18, borderRadius: 4, border: "none", background: "transparent", color: t.tg, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                          </div>
                        );
                      })}
                      <div style={{ fontSize: 10, fontFamily: "'IBM Plex Mono',monospace", color: adjSum >= 0 ? t.info : t.danger, borderTop: `1px dashed ${t.cb}`, paddingTop: 3, marginTop: 3 }}>個別調整合計: {fmtS(adjSum)}</div>
                    </div>
                  )}

                  {/* Add adjust */}
                  <div style={{ marginLeft: 50, marginTop: 6, display: "flex", gap: 5 }}>
                    <input type="text" placeholder="項目名" value={adjInputs[m.id]?.l || ""} onChange={(e) => setAdjInputs(p => ({ ...p, [m.id]: { ...p[m.id], l: e.target.value } }))} style={{ flex: 1, padding: "5px 8px", fontSize: 11, color: t.text, background: t.ib, border: `1px dashed ${t.cb}`, borderRadius: 6, fontFamily: "'Noto Sans JP',sans-serif", minWidth: 0 }} />
                    <input type="text" inputMode="numeric" placeholder="±金額" value={adjInputs[m.id]?.a || ""} onChange={(e) => setAdjInputs(p => ({ ...p, [m.id]: { ...p[m.id], a: e.target.value.replace(/[^0-9\-]/g, "") } }))} style={{ width: 60, padding: "5px 8px", fontSize: 11, color: t.text, background: t.ib, border: `1px dashed ${t.cb}`, borderRadius: 6, fontFamily: "'IBM Plex Mono',monospace", textAlign: "right" }} />
                    <select value={adjInputs[m.id]?.t ?? ""} onChange={(e) => setAdjInputs(p => ({ ...p, [m.id]: { ...p[m.id], t: e.target.value } }))} style={{ width: 54, padding: "5px 4px", fontSize: 10, color: t.text, background: t.ib, border: `1px dashed ${t.cb}`, borderRadius: 6, fontFamily: "'IBM Plex Mono',monospace" }}>
                      <option value="">税なし</option>
                      {taxRates.filter((r) => r > 0).map((r) => <option key={r} value={r}>{r}%</option>)}
                    </select>
                    <button onClick={() => { const inp = adjInputs[m.id]; const amt = parseInt(inp?.a, 10); if (amt) { addAdj(m.id, inp.l || "調整", amt, inp?.t ? parseInt(inp.t, 10) : null); setAdjInputs(p => ({ ...p, [m.id]: { l: "", a: "", t: "" } })); } }} style={{ padding: "5px 8px", borderRadius: 6, border: `1px dashed ${t.acb}`, background: t.ab, color: t.ac, fontSize: 10, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>±</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addMember()} placeholder={`メンバー ${members.length + 1}`} style={{ flex: 1, padding: "10px 14px", fontSize: 13, color: t.text, background: t.card, border: `1px dashed ${t.cb}`, borderRadius: 10, fontFamily: "'Noto Sans JP',sans-serif" }} />
            <button onClick={addMember} style={{ padding: "10px 18px", borderRadius: 10, border: `1px dashed ${t.acb}`, background: t.ab, color: t.ac, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans JP',sans-serif", whiteSpace: "nowrap" }}>+ 追加</button>
          </div>
        </section>

        {/* Advanced */}
        <section style={sS(0.25)}>
          <button onClick={() => setShowAdvanced(!showAdvanced)} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1px solid ${t.advbr}`, background: t.advb, color: t.tm, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans JP',sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>⚙️ 詳細設定</span><span style={{ fontSize: 10, transform: showAdvanced ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
          </button>
          {showAdvanced && (
            <div style={{ marginTop: 14, padding: 16, background: t.advb, border: `1px solid ${t.advbr}`, borderRadius: 10, animation: "fadeUp 0.3s ease both" }}>
              <label style={sL}>💳 送金先URL / QR決済</label>
              <p style={{ fontSize: 11, color: t.td, margin: "0 0 8px", lineHeight: 1.7 }}>送金用URLを入力すると結果画面にQRコードとリンクが表示されます。</p>
              <input type="text" placeholder="https://pay.paypay.ne.jp/xxxxx" value={paymentId} onChange={(e) => { setPaymentId(e.target.value); persist({ paymentId: e.target.value }); }} style={{ width: "100%", padding: "10px 14px", fontSize: 13, color: t.text, background: t.ib, border: `1px solid ${t.ibr}`, borderRadius: 8, fontFamily: "'IBM Plex Mono',monospace", boxSizing: "border-box" }} />
              {paymentId && <div style={{ marginTop: 10, padding: 12, background: t.card, borderRadius: 8, border: `1px solid ${t.cb}`, display: "flex", alignItems: "center", gap: 12 }}><QRImg text={paymentId} size={64} /><div style={{ flex: 1, fontSize: 11, color: t.td }}><div style={{ fontWeight: 600, color: t.ac, marginBottom: 2 }}>プレビュー</div>結果画面とPDFに表示されます</div></div>}

              {/* PDF options */}
              <div style={{ marginTop: 20 }}>
                <label style={sL}>📄 PDF出力オプション</label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: t.ts, cursor: "pointer", marginBottom: 8 }}>
                  <input type="checkbox" checked={pdfShowDate} onChange={(e) => setPdfShowDate(e.target.checked)} /> 作成日時を含める
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: t.ts, cursor: "pointer", marginBottom: 8 }}>
                  <input type="checkbox" checked={pdfAuthorOn} onChange={(e) => setPdfAuthorOn(e.target.checked)} /> 作成者名を含める
                </label>
                {pdfAuthorOn && (
                  <div style={{ marginLeft: 24 }}>
                    <input type="text" value={pdfAuthor} onChange={(e) => setPdfAuthor(e.target.value)} placeholder="名前を入力" style={{ width: "100%", padding: "6px 10px", fontSize: 12, color: t.text, background: t.ib, border: `1px solid ${t.ibr}`, borderRadius: 6, fontFamily: "'Noto Sans JP',sans-serif", boxSizing: "border-box" }} />
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Calculate */}
        <button onClick={() => setShowResult(true)} disabled={!canCalc} style={{ width: "100%", padding: "16px", borderRadius: 12, border: "none", background: canCalc ? `linear-gradient(135deg,${t.acd},${t.ac})` : t.card, color: canCalc ? "#fff" : t.tg, fontSize: 16, fontWeight: 700, cursor: canCalc ? "pointer" : "not-allowed", fontFamily: "'Noto Sans JP',sans-serif", transition: "all 0.3s", marginBottom: 24, boxShadow: canCalc ? `0 4px 24px ${t.ag}` : "none" }}>
          {canCalc ? "計算する" : "金額を入力してください"}
        </button>

        {/* Results */}
        {showResult && canCalc && adjSplits.length > 0 && (
          <section style={{ animation: "fadeUp 0.4s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 2, color: t.ac, textTransform: "uppercase", margin: 0 }}>Result</h2>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${t.acb},transparent)` }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, background: t.rb, border: `1px solid ${t.rbr}`, borderRadius: 10, padding: "14px 18px", marginBottom: 14 }}>
              <div><div style={{ fontSize: 10, color: t.td, fontFamily: "'IBM Plex Mono',monospace" }}>合計</div><div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: t.ac }}>¥{fmt(totalNum)}</div></div>
              {!hasWeightDiff && <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: t.td, fontFamily: "'IBM Plex Mono',monospace" }}>共通/人</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: t.text }}>¥{fmt(basePerPerson)}</div></div>}
              {hasWeightDiff && <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: t.td, fontFamily: "'IBM Plex Mono',monospace" }}>共通(比重1)</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: t.text }}>¥{fmt(basePerPerson)}</div></div>}
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: t.td, fontFamily: "'IBM Plex Mono',monospace" }}>支払合計</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: adjGrand !== totalNum ? t.warn : t.ts }}>¥{fmt(adjGrand)}</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: t.td, fontFamily: "'IBM Plex Mono',monospace" }}>人数</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: t.text }}>{members.length}</div></div>
              {payer && <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: t.td, fontFamily: "'IBM Plex Mono',monospace" }}>支払者</div><div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: t.warn }}>👑 {payer.name}</div></div>}
            </div>

            {/* 共通支払額の内訳説明 */}
            {hasAnyAdj && (
              <div style={{ background: t.card, border: `1px solid ${t.cb}`, borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 11, fontFamily: "'IBM Plex Mono',monospace", color: t.td }}>
                共通プール: ¥{fmt(totalNum)} - 個別調整合計 ¥{fmt(allAdjSum)} = <span style={{ color: t.ac, fontWeight: 600 }}>¥{fmt(sharedPool)}</span>{hasWeightDiff ? ` (比重1あたり ¥${fmt(basePerPerson)})` : ` (÷${members.length}人 = ¥${fmt(basePerPerson)}/人)`}
              </div>
            )}

            {/* 端数おまけ */}
            {rawRemainder !== 0 && (
              <div style={{ background: t.card, border: `1px solid ${t.cb}`, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: validAsgn.length > 0 ? 4 : 8 }}>
                  <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", color: rawRemainder > 0 ? t.ac : t.danger }}>端数: {fmtS(rawRemainder)}</div>
                  {validAsgn.length > 0 && <div style={{ fontSize: 10, color: t.ac, fontFamily: "'IBM Plex Mono',monospace" }}>✓ {validAsgn.length}人に割当 → 差額 {remainder === 0 ? "±0" : fmtS(remainder)}</div>}
                </div>
                <div style={{ fontSize: 11, color: t.td, marginBottom: 8 }}>端数おまけ: タップで負担する人を選択（複数可）</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {members.map((m) => { const on = remainderAssignees.includes(m.id); return <button key={m.id} onClick={() => toggleAsgn(m.id)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans JP',sans-serif", border: on ? `1.5px solid ${t.acb}` : `1.5px solid ${t.cb}`, background: on ? t.ab : "transparent", color: on ? t.ac : t.tm }}>{on ? "✓ " : ""}{m.name}</button>; })}
                </div>
              </div>
            )}

            {/* Per-person */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
              {adjSplits.map((s, i) => {
                const isP = s.isPayer && !!payer;
                const recv = isP ? adjSplits.filter((x) => !x.isPayer).reduce((a, x) => a + x.amount, 0) : 0;
                return (
                  <div key={s.id} onClick={() => !payer && upMember(s.id, "paid", !s.paid)} style={{ display: "flex", alignItems: "center", gap: 12, background: isP ? t.pyb : s.paid ? t.pb : t.card, border: `1px solid ${isP ? t.pybr : s.paid ? t.pbr : t.cb}`, borderRadius: 10, padding: "14px 16px", cursor: payer ? "default" : "pointer", transition: "all 0.25s", animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
                    {isP ? <div style={{ fontSize: 18, width: 24, textAlign: "center" }}>👑</div> : !payer ? <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${s.paid ? t.ac : t.tg}`, background: s.paid ? t.ac : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0, animation: s.paid ? "checkPop 0.3s ease" : "none" }}>{s.paid && "✓"}</div> : <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${t.tg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: t.td, flexShrink: 0 }}>→</div>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: s.paid && !payer ? t.tm : t.text, textDecoration: s.paid && !payer ? "line-through" : "none" }}>
                        {s.name}
                        {s.weight !== 1 && <span style={{ fontSize: 10, color: t.warn, marginLeft: 6, fontFamily: "'IBM Plex Mono',monospace" }}>比重{s.weight}</span>}
                        {s.omake && <span style={{ fontSize: 9, color: t.warn, marginLeft: 6, fontFamily: "'IBM Plex Mono',monospace", background: "rgba(245,158,11,0.1)", padding: "1px 6px", borderRadius: 4 }}>端数負担</span>}
                      </div>
                      {isP && <div style={{ fontSize: 10, color: t.warn, fontFamily: "'IBM Plex Mono',monospace", marginTop: 2 }}>支払い担当（¥{fmt(recv)} 受け取り）</div>}
                      {payer && !isP && <div style={{ fontSize: 10, color: t.td, fontFamily: "'IBM Plex Mono',monospace", marginTop: 2 }}>→ {payer.name}へ送金</div>}
                      {s.adjTotal !== 0 && <div style={{ fontSize: 10, color: s.adjTotal > 0 ? t.info : t.danger, fontFamily: "'IBM Plex Mono',monospace", marginTop: 2 }}>個別調整: {fmtS(s.adjTotal)}</div>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: isP ? t.warn : (s.paid && !payer) ? t.td : t.text }}>¥{fmt(s.amount)}</div>
                      <div style={{ fontSize: 10, color: t.td, fontFamily: "'IBM Plex Mono',monospace" }}>支払額</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!payer && <div style={{ textAlign: "center", fontSize: 11, color: t.tg, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 20 }}>↑ タップで支払い済みにチェック</div>}

            {paymentId && (
              <div style={{ background: t.card, border: `1px solid ${t.cb}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono',monospace", color: t.td, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>💳 送金先</div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ background: "#fff", borderRadius: 8, padding: 6, flexShrink: 0 }}><QRImg text={paymentId} size={120} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 8 }}>QRコードをスキャン</div>
                    {paymentId.startsWith("http") ? <a href={paymentId} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "8px 16px", borderRadius: 8, background: `linear-gradient(135deg,${t.acd},${t.ac})`, color: "#fff", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>送金ページを開く →</a> : <div style={{ fontSize: 12, color: t.ac, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, wordBreak: "break-all" }}>{paymentId}</div>}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => { handleCopy(); saveToHist(); }} style={{ flex: 1, minWidth: 140, padding: "14px", borderRadius: 10, border: `1px solid ${t.cb}`, background: t.card, color: t.ts, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans JP',sans-serif" }}>{copiedMsg ? "✓ 保存&コピー済み！" : "📋 保存&コピー"}</button>
              <button onClick={handlePDF} style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${t.cb}`, background: t.card, color: t.ts, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans JP',sans-serif" }}>📄 PDF</button>
              <button onClick={handleReset} style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${t.cb}`, background: t.card, color: t.tm, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans JP',sans-serif" }}>リセット</button>
            </div>
          </section>
        )}

        <div style={{ marginTop: 60 }} />
      </div>
    </div>
  );
}
