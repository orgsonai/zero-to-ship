import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";

const themes = {
  dark: { bg:"#0a0a0b",card:"rgba(255,255,255,0.03)",cb:"rgba(255,255,255,0.06)",text:"#e4e4e7",ts:"#a1a1aa",tm:"#71717a",td:"#52525b",tg:"#3f3f46",ac:"#22c55e",ab:"rgba(34,197,94,0.1)",acb:"rgba(34,197,94,0.3)",acd:"#16a34a",gc:"rgba(34,197,94,0.02)" },
  light: { bg:"#f8fafb",card:"rgba(0,0,0,0.02)",cb:"rgba(0,0,0,0.07)",text:"#18181b",ts:"#52525b",tm:"#71717a",td:"#a1a1aa",tg:"#d4d4d8",ac:"#16a34a",ab:"rgba(22,163,74,0.08)",acb:"rgba(22,163,74,0.25)",acd:"#15803d",gc:"rgba(22,163,74,0.03)" },
};

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const t = themes[theme];

  return (
    <>
      <Head><title>Zero to Ship</title></Head>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes typing{from{width:0}to{width:100%}}@keyframes blink{50%{border-color:transparent}}a{text-decoration:none}`}</style>
      <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Noto Sans JP',sans-serif", color: t.text, transition: "background 0.4s" }}>
        <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${t.gc} 1px,transparent 1px),linear-gradient(90deg,${t.gc} 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto", padding: "60px 20px 100px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 40 }}>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.cb}`, background: t.card, color: t.ts, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{theme === "dark" ? "☀️" : "🌙"}</button>
          </div>

          {/* Terminal-style title */}
          <div style={{ animation: "fadeUp 0.6s ease both", marginBottom: 48 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: t.ac, marginBottom: 8 }}>$ npx create-next-app</div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 48, fontWeight: 900, color: t.text, lineHeight: 1.1, marginBottom: 12 }}>Zero to Ship</h1>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: t.td, lineHeight: 1.8 }}>
              プログラミング未経験者が、AIの力だけでアプリを作って公開していく開発日誌。
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 24, marginBottom: 48, animation: "fadeUp 0.6s ease 0.1s both" }}>
            <div style={{ padding: "16px 24px", background: t.card, border: `1px solid ${t.cb}`, borderRadius: 12 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 32, fontWeight: 900, color: t.ac }}>1</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.td, letterSpacing: 1 }}>APPS SHIPPED</div>
            </div>
            <div style={{ padding: "16px 24px", background: t.card, border: `1px solid ${t.cb}`, borderRadius: 12 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 32, fontWeight: 900, color: t.text }}>1</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.td, letterSpacing: 1 }}>BLOG POSTS</div>
            </div>
          </div>

          {/* Apps */}
          <section style={{ marginBottom: 48, animation: "fadeUp 0.6s ease 0.2s both" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.td, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Apps</div>
            <Link href="/apps/warikan">
              <div style={{ padding: "20px 24px", background: t.card, border: `1px solid ${t.cb}`, borderRadius: 12, cursor: "pointer", transition: "border-color 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>💰 割り勘計算機 <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: t.ac, background: t.ab, padding: "2px 8px", borderRadius: 4, marginLeft: 8 }}>LIVE</span></div>
                  <div style={{ fontSize: 12, color: t.td }}>比重・個別調整・税込/税抜・QR決済対応の割り勘アプリ</div>
                </div>
                <span style={{ color: t.tg, fontSize: 18 }}>→</span>
              </div>
            </Link>
          </section>

          {/* Blog */}
          <section style={{ animation: "fadeUp 0.6s ease 0.3s both" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.td, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Blog</div>
            <Link href="/blog/001">
              <div style={{ padding: "16px 24px", background: t.card, border: `1px solid ${t.cb}`, borderRadius: 12, cursor: "pointer", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>001 — Zero to Ship、はじめました。</div>
                <div style={{ fontSize: 11, color: t.tg, fontFamily: "'IBM Plex Mono',monospace", marginTop: 4 }}>立ち上げの理由、方針、広告のジレンマ</div>
              </div>
            </Link>
          </section>

        </div>
      </div>
    </>
  );
}
