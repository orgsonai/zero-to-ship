import dynamic from "next/dynamic";
import Head from "next/head";

const QRGeneratorApp = dynamic(() => import("../../components/qr-generator"), { ssr: false });

export default function QRGeneratorPage() {
  return (
    <>
      <Head>
        <title>QRコード生成機 — Zero to Ship</title>
        <meta name="description" content="7種ドット形状・グラデーション・ロゴ挿入・SVG/PNG出力対応のQRコード生成アプリ。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&family=Outfit:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>
      <QRGeneratorApp />
    </>
  );
}
