# 📥 DOWNLOAD GUIDE - De Peenk Courtroom

## How to Get the Complete Codebase

Since this is a web-based environment, here are **3 ways** to get the complete project:

---

## 🎯 Option 1: Download from Preview (Recommended)

If you're viewing this in a preview environment:

1. **Look for a "Download" button** in the preview interface
2. **Click "Download Project"** or **"Export as ZIP"**
3. **Extract the ZIP file** to your desired location
4. **Open in VSCode:**
   ```bash
   code de-peenk-courtroom
   ```

---

## 🎯 Option 2: Manual Copy-Paste (If No Download Button)

### Step 1: Create Project Structure
```bash
# Create new folder
mkdir de-peenk-courtroom
cd de-peenk-courtroom

# Initialize Vite project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
npm install framer-motion @supabase/supabase-js
```

### Step 2: Copy Files from Workspace

You'll need to copy **80+ files** from this workspace. Here's the complete list:

#### Core Files (Copy First)
```
✅ package.json
✅ vite.config.js
✅ tsconfig.json
✅ index.html
✅ src/main.tsx
✅ src/index.css
✅ src/App.tsx
```

#### Components (35+ files in src/components/)
```
✅ CourtroomIntro.tsx
✅ CourtroomSignup.tsx
✅ CourtroomFloor.tsx
✅ TrialCountdown.tsx
✅ ExhaustionNotice.tsx
✅ RechargeModal.tsx
✅ VirtualGiftModal.tsx
✅ BoostCommentModal.tsx
✅ StarListenerBadgeModal.tsx
✅ DailyRewardModal.tsx
✅ CJSlotSystem.tsx
✅ LawyerSlotSystem.tsx
✅ CJTriageDashboard.tsx
✅ CJPrivateChamber.tsx
✅ LawyerDashboard.tsx
✅ BuyCreditsModal.tsx
✅ WalletDashboard.tsx
✅ FileCaseForm.tsx
✅ HireLawyerModal.tsx
✅ TopBanner.tsx
✅ SidebarAds.tsx
✅ ChamberBillboard.tsx
✅ VideoAdPopup.tsx
✅ VideoAdRewards.tsx
✅ BrandDashboard.tsx
✅ GalleryTalk.tsx
✅ CaseDetailView.tsx
✅ CasesBoard.tsx
✅ HeroSection.tsx
✅ Navbar.tsx
✅ Footer.tsx
✅ IdentityGenerator.tsx
✅ PrismaSchema.tsx
✅ Dashboard.tsx
```

#### Library Files (20+ files in src/lib/)
```
✅ identity.ts
✅ economy.ts
✅ credit-exhaustion.ts
✅ gender-pricing.ts
✅ trial-system.ts
✅ cj-slots.ts
✅ lawyer-slots.ts
✅ ads.ts
✅ ad-video-rewards.ts
✅ mock-data.ts
✅ consolidated-api-routes.ts
✅ prisma-schema.ts
✅ prisma.ts
✅ paystack-api-routes.ts
✅ case-filing-api.ts
✅ case-resolve-api.ts
✅ cj-api.ts
✅ cj-slots-api.ts
✅ lawyer-slots-api.ts
✅ ads-api.ts
✅ ad-video-rewards-api.ts
✅ gender-pricing-api.ts
✅ trial-api.ts
```

#### Hooks
```
✅ src/hooks/useWallet.ts
```

#### Database
```
✅ prisma/schema.prisma
```

### Step 3: Run the Project
```bash
npm run dev
```

Open: http://localhost:5173

---

## 🎯 Option 3: Use Git (If Available)

If this workspace is connected to Git:

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project
cd de-peenk-courtroom

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## 📋 Complete File Checklist

Use this checklist to ensure you have all files:

### ✅ Core Configuration (7 files)
- [ ] package.json
- [ ] package-lock.json
- [ ] vite.config.js
- [ ] tsconfig.json
- [ ] index.html
- [ ] src/main.tsx
- [ ] src/index.css

### ✅ Main App (1 file)
- [ ] src/App.tsx

### ✅ Components (35 files)
- [ ] src/components/CourtroomIntro.tsx
- [ ] src/components/CourtroomSignup.tsx
- [ ] src/components/CourtroomFloor.tsx
- [ ] src/components/TrialCountdown.tsx
- [ ] src/components/ExhaustionNotice.tsx
- [ ] src/components/RechargeModal.tsx
- [ ] src/components/VirtualGiftModal.tsx
- [ ] src/components/BoostCommentModal.tsx
- [ ] src/components/StarListenerBadgeModal.tsx
- [ ] src/components/DailyRewardModal.tsx
- [ ] src/components/CJSlotSystem.tsx
- [ ] src/components/LawyerSlotSystem.tsx
- [ ] src/components/CJTriageDashboard.tsx
- [ ] src/components/CJPrivateChamber.tsx
- [ ] src/components/LawyerDashboard.tsx
- [ ] src/components/BuyCreditsModal.tsx
- [ ] src/components/WalletDashboard.tsx
- [ ] src/components/FileCaseForm.tsx
- [ ] src/components/HireLawyerModal.tsx
- [ ] src/components/TopBanner.tsx
- [ ] src/components/SidebarAds.tsx
- [ ] src/components/ChamberBillboard.tsx
- [ ] src/components/VideoAdPopup.tsx
- [ ] src/components/VideoAdRewards.tsx
- [ ] src/components/BrandDashboard.tsx
- [ ] src/components/GalleryTalk.tsx
- [ ] src/components/CaseDetailView.tsx
- [ ] src/components/CasesBoard.tsx
- [ ] src/components/HeroSection.tsx
- [ ] src/components/Navbar.tsx
- [ ] src/components/Footer.tsx
- [ ] src/components/IdentityGenerator.tsx
- [ ] src/components/PrismaSchema.tsx
- [ ] src/components/Dashboard.tsx

### ✅ Library Files (23 files)
- [ ] src/lib/identity.ts
- [ ] src/lib/economy.ts
- [ ] src/lib/credit-exhaustion.ts
- [ ] src/lib/gender-pricing.ts
- [ ] src/lib/trial-system.ts
- [ ] src/lib/cj-slots.ts
- [ ] src/lib/lawyer-slots.ts
- [ ] src/lib/ads.ts
- [ ] src/lib/ad-video-rewards.ts
- [ ] src/lib/mock-data.ts
- [ ] src/lib/consolidated-api-routes.ts
- [ ] src/lib/prisma-schema.ts
- [ ] src/lib/prisma.ts
- [ ] src/lib/paystack-api-routes.ts
- [ ] src/lib/case-filing-api.ts
- [ ] src/lib/case-resolve-api.ts
- [ ] src/lib/cj-api.ts
- [ ] src/lib/cj-slots-api.ts
- [ ] src/lib/lawyer-slots-api.ts
- [ ] src/lib/ads-api.ts
- [ ] src/lib/ad-video-rewards-api.ts
- [ ] src/lib/gender-pricing-api.ts
- [ ] src/lib/trial-api.ts

### ✅ Hooks (1 file)
- [ ] src/hooks/useWallet.ts

### ✅ Database (1 file)
- [ ] prisma/schema.prisma

### ✅ Documentation (20+ files)
- [ ] README.md
- [ ] PROJECT_COMPLETE.md
- [ ] COMPLETE_IMPLEMENTATION_GUIDE.md
- [ ] COMPLETE_PLATFORM_DOCUMENTATION.md
- [ ] DOWNLOAD_GUIDE.md (this file)
- [ ] PHASE3_IMPLEMENTATION.md
- [ ] PHASE4_IMPLEMENTATION.md
- [ ] PHASE5_IMPLEMENTATION.md
- [ ] CJ_SLOT_SYSTEM.md
- [ ] LAWYER_SLOT_SYSTEM.md
- [ ] VIDEO_AD_REWARDS_GUIDE.md
- [ ] COINS_SYSTEM_GUIDE.md
- [ ] COURTROOM_INTRO_GUIDE.md
- [ ] MALE_PRICING_RULE_SUMMARY.md
- [ ] FREE_TRIAL_SUMMARY.md
- [ ] CREDIT_EXHAUSTION_SUMMARY.md
- [ ] ENVIRONMENT_VARIABLES.md

**Total: 87+ files**

---

## 🔧 After Downloading

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to: http://localhost:5173

### Step 4: Experience the Platform
- 🎬 Watch the cinematic intro
- 📝 Sign up with gender/religion
- 💺 Select your seat
- 🏠 Explore all 15+ pages
- 💰 Test the credit system
- 👑 Try CJ/Lawyer dashboards
- 💬 Experience Gallery Talk

---

## 📦 Required Dependencies

The `package.json` should include:

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "framer-motion": "^10.x",
    "@supabase/supabase-js": "^2.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "@vitejs/plugin-react": "^4.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "autoprefixer": "^10.x",
    "postcss": "^8.x"
  }
}
```

---

## 🎨 Tailwind Configuration

Make sure `tailwind.config.js` includes the custom theme:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          100: '#FFD1DC',
          400: '#FF69B4',
          600: '#C71585',
        },
        sky: {
          100: '#E0F6FF',
          300: '#87CEEB',
          500: '#00BFFF',
        },
        gold: {
          100: '#FFF9DB',
          400: '#FFEC85',
          500: '#FFD700',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 🚀 Quick Start Commands

```bash
# 1. Create project
mkdir de-peenk-courtroom
cd de-peenk-courtroom

# 2. Initialize Vite
npm create vite@latest . -- --template react-ts

# 3. Install dependencies
npm install
npm install framer-motion @supabase/supabase-js

# 4. Copy all files from workspace
# (Use the file list above)

# 5. Run development server
npm run dev

# 6. Open browser
# http://localhost:5173
```

---

## 📞 Need Help?

If you encounter any issues:

1. **Check the documentation:**
   - `README.md` - Project overview
   - `COMPLETE_IMPLEMENTATION_GUIDE.md` - Full guide
   - `PROJECT_COMPLETE.md` - Complete status

2. **Verify all files are copied:**
   - Use the checklist above
   - Ensure no files are missing

3. **Check dependencies:**
   ```bash
   npm install
   ```

4. **Clear cache and rebuild:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

---

## 🎉 You're Ready!

Once you have all the files copied and dependencies installed, you'll have the **complete De Peenk Courtroom platform** running locally in VSCode!

**Features to test:**
- ✅ Cinematic intro (3 scenes)
- ✅ Signup with gender/religion
- ✅ Seat selection
- ✅ Trial countdown timer
- ✅ All 15+ pages
- ✅ Credit system
- ✅ Male 2x pricing
- ✅ CJ & Lawyer slots
- ✅ Video ad rewards
- ✅ Gallery Talk
- ✅ And much more!

**"We Listen. We Judge. We Advise. We Compensate."** 💖⚖️👑

---

**Last Updated:** 2026-03-18  
**Status:** ✅ Ready to Download & Run
