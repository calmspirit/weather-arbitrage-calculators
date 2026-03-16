export default function Sidebar() {
  return (
    <aside className="w-full lg:w-[30%] space-y-4">
      {/* A-Ads Banner */}
      <div className="sticky top-4 space-y-4">
        <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">Advertisement</div>
          <div className="flex justify-center">
            <div id="frame" style={{width: '100%', margin: 'auto', position: 'relative', zIndex: 99998}}>
              <iframe 
                data-aa='2430615' 
                src='//acceptable.a-ads.com/2430615/?size=Adaptive' 
                style={{border: 0, padding: 0, width: '100%', height: 'auto', overflow: 'hidden', display: 'block', margin: 'auto'}} 
              />
            </div>
          </div>
        </div>

        {/* Binance Referral */}
        <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 text-center mb-2">💡 Support this free tool</div>
          <a 
            href="https://www.bsmkweb.cc/activity/referral-entry/CPA?ref=CPA_00M8R3UI0N" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block transition-transform hover:scale-105"
          >
            <img src="/binance-logo.svg" alt="Binance" className="mx-auto h-10 w-auto" />
          </a>
        </div>
      </div>
    </aside>
  )
}
