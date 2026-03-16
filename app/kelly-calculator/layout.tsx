import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kelly Criterion Calculator - Optimal Bet Sizing for Sports Betting',
  description: 'Calculate optimal bet size using the Kelly Criterion formula. Maximize long-term growth while managing risk. Free Kelly calculator for sports bettors. Protect your bankroll today.',
  keywords: ['kelly criterion calculator', 'kelly formula', 'optimal bet size', 'bankroll management', 'betting calculator', 'sports betting', 'prediction markets'],
  openGraph: {
    title: 'Kelly Criterion Calculator - Optimal Bet Sizing Tool',
    description: 'Calculate optimal bet size using the Kelly Criterion formula for maximum long-term growth',
    type: 'website',
  },
}

export default function KellyCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
