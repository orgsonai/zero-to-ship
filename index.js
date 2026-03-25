import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";

const themes = {
  dark: { bg:"#0a0a0b",card:"rgba(255,255,255,0.03)",click:"rgba(255,255,255,0.065)",clickBd:"rgba(255,255,255,0.12)",cb:"rgba(255,255,255,0.06)",text:"#e4e4e7",ts:"#a1a1aa",tm:"#71717a",td:"#52525b",tg:"#3f3f46",ac:"#22c55e",ab:"rgba(34,197,94,0.1)",acb:"rgba(34,197,94,0.3)",acd:"#16a34a",gc:"rgba(34,197,94,0.02)",glow:"rgba(34,197,94,0.08)" },
  light: { bg:"#f8fafb",card:"rgba(0,0,0,0.02)",click:"#ffffff",clickBd:"rgba(0,0,0,0.12)",cb:"rgba(0,0,0,0.07)",text:"#18181b",ts:"#52525b",tm:"#71717a",td:"#a1a1aa",tg:"#d4d4d8",ac:"#16a34a",ab:"rgba(22,163,74,0.08)",acb:"rgba(22,163,74,0.25)",acd:"#15803d",gc:"rgba(22,163,74,0.03)",glow:"rgba(22,163,74,0.06)" },
};

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [typed, setTyped] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const t = themes[theme];
  const cmd = "npx create-next-app zero-to-ship";

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i <= cmd.length) { setTyped(cmd.slice(0, i)); i++; }
      else clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(iv);
  }, []);

  const apps = [
    { emoji: "💰", title: "割り勘計算機", sub: "Split Bill Calculator", desc: "比重・個別調整・税込/税抜・端数処理・QR決済対応", href: "/apps/warikan", status: "LIVE" },
    { emoji: "📱", title: "QRコード生成機", sub: "QR Code Generator", desc: "7種ドット形状・グラデーション・ロゴ挿入・SVG/PNG出力", href: "/apps/qr-generator", status: "LIVE" },
  ];

  const blogs = [
    { num: "001", title: "Zero to Ship、はじめました。", desc: "立ち上げの理由、方針、広告のジレンマ", href: "/blog/001" },
    { num: "002", title: "2作目、QRコード生成機を作った。", desc: "機能盛りすぎ問題と、UIの統一感", href: "/blog/002" },
    { num: "003", title: "なぜこのプロジェクトを始めたのか、もうちょっと正直な話。", desc: "一年契約の話、本当に作りたいもの", href: "/blog/003" },
  ];

  return (
    <>
      <Head><title>Zero to Ship</title></Head>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        a{text-decoration:none;color:inherit}
        .zts-card{transition:border-color 0.25s,transform 0.25s,box-shadow 0.25s}
        .zts-card:hover{border-color:${t.acb} !important;transform:translateY(-2px);box-shadow:0 8px 32px ${t.glow}}
        @media(max-width:600px){
          .zts-hero-title{font-size:36px !important}
          .zts-stats{gap:12px !important}
          .zts-stat{padding:12px 16px !important}
          .zts-stat-num{font-size:24px !important}
          .zts-apps-grid{grid-template-columns:1fr !important}
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Noto Sans JP',sans-serif", color: t.text, transition: "background 0.4s" }}>
        <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${t.gc} 1px,transparent 1px),linear-gradient(90deg,${t.gc} 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>

          {/* Header */}
          <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48, animation: "fadeUp 0.5s ease both" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 700, color: t.ac, letterSpacing: 1 }}>Z→S</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Link href="#apps" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: t.tm, padding: "6px 12px", borderRadius: 8, transition: "color 0.2s" }}>Apps</Link>
              <Link href="#blog" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: t.tm, padding: "6px 12px", borderRadius: 8, transition: "color 0.2s" }}>Blog</Link>
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.cb}`, background: t.card, color: t.ts, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" }}>{theme === "dark" ? "☀️" : "🌙"}</button>
            </div>
          </nav>

          {/* Hero */}
          <div style={{ animation: "fadeUp 0.6s ease 0.1s both", marginBottom: 56 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: t.ac, marginBottom: 16, display: "flex", alignItems: "center" }}>
              <span style={{ color: t.td }}>$&nbsp;</span>
              <span>{typed}</span>
              <span style={{ display: "inline-block", width: 8, height: 18, background: t.ac, marginLeft: 2, verticalAlign: "text-bottom", opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }} />
            </div>
            <h1 className="zts-hero-title" style={{ fontFamily: "'Outfit',sans-serif", fontSize: 52, fontWeight: 900, color: t.text, lineHeight: 1.05, margin: "0 0 16px", letterSpacing: -1 }}>
              Zero to <span style={{ color: t.ac }}>Ship</span>
            </h1>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: t.td, lineHeight: 1.8, margin: 0 }}>
              プログラミング未経験者が、AIの力だけでアプリを作って公開していく開発日誌。
            </p>
          </div>

          {/* Stats */}
          <div className="zts-stats" style={{ display: "flex", gap: 16, marginBottom: 56, animation: "fadeUp 0.6s ease 0.2s both" }}>
            {[
              { num: "2", label: "APPS SHIPPED", color: t.ac },
              { num: "3", label: "BLOG POSTS", color: t.text },
              { num: String(Math.floor((Date.now() - new Date("2026-03-01").getTime()) / 86400000)), label: "DAYS ACTIVE", color: t.td },
            ].map((s, i) => (
              <div className="zts-stat" key={i} style={{ flex: 1, padding: "16px 20px", background: t.card, border: `1px solid ${t.cb}`, borderRadius: 12 }}>
                <div className="zts-stat-num" style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 900, color: s.color }}>{s.num}</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: t.td, letterSpacing: 1, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Apps */}
          <section id="apps" style={{ marginBottom: 56, animation: "fadeUp 0.6s ease 0.3s both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.td, letterSpacing: 2, textTransform: "uppercase" }}>Apps</div>
              <div style={{ flex: 1, height: 1, background: t.cb }} />
            </div>
            <div className="zts-apps-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {apps.map((app, i) => (
                <Link href={app.href} key={i}>
                  <div className="zts-card" style={{ padding: "20px", background: t.click, border: `1px solid ${t.clickBd}`, borderRadius: 14, cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 24 }}>{app.emoji}</span>
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, fontWeight: 600, color: t.ac, background: t.ab, padding: "3px 10px", borderRadius: 6 }}>{app.status}</span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 2 }}>{app.title}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: t.tg, marginBottom: 10, letterSpacing: 0.5 }}>{app.sub}</div>
                    <div style={{ fontSize: 12, color: t.td, lineHeight: 1.7, flex: 1 }}>{app.desc}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.ac, marginTop: 14, display: "flex", alignItems: "center", gap: 4 }}>使ってみる <span style={{ fontSize: 14 }}>→</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Blog */}
          <section id="blog" style={{ marginBottom: 56, animation: "fadeUp 0.6s ease 0.4s both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.td, letterSpacing: 2, textTransform: "uppercase" }}>Blog</div>
              <div style={{ flex: 1, height: 1, background: t.cb }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {blogs.map((post, i) => (
                <Link href={post.href} key={i}>
                  <div className="zts-card" style={{ padding: "16px 20px", background: t.click, border: `1px solid ${t.clickBd}`, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, fontWeight: 600, color: t.tg, minWidth: 32, paddingTop: 2 }}>{post.num}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 3, lineHeight: 1.5 }}>{post.title}</div>
                      <div style={{ fontSize: 11, color: t.tg, fontFamily: "'IBM Plex Mono',monospace" }}>{post.desc}</div>
                    </div>
                    <span style={{ color: t.tg, fontSize: 14, paddingTop: 2, flexShrink: 0 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer style={{ paddingTop: 24, borderTop: `1px solid ${t.cb}`, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "fadeUp 0.6s ease 0.5s both" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.tg }}>© 2026 Zero to Ship</div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.tg }}>From zero code to shipped apps.</div>
          </footer>

        </div>
      </div>
    </>
  );
}
