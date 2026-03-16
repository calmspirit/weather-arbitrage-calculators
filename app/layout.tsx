import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: '天气套利计算器 | Polymarket Weather Arbitrage Calculator',
  description: '专业的 Polymarket 天气市场套利计算工具，实时计算 Edge、EV 和 ROI，帮助你发现天气预测市场的套利机会',
  keywords: 'Polymarket, 天气套利, 预测市场, 套利计算器, weather arbitrage, prediction market',
  openGraph: {
    title: '天气套利计算器',
    description: '发现 Polymarket 天气市场的套利机会',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛅</text></svg>" />
      </head>
      <body>
        <Script src="https://api.a-ads.com/ads.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  )
}
