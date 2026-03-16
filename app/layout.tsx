import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Weather Arbitrage Calculator | Polymarket Weather Arbitrage Tool',
  description: 'Professional Polymarket weather market arbitrage calculator. Real-time Edge, EV and ROI calculations to help you discover arbitrage opportunities in weather prediction markets',
  keywords: 'Polymarket, weather arbitrage, prediction market, arbitrage calculator, weather trading, betting odds',
  openGraph: {
    title: 'Weather Arbitrage Calculator',
    description: 'Discover arbitrage opportunities in Polymarket weather markets',
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
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛅</text></svg>" />
        <script dangerouslySetInnerHTML={{__html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`}} />
      </head>
      <body>
        <Script src="https://api.a-ads.com/ads.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  )
}
