import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Odds Converter - Convert Decimal, Fractional & American Odds Instantly',
  description: 'Convert between decimal, fractional, American, Hong Kong, Indonesian & Malay odds formats instantly. Free odds converter calculator with probability calculations. No registration needed.',
  keywords: ['odds converter', 'betting odds calculator', 'decimal to fractional', 'american odds', 'implied probability', 'sports betting', 'prediction markets'],
  openGraph: {
    title: 'Odds Converter - Convert Betting Odds | Free Calculator',
    description: 'Free odds converter. Convert between decimal, fractional, American odds and implied probability instantly.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odds Converter - Convert Betting Odds | Free Calculator',
    description: 'Free odds converter. Convert between decimal, fractional, American odds and implied probability instantly.',
  }
}

export default function OddsConverterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
