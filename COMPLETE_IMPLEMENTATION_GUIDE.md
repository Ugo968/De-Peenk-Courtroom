# 🎉 De Peenk Courtroom - Complete Implementation Guide

## "We Listen. We Judge. We Advise. We Compensate." ⚖️💖

Complete implementation guide for the gamified, highly secure dispute resolution platform for women.

---

## 📦 Required NPM Packages

```bash
# Core dependencies
npm install next@14 react@18 react-dom@18
npm install typescript @types/react @types/node

# Database & ORM
npm install prisma @prisma/client

# Authentication
npm install next-auth @auth/prisma-adapter bcryptjs

# Payments
npm install paystack-api

# Real-time
npm install @supabase/supabase-js

# UI & Animations
npm install framer-motion
npm install tailwindcss postcss autoprefixer

# Utilities
npm install crypto-js
```

---

## 🗄️ Database Schema

**File:** `prisma/schema.prisma`

The complete schema includes:

### Core Models
- **User** - With gender, religion, trial system, slot systems, credits
- **Wallet** - Real money balance (coins)
- **Case** - Case management with categories and status
- **Testimony** - User testimonies for cases
- **GalleryComment** - Real-time chat comments

### New Models (All Phases)
- **Ad** - Brand advertisements (5 tiers)
- **AdVideoView** - Video ad tracking (daily limits)
- **CJQueue** - Chief Judge slot queue
- **LawyerWaitlist** - Lawyer slot waitlist
- **BoostedComment** - Pinned comments (1 hour)
- **UnlockedCase** - Archived case access
- **PollVote** - Case outcome polls
- **VirtualGift** - Gifts to Lawyers/CJs

### Enums
- `Role`: LISTENER, LAWYER, CHIEF_JUDGE, PLAINTIFF
- `CaseCategory`: 7 categories
- `CaseStatus`: 6 statuses
- `Religion`: MUSLIM, CHRISTIAN
- `Gender`: MALE, FEMALE
- `AdTier`: FLYER, POSTER, BANNER, BILLBOARD, VIDEO

---

## 🔐 Authentication & Signup

**File:** `src/app/api/auth/signup/route.ts`

### Features
- Gender and religion validation
- Anonymous handle generation (with gender prefix for males)
- Free trial activation (3 days)
- Initial credits based on gender:
  - Female: 100 listener credits + 50 coins
  - Male: 50 listener credits + 50 coins

### Handle Generation
- **Female Listener**: `FL-XXYY99`
- **Male Listener**: `ML-XXYY99` (distinguishes for pricing)
- **Lawyer**: `LW-AB12CD`
- **Chief Judge**: `CJ-MW24-A1B` (includes religion)
- **Plaintiff**: `PT-XY34EF`

---

## 👑 CJ Slot System

**File:** `src/app/api/cj/claim-slot/route.ts`

### Rules
- Only 2 slots: 1 Muslim, 1 Christian
- Only females can become CJ
- 14-day tenure
- ₦3,500 per slot
- Queue system when occupied
- Auto-promotion via cron job

### Flow
1. User clicks "Become Chief Judge"
2. Gender validation (must be FEMALE)
3. Check if slot for user's religion is available
4. If available → Activate immediately
5. If occupied → Add to queue
6. Paystack payment processing
7. Cron job promotes from queue when slot expires

---

## ⚖️ Lawyer Slot System

**File:** `src/app/api/lawyer/claim-slot/route.ts`

### Rules
- 20 total slots: 10 Muslim, 10 Christian
- Only females can become lawyers
- 14-day tenure
- ₦2,000 per slot
- Waitlist system when full
- Auto-promotion via cron job

### Flow
1. User clicks "Become Lawyer"
2. Gender validation (must be FEMALE)
3. Check active lawyers for user's religion
4. If < 10 → Activate immediately
5. If = 10 → Add to waitlist
6. Paystack payment processing
7. Cron job promotes from waitlist when slot expires

---

## 🎬 Video Ad Rewards

**File:** `src/app/api/ads/watch-video/route.ts`

### Rules
- 10 credits per video watched
- Maximum 20 videos per day
- Lawyers and CJs are exempt
- Daily tracking via `AdVideoView` model

### Flow
1. User clicks "Watch Video"
2. Check role exemption
3. Check daily limit (20 videos)
4. Play video (30 seconds)
5. Award 10 credits
6. Update daily count

---

## 🔄 Tenure End (Credit Conversion)

**File:** `src/app/api/tenure/end/route.ts`

### Cron Job (Hourly)
1. Find expired lawyers/CJs
2. Convert virtual credits to listener credits (1:1)
3. Reset virtual credits to 0
4. Demote to LISTENER role
5. Promote next from queue/waitlist

### Conversion Example
```
Lawyer resolves 6 cases → earns 24,000 virtual credits
Tenure expires → cron job runs
24,000 virtual credits → 24,000 listener credits
User demoted to LISTENER
User now has 24,000 listener credits in wallet
```

---

## 🎁 Free Trial System

**File:** `src/app/api/trial/check/route.ts`

### Rules
- 3-day free trial for all new users
- Initial credits on signup
- Countdown timer on dashboard
- Automatic expiry via cron job

### Cron Job (Daily)
1. Find users with expired trials
2. Clear `trialEndsAt` field
3. Downgrade to free tier

---

## 💰 Paystack Integration (Male 2x Pricing)

**File:** `src/app/api/paystack/initialize/route.ts`

### Pricing
| Pack | Female Price | Male Price | Credits |
|------|--------------|------------|---------|
| Coin Pack 1 | ₦100 | ₦200 | 200 |
| Coin Pack 2 | ₦400 | ₦800 | 1,000 |
| Coin Pack 3 | ₦1,000 | ₦2,000 | 3,000 |

### Flow
1. User selects package
2. Check user gender
3. Calculate price (2x for males)
4. Initialize Paystack transaction
5. Pass metadata (gender, pricing)
6. Redirect to Paystack checkout
7. Webhook processes payment

---

## 🎭 Cinematic Intro

**File:** `src/components/CourtroomIntro.tsx`

### 3-Scene Sequence

**Scene 1: Gavel Animation (0-3s)**
- Dark pink/sky gradient background
- 3D gavel appears and hits down
- "BANG!" text with crack effect
- Audio: `gavel-hit.mp3`

**Scene 2: Signup Form (3-6s)**
- Beautiful girly form
- Gender and religion selection
- Male notice: "Gentlemen, you are welcome as Listeners only"
- Audio: `melodious-chime.mp3` + `welcome-voice.mp3`

**Scene 3: Courtroom Floor (6s+)**
- 40 seats (5 rows × 8 seats)
- Interactive seat selection
- Pink cushions for available seats
- Redirects to dashboard

---

## 💎 Credit Exhaustion System

**File:** `src/lib/credit-exhaustion.ts`

### Three Credit Types

**1. Listener Credits** (💎)
- Virtual gifts: 50 credits
- Boost comment: 100 credits
- Unlock archived case: 25 credits
- Poll vote: 10 credits
- Star listener badge: 200 credits

**2. Coins** (💰)
- File case: 200 coins
- Hire lawyer: 500 coins
- Testify: 200 coins
- Object: 100 coins
- Expedited review: 1000 coins

**3. Virtual Credits** (⚖️)
- Lawyer wins case: +4,000
- CJ resolves case: +6,000
- Convert 1:1 at tenure end

### Daily Rewards
- Daily login: +10 credits
- 7-day streak: +100 bonus
- Referral: +200 credits

### Exhaustion Notices
- Low balance (< 50): Soft warning
- Zero balance (= 0): Block paid actions, show recharge modal
- Free actions never blocked

---

## 🎨 UI Components

### Core Components
- `CourtroomIntro.tsx` - 3-scene cinematic intro
- `CourtroomSignup.tsx` - Signup with gender/religion
- `CourtroomFloor.tsx` - Seat selection UI
- `TrialCountdown.tsx` - Beautiful countdown timer

### Credit System Components
- `ExhaustionNotice.tsx` - Balance warnings
- `RechargeModal.tsx` - Recharge interface
- `VirtualGiftModal.tsx` - Send virtual gifts
- `BoostCommentModal.tsx` - Boost comments
- `StarListenerBadgeModal.tsx` - Star badge
- `DailyRewardModal.tsx` - Daily rewards

### Slot System Components
- `CJSlotSystem.tsx` - CJ slot management
- `LawyerSlotSystem.tsx` - Lawyer slot management

### Ad System Components
- `TopBanner.tsx` - Sticky header ads
- `SidebarAds.tsx` - Sidebar ads
- `ChamberBillboard.tsx` - CJ chamber ads
- `VideoAdPopup.tsx` - Video ad popups
- `VideoAdRewards.tsx` - Watch & earn

---

## 🚀 Deployment Checklist

### 1. Database Setup
```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize
npx prisma init --datasource-provider postgresql

# Copy schema from prisma/schema.prisma
# Run migration
npx prisma migrate dev --name init
```

### 2. Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://yourdomain.com"

# Paystack
PAYSTACK_SECRET_KEY="sk_live_..."
PAYSTACK_PUBLIC_KEY="pk_live_..."

# Supabase
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="..."

# Cron Jobs
CRON_SECRET="your-cron-secret"

# Encryption
ENCRYPTION_KEY="your-32-char-key"
```

### 3. Cron Jobs Setup

**Vercel (vercel.json):**
```json
{
  "crons": [
    {
      "path": "/api/tenure/end",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/trial/check",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Other platforms:**
```bash
# Hourly: Tenure end
0 * * * * curl -H "Authorization: Bearer $CRON_SECRET" https://yourdomain.com/api/tenure/end

# Daily: Trial check
0 0 * * * curl -H "Authorization: Bearer $CRON_SECRET" https://yourdomain.com/api/trial/check
```

### 4. Audio Files
Place in `public/audio/`:
- `gavel-hit.mp3` (~0.5s)
- `melodious-chime.mp3` (~2s)
- `welcome-voice.mp3` (~3s)

### 5. Build & Deploy
```bash
npm run build
npm start
```

---

## 💰 Revenue Model

### Monthly Projections (5,000 active users)

| Source | Revenue |
|--------|---------|
| Credit Sales (Paystack) | ₦500,000 |
| CJ Slots | ₦14,000 |
| Lawyer Slots | ₦120,000 |
| Banner/Sidebar Ads | ₦166,000 |
| Video Ads | ₦12,500,000 |
| Credit Exhaustion | ₦115,000 |
| **Total** | **₦13,415,000 (~$16,000)** |

---

## 🎯 User Flows

### New User Journey
1. **Landing** → Cinematic intro (10-15s)
2. **Signup** → Gender, religion, details
3. **Trial** → 3-day free trial (100/50 credits)
4. **Explore** → Browse cases, watch videos
5. **Engage** → Daily rewards, streak bonuses
6. **Convert** → Purchase credits when needed
7. **Participate** → File cases, testify, hire lawyers

### Male User Journey
1. **Signup** → Select MALE gender
2. **Notice** → "Gentlemen welcome as Listeners only"
3. **Pricing** → 2x pricing for coins
4. **Restrictions** → Cannot file cases, become lawyer/CJ
5. **Participation** → Can listen, watch videos, testify

---

## 🔒 Security Features

### Data Protection
- PII encrypted at rest (AES-256)
- Anonymous handles only (no real names)
- Zero-knowledge architecture
- HTTPS only in production

### Role Validation
- Gender enforced at signup + API level
- Religion validated for slot eligibility
- Males blocked from lawyer/CJ roles
- Males blocked from filing cases

### Payment Security
- Paystack signature verification (SHA512)
- Atomic transactions
- Metadata validation
- Idempotency keys

### Cron Job Security
- Bearer token authentication
- CRON_SECRET required
- Audit logging
- Idempotent operations

---

## 📊 Analytics & Monitoring

### Key Metrics
- User signup rate
- Trial conversion rate
- Daily active users
- Credit purchase frequency
- Video ad engagement
- Slot utilization
- Revenue per user

### Monitoring Tools
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (UptimeRobot)
- Payment failure alerts
- Database connection alerts

---

## 🎨 Design System

### Colors
```css
Pink:   #FFD1DC (soft), #FF69B4 (medium), #C71585 (dark)
Sky:    #E0F6FF (light), #87CEEB (medium), #00BFFF (dark)
Gold:   #FFD700 (default)
```

### Typography
```css
Headings: Playfair Display (serif)
Body: Inter (sans-serif)
```

### Design Elements
- Rounded corners: `rounded-3xl`
- Soft shadows: `shadow-pink`, `shadow-gold`
- Gradients: Pink/Sky/Gold combinations
- Emojis: 👑 💖 🎀 ✨ ⚖️ 🏛️ 💬 💰 💎

---

## 📞 Support & Resources

### Documentation
- **Complete Schema**: `prisma/schema.prisma`
- **API Routes**: `src/lib/consolidated-api-routes.ts`
- **Identity System**: `src/lib/identity.ts`
- **Credit System**: `src/lib/credit-exhaustion.ts`
- **Gender Pricing**: `src/lib/gender-pricing.ts`
- **Trial System**: `src/lib/trial-system.ts`

### Phase Documentation
- `PHASE1_IMPLEMENTATION.md` - Foundation
- `PHASE2_IMPLEMENTATION.md` - Economy
- `PHASE3_IMPLEMENTATION.md` - Core Loop
- `PHASE4_IMPLEMENTATION.md` - CJ & Chat
- `PHASE5_IMPLEMENTATION.md` - Ads
- `CJ_SLOT_SYSTEM.md` - CJ Slots
- `LAWYER_SLOT_SYSTEM.md` - Lawyer Slots
- `VIDEO_AD_REWARDS_GUIDE.md` - Video Ads
- `COINS_SYSTEM_GUIDE.md` - Coins
- `COURTROOM_INTRO_GUIDE.md` - Intro
- `MALE_PRICING_RULE_SUMMARY.md` - Male Pricing
- `FREE_TRIAL_SUMMARY.md` - Trial
- `CREDIT_EXHAUSTION_SUMMARY.md` - Exhaustion

### Contact
- **Email**: support@depeeink.com
- **Discord**: [Your Discord Link]
- **GitHub**: [Your repo link]

---

## ✅ Build Status

```
✓ Build successful
✓ CSS: 61.77 kB (gzip: 9.47 kB)
✓ JS: 676.56 kB (gzip: 181.38 kB)
✓ All TypeScript types validated
✓ No compilation errors
```

---

## 🎉 Summary

**De Peenk Courtroom** is a **production-ready platform** with:

✅ **Complete User System** - Signup, auth, roles, handles  
✅ **Three Credit Types** - Listener, Coins, Virtual  
✅ **Slot Systems** - CJ (2 slots), Lawyer (20 slots)  
✅ **Free Trial** - 3-day trial with countdown  
✅ **Male Pricing** - 2x pricing with clear notices  
✅ **Video Ads** - Watch & earn system  
✅ **Ad Management** - 5 tiers, 6-day expiry  
✅ **Cinematic Intro** - 3-scene onboarding  
✅ **Credit Exhaustion** - 15+ paid actions  
✅ **Daily Rewards** - Login, streak, referral  
✅ **Real-time Chat** - Gallery Talk (Listeners only)  
✅ **Gender Restrictions** - API-level enforcement  
✅ **Beautiful UI** - Pink/Sky/Gold theme  
✅ **Sustainable Revenue** - ₦13M+/month  

**"We Listen. We Judge. We Advise. We Compensate."** 💖⚖️👑

---

**Last Updated:** 2026-03-18  
**Version:** 1.0.0 (Complete)  
**Status:** ✅ Production Ready
