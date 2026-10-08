# 🚀 QUICK START - De Peenk Courtroom

## Get the Complete Codebase Running in 5 Minutes

---

## 📥 Step 1: Get the Code

### Option A: Download from Preview (Easiest)
1. Look for **"Download"** or **"Export"** button in your preview interface
2. Click **"Download Project as ZIP"**
3. Extract the ZIP file

### Option B: Manual Setup
```bash
# Create project folder
mkdir de-peenk-courtroom
cd de-peenk-courtroom

# Initialize with Vite
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
npm install framer-motion @supabase/supabase-js
```

---

## 📋 Step 2: Copy All Files

You need to copy **87+ files** from this workspace. Here's the structure:

```
de-peenk-courtroom/
├── 📄 Configuration Files (7)
│   ├── package.json
│   ├── vite.config.js
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── index.css
│       └── App.tsx
│
├── 🎨 Components (35 files in src/components/)
│   ├── CourtroomIntro.tsx
│   ├── CourtroomSignup.tsx
│   ├── CourtroomFloor.tsx
│   ├── TrialCountdown.tsx
│   ├── ... (31 more)
│   └── Dashboard.tsx
│
├── 📚 Library (23 files in src/lib/)
│   ├── identity.ts
│   ├── economy.ts
│   ├── credit-exhaustion.ts
│   ├── ... (20 more)
│   └── trial-api.ts
│
├── 🪝 Hooks (1 file)
│   └── src/hooks/useWallet.ts
│
├── 🗄️ Database (1 file)
│   └── prisma/schema.prisma
│
└── 📚 Documentation (20+ files)
    ├── README.md
    ├── DOWNLOAD_GUIDE.md
    └── ... (18 more)
```

**Complete file list:** See `DOWNLOAD_GUIDE.md`

---

## ⚡ Step 3: Run the Project

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Open browser:** http://localhost:5173

---

## 🎯 What You'll See

### First Visit
1. 🎬 **Cinematic Intro** (3 scenes, ~15 seconds)
   - Gavel animation with "BANG!" effect
   - Signup form with gender/religion
   - Courtroom floor with seat selection

2. 🏠 **Main Dashboard**
   - Trial countdown timer (top-right)
   - Wallet bar (coins, virtual credits, wins)
   - Navigation to 15+ pages

### Pages to Explore
- 🏠 Home - Hero section
- ⚖️ Cases - Browse all cases
- 🎀 File Case - Submit new case (female only)
- 👩‍⚖️ Lawyer - Lawyer dashboard
- 👩‍⚖️ Lawyer Slots - Become lawyer (₦2,000)
- 👑 CJ Slots - Become Chief Judge (₦3,500)
- 👑 CJ Dashboard - Triage cases
- 🏛️ CJ Chamber - Deliver rulings
- 🎬 Video Rewards - Watch & earn
- 💰 Wallet - Buy coins
- 📢 Brands - Advertiser interface
- 🎭 Identity - Generate handles
- 🗄️ Schema - View database
- 📊 Dashboard - Overview

---

## 🧪 Test Different User Types

### Female User (Full Access)
```
1. Sign up as FEMALE
2. See normal pricing
3. File case (200 coins)
4. Hire lawyer (500 coins)
5. Become lawyer (₦2,000)
6. Become CJ (₦3,500)
```

### Male User (Restricted)
```
1. Sign up as MALE
2. See "Gentleman's Rate" (2x pricing)
3. Try to file case → BLOCKED
4. Try to become lawyer → BLOCKED
5. Buy coins at 2x price
6. Watch videos for credits
```

---

## 🔧 Troubleshooting

### Issue: Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Components not rendering
```bash
# Check all files are copied
# See DOWNLOAD_GUIDE.md for complete list
```

### Issue: TypeScript errors
```bash
# Regenerate types
npx tsc --noEmit
```

---

## 📚 Documentation

- **README.md** - Project overview
- **DOWNLOAD_GUIDE.md** - Complete download instructions
- **COMPLETE_IMPLEMENTATION_GUIDE.md** - Full implementation
- **PROJECT_COMPLETE.md** - Complete status

---

## 🎉 You're Ready!

Once you have all files copied and dependencies installed, you'll have the **complete De Peenk Courtroom platform** running locally!

**"We Listen. We Judge. We Advise. We Compensate."** 💖⚖️👑

---

## 📊 Project Stats

- **Total Files:** 87+
- **Components:** 35+
- **Library Files:** 23+
- **Documentation:** 20+ files
- **Build Size:** ~676 KB (gzip: 181 KB)
- **Build Status:** ✅ Successful

---

**Need Help?** Check `DOWNLOAD_GUIDE.md` for detailed instructions.
