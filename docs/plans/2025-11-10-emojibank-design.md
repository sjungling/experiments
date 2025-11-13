# Emoji Piggy Bank Design

**Date:** 2025-11-10
**Project:** emojibank
**Purpose:** Educational app to teach 7 and 5 year olds about earning interest through a piggy bank tracker

## Overview

A single-page emoji-themed Progressive Web App that allows two children to track their individual piggy banks and earn automatic weekly compound interest. The app reinforces the concept of saving (not spending) by showing visual growth over time.

## Requirements

### Core Features
- Two separate piggy bank trackers (one per child)
- Automatic weekly compound interest calculation
- Configurable interest rate (parent-controlled)
- Deposit money functionality (no withdrawals - savings only)
- Visual growth chart showing balance history
- Persistent storage using localStorage

### Display Information
- Current balance for each child
- Total interest earned (separate from deposits)
- Simple growth chart showing balance over last 8-12 weeks

### Design Constraints
- Vanilla JavaScript and CSS (no build process)
- Single HTML file architecture
- Emoji-themed UI (consistent with emojistori, emojinumuncher, emojitactoe)
- Mobile-first responsive design
- PWA-capable with offline support

## Architecture

### Approach: Simple & Clean

**Rationale:** Prioritizes clarity and ease of understanding over complex interactions. Keeps focus on the educational goal of demonstrating compound interest growth.

**Key Characteristics:**
- Auto-calculates interest on page load
- CSS-based bar chart for growth visualization
- Two piggy bank cards side-by-side (stacked on mobile)
- Minimal animations
- Easy to maintain and extend

### Data Model

```javascript
{
  interestRate: 0.01,  // configurable weekly rate (1% = 0.01)
  children: [
    {
      name: "Child 1",
      emoji: "🐷",  // their chosen piggy bank emoji
      balance: 0,
      totalInterestEarned: 0,
      transactions: [
        { type: "deposit", amount: 10, date: "2025-01-01" },
        { type: "interest", amount: 0.10, date: "2025-01-08" }
      ],
      lastInterestDate: "2025-01-08"  // tracks when interest was last applied
    },
    // child 2 with same structure
  ]
}
```

**Storage:** localStorage key `piggybank-data`

### Interest Calculation

**Timing:** Weekly (every 7 days)

**Mechanism:**
1. On page load, check `lastInterestDate` for each child
2. Calculate elapsed weeks: `weeks = Math.floor(daysSince / 7)`
3. Apply compound interest: `newBalance = balance * Math.pow(1 + rate, weeks)`
4. Record interest earned in transactions
5. Update `lastInterestDate` to current date
6. Save to localStorage

**Why on page load?** Ensures interest accrues even if app isn't opened daily. When reopened, all missed weeks are calculated at once.

## User Interface

### Layout Structure

**Header:**
- App title: "🏦 Emoji Piggy Bank"
- Interest rate display with edit control (parent only)

**Main Content:**
- Two-column grid (responsive: stacks on mobile < 768px)
- Each column contains one PiggyBankCard

### PiggyBankCard Components

1. **Card Header**
   - Child's name (editable)
   - Piggy bank emoji (selectable: 🐷/💰/🪙)

2. **Balance Display**
   - Large, prominent currency-formatted number
   - Example: "$25.47"

3. **Interest Stats**
   - "Total Interest Earned: $2.47"
   - Displayed below balance in smaller text

4. **Growth Chart**
   - CSS-based vertical bar chart
   - Shows last 8-12 weeks of balance snapshots
   - Auto-scales to fit data range
   - X-axis: week labels, Y-axis: dollar amounts

5. **Deposit Form**
   - Number input field for amount
   - "Deposit 💵" button (large, touch-friendly)

### Visual Style

- Emoji-first design (consistent with other projects)
- Pastel color scheme (soft pinks, greens, yellows)
- Large touch targets (minimum 44px)
- CSS custom properties for theming
- Mobile-first responsive breakpoints

## Data Flow

### Page Load Flow
1. Load `piggybank-data` from localStorage
2. If not found, initialize with default structure
3. For each child:
   - Calculate weeks since `lastInterestDate`
   - Apply compound interest for elapsed weeks
   - Update `totalInterestEarned`
   - Update `lastInterestDate` to today
   - Add interest transactions to history
4. Save updated data to localStorage
5. Render both PiggyBankCards

### Deposit Flow
1. User enters amount in input field
2. Clicks "Deposit 💵" button
3. Validate amount (must be positive number)
4. Add to child's `balance`
5. Create transaction: `{ type: "deposit", amount, date: new Date().toISOString() }`
6. Save to localStorage
7. Re-render card (update balance display and chart)

### Interest Rate Adjustment Flow
1. Parent clicks interest rate in header
2. Inline input or modal appears
3. Enter new rate (e.g., "1" for 1%, "0.5" for 0.5%)
4. Convert to decimal: `rate = inputValue / 100`
5. Update `interestRate` in data model
6. Save to localStorage
7. Display confirmation
8. Note: Does NOT retroactively recalculate existing balances

### Growth Chart Logic
1. Sample balance from transaction history at weekly intervals
2. Create data points for last 8-12 weeks
3. Calculate max balance for scaling
4. Render as CSS-based vertical bars
5. Bar height: `(balance / maxBalance) * 100%`
6. Include labels for weeks and amounts

## Implementation Details

### Money Handling
- Store as JavaScript numbers (floating point)
- Display with `.toFixed(2)` for 2 decimal places
- Format currency: `new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`

### Edge Cases

**First Load:**
- Initialize with default data structure
- Set `lastInterestDate` to current date
- Balance starts at 0

**localStorage Cleared:**
- Detect missing data
- Reinitialize gracefully (don't crash)
- Show welcome message

**Invalid Inputs:**
- Validate deposit amounts (reject negative/non-numeric)
- Validate interest rate (must be 0-100%)
- Show user-friendly error messages

**Large Balances:**
- Chart auto-scales to accommodate any balance
- Currency formatter handles large numbers

**No Transactions:**
- Show empty chart with message: "Make your first deposit!"
- Display $0.00 balances

### Technical Stack

**Languages:**
- Vanilla JavaScript (ES6+)
  - Classes
  - Template literals
  - Arrow functions
  - Async/await (if needed)

**Styling:**
- Vanilla CSS
- CSS Grid and Flexbox
- CSS custom properties (variables)
- Mobile-first media queries

**APIs:**
- localStorage API
- Intl.NumberFormat (currency formatting)
- Date API (interest calculation)

**No Dependencies:**
- No npm packages
- No build process
- No transpilation
- Direct browser execution

### PWA Features

**Meta Tags:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

**Apple Touch Icon:**
- Inline data URI with piggy bank emoji
- Follows pattern from other projects

**Manifest (optional):**
```json
{
  "name": "Emoji Piggy Bank",
  "short_name": "EmojiBank",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ff69b4",
  "icons": [...]
}
```

**Service Worker (optional):**
- Cache HTML/CSS/JS for offline use
- Cache-first strategy

### File Structure

```
emojibank/
  index.html          # Complete single-file application
  manifest.json       # PWA manifest (optional)
```

## Future Enhancements (Out of Scope)

- Withdraw functionality (shows opportunity cost)
- Savings goals with progress tracking
- Multiple piggy banks per child
- Export transaction history
- Parent dashboard with analytics
- Configurable compounding frequency
- "What if" calculator for different rates

## Success Criteria

1. ✅ Children can see their balance grow automatically each week
2. ✅ Clear distinction between deposited money and earned interest
3. ✅ Visual growth chart demonstrates compound interest concept
4. ✅ Parent can adjust interest rate to control learning pace
5. ✅ Works on mobile devices (touch-friendly, responsive)
6. ✅ Data persists between sessions
7. ✅ Consistent emoji theme with other projects
8. ✅ Simple enough for 5-7 year olds to understand

## Educational Value

**Concepts Taught:**
- **Compound Interest:** Balance grows faster over time
- **Delayed Gratification:** Not withdrawing allows more growth
- **Consistent Saving:** Regular deposits show cumulative effect
- **Financial Awareness:** Tracking money builds number sense

**Age-Appropriate Design:**
- Large, colorful visuals (emoji-themed)
- Simple number displays
- Visual chart (not just numbers)
- Positive reinforcement (only growth, no penalties)
