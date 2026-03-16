# OddsKit Development Roadmap

## Phase 1: Immediate Optimizations ✅ (Completed 2026-03-16)

### SEO Enhancements
- ✅ Added robots.txt
- ✅ Added sitemap.xml with dynamic routes
- ✅ Improved meta descriptions and keywords
- ✅ Added structured data (JSON-LD) for WebApplication
- ✅ Added Twitter card metadata

### Homepage Improvements
- ✅ Created FeaturedTools component with better descriptions
- ✅ Added "NEW" badge support for recent tools
- ✅ Improved visual hierarchy with gradient cards

### Performance & UX
- Next steps: Image optimization, bundle analysis, breadcrumbs, related tools

---

## Phase 2: New Calculator Tools

### 1. Parlay Calculator (HIGH PRIORITY)
**Estimated Time:** 4-6 hours

**Features:**
- Add multiple bet legs (2-10 legs)
- Support all odds formats (American, Decimal, Fractional)
- Calculate combined parlay odds
- Show total payout and profit
- Display probability of winning all legs
- Show individual leg probabilities

**Technical:**
- New route: `/parlay-calculator`
- Component: `app/parlay-calculator/page.tsx`
- Formula: Combined odds = odds1 × odds2 × ... × oddsN

---

### 2. Arbitrage Calculator (HIGH PRIORITY)
**Estimated Time:** 5-7 hours

**Features:**
- Input odds from 2-3 different bookmakers
- Detect arbitrage opportunities automatically
- Calculate optimal stake distribution
- Show guaranteed profit percentage
- Support different total stake amounts
- Display profit for each outcome

**Technical:**
- New route: `/arbitrage-calculator`
- Component: `app/arbitrage-calculator/page.tsx`
- Formula: Arbitrage exists when (1/odds1 + 1/odds2) < 1

---

### 3. Hedge Calculator (MEDIUM PRIORITY)
**Estimated Time:** 4-5 hours

**Features:**
- Input original bet details (stake, odds)
- Input hedge bet odds
- Calculate hedge stake to guarantee profit
- Calculate hedge stake to minimize loss
- Show profit/loss scenarios for both outcomes
- Support partial hedging strategies

**Technical:**
- New route: `/hedge-calculator`
- Component: `app/hedge-calculator/page.tsx`
- Multiple calculation modes: full hedge, partial hedge, break-even

---

## Phase 3: Advanced Features (Future)

### 4. Dutching Calculator
- Distribute stake across multiple selections
- Guarantee equal profit regardless of winner

### 5. Odds Comparison Tool
- Compare odds across multiple bookmakers
- Highlight best value bets

### 6. Betting Tracker
- Log bets and track performance
- Calculate actual ROI and profit/loss

---

## Development Timeline

**Week 1 (Current):**
- ✅ Phase 1 optimizations
- Start Parlay Calculator

**Week 2:**
- Complete Parlay Calculator
- Start Arbitrage Calculator

**Week 3:**
- Complete Arbitrage Calculator
- Start Hedge Calculator

**Week 4:**
- Complete Hedge Calculator
- Testing and refinement

---

## Technical Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide Icons
- Vercel deployment

## Notes
- All calculators should support dark mode
- Mobile-responsive design required
- Add related tools section to each calculator
- Include educational content explaining each concept
