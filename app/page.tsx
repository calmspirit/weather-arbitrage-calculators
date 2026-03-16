'use client'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Cloud, Droplets, ThermometerSun, Calculator, Download, Github, Sparkles, BarChart3, Clock, Target, Globe } from 'lucide-react'
import { translations, cities } from './i18n'

type Lang = 'en' | 'ja' | 'fr' | 'es' | 'zh-CN' | 'zh-TW'

export default function Home() {
  const [lang, setLang] = useState<Lang>('en')
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
    if (saved) setHistory(JSON.parse(saved))
    if (savedLang) setLang(savedLang)
    if (savedCity) setSelectedCity(savedCity)
  }, [])

  const changeLang = (newLang: Lang) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-600" />
              {t.title}
            </h1>
            <p className="text-gray-600 mt-2">{t.subtitle}</p>
          </div>
          <div className="flex gap-3">
            <select value={lang} onChange={(e) => changeLang(e.target.value as Lang)} className="px-4 py-2 border rounded-lg bg-white shadow-sm">
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁體中文</option>
            </select>
            <a href="https://github.com/calmspirit/weather-arbitrage-calculators" target="_blank" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2">
              <Github className="w-4 h-4" />
              {t.github}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-800">{t.realtime}</h3>
            </div>
            <p className="text-gray-600 text-sm">{t.weather}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-800">{t.accurate}</h3>
            </div>
            <p className="text-gray-600 text-sm">{t.calculator}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-800">{t.tracking}</h3>
            </div>
            <p className="text-gray-600 text-sm">{t.history}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Cloud className="w-6 h-6 text-blue-600" />
              {t.weather}
            </h2>
            <div className="mb-4 relative">
              <input type="text" placeholder={cities.find(c => c.name === selectedCity)?.label[lang]} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              {searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCities.map(city => (
                    <div key={city.name} onClick={() => changeCity(city.name)} className="px-4 py-2 hover:bg-blue-50 cursor-pointer">
                      {city.label[lang]}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={fetchWeather} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
              <Cloud className="w-5 h-5" />
              {loading ? t.calculating : t.getWeather}
            </button>
            {weather && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold">{t.temp}</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{weather.temp}°C</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">{t.precip}</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{weather.precip}mm</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">{t.rainProb}</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{weather.prob}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-purple-600" />
              {t.calculator}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.yesPrice} (%)</label>
                <input type="number" value={yesPrice} onChange={(e) => setYesPrice(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="65" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.noPrice} (%)</label>
                <input type="number" value={noPrice} onChange={(e) => setNoPrice(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="35" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.forecast} (%)</label>
                <input type="number" value={forecast} onChange={(e) => setForecast(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="70" />
              </div>
              <button onClick={calculate} disabled={calculating} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5" />
                {calculating ? t.calculating : t.calculate}
              </button>
            </div>
            {result && (
              <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">{t.edge}</div>
                    <div className="text-2xl font-bold text-purple-600">{result.edge}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">{t.ev}</div>
                    <div className="text-2xl font-bold text-blue-600">{result.ev}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">{t.roi}</div>
                    <div className="text-2xl font-bold text-green-600">{result.roi}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">{t.recommend}</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      {result.recommend === 'YES' ? <TrendingUp className="text-green-600" /> : result.recommend === 'NO' ? <TrendingDown className="text-red-600" /> : null}
                      <span className={result.recommend === 'YES' ? 'text-green-600' : result.recommend === 'NO' ? 'text-red-600' : 'text-gray-600'}>{result.recommend}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-green-600" />
                {t.history}
              </h2>
              <button onClick={exportCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                {t.export}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{t.time}</th>
                    <th className="text-left p-2">YES</th>
                    <th className="text-left p-2">NO</th>
                    <th className="text-left p-2">{t.forecast}</th>
                    <th className="text-left p-2">{t.edge}</th>
                    <th className="text-left p-2">{t.roi}</th>
                    <th className="text-left p-2">{t.suggestion}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-sm">{h.time}</td>
                      <td className="p-2">{h.yesPrice}%</td>
                      <td className="p-2">{h.noPrice}%</td>
                      <td className="p-2">{h.forecast}%</td>
                      <td className="p-2 font-semibold">{h.edge}%</td>
                      <td className="p-2 font-semibold">{h.roi}%</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-sm ${h.recommend === 'YES' ? 'bg-green-100 text-green-800' : h.recommend === 'NO' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
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
