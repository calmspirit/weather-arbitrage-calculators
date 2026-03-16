'use client'
import { useState, useEffect } from 'react'
import { Calculator, TrendingUp, AlertTriangle, DollarSign, Percent, Github, Sun, Moon, Home, Info } from 'lucide-react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

export default function KellyCalculator() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [winProb, setWinProb] = useState('')
  const [odds, setOdds] = useState('')
  const [bankroll, setBankroll] = useState('')
  const [fractionalKelly, setFractionalKelly] = useState(1)
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
    const p = parseFloat(winProb) / 100
    const q = 1 - p
    const b = parseFloat(odds) - 1
    const bank = parseFloat(bankroll)

    if (isNaN(p) || isNaN(b) || isNaN(bank) || p <= 0 || p >= 1 || b <= 0) return

    const kellyPercent = ((b * p - q) / b) * 100
    const adjustedKelly = kellyPercent * fractionalKelly
    const betSize = (bank * adjustedKelly) / 100
    const expectedGrowth = p * Math.log(1 + b * (adjustedKelly / 100)) + q * Math.log(1 - (adjustedKelly / 100))

    const riskLevel = adjustedKelly > 20 ? 'high' : adjustedKelly > 10 ? 'medium' : 'low'

    setResult({
      kellyPercent: kellyPercent.toFixed(2),
      adjustedKelly: adjustedKelly.toFixed(2),
      betSize: betSize.toFixed(2),
      expectedGrowth: (expectedGrowth * 100).toFixed(3),
      riskLevel,
      isPositive: kellyPercent > 0
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
              Kelly Criterion Calculator
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Calculate optimal bet size for maximum long-term growth</p>
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
                <input type="number" value={winProb} onChange={(e) => setWinProb(e.target.value)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" placeholder="55" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your estimated chance of winning</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Odds (Decimal)</label>
                <input type="number" step="0.01" value={odds} onChange={(e) => setOdds(e.target.value)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" placeholder="2.0" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Decimal odds (e.g., 2.0 = even money)</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Bankroll ($)</label>
                <input type="number" value={bankroll} onChange={(e) => setBankroll(e.target.value)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" placeholder="1000" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your total betting capital</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                  Fractional Kelly: {fractionalKelly === 1 ? 'Full' : fractionalKelly === 0.5 ? 'Half' : fractionalKelly === 0.25 ? 'Quarter' : `${(fractionalKelly * 100).toFixed(0)}%`}
                </label>
                <input type="range" min="0.1" max="1" step="0.05" value={fractionalKelly} onChange={(e) => setFractionalKelly(parseFloat(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <button onClick={() => setFractionalKelly(0.25)} className="hover:text-purple-600 dark:hover:text-purple-400">Quarter</button>
                  <button onClick={() => setFractionalKelly(0.5)} className="hover:text-purple-600 dark:hover:text-purple-400">Half</button>
                  <button onClick={() => setFractionalKelly(1)} className="hover:text-purple-600 dark:hover:text-purple-400">Full</button>
                </div>
              </div>
              <button onClick={calculate} className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 flex items-center justify-center gap-2 transition-colors">
                <Calculator className="w-5 h-5" />
                Calculate Kelly
              </button>
            </div>

            {result && (
              <div className={`mt-6 p-6 rounded-lg border-2 ${result.isPositive ? (result.riskLevel === 'high' ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700' : 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700') : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Kelly Percentage</span>
                    <span className={`text-2xl font-bold ${result.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {result.kellyPercent}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Adjusted Kelly ({(fractionalKelly * 100).toFixed(0)}%)</span>
                    <span className={`text-xl font-bold ${result.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {result.adjustedKelly}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Recommended Bet Size</span>
                    <span className={`text-2xl font-bold ${result.isPositive ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                      ${result.betSize}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Expected Growth Rate</span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {result.expectedGrowth}%
                    </span>
                  </div>
                  {result.riskLevel === 'high' && (
                    <div className="flex items-start gap-2 pt-3 border-t border-orange-200 dark:border-orange-700">
                      <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-orange-600 dark:text-orange-400">High Risk Warning</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Kelly &gt; 20% is aggressive. Consider fractional Kelly.</p>
                      </div>
                    </div>
                  )}
                  {!result.isPositive && (
                    <div className="flex items-center gap-2 pt-3 border-t dark:border-gray-600">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        Negative Edge - Do Not Bet
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">What is Kelly Criterion?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The Kelly Criterion is a mathematical formula for optimal bet sizing that maximizes long-term growth while minimizing risk of ruin.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg font-mono text-sm mb-4">
                Kelly % = (bp - q) / b
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Where: b = odds-1, p = win probability, q = 1-p
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Why Fractional Kelly?</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">Quarter Kelly (25%)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Conservative. Lower volatility, slower growth.</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Half Kelly (50%)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Balanced. Recommended for most bettors.</p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                  <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-1">Full Kelly (100%)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Aggressive. Maximum growth, high volatility.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Examples</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2 dark:text-gray-100">Conservative Bet</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">55% win, 2.0 odds, $1000 bankroll</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">Kelly: 10% → Bet $100</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2 dark:text-gray-100">Aggressive Bet</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">60% win, 2.5 odds, $1000 bankroll</p>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mt-1">Kelly: 26.7% → Use Half Kelly!</p>
                </div>
              </div>
            </div>
          </div>
          
          <Sidebar />
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Risk Management Tips</h3>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
              <span>Never bet more than Kelly suggests - it increases risk of ruin</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
              <span>Use fractional Kelly (25-50%) to reduce volatility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
              <span>Be conservative with win probability estimates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
              <span>Recalculate after each bet as bankroll changes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400 mt-1">✗</span>
              <span>Don't bet if Kelly is negative (no edge)</span>
            </li>
          </ul>
        </div>

        <footer className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Built for optimal bankroll management • Use responsibly</p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400">Home</Link>
            <Link href="/ev-calculator" className="hover:text-purple-600 dark:hover:text-purple-400">EV Calculator</Link>
            <Link href="/odds-converter" className="hover:text-purple-600 dark:hover:text-purple-400">Odds Converter</Link>
          </div>
        </footer>
      </div>
      </div>
    </div>
  )
}
