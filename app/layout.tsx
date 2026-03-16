import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Free Betting Calculators - Odds, EV & Kelly Tools | OddsKit',
  description: 'Free betting calculators for sports bettors. Convert odds, calculate expected value, optimize bet sizing with Kelly Criterion. No signup required. Start winning smarter today.',
  keywords: 'odds converter, Kelly calculator, EV calculator, betting calculator, arbitrage calculator, betting odds, prediction market, ROI calculator, sports betting tools, implied probability',
  openGraph: {
    title: 'OddsKit - Professional Betting Calculators & Odds Converter',
    description: 'Free professional betting tools for odds conversion, Kelly Criterion, and EV analysis',
    type: 'website',
    url: 'https://oddskit.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OddsKit - Professional Betting Calculators',
    description: 'Free tools for odds conversion, Kelly Criterion, and EV analysis',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  robots: 'index, follow',
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "OddsKit",
          "description": "Professional betting calculators and odds converter tools",
          "url": "https://oddskit.vercel.app",
          "applicationCategory": "FinanceApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}} />
      </head>
      <body>
        <Script src="https://api.a-ads.com/ads.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  )
}
