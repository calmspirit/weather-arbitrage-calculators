'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [yesPrice, setYesPrice] = useState('')
  const [noPrice, setNoPrice] = useState('')
  const [forecast, setForecast] = useState('')
  const [result, setResult] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('calcHistory')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const calculate = () => {
    const yes = parseFloat(yesPrice) / 100
    const no = parseFloat(noPrice) / 100
    const prob = parseFloat(forecast) / 100
    
    if (!yes || !no || !prob) return

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
    
    const newHistory = [{ yesPrice, noPrice, forecast, ...newResult }, ...history].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem('calcHistory', JSON.stringify(newHistory))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto pt-4 sm:pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">⛅ 天气套利计算器</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">市场 YES 价格 (%)</label>
            <input
              type="number"
              value={yesPrice}
              onChange={(e) => setYesPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="例: 65"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">市场 NO 价格 (%)</label>
            <input
              type="number"
              value={noPrice}
              onChange={(e) => setNoPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="例: 35"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">天气预报概率 (%)</label>
            <input
              type="number"
              value={forecast}
              onChange={(e) => setForecast(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
              placeholder="例: 75"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition active:scale-95"
          >
            计算套利机会
          </button>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">优势 (Edge):</span>
                <span className="font-bold">{result.edge}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">期望值 (EV):</span>
                <span className="font-bold">{result.ev}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ROI:</span>
                <span className="font-bold">{result.roi}%</span>
              </div>
              <div className="pt-3 border-t">
                <div className="text-center">
                  <span className="text-gray-600">建议操作: </span>
                  <span className={`font-bold text-lg ${
                    result.recommend === 'YES' ? 'text-green-600' : 
                    result.recommend === 'NO' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {result.recommend}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">📊 计算历史</h2>
            <div className="space-y-3">
              {history.map((item, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">{item.time}</span>
                    <span className={`font-bold ${
                      item.recommend === 'YES' ? 'text-green-600' : 
                      item.recommend === 'NO' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {item.recommend}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>YES: {item.yesPrice}%</div>
                    <div>NO: {item.noPrice}%</div>
                    <div>预报: {item.forecast}%</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Edge: {item.edge}% | ROI: {item.roi}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
