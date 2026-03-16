import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expected Value Calculator - Find +EV Bets & Maximize Profits',
  description: 'Calculate expected value (EV) for any bet in seconds. Find profitable +EV opportunities and avoid -EV traps. Free EV calculator for sports betting. Start making smarter bets now.',
  keywords: ['ev calculator', 'expected value calculator', 'betting ev', 'positive ev', 'polymarket calculator', 'sports betting calculator'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
