'use client'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Cloud, Droplets, ThermometerSun, Calculator, Download, Github, Sparkles, BarChart3, Clock, Target, Globe, Sun, Moon } from 'lucide-react'
import { translations, cities } from './i18n'

type Lang = 'en' | 'ja' | 'fr' | 'es' | 'zh-CN' | 'zh-TW'

export default function Home() {
  const [lang, setLang] = useState<Lang>('en')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [yesPrice, setYesPrice] = useState('')
  const [noPrice, setNoPrice] = useState('')
  const [forecast, setForecast] = useState('')
  const [result, setResult] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Beijing')
  const [searchTerm, setSearchTerm] = useState('')

  const t = translations[lang]

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('calcHistory')
    const savedLang = localStorage.getItem('lang') as Lang
    const savedCity = localStorage.getItem('selectedCity')
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) setHistory(JSON.parse(saved))
    if (savedLang) setLang(savedLang)
    if (savedCity) setSelectedCity(savedCity)
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])



  const changeLang = (newLang: Lang) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }

  const changeCity = (city: string) => {
    setSelectedCity(city)
    localStorage.setItem('selectedCity', city)
    setSearchTerm('')
  }

  const fetchWeather = async () => {
    setLoading(true)
    try {
      const city = cities.find(c => c.name === selectedCity)
      if (!city) return
      const [lat, lon] = city.coords
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code&daily=precipitation_probability_max&timezone=auto`)
      const data = await res.json()
      setWeather({
        temp: data.current.temperature_2m,
        precip: data.current.precipitation,
        prob: data.daily.precipitation_probability_max[0],
        city: selectedCity
      })
      setForecast(data.daily.precipitation_probability_max[0].toString())
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const calculate = () => {
    console.log('Calculate clicked', { yesPrice, noPrice, forecast })
    setCalculating(true)
    setTimeout(() => {
      const yes = parseFloat(yesPrice) / 100
      const no = parseFloat(noPrice) / 100
      const prob = parseFloat(forecast) / 100
      
      console.log('Parsed values:', { yes, no, prob })
      
      if (isNaN(yes) || isNaN(no) || isNaN(prob)) {
        console.error('Invalid input values')
        setCalculating(false)
        return
      }

      const impliedProb = yes
      const edge = prob - impliedProb
      const expectedValue = (prob * (1 - yes)) - ((1 - prob) * yes)
      const roi = (expectedValue / yes) * 100

      const newResult = {
        edge: (edge * 100).toFixed(2),
        ev: (expectedValue * 100).toFixed(2),
        roi: roi.toFixed(2),
        recommend: edge > 0.1 ? 'YES' : edge < -0.1 ? 'NO' : t.noArbitrage,
        time: new Date().toLocaleString()
      }

      setResult(newResult)
      
      const newHistory = [{ yesPrice, noPrice, forecast, ...newResult }, ...history].slice(0, 10)
      setHistory(newHistory)
      localStorage.setItem('calcHistory', JSON.stringify(newHistory))
      setCalculating(false)
    }, 800)
  }

  const exportCSV = () => {
    const csv = [`${t.time},YES,NO,${t.forecast},${t.edge},${t.ev},ROI,${t.recommend}`, 
      ...history.map(h => `${h.time},${h.yesPrice},${h.noPrice},${h.forecast},${h.edge},${h.ev},${h.roi},${h.recommend}`)
    ].join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `weather-arbitrage-${Date.now()}.csv`
    link.click()
  }

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(c.label).some(l => l.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              {t.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{t.subtitle}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={toggleTheme} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {theme === 'light' ? <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            </button>
            <select value={lang} onChange={(e) => changeLang(e.target.value as Lang)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100 shadow-sm">
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁體中文</option>
            </select>
            <a href="https://github.com/calmspirit/weather-arbitrage-calculators" target="_blank" className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors">
              <Github className="w-4 h-4" />
              {t.github}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{t.realtime}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{t.weather}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{t.accurate}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{t.calculator}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-green-100 dark:border-green-900 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{t.tracking}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{t.history}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <Cloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {t.weather}
            </h2>
            <div className="mb-4 relative">
              <input type="text" placeholder={cities.find(c => c.name === selectedCity)?.label[lang]} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" />
              {searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCities.map(city => (
                    <div key={city.name} onClick={() => changeCity(city.name)} className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer dark:text-gray-100">
                      {city.label[lang]}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={fetchWeather} disabled={loading} className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors">
              <Cloud className="w-5 h-5" />
              {loading ? t.calculating : t.getWeather}
            </button>
            {weather && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-semibold dark:text-gray-100">{t.temp}</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{weather.temp}°C</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold dark:text-gray-100">{t.precip}</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{weather.precip}mm</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-semibold dark:text-gray-100">{t.rainProb}</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{weather.prob}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <Calculator className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              {t.calculator}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">{t.yesPrice} (%)</label>
                <input type="number" value={yesPrice} onChange={(e) => setYesPrice(e.target.value)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" placeholder="65" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">{t.noPrice} (%)</label>
                <input type="number" value={noPrice} onChange={(e) => setNoPrice(e.target.value)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" placeholder="35" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">{t.forecast} (%)</label>
                <input type="number" value={forecast} onChange={(e) => setForecast(e.target.value)} className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100" placeholder="70" />
              </div>
              <button onClick={calculate} disabled={calculating} className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors">
                <Calculator className="w-5 h-5" />
                {calculating ? t.calculating : t.calculate}
              </button>
            </div>
            {result && (
              <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg border-2 border-purple-200 dark:border-purple-700 transition-colors">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t.edge}</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{result.edge}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t.ev}</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.ev}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t.roi}</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.roi}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{t.recommend}</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      {result.recommend === 'YES' ? <TrendingUp className="text-green-600 dark:text-green-400" /> : result.recommend === 'NO' ? <TrendingDown className="text-red-600 dark:text-red-400" /> : null}
                      <span className={result.recommend === 'YES' ? 'text-green-600 dark:text-green-400' : result.recommend === 'NO' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>{result.recommend}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500 mb-2 text-center">Advertisement</div>
              <div className="flex justify-center">
                <div id="frame" style={{width: '100%', margin: 'auto', position: 'relative', zIndex: 99998}}>
                  <iframe data-aa='2430615' src='//acceptable.a-ads.com/2430615/?size=Adaptive' style={{border: 0, padding: 0, width: '70%', height: 'auto', overflow: 'hidden', display: 'block', margin: 'auto'}} />
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="text-xs text-gray-600 text-center mb-2">💡 Support this free tool</div>
              <a href="https://www.bsmkweb.cc/activity/referral-entry/CPA?ref=CPA_00M8R3UI0N" target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">
                <img src="/binance-logo.svg" alt="Binance" className="mx-auto h-10 w-auto" />
              </a>
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                {t.history}
              </h2>
              <button onClick={exportCSV} className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                {t.export}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-600">
                    <th className="text-left p-2 dark:text-gray-200">{t.time}</th>
                    <th className="text-left p-2 dark:text-gray-200">YES</th>
                    <th className="text-left p-2 dark:text-gray-200">NO</th>
                    <th className="text-left p-2 dark:text-gray-200">{t.forecast}</th>
                    <th className="text-left p-2 dark:text-gray-200">{t.edge}</th>
                    <th className="text-left p-2 dark:text-gray-200">{t.roi}</th>
                    <th className="text-left p-2 dark:text-gray-200">{t.suggestion}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-2 text-sm dark:text-gray-300">{h.time}</td>
                      <td className="p-2 dark:text-gray-300">{h.yesPrice}%</td>
                      <td className="p-2 dark:text-gray-300">{h.noPrice}%</td>
                      <td className="p-2 dark:text-gray-300">{h.forecast}%</td>
                      <td className="p-2 font-semibold dark:text-gray-200">{h.edge}%</td>
                      <td className="p-2 font-semibold dark:text-gray-200">{h.roi}%</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-sm ${h.recommend === 'YES' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : h.recommend === 'NO' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>
                          {h.recommend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
