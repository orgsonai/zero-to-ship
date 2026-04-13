import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const themes = {
  dark: { bg:"#0a0a0b",card:"rgba(255,255,255,0.03)",click:"rgba(255,255,255,0.065)",clickBd:"rgba(255,255,255,0.12)",cb:"rgba(255,255,255,0.06)",text:"#e4e4e7",ts:"#a1a1aa",tm:"#71717a",td:"#52525b",tg:"#3f3f46",ac:"#22c55e",ab:"rgba(34,197,94,0.1)",acb:"rgba(34,197,94,0.3)",gc:"rgba(34,197,94,0.02)" },
  light: { bg:"#f8fafb",card:"rgba(0,0,0,0.02)",click:"#ffffff",clickBd:"rgba(0,0,0,0.12)",cb:"rgba(0,0,0,0.07)",text:"#18181b",ts:"#52525b",tm:"#71717a",td:"#a1a1aa",tg:"#d4d4d8",ac:"#16a34a",ab:"rgba(22,163,74,0.08)",acb:"rgba(22,163,74,0.25)",gc:"rgba(22,163,74,0.03)" },
};

export default function Blog003() {
  const [theme, setTheme] = useState("dark");
  const t = themes[theme];
  const h2 = { fontSize: 20, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: t.text, margin: "40px 0 16px", lineHeight: 1.4 };
  const p = { fontSize: 15, color: t.ts, lineHeight: 2, margin: "0 0 16px" };
  const b = { fontWeight: 700, color: t.text };
  const li = { fontSize: 14, color: t.ts, lineHeight: 1.9, marginBottom: 4 };

  return (
    <>
      <Head>
        <title>003 — なぜこのプロジェクトを始めたのか、もうちょっと正直な話。 — Zero to Ship</title>
        <meta name="description" content="一年契約の話、本当に作りたいもの、パスワード管理アプリとカレンダーアプリへの野望。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&family=Outfit:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}a{text-decoration:none;color:inherit}`}</style>
      <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Noto Sans JP',sans-serif", color: t.text }}>
        <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${t.gc} 1px,transparent 1px),linear-gradient(90deg,${t.gc} 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto", padding: "40px 20px 80px" }}>
          <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48, animation: "fadeUp 0.5s ease both" }}>
            <Link href="/"><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: t.ac, cursor: "pointer" }}>← Zero to Ship</span></Link>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.cb}`, background: t.card, color: t.ts, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{theme === "dark" ? "☀️" : "🌙"}</button>
          </nav>

          <article style={{ animation: "fadeUp 0.6s ease 0.1s both" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.tg, letterSpacing: 1, marginBottom: 12 }}>BLOG — 003</div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 900, color: t.text, lineHeight: 1.3, margin: "0 0 32px" }}>なぜこのプロジェクトを始めたのか、もうちょっと正直な話。</h1>

            <p style={p}>前回の「なぜ始めたのか」では「小遣い稼ぎ」と書いた。嘘ではないけど、もう一つ理由がある。</p>

            <h2 style={h2}>一年契約してしまった</h2>
            <p style={p}>Claudeという AIサービスがある。このブログもアプリも全部こいつに作らせている。</p>
            <p style={p}>で、一月分の有料プランを契約しようとしたら、<span style={b}>間違えて一年契約してしまった。</span></p>
            <p style={p}>もったいない。</p>
            <p style={p}>せっかく金を払ったんだから使い倒そうと思ったのがきっかけの一つ。ただ、このサービスには五時間の使用制限がある。ガッとやり込むとすぐ制限がかかって、回復するまで何もできない。</p>
            <p style={p}>で、気づいた。<span style={b}>仕事中の空き時間にポチポチ命令を出すくらいがちょうどいい</span>と。</p>
            <p style={p}>待ち時間とか、手が空いた隙間とか、そういう時間にスマホでちょこちょこ指示を出す。制限がかかったら別のことをする。制限が解除されたらまた少し触る。この繰り返し。</p>
            <p style={p}>この「無駄に過ぎていく空き時間」に何か生産性のあることができたら面白いんじゃないか、と思いついた。それがZero to Ship。</p>
            <p style={p}>...いや、「生産性」って言うと大げさか。本音を言うと、<span style={b}>主に仕事中にポチポチする程度の作業しかやる気はない</span>。がっつり夜中まで開発するとか、そういうテンションではない。</p>

            <h2 style={h2}>本当に作りたいもの</h2>
            <p style={p}>ここまで割り勘計算機とQRコード生成機を作ったけど、どっちも「本当に作りたかったもの」ではない。</p>
            <p style={p}>じゃあ本当に作りたいものは何かと言うと、ある。あるにはある。ただ、<span style={b}>技術的にレベルが高すぎる</span>。</p>
            <p style={p}>プログラミングの知識ゼロの人間がAIに命令するだけで作れる範囲を超えている気がする。途中まで進めてどん詰まって断念、というのが一番時間の無駄なので、慎重になっている。</p>

            <h2 style={h2}>パスワード管理アプリ</h2>
            <p style={p}>今一番不便だなーと思っているのが、<span style={b}>パスワード管理</span>。</p>
            <p style={p}>現在はKeePassXCを使っていて、アプリ自体の使い勝手は悪くない。問題は<span style={b}>クラウド同期に対応していない</span>こと。PCとスマホでデータを共有するのが面倒。今はSMBと同期アプリで無理やり運用しているけど、ローカルネットワーク内でしか同期できないし、ちょっとだけ不便。</p>
            <p style={p}>まぁ今のままでも使えてはいるんだけど。</p>
            <p style={p}>なので自分で作っちゃおうかと考え中。高度なことはやらなくていい。パスワードの生成と管理ができて、PCとスマホで同期できれば、それでいい。</p>
            <p style={p}>ただ、これを作るとなると...</p>
            <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
              <li style={li}>暗号化をちゃんとやらないとセキュリティ的にまずい</li>
              <li style={li}>クラウド同期の仕組みが必要</li>
              <li style={li}>デスクトップアプリも作ることになる</li>
            </ul>
            <p style={p}>どう考えてもレベルが高い。特に暗号化と同期。パスワードを扱うアプリでセキュリティが甘かったら本末転倒だし。</p>

            <h2 style={h2}>カレンダーアプリ</h2>
            <p style={p}>もう一つ、スマホの<span style={b}>カレンダーアプリ</span>。</p>
            <p style={p}>どれもこれも広告がある。どうにかしてほしい。</p>
            <p style={p}>あと、ウィジェットが使いにくいものが多い。デザインが好みじゃないとか、表示が中途半端とか、細かい不満がたくさんある。</p>
            <p style={p}>ただ、自分の場合はGoogleカレンダーとの同期が必須なので、そこの連携を作れるのかどうか。これも技術的にどうなのかわからない。</p>

            <h2 style={h2}>結局</h2>
            <p style={p}>今の自分が不便に感じているアプリたち、という話。作るかどうかは別の話。</p>
            <p style={p}>「作りたいもの」はあるけど「作れるかどうか」が問題で、だから今は作れそうなものを作っている。割り勘計算機やQRコード生成機は、その「作れそうなもの」枠。</p>
            <p style={p}>パスワード管理アプリ、カレンダーアプリ。いつか手を出すかもしれないし、出さないかもしれない。まぁ色々試行錯誤しながら考える。</p>

            <hr style={{ border: "none", borderTop: `1px solid ${t.cb}`, margin: "40px 0" }} />
            <p style={{ fontSize: 12, color: t.tg, fontStyle: "italic", lineHeight: 1.8 }}>Zero to Ship — プログラミング未経験者が、AIの力だけでアプリを作って公開していく開発日誌。</p>
          </article>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
            <Link href="/blog/002"><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: t.ac, cursor: "pointer" }}>← 002</span></Link>
            <Link href="/blog/004"><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: t.ac, cursor: "pointer" }}>004 →</span></Link>
            <span />
          </div>
        </div>
      </div>
    </>
  );
}
