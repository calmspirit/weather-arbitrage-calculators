'use client'
import { useState, useEffect } from 'react'
import { Calculator, TrendingUp, TrendingDown, DollarSign, Percent, Github, Sun, Moon, Home } from 'lucide-react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

export default function EVCalculator() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [winProb, setWinProb] = useState('')
  const [winAmount, setWinAmount] = useState('')
  const [lossAmount, setLossAmount] = useState('')
  const [numBets, setNumBets] = useState('1')
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }

  const calculate = () => {
    const pWin = parseFloat(winProb) / 100
    const pLoss = 1 - pWin
    const win = parseFloat(winAmount)
    const loss = parseFloat(lossAmount)
    const bets = parseInt(numBets) || 1

    if (isNaN(pWin) || isNaN(win) || isNaN(loss)) return

    const ev = (pWin * win) - (pLoss * loss)
    const evPercent = (ev / loss) * 100
    const longTermEV = ev * bets

    setResult({
      ev: ev.toFixed(2),
      evPercent: evPercent.toFixed(2),
      longTermEV: longTermEV.toFixed(2),
      isPositive: ev > 0
    })
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              Expected Value Calculator
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Calculate EV for betting and trading decisions</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <Home className="w-5 h-5" />
            </Link>
            <button onClick={toggleTheme} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {theme === 'light' ? <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            </button>
            <a href="https://github.com/calmspirit/weather-arbitrage-calculators" target="_blank" className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors">
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <Calculator className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Calculator
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Win Probability (%)</label>
                <input type="number" value={winProb} onChange={(e) => setWinProb(e.target.value)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" placeholder="60" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loss probability: {winProb ? (100 - parseFloat(winProb)).toFixed(1) : '0'}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Win Amount ($)</label>
                <input type="number" value={winAmount} onChange={(e) => setWinAmount(e.target.value)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" placeholder="100" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Loss Amount ($)</label>
                <input type="number" value={lossAmount} onChange={(e) => setLossAmount(e.target.value)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" placeholder="50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Number of Bets (Optional)</label>
                <input type="number" value={numBets} onChange={(e) => setNumBets(e.target.value)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" placeholder="1" />
              </div>
              <button onClick={calculate} className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 flex items-center justify-center gap-2 transition-colors">
                <Calculator className="w-5 h-5" />
                Calculate EV
              </button>
            </div>

            {result && (
              <div className={`mt-6 p-6 rounded-lg border-2 ${result.isPositive ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Expected Value</span>
                    <span className={`text-2xl font-bold ${result.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ${result.ev}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">EV Percentage</span>
                    <span className={`text-xl font-bold ${result.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {result.evPercent}%
                    </span>
                  </div>
                  {parseInt(numBets) > 1 && (
                    <div className="flex items-center justify-between pt-3 border-t dark:border-gray-600">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Long-term EV ({numBets} bets)</span>
                      <span className={`text-xl font-bold ${result.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        ${result.longTermEV}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-3 border-t dark:border-gray-600">
                    {result.isPositive ? <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" /> : <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />}
                    <span className={`font-semibold ${result.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {result.isPositive ? 'Positive EV - Good Bet' : 'Negative EV - Avoid'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">What is Expected Value?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Expected Value (EV) is the average amount you can expect to win or lose per bet over the long run. It's calculated using:
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg font-mono text-sm">
                EV = (P(Win) × Win Amount) - (P(Loss) × Loss Amount)
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Examples</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2 dark:text-gray-100">Sports Betting</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">60% win chance, win $100, lose $50</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">EV = $10 (Positive EV)</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2 dark:text-gray-100">Polymarket</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">55% win chance, win $90, lose $50</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">EV = $4.50 (Positive EV)</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2 dark:text-gray-100">Casino Game</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">45% win chance, win $100, lose $100</p>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">EV = -$10 (Negative EV)</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Why It Matters</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  <span>Positive EV means profitable long-term</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
                  <span>Negative EV means losing money over time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">→</span>
                  <span>Make data-driven betting decisions</span>
                </li>
              </ul>
            </div>
          </div>
          </div>
          
          <Sidebar />
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Related Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/" className="p-4 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <h4 className="font-semibold mb-2 dark:text-gray-100">Weather Arbitrage Calculator</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Find arbitrage opportunities in weather prediction markets</p>
            </Link>
            <a href="https://accounts.binance.com/register?ref=11131007" target="_blank" className="p-4 border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
              <h4 className="font-semibold mb-2 dark:text-gray-100">Trade on Binance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get 20% fee discount with our referral link</p>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div id="a-ads-container" className="mx-auto" style={{maxWidth: '728px'}}>
            <ins className="adsbygoogle" style={{display: 'block'}} data-ad-client="ca-pub-placeholder" data-ad-slot="placeholder" data-ad-format="auto"></ins>
          </div>
        </div>
      </div>
    </div>
  )
}
