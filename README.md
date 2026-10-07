# 🎉 De Peenk Courtroom - Complete Project

## "We Listen. We Judge. We Advise. We Compensate." ⚖️💖

A gamified, highly secure dispute resolution platform for women built with Next.js 14, TypeScript, Tailwind CSS, Prisma, PostgreSQL (Supabase), NextAuth, and Paystack.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# Copy the schema
cp prisma/schema.prisma ./prisma/schema.prisma

# Generate Prisma Client
npx prisma generate

# Push to database (development)
npx prisma db push

# Or run migrations (production)
npx prisma migrate dev --name init
```

### 3. Environment Variables
Create `.env.local`:
```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/depeeink"

# Auth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Paystack
PAYSTACK_SECRET_KEY="sk_test_xxx"
PAYSTACK_PUBLIC_KEY="pk_test_xxx"

# Supabase
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_ANON_KEY="xxx"

# Cron Jobs
CRON_SECRET="your-cron-secret"

# Encryption
ENCRYPTION_KEY="your-32-char-encryption-key"
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. View in Preview
Open your browser to see the complete platform with all features!

---

## 📁 Project Structure

```
de-peenk-courtroom/
├── prisma/
│   └── schema.prisma              # Complete database schema
├── src/
│   ├── app/                       # Next.js pages (reference)
│   ├── components/                # React components
│   │   ├── CourtroomIntro.tsx     # Cinematic 3-scene intro
│   │   ├── CourtroomSignup.tsx    # Signup with gender/religion
│   │   ├── CourtroomFloor.tsx     # Seat selection UI
│   │   ├── TrialCountdown.tsx     # Trial countdown timer
│   │   ├── ExhaustionNotice.tsx   # Balance warnings
│   │   ├── RechargeModal.tsx      # Recharge interface
│   │   ├── VirtualGiftModal.tsx   # Send virtual gifts
│   │   ├── BoostCommentModal.tsx  # Boost comments
│   │   ├── StarListenerBadgeModal.tsx # Star badge
│   │   ├── DailyRewardModal.tsx   # Daily rewards
│   │   ├── CJSlotSystem.tsx       # CJ slot management
│   │   ├── LawyerSlotSystem.tsx   # Lawyer slot management
│   │   ├── BuyCreditsModal.tsx    # Purchase coins
│   │   ├── FileCaseForm.tsx       # File new case
│   │   ├── LawyerDashboard.tsx    # Lawyer interface
│   │   ├── CJTriageDashboard.tsx  # CJ triage
│   │   ├── CJPrivateChamber.tsx   # CJ rulings
│   │   ├── GalleryTalk.tsx        # Real-time chat
│   │   ├── VideoAdRewards.tsx     # Watch & earn
│   │   ├── TopBanner.tsx          # Header ads
│   │   ├── SidebarAds.tsx         # Sidebar ads
│   │   ├── ChamberBillboard.tsx   # CJ chamber ads
│   │   ├── VideoAdPopup.tsx       # Video popups
│   │   ├── BrandDashboard.tsx     # Advertiser interface
│   │   ├── WalletDashboard.tsx    # Wallet management
│   │   └── ... (more components)
│   ├── lib/                       # Utilities & logic
│   │   ├── identity.ts            # Anonymous handle generation
│   │   ├── economy.ts             # Credit packages & costs
│   │   ├── credit-exhaustion.ts   # Credit system logic
│   │   ├── gender-pricing.ts      # Male 2x pricing
│   │   ├── trial-system.ts        # Free trial logic
│   │   ├── cj-slots.ts            # CJ slot management
│   │   ├── lawyer-slots.ts        # Lawyer slot management
│   │   ├── ads.ts                 # Ad management
│   │   ├── consolidated-api-routes.ts # All API routes
│   │   └── ... (more utilities)
│   ├── hooks/                     # Custom React hooks
│   │   └── useWallet.ts           # Wallet state management
│   └── App.tsx                    # Main app component
├── public/
│   └── audio/                     # Audio files for intro
│       ├── gavel-hit.mp3
│       ├── melodious-chime.mp3
│       └── welcome-voice.mp3
├── COMPLETE_IMPLEMENTATION_GUIDE.md # Full documentation
└── README.md                      # This file
```

---

## 🎯 Key Features

### Phase 1: Foundation
- ✅ Anonymous identity system
- ✅ Pink/Sky/Gold theme
- ✅ Prisma schema

### Phase 2: Economy
- ✅ Paystack integration
- ✅ Credit packages
- ✅ Virtual rewards

### Phase 3: Core Loop
- ✅ Case filing with routing
- ✅ Lawyer dashboard
- ✅ Case resolution

### Phase 4: CJ & Chat
- ✅ CJ triage dashboard
- ✅ Private chamber
- ✅ Real-time Gallery Talk

### Phase 5: Ads
- ✅ 5-tier ad system
- ✅ Brand dashboard
- ✅ Layout integration

### Change 1: New Motto
- ✅ "We Listen. We Judge. We Advise. We Compensate."

### Change 2: CJ Slot System
- ✅ 2 slots (Muslim/Christian)
- ✅ 14-day tenure
- ✅ Queue system

### Change 3: Lawyer Slot System
- ✅ 20 slots (10 Muslim/10 Christian)
- ✅ Gender restriction (female only)
- ✅ Waitlist system

### Change 4: Video Ad Rewards
- ✅ 10 credits per video
- ✅ 20 videos/day limit
- ✅ Lawyer/CJ exemption

### Change 5: Coins System
- ✅ Renamed credits to coins
- ✅ 3 coin packs
- ✅ Hire lawyer feature (500 coins)

### Change 6: Cinematic Intro
- ✅ 3-scene animation
- ✅ Gavel hit effect
- ✅ Signup with gender/religion
- ✅ Seat selection UI

### Change 7: Male Pricing Rule
- ✅ 2x pricing for males
- ✅ Role restrictions
- ✅ API-level enforcement

### Change 8: Free Trial
- ✅ 3-day trial
- ✅ Countdown timer
- ✅ Automatic expiry

### Credit Exhaustion System
- ✅ 3 credit types
- ✅ 15+ paid actions
- ✅ Daily rewards
- ✅ Exhaustion notices

---

## 👥 User Roles

### Listener (FL-/ML-)
- Browse cases
- Watch Gallery Talk
- Watch video ads
- Send virtual gifts
- Boost comments
- Vote in polls
- Get star badge

### Lawyer (LW-)
- Handle cases
- Submit verdicts
- Earn virtual credits
- 14-day tenure
- Female only

### Chief Judge (CJ-)
- Triage cases
- Deliver rulings
- Manage chamber
- 14-day tenure
- Female only

### Plaintiff (PT-)
- File cases
- Hire lawyers
- Testify
- Female only

---

## 💰 Pricing

### Coin Packs
| Pack | Female | Male | Credits |
|------|--------|------|---------|
| Pack 1 | ₦100 | ₦200 | 200 |
| Pack 2 | ₦400 | ₦800 | 1,000 |
| Pack 3 | ₦1,000 | ₦2,000 | 3,000 |

### Slot Purchases
| Role | Price | Duration | Slots |
|------|-------|----------|-------|
| Lawyer | ₦2,000 | 14 days | 20 total |
| Chief Judge | ₦3,500 | 14 days | 2 total |

### Action Costs
| Action | Cost | Credit Type |
|--------|------|-------------|
| File case | 200 | Coins |
| Hire lawyer | 500 | Coins |
| Testify | 200 | Coins |
| Object | 100 | Coins |
| Virtual gift | 50 | Listener |
| Boost comment | 100 | Listener |
| Unlock case | 25 | Listener |
| Poll vote | 10 | Listener |
| Star badge | 200 | Listener |

---

## 🎨 Design System

### Colors
- **Pink**: #FFD1DC, #FF69B4, #C71585
- **Sky**: #E0F6FF, #87CEEB, #00BFFF
- **Gold**: #FFD700

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Elements
- Rounded corners: `rounded-3xl`
- Soft shadows: `shadow-pink`, `shadow-gold`
- Gradients: Pink/Sky/Gold
- Emojis: 👑 💖 🎀 ✨ ⚖️ 🏛️ 💬 💰 💎

---

## 🔒 Security

### Data Protection
- ✅ PII encrypted at rest
- ✅ Anonymous handles only
- ✅ Zero-knowledge architecture
- ✅ HTTPS only

### Validation
- ✅ Gender enforced at API level
- ✅ Religion validated for slots
- ✅ Males blocked from lawyer/CJ
- ✅ Males blocked from filing cases

### Payments
- ✅ Paystack signature verification
- ✅ Atomic transactions
- ✅ Metadata validation

---

## 📊 Revenue Model

### Monthly Projections (5,000 users)
- Credit Sales: ₦500,000
- CJ Slots: ₦14,000
- Lawyer Slots: ₦120,000
- Ads: ₦166,000
- Video Ads: ₦12,500,000
- Credit Exhaustion: ₦115,000
- **Total: ₦13,415,000 (~$16,000)**

---

## 📚 Documentation

### Complete Guides
- `COMPLETE_IMPLEMENTATION_GUIDE.md` - Full implementation
- `COMPLETE_PLATFORM_DOCUMENTATION.md` - Platform overview
- `prisma/schema.prisma` - Database schema
- `src/lib/consolidated-api-routes.ts` - All API routes

### Phase Documentation
- `PHASE1_IMPLEMENTATION.md` - Foundation
- `PHASE2_IMPLEMENTATION.md` - Economy
- `PHASE3_IMPLEMENTATION.md` - Core Loop
- `PHASE4_IMPLEMENTATION.md` - CJ & Chat
- `PHASE5_IMPLEMENTATION.md` - Ads

### Feature Documentation
- `CJ_SLOT_SYSTEM.md` - CJ slots
- `LAWYER_SLOT_SYSTEM.md` - Lawyer slots
- `VIDEO_AD_REWARDS_GUIDE.md` - Video ads
- `COINS_SYSTEM_GUIDE.md` - Coins
- `COURTROOM_INTRO_GUIDE.md` - Intro
- `MALE_PRICING_RULE_SUMMARY.md` - Male pricing
- `FREE_TRIAL_SUMMARY.md` - Trial
- `CREDIT_EXHAUSTION_SUMMARY.md` - Exhaustion

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables
Set all variables in Vercel dashboard:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- PAYSTACK_SECRET_KEY
- PAYSTACK_PUBLIC_KEY
- SUPABASE_URL
- SUPABASE_ANON_KEY
- CRON_SECRET
- ENCRYPTION_KEY

### Cron Jobs
Add to `vercel.json`:
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

---

## 🎉 Preview the Complete Project

To see the complete project in action:

1. **Run the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser** to `http://localhost:3000`

3. **Experience the full flow:**
   - Cinematic intro (3 scenes)
   - Signup with gender/religion
   - Seat selection
   - Dashboard with trial countdown
   - Browse cases
   - File a case (female only)
   - Lawyer dashboard
   - CJ dashboard
   - Gallery Talk
   - Video rewards
   - Buy coins
   - And much more!

4. **Test different user types:**
   - Female user (full access)
   - Male user (restricted, 2x pricing)
   - Trial user (3-day countdown)
   - Lawyer (virtual credits)
   - Chief Judge (royal interface)

---

## 📞 Support

- **Email**: support@depeeink.com
- **Discord**: [Your Discord Link]
- **GitHub Issues**: [Your repo link]

---

## 🙏 Acknowledgments

Built with:
- Next.js by Vercel
- Supabase
- Paystack
- Prisma
- Tailwind CSS
- Framer Motion

Special thanks to all the women who inspired this platform.

---

**"We Listen. We Judge. We Advise. We Compensate."** ⚖️💖👑

*Empowering women through community-driven justice.*

---

## 📝 License

MIT License - See LICENSE file for details

---

**Last Updated:** 2026-03-18  
**Version:** 1.0.0 (Complete)  
**Status:** ✅ Production Ready
