# ⛅ Weather Arbitrage Calculator

A real-time calculator for identifying arbitrage opportunities in weather prediction markets by comparing market prices with meteorological forecasts.

![Weather Arbitrage Calculator](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## 🎯 Features

- **Real-time Arbitrage Calculation** - Instantly calculate edge, expected value (EV), and ROI
- **Smart Recommendations** - Get YES/NO/HOLD signals based on probability differences
- **Calculation History** - Track your last 5 calculations with local storage
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Clean UI** - Modern gradient interface with Tailwind CSS

## 🚀 How to Use

1. **Enter Market YES Price** - The current market probability for the event (e.g., 65%)
2. **Enter Market NO Price** - The inverse market probability (e.g., 35%)
3. **Enter Weather Forecast** - The meteorological forecast probability (e.g., 75%)
4. **Click Calculate** - Get instant arbitrage analysis

### Example Scenario

```
Market YES: 65%
Market NO: 35%
Forecast: 75%

Result:
- Edge: +10%
- Expected Value: +7.5%
- ROI: +11.54%
- Recommendation: YES (Buy)
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **UI**: React 19 with Client Components
- **Storage**: Browser LocalStorage for history

## 💻 Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/calmspirit/weather-arbitrage-calculator.git
cd weather-arbitrage-calculator

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/calmspirit/weather-arbitrage-calculator)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy with one click

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

## 📊 How It Works

The calculator uses the following formulas:

- **Edge** = Weather Forecast Probability - Market Implied Probability
- **Expected Value (EV)** = (Forecast × (1 - YES Price)) - ((1 - Forecast) × YES Price)
- **ROI** = (EV / YES Price) × 100

**Trading Signal Logic:**
- Edge > 10%: **BUY YES**
- Edge < -10%: **BUY NO**
- -10% ≤ Edge ≤ 10%: **NO ARBITRAGE**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **GitHub**: https://github.com/calmspirit/weather-arbitrage-calculator
- **Issues**: https://github.com/calmspirit/weather-arbitrage-calculator/issues

---

Built with ❤️ for prediction market traders
