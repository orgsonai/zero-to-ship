import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const themes = {
  dark: { bg:"#0a0a0b",card:"rgba(255,255,255,0.03)",click:"rgba(255,255,255,0.065)",clickBd:"rgba(255,255,255,0.12)",cb:"rgba(255,255,255,0.06)",text:"#e4e4e7",ts:"#a1a1aa",tm:"#71717a",td:"#52525b",tg:"#3f3f46",ac:"#22c55e",ab:"rgba(34,197,94,0.1)",acb:"rgba(34,197,94,0.3)",gc:"rgba(34,197,94,0.02)" },
  light: { bg:"#f8fafb",card:"rgba(0,0,0,0.02)",click:"#ffffff",clickBd:"rgba(0,0,0,0.12)",cb:"rgba(0,0,0,0.07)",text:"#18181b",ts:"#52525b",tm:"#71717a",td:"#a1a1aa",tg:"#d4d4d8",ac:"#16a34a",ab:"rgba(22,163,74,0.08)",acb:"rgba(22,163,74,0.25)",gc:"rgba(22,163,74,0.03)" },
};

export default function Blog004() {
  const [theme, setTheme] = useState("dark");
  const t = themes[theme];
  const h2 = { fontSize: 20, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: t.text, margin: "40px 0 16px", lineHeight: 1.4 };
  const p = { fontSize: 15, color: t.ts, lineHeight: 2, margin: "0 0 16px" };
  const b = { fontWeight: 700, color: t.text };

  return (
    <>
      <Head>
        <title>004 — パスワードアプリ、作ったはいいけど。 | Zero to Ship</title>
        <meta name="description" content="パスワード管理アプリKuraudoを作った。でもGoogle Playの落とし穴にハマって公開できていない話。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Noto Sans JP',sans-serif", transition: "background 0.3s" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
            <Link href="/"><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: t.ac, cursor: "pointer" }}>← Zero to Ship</span></Link>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ background: "none", border: `1px solid ${t.cb}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: t.tm, cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace" }}>{theme === "dark" ? "☀ Light" : "● Dark"}</button>
          </div>

          <article>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.tg, marginBottom: 12 }}>Blog #004</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: t.text, lineHeight: 1.4, margin: "0 0 32px" }}>パスワードアプリ、作ったはいいけど。</h1>

            <div style={{ color: t.ts, lineHeight: 2 }}>
              <p style={p}>前回「パスワード管理アプリ、いつか手を出すかもしれないし、出さないかもしれない」みたいなことを書いた。</p>
              <p style={p}>手を出してしまった。</p>

              <h2 style={h2}>作れた</h2>
              <p style={p}>「技術的にレベルが高すぎる」と言っていたやつ。暗号化とかクラウド同期とか、どう考えても自分の手に負えないと思っていたやつ。</p>
              <p style={p}>作れてしまった。AIに。</p>
              <p style={p}>名前は「Kuraudo（蔵人）」。「蔵」と「クラウド」の掛け言葉。AIが提案してきた名前で、まぁ悪くないかと思ってそのまま採用した。</p>
              <p style={p}>パスワードを暗号化して保存して、Googleドライブで同期する。やりたかったのはそれだけ。KeePassXCのクラウド同期がないのが不便で、じゃあ自分で作るかと。</p>
              <p style={p}>で、FlutterっていうフレームワークとDartっていう言語で作ることになった。どっちも初めて聞いた。AIが「これがいい」って言うからそうした。正直、今でもDartが何なのかよくわかっていない。</p>

              <h2 style={h2}>思ったより大変だった</h2>
              <p style={p}>暗号化とか同期とか、パスワードの自動入力とか、指紋認証とか...。やりたいことを一つ言うたびにファイルが増えていく。途中から自分でも何がどうなっているのか全然わからなくなった。</p>
              <p style={p}>「あのファイルどこだっけ」とAIに聞く。「それはlib/services/の中にあります」と返ってくる。ああそう。</p>
              <p style={p}>今までのアプリとは全然違った。一つのファイルをちょこちょこ直して完成、という話ではなかった。暗号化のアルゴリズムがどうとか、OAuthの認証フローがどうとか、自分に聞かれても何も説明できない。動いているから使っている、としか言えない。</p>

              <h2 style={h2}>一応動いている</h2>
              <p style={p}>Linux版。自分のPCで毎日使っている。KeePassXCから全データをインポートして乗り換えた。今のところ壊れてはいない。たぶん。</p>
              <p style={p}>Android版。指紋でロック解除して、パスワードをコピーして貼り付ける。自動入力の機能も一応作ったけど、正直やり方がよくわからなくて確認できていない。そのうち試す。</p>
              <p style={p}>Googleドライブ同期。PCで追加したやつがスマホに降りてくる。逆も。自分一人でしか試していないので他の環境でどうなるかは知らない。</p>
              <p style={p}>Windows版は保留。環境はあるけど後回しにしている。</p>

              <h2 style={h2}>で、Google Play</h2>
              <p style={p}>ここからが本題というか、愚痴というか。</p>
              <p style={p}>アプリは完成した。手元では動いている。じゃあGoogle Playに出すか、と。</p>
              <p style={p}>開発者アカウント登録、$25。まぁいい。本人確認、通った。リリースビルド、作った。ストアの説明文、書いた。審査に出した。</p>
              <p style={{...p, fontWeight: 700, color: t.text}}>ここまでは良かった。</p>
              <p style={p}>まず審査に落ちた。「ファミリーポリシー要件違反」。何事かと思ったら、対象年齢の設定で全年齢にしてしまっていた。パスワード管理アプリを5歳児に使わせる気か。自分のミス。13歳以上に直して再提出。</p>
              <p style={p}>でも審査落ちは序の口だった。</p>

              <h2 style={h2}>テスター12人問題</h2>
              <p style={p}>Google Playにはいきなり製品版を出せない。「クローズドテスト」というのを通過しないといけない。</p>
              <p style={p}>このクローズドテストに、<span style={b}>テスターが最低12人必要</span>。</p>
              <p style={p}>12人がアプリをインストールして、<span style={b}>14日間</span>テストする。それをクリアしてようやく製品版に昇格できる。</p>
              <p style={p}>...12人？</p>
              <p style={p}>パスワード管理アプリだよ？ 「ちょっとこれインストールしてよ」って気軽に頼めるジャンルじゃない。しかもGoogleアカウント持ちで、Androidスマホ持ちで、テスト用のリンクからオプトインしてくれて、14日間消さないでいてくれる人。</p>
              <p style={p}>そんな都合のいい知り合いが12人もいるか。いない。</p>
              <p style={p}>ここで完全に詰まっている。</p>

              <h2 style={h2}>他にも色々ある</h2>
              <p style={p}>OAuthの審査というのもある。Googleドライブにアクセスするための認証画面の審査。今はテスト段階だから100人まで手動登録できるけど、製品版にしたら正式に審査を通さないといけない。</p>
              <p style={p}>Windows版もそのうちビルドしないといけないけど、後回し。</p>
              <p style={p}>やることは山ほどあるのに、テスター12人が集まらないと何も先に進まない。</p>

              <h2 style={h2}>作っただけ</h2>
              <p style={p}>コードを書く...いや、書いてもらうところまではAIがどうにかしてくれた。問題はその先。審査とかテスターとか、そういうのが面倒くさくて止まっている。</p>

              <h2 style={h2}>まぁでも</h2>
              <p style={p}>KeePassXCからは乗り換えた。普通に使っている。毎日開くわけじゃないけど、パスワードが必要な時にサッと開いて、Googleドライブで同期されているのを見ると、ああ作ってよかったなとは思う。</p>
              <p style={p}>テスター問題は...まぁそのうちどうにかする。どうにかなるかは知らないけど。</p>
              <p style={p}>のんびりやる。</p>
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${t.cb}`, margin: "40px 0" }} />
            <p style={{ fontSize: 12, color: t.tg, fontStyle: "italic", lineHeight: 1.8 }}>Zero to Ship — プログラミング未経験者が、AIの力だけでアプリを作って公開していく開発日誌。</p>
          </article>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
            <Link href="/blog/003"><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: t.ac, cursor: "pointer" }}>← 003</span></Link>
            <Link href="/blog/005"><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: t.ac, cursor: "pointer" }}>005 →</span></Link>
          </div>
        </div>
      </div>
    </>
  );
}
