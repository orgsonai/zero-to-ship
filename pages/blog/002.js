import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const themes = {
  dark: { bg:"#0a0a0b",card:"rgba(255,255,255,0.03)",click:"rgba(255,255,255,0.065)",clickBd:"rgba(255,255,255,0.12)",cb:"rgba(255,255,255,0.06)",text:"#e4e4e7",ts:"#a1a1aa",tm:"#71717a",td:"#52525b",tg:"#3f3f46",ac:"#22c55e",ab:"rgba(34,197,94,0.1)",acb:"rgba(34,197,94,0.3)",gc:"rgba(34,197,94,0.02)" },
  light: { bg:"#f8fafb",card:"rgba(0,0,0,0.02)",click:"#ffffff",clickBd:"rgba(0,0,0,0.12)",cb:"rgba(0,0,0,0.07)",text:"#18181b",ts:"#52525b",tm:"#71717a",td:"#a1a1aa",tg:"#d4d4d8",ac:"#16a34a",ab:"rgba(22,163,74,0.08)",acb:"rgba(22,163,74,0.25)",gc:"rgba(22,163,74,0.03)" },
};

export default function Blog002() {
  const [theme, setTheme] = useState("dark");
  const t = themes[theme];
  const h2 = { fontSize: 20, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: t.text, margin: "40px 0 16px", lineHeight: 1.4 };
  const p = { fontSize: 15, color: t.ts, lineHeight: 2, margin: "0 0 16px" };
  const b = { fontWeight: 700, color: t.text };
  const li = { fontSize: 14, color: t.ts, lineHeight: 1.9, marginBottom: 4 };

  return (
    <>
      <Head>
        <title>002 — 2作目、QRコード生成機を作った。 — Zero to Ship</title>
        <meta name="description" content="QRコード生成機を作った話。機能盛りすぎ問題と、UIの統一感について。" />
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
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.tg, letterSpacing: 1, marginBottom: 12 }}>BLOG — 002</div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 32, fontWeight: 900, color: t.text, lineHeight: 1.3, margin: "0 0 32px" }}>2作目、QRコード生成機を作った。</h1>

            <p style={p}>2作目を出した。<span style={b}>QRコード生成機</span>。</p>
            <p style={p}>名前のまんまで、QRコードを作れるWebアプリ。色とか形とか変えられて、ロゴも入れられて、SVGでも出力できて、一括生成もできる。機能としてはかなり盛った。盛りすぎたかもしれない。</p>

            <h2 style={h2}>なぜQRコード生成機なのか</h2>
            <p style={p}>前回の割り勘計算機に続いて、「次は何を作るか」という話になった。候補はいくつかあったけど、QRコードを選んだ理由は単純で、<span style={b}>作りやすそうだったから</span>。</p>
            <p style={p}>自分が心底「これ欲しい！」と思って作ったわけではない。割り勘計算機もそうだけど、まだ「本当に自分が作りたいもの」には辿り着いていない。とりあえず作ってみた、くらいの温度感。使いたい人がいれば使ってもらえればいいし、誰も使わなくても別にいい。</p>

            <h2 style={h2}>作ってみてどうだったか</h2>
            <p style={p}>機能面はこんな感じ。</p>
            <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
              {["URL、テキスト、Wi-Fi、連絡先、メール、電話、SNS、地図の8種類の入力に対応","ドット形状7種（四角、角丸、丸、ダイヤ、星、ハート、コネクト）","コーナーマーク5種","カラーテーマ12種 + フルカスタム + グラデーション（線形・放射、角度指定可）","中央ロゴ挿入","背景画像の透過合成","フレーム14種（Scan Me、メニューはこちら、Follow Me、etc.）","店舗・SNS特化のシーンプリセット12種","PNG / SVG エクスポート","CSV一括生成 → ZIP ダウンロード","読み取りテスト（jsQRで自動チェック）","マイテンプレート保存"].map((item, i) => <li key={i} style={li}>{item}</li>)}
            </ul>
            <p style={p}>...書き出してみると我ながら多い。でもこれ、自分で一行もコード書いてない。全部AIに「これやって」「あれ追加して」って言っただけ。</p>
            <p style={p}>ちなみに<span style={b}>完全な検証はまだやりきれていない</span>。機能が多すぎて、全パターンの組み合わせを試すのが大変。「コネクトドット × リーフコーナー × 放射グラデーション × ロゴ挿入 × フレーム付き × SVG出力」みたいな組み合わせが無限にあるので、壊れてるパターンがあってもおかしくない。見つけたら直す。</p>

            <h2 style={h2}>UIの話</h2>
            <p style={p}>割り勘計算機と見比べると気づくと思うけど、<span style={b}>UIの雰囲気がかなり似ている</span>。</p>
            <p style={p}>ダーク基調、グリーンのアクセント、IBM Plex Monoのラベル、Outfitの見出し。ほぼ同じデザインシステム。</p>
            <p style={p}>これは意図的にそうしたわけではなく、AIに「Zero to Shipのデザイン方針に合わせて」と言ったら自然とこうなった。統一感があると言えば聞こえはいいけど、正直なところ<span style={b}>このスタイルで全アプリを統一するか、アプリごとに変えるか、まだ決めかねている</span>。</p>
            <p style={p}>統一するメリットは「Zero to Shipブランド」としての一貫性。見た瞬間に「あ、あのサイトのアプリだ」と分かる。</p>
            <p style={p}>変えるメリットは飽きない。作る側も使う側も。QRコード生成機にダーク基調って別に最適解じゃないし、明るくてポップな方が合うかもしれない。</p>
            <p style={p}>まぁ、今決める必要はない。そのうち考える。</p>

            <h2 style={h2}>「自分が作りたいもの」問題</h2>
            <p style={p}>前回のブログで「自分にとって需要のないアプリを作ると駄作になりがち」と書いた。</p>
            <p style={p}>で、今回まさにそれを体感している。QRコード生成機、機能は豊富だけど、自分が普段使うかと言われると...使わない。QRコードを生成する場面が日常にない。そもそもQRコード生成って世の中にどれだけ需要があるのかもよくわからない。</p>
            <p style={p}>じゃあなんで作ったんだという話だけど、単純にテスト。とりあえず作ってみて、刺さる人がいればラッキー、くらいの感覚。</p>
            <p style={p}>本当に作りたいものは、もう少し自分の生活に根ざした何かだと思う。何かは、まだわからない。</p>

            <h2 style={h2}>技術的なメモ</h2>
            <p style={p}>今回面白かったのは、QRコードの生成ロジックを外部APIに頼らず、<span style={b}>ブラウザ内で完結</span>させたこと。</p>
            <p style={p}>Reed-Solomonの誤り訂正とか、ガロア体GF(256)とか、何を言ってるのか正直さっぱりわからないけど、AIが全部書いてくれた。「すべてブラウザ内で処理 — データ送信なし」と堂々と書けるのは気持ちがいい。ユーザーの入力データがどこにも送られないというのは、QRコードみたいにURLやパスワードを扱うツールでは結構大事なポイントだと思う。</p>
            <p style={p}>あと、一括生成機能でJSZipを使ってZIPファイルをブラウザ内で生成するとか、jsQRで生成したQRコードを自分自身で読み取って検証するとか、なかなかアクロバティックなことをやっている。自分は何もわかってないけど。</p>

            <h2 style={h2}>次どうするか</h2>
            <p style={p}>未定。</p>
            <p style={p}>「作りたいもの」が見つかればそれを作るし、見つからなければまた適当に何か作るかもしれない。</p>
            <p style={p}>まぁ、のんびりやる。</p>

            <div style={{ margin: "40px 0", padding: "16px 20px", background: t.click, border: `1px solid ${t.clickBd}`, borderRadius: 12 }}>
              <div style={{ fontSize: 13, color: t.td, marginBottom: 8 }}>この記事で紹介したアプリ</div>
              <Link href="/apps/qr-generator"><span style={{ fontSize: 15, fontWeight: 700, color: t.ac, cursor: "pointer" }}>📱 QRコード生成機を使ってみる →</span></Link>
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${t.cb}`, margin: "40px 0" }} />
            <p style={{ fontSize: 12, color: t.tg, fontStyle: "italic", lineHeight: 1.8 }}>Zero to Ship — プログラミング未経験者が、AIの力だけでアプリを作って公開していく開発日誌。</p>
          </article>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
            <Link href="/blog/001"><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: t.ac, cursor: "pointer" }}>← 001</span></Link>
            <Link href="/blog/003"><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: t.ac, cursor: "pointer" }}>003 →</span></Link>
          </div>
        </div>
      </div>
    </>
  );
}
