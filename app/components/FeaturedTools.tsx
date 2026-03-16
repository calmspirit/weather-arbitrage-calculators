'use client'
import Link from 'next/link'
import { Calculator, TrendingUp, Target, Sparkles } from 'lucide-react'

const tools = [
  {
    name: 'Odds Converter',
    description: 'Convert between American, Decimal, Fractional, and Implied Probability formats instantly',
    href: '/odds-converter',
    icon: Calculator,
    color: 'blue',
    new: false
  },
  {
    name: 'Kelly Calculator',
    description: 'Calculate optimal bet sizing using the Kelly Criterion for maximum long-term growth',
    href: '/kelly-calculator',
    icon: TrendingUp,
    color: 'purple',
    new: false
  },
  {
    name: 'EV Calculator',
    description: 'Calculate Expected Value, Edge, and ROI for prediction markets and sports betting',
    href: '/ev-calculator',
    icon: Target,
    color: 'green',
    new: true
  }
]

export default function FeaturedTools() {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-7 h-7 text-yellow-500" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Featured Tools</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
            purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
            green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          }
          
          return (
            <Link key={tool.href} href={tool.href} className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[tool.color as keyof typeof colorClasses]} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {tool.new && (
                    <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
