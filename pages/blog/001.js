import Head from "next/head";
import Link from "next/link";

export default function Blog001() {
  const t = { bg:"#0a0a0b",card:"rgba(255,255,255,0.03)",cb:"rgba(255,255,255,0.06)",text:"#e4e4e7",ts:"#a1a1aa",td:"#52525b",tg:"#3f3f46",ac:"#22c55e",gc:"rgba(34,197,94,0.02)" };

  return (
    <>
      <Head><title>Zero to Ship、はじめました。 — Zero to Ship</title></Head>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}a{color:${t.ac}}`}</style>
      <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Noto Sans JP',sans-serif", color: t.text }}>
        <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${t.gc} 1px,transparent 1px),linear-gradient(90deg,${t.gc} 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto", padding: "40px 20px 100px" }}>
          <Link href="/" style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: 1, textDecoration: "none" }}>← Zero to Ship</Link>

          <article style={{ marginTop: 32, animation: "fadeUp 0.5s ease both" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.tg, marginBottom: 8 }}>BLOG — 001</div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 900, lineHeight: 1.3, marginBottom: 24 }}>Zero to Ship、はじめました。</h1>

            <div style={{ fontSize: 15, lineHeight: 2, color: t.ts }}>
              <p>はじめまして。</p>
              <p style={{marginTop:16}}>今日からこのサイト「Zero to Ship」を始める。何をするサイトかというと、<strong style={{color:t.text}}>プログラミングができない人間が、AIの力だけでアプリを作って公開していく</strong>という、まぁそんな場所。</p>
              <p style={{marginTop:16}}>最初の投稿なので、なぜこんなことを始めたのか、これから何をしていくのか、書いておく。</p>

              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:700, color:t.text, marginTop:40, marginBottom:12 }}>なぜ始めたのか</h2>
              <p>正直に言うと、<strong style={{color:t.text}}>小遣い稼ぎ</strong>。</p>
              <p style={{marginTop:16}}>...と言いつつ、稼ぐことを目的にしてしまうと絶対に続かないのも分かっている。ブログもアプリ開発も、収益を追い求めた瞬間に作業になって、つまらなくなる。</p>
              <p style={{marginTop:16}}>なので位置づけとしては<strong style={{color:t.text}}>趣味の延長</strong>。収益はなくても全然いい。ただ、サーバー代とかでマイナスになるのだけは避けたい。そんなゆるい温度感。</p>
              <p style={{marginTop:16}}>要するに「楽しく続けられて、うまくいけば多少のお小遣いになればラッキー」くらいの気持ち。</p>

              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:700, color:t.text, marginTop:40, marginBottom:12 }}>これから何をしていくのか</h2>
              <p>やることはシンプルで、<strong style={{color:t.text}}>AIで簡単なアプリを作って公開していく。</strong></p>
              <p style={{marginTop:16}}>作るのは大層なものではなく、ちょっとした便利ツールや、「こんなのあったらいいな〜」と思うもの。自分に需要があるものから、「自分は使わないけど一部の人は使うかもしれない」ものまで、幅広く。</p>
              <p style={{marginTop:16}}>ここで一つ、正直な悩みがある。</p>
              <p style={{marginTop:16}}>便利なアプリやWebサービスを使っていていつも思うこと。<strong style={{color:t.text}}>広告がじゃま！！</strong></p>
              <p style={{marginTop:16}}>あの画面の下にべったり張り付いてるバナーとか、スクロールするたびに出てくる全画面広告とか、本当にストレス。自分がそう思ってるのに、自分のアプリに広告を貼るのはなんだかなぁ、と。</p>
              <p style={{marginTop:16}}>なのでできる限り広告はつけたくない。でも収入源がないとサイトの維持すら危うい。このジレンマは今後ずっと付き合っていくことになりそう。とりあえずは広告なしで始めて、どうにもならなくなったら考える。</p>

              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:700, color:t.text, marginTop:40, marginBottom:12 }}>取り敢えず、一つ目の作品</h2>
              <p>第1作目として、<strong style={{color:t.text}}>割り勘計算機</strong>を作ることにした。</p>
              <p style={{marginTop:16}}>飲み会の会計で「あの人は飲んでないのに均等割りかよ...」と思った経験、ないだろうか。ボトル頼んだ人だけ加算したいとか、途中参加の人は安くしたいとか、微妙な要望に対応できる割り勘アプリを作ってみる。</p>
              <p style={{marginTop:16}}>完成したらまた書く。</p>

              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:700, color:t.text, marginTop:40, marginBottom:12 }}>ところで、このブログについて</h2>
              <p>一つ白状しておくと、<strong style={{color:t.text}}>この文章もAIで書いている。</strong></p>
              <p style={{marginTop:16}}>もちろん内容や方針は自分の考えだけど、文章としてまとめるのはAIにやってもらっている。なので、差し支えのない範囲でところどころ嘘というか、AIが勝手に盛ったり整えたりしている部分があるかもしれない。そこはご愛嬌ということで。</p>
              <p style={{marginTop:16}}>あと、作るアプリについて気づいたことがある。</p>
              <p style={{marginTop:16}}>自分にとって需要のないアプリを作ると、使う人の気持ちがわからないので駄作になりがち。かといって自分が必要なものだけに絞ると、作るものがすぐになくなりそう...。</p>
              <p style={{marginTop:16}}>ただ、面白いことに気づいた。自分はプログラミングをする側ではなく、<strong style={{color:t.text}}>「使いにくい！」とAIにダメ出しをしまくる中間的な立場</strong>にいる。コードは書けないけど、使いにくいものに対する嗅覚はある。これって意外と、使用者目線でアプリを作れるポジションなのかもしれない。</p>
              <p style={{marginTop:16}}>プログラマーが作ると「技術的にはすごいけど使いにくい」ものができがち。でも自分は技術がわからないぶん、純粋に「使いやすいかどうか」だけで判断できる。AIに何度もダメ出しして、納得いくまで直してもらう。そのプロセス自体が、わりと楽しい。</p>

              <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:700, color:t.text, marginTop:40, marginBottom:12 }}>まとめ</h2>
              <p>というわけで、Zero to Shipを始める。</p>
              <p style={{marginTop:16}}>趣味の延長で、AIでアプリを作っていく。広告はなるべくつけない（けど収入は欲しいジレンマ）。まずは割り勘計算機から。文章もAIに書いてもらってる（正直）。楽しく続けることが最優先。</p>
              <p style={{marginTop:16}}>更新頻度は未定。のんびりやっていく。</p>
              <p style={{marginTop:16}}>もし「こんなアプリあったらいいな」というアイデアがあれば、教えてもらえると嬉しい。いいなと思えば作るかも。</p>
            </div>
          </article>

          <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${t.cb}`, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: t.tg }}>
            Zero to Ship
          </div>
        </div>
      </div>
    </>
  );
}
