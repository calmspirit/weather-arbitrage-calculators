'use client'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Cloud, Droplets, ThermometerSun, Calculator, Download, Github, Sparkles, BarChart3, Clock, Target } from 'lucide-react'

export default function Home() {
  const [yesPrice, setYesPrice] = useState('')
  const [noPrice, setNoPrice] = useState('')
  const [forecast, setForecast] = useState('')
  const [result, setResult] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('calcHistory')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const fetchWeather = async (city: string = 'Beijing') => {
    setLoading(true)
    try {
      const coords: any = { Beijing: [39.9, 116.4], Shanghai: [31.2, 121.5], Shenzhen: [22.5, 114.1] }
      const [lat, lon] = coords[city] || coords.Beijing
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code&daily=precipitation_probability_max&timezone=Asia/Shanghai`)
      const data = await res.json()
      setWeather({
        temp: data.current.temperature_2m,
        precip: data.current.precipitation,
        prob: data.daily.precipitation_probability_max[0],
        city
      })
      setForecast(data.daily.precipitation_probability_max[0].toString())
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const calculate = () => {
    setCalculating(true)
    setTimeout(() => {
      const yes = parseFloat(yesPrice) / 100
      const no = parseFloat(noPrice) / 100
      const prob = parseFloat(forecast) / 100
      
      if (!yes || !no || !prob) {
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
        recommend: edge > 0.1 ? 'YES' : edge < -0.1 ? 'NO' : '无套利',
        time: new Date().toLocaleString('zh-CN')
      }

      setResult(newResult)
      
      const newHistory = [{ yesPrice, noPrice, forecast, ...newResult }, ...history].slice(0, 10)
      setHistory(newHistory)
      localStorage.setItem('calcHistory', JSON.stringify(newHistory))
      setCalculating(false)
    }, 800)
  }

  const exportCSV = () => {
    const csv = ['时间,YES价格,NO价格,预报概率,优势,期望值,ROI,建议', 
      ...history.map(h => `${h.time},${h.yesPrice},${h.noPrice},${h.forecast},${h.edge},${h.ev},${h.roi},${h.recommend}`)
    ].join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `weather-arbitrage-${Date.now()}.csv`
    link.click()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-3xl mb-6 shadow-2xl shadow-blue-500/50 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <Cloud className="w-10 h-10 text-white relative z-10" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-4 tracking-tight">
            天气套利计算器
          </h1>
          <p className="text-lg sm:text-xl text-blue-200/80 max-w-2xl mx-auto font-light">
            基于气象数据的预测市场套利分析工具
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-blue-300/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>实时数据</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>精准计算</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>历史追踪</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          
          {/* Weather Widget - Compact */}
          <div className="lg:col-span-1">
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 hover:border-cyan-400/50 transition-all duration-500 h-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                  实时天气
                </h2>
                <select 
                  onChange={(e) => fetchWeather(e.target.value)} 
                  className="px-3 py-1.5 bg-white/10 text-white rounded-xl text-sm border border-white/20 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all hover:bg-white/15"
                >
                  <option value="Beijing">北京</option>
                  <option value="Shanghai">上海</option>
                  <option value="Shenzhen">深圳</option>
                </select>
              </div>
              
              {!weather && !loading && (
                <button 
                  onClick={() => fetchWeather()} 
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  获取天气数据
                </button>
              )}
              
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                </div>
              )}
              
              {weather && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-200 text-sm">
                        <ThermometerSun className="w-4 h-4" />
                        <span>温度</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{weather.temp}°C</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-200 text-sm">
                        <Droplets className="w-4 h-4" />
                        <span>降水</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{weather.precip}mm</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-4 border border-cyan-400/30 hover:border-cyan-400/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-cyan-200 text-sm font-medium">
                        <Cloud className="w-4 h-4" />
                        <span>降雨概率</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{weather.prob}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calculator Card - Main */}
          <div className="lg:col-span-2">
            <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:border-blue-400/50 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">套利计算</h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-blue-100">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    YES 价格
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={yesPrice}
                      onChange={(e) => setYesPrice(e.target.value)}
                      className="w-full px-4 py-3 bg-white/95 border-2 border-transparent rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-900 text-lg font-semibold transition-all outline-none hover:bg-white"
                      placeholder="65"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-blue-100">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    NO 价格
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={noPrice}
                      onChange={(e) => setNoPrice(e.target.value)}
                      className="w-full px-4 py-3 bg-white/95 border-2 border-transparent rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 text-gray-900 text-lg font-semibold transition-all outline-none hover:bg-white"
                      placeholder="35"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-blue-100">
                    <Cloud className="w-4 h-4 text-cyan-400" />
                    预报概率
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={forecast}
                      onChange={(e) => setForecast(e.target.value)}
                      className="w-full px-4 py-3 bg-white/95 border-2 border-transparent rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-gray-900 text-lg font-semibold transition-all outline-none hover:bg-white"
                      placeholder="75"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={calculate}
                disabled={calculating}
                className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white py-4 rounded-xl font-bold text-lg transition-all duration-500 shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {calculating ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      计算中...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      计算套利机会
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </button>

              {result && (
                <div className="mt-6 p-6 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl border border-white/30 animate-fadeIn">
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border border-blue-400/30 hover:border-blue-400/50 transition-all hover:scale-105">
                      <div className="text-xs text-blue-200 mb-1 font-medium">优势</div>
                      <div className="text-2xl font-bold text-white">{result.edge}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-xl p-4 border border-cyan-400/30 hover:border-cyan-400/50 transition-all hover:scale-105">
                      <div className="text-xs text-cyan-200 mb-1 font-medium">期望值</div>
                      <div className="text-2xl font-bold text-white">{result.ev}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 border border-purple-400/30 hover:border-purple-400/50 transition-all hover:scale-105">
                      <div className="text-xs text-purple-200 mb-1 font-medium">ROI</div>
                      <div className="text-2xl font-bold text-white">{result.roi}%</div>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-white/20">
                    <div className="text-center">
                      <div className="text-sm text-blue-200 mb-3 font-medium">建议操作</div>
                      <div className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-xl transition-all duration-300 ${
                        result.recommend === 'YES' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl shadow-green-500/50 animate-pulse' : 
                        result.recommend === 'NO' ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-xl shadow-red-500/50 animate-pulse' : 
                        'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg'
                      }`}>
                        {result.recommend === 'YES' && <TrendingUp className="w-6 h-6" />}
                        {result.recommend === 'NO' && <TrendingDown className="w-6 h-6" />}
                        {result.recommend}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">计算历史</h2>
              </div>
              <button 
                onClick={exportCSV} 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30"
              >
                <Download className="w-4 h-4" />
                导出CSV
              </button>
            </div>
            
            <div className="grid gap-3">
              {history.map((item, i) => (
                <div key={i} className="group p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 text-xs text-blue-200">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </div>
                    <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      item.recommend === 'YES' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30' : 
                      item.recommend === 'NO' ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30' : 
                      'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                    }`}>
                      {item.recommend === 'YES' && <TrendingUp className="w-3 h-3" />}
                      {item.recommend === 'NO' && <TrendingDown className="w-3 h-3" />}
                      {item.recommend}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm text-white mb-2">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      YES: <span className="font-bold">{item.yesPrice}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-red-400" />
                      NO: <span className="font-bold">{item.noPrice}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cloud className="w-3 h-3 text-cyan-400" />
                      预报: <span className="font-bold">{item.forecast}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-blue-200/80">
                    Edge: <span className="font-semibold">{item.edge}%</span> | ROI: <span className="font-semibold">{item.roi}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ROI Chart */}
            {history.length > 2 && (
              <div className="mt-6 p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  ROI 趋势图
                </h3>
                <div className="flex items-end justify-between h-40 gap-2">
                  {history.slice(0, 10).reverse().map((item, i) => {
                    const height = Math.min(Math.abs(parseFloat(item.roi)), 100)
                    const isPositive = parseFloat(item.roi) > 0
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group/bar">
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-500 hover:opacity-80 ${
                            isPositive 
                              ? 'bg-gradient-to-t from-green-500 to-emerald-400 shadow-lg shadow-green-500/30' 
                              : 'bg-gradient-to-t from-red-500 to-rose-400 shadow-lg shadow-red-500/30'
                          }`}
                          style={{ height: `${height}%` }}
                          title={`ROI: ${item.roi}%`}
                        />
                        <div className="text-xs text-blue-200/60 mt-2 group-hover/bar:text-blue-200 transition-colors">{i+1}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center pb-8">
          <div className="inline-flex items-center gap-4 mb-4">
            <a 
              href="https://github.com/calmspirit/weather-arbitrage-calculators" 
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/40"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">GitHub</span>
            </a>
          </div>
          <div className="text-sm text-blue-200/60">
            Built with Next.js, Tailwind CSS & Lucide Icons
          </div>
        </footer>
      </div>
    </main>
  )
}
