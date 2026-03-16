'use client'
import { useState, useEffect } from 'react'
import { Calculator, ArrowRight, Sun, Moon, Github, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

type OddsFormat = 'decimal' | 'fractional' | 'american' | 'probability'

export default function OddsConverter() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)
  const [inputFormat, setInputFormat] = useState<OddsFormat>('decimal')
  const [inputValue, setInputValue] = useState('')
  const [stake, setStake] = useState('100')
  const [results, setResults] = useState<any>(null)

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

  const decimalToFractional = (decimal: number): string => {
    const profit = decimal - 1
    let num = profit
    let den = 1
    const precision = 1000
    num = Math.round(num * precision)
    den = precision
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a
    const divisor = gcd(num, den)
    return `${num / divisor}/${den / divisor}`
  }

  const decimalToAmerican = (decimal: number): string => {
    if (decimal >= 2) {
      return `+${Math.round((decimal - 1) * 100)}`
    } else {
      return `${Math.round(-100 / (decimal - 1))}`
    }
  }

  const fractionalToDecimal = (frac: string): number => {
    const [num, den] = frac.split('/').map(Number)
    return 1 + (num / den)
  }

  const americanToDecimal = (american: number): number => {
    if (american > 0) {
      return 1 + (american / 100)
    } else {
      return 1 + (100 / Math.abs(american))
    }
  }

  const probabilityToDecimal = (prob: number): number => {
    return 1 / (prob / 100)
  }

  const convert = () => {
    if (!inputValue) return

    let decimal = 0

    try {
      if (inputFormat === 'decimal') {
        decimal = parseFloat(inputValue)
      } else if (inputFormat === 'fractional') {
        decimal = fractionalToDecimal(inputValue)
      } else if (inputFormat === 'american') {
        decimal = americanToDecimal(parseFloat(inputValue))
      } else if (inputFormat === 'probability') {
        decimal = probabilityToDecimal(parseFloat(inputValue))
      }

      if (isNaN(decimal) || decimal <= 1) return

      const probability = (1 / decimal) * 100
      const stakeNum = parseFloat(stake) || 100
      const profit = stakeNum * (decimal - 1)
      const totalReturn = stakeNum * decimal

      setResults({
        decimal: decimal.toFixed(2),
        fractional: decimalToFractional(decimal),
        american: decimalToAmerican(decimal),
        probability: probability.toFixed(2),
        profit: profit.toFixed(2),
        totalReturn: totalReturn.toFixed(2)
      })
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (inputValue) convert()
  }, [inputValue, inputFormat, stake])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              Odds Converter
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Convert between betting odds formats instantly</p>
          </div>
          <div className="flex gap-3">
            <button onClick={toggleTheme} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {theme === 'light' ? <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            </button>
            <Link href="/" className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 transition-colors">
              <TrendingUp className="w-4 h-4" />
              Weather Calculator
            </Link>
            <a href="https://github.com/calmspirit/weather-arbitrage-calculators" target="_blank" className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors">
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Input</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Format</label>
                <select value={inputFormat} onChange={(e) => setInputFormat(e.target.value as OddsFormat)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100">
                  <option value="decimal">Decimal (European)</option>
                  <option value="fractional">Fractional (UK)</option>
                  <option value="american">American (Moneyline)</option>
                  <option value="probability">Implied Probability (%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Value</label>
                <input 
                  type="text" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" 
                  placeholder={inputFormat === 'decimal' ? '2.50' : inputFormat === 'fractional' ? '3/2' : inputFormat === 'american' ? '+150' : '40'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Stake ($)</label>
                <input 
                  type="number" 
                  value={stake} 
                  onChange={(e) => setStake(e.target.value)} 
                  className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" 
                  placeholder="100"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h3 className="font-semibold mb-2 dark:text-gray-100">Examples:</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <div>Decimal: 2.50, 1.80, 3.00</div>
                <div>Fractional: 3/2, 4/5, 2/1</div>
                <div>American: +150, -125, +200</div>
                <div>Probability: 40%, 55%, 33%</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Results</h2>
            {results ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Decimal (European)</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{results.decimal}</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Fractional (UK)</div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{results.fractional}</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">American (Moneyline)</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{results.american}</div>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Implied Probability</div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{results.probability}%</div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold mb-3 dark:text-gray-100">Profit Calculator</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Stake:</span>
                      <span className="font-bold dark:text-gray-100">${stake}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Profit:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">${results.profit}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-300">Total Return:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">${results.totalReturn}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                <div className="text-center">
                  <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Enter odds to see conversions</p>
                </div>
              </div>
            )}
          </div>
          </div>
          
          <Sidebar />
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Understanding Odds Formats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-300">Decimal (European)</h4>
              <p className="text-gray-600 dark:text-gray-300">Most common in Europe. Shows total return per unit staked. Example: 2.50 means you get $2.50 back for every $1 bet (including stake).</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-300">Fractional (UK)</h4>
              <p className="text-gray-600 dark:text-gray-300">Traditional UK format. Shows profit relative to stake. Example: 3/2 means you win $3 for every $2 staked.</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-900 dark:text-green-300">American (Moneyline)</h4>
              <p className="text-gray-600 dark:text-gray-300">Used in US sports betting. Positive (+150) shows profit on $100 stake. Negative (-125) shows stake needed to win $100.</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <h4 className="font-semibold mb-2 text-orange-900 dark:text-orange-300">Implied Probability</h4>
              <p className="text-gray-600 dark:text-gray-300">The probability implied by the odds. Example: 40% means the bookmaker thinks there's a 40% chance of this outcome.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-xl font-bold mb-4 dark:text-gray-100">🎁 Start Trading on Binance</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Join the world's largest crypto exchange and get up to 20% commission rebate on trading fees!</p>
          <a href="https://accounts.binance.com/register?ref=11131840" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors">
            Sign Up on Binance →
          </a>
        </div>

        <div className="mt-6 text-center">
          <div id="a-ads-container" className="mx-auto" style={{maxWidth: '728px'}}>
            <ins className="adsbygoogle" style={{display: 'block'}} data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="XXXXXXXX" data-ad-format="horizontal"></ins>
          </div>
        </div>
      </div>
    </div>
  )
}
