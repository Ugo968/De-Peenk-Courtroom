# 📤 GitHub Publishing Guide

## Complete Step-by-Step Instructions to Publish De Peenk Courtroom to GitHub

---

## ✅ Prerequisites

Before you start, make sure you have:

- [ ] GitHub account (sign up at https://github.com if you don't have one)
- [ ] Git installed on your computer (check with `git --version`)
- [ ] All project files ready (they are!)
- [ ] Internet connection

---

## 🎯 Step 1: Create GitHub Repository

### Option A: Via GitHub Website (Recommended)

1. **Go to GitHub**
   - Visit: https://github.com/new

2. **Fill in repository details**
   - **Repository name**: `de-peenk-courtroom`
   - **Description**: `A gamified, highly secure dispute resolution platform for women`
   - **Public** or **Private** (your choice)
   - ✅ **Initialize this repository with**: 
     - ❌ DO NOT check "Add a README file" (we already have one)
     - ❌ DO NOT check "Add .gitignore" (we already have one)
     - ❌ DO NOT check "Choose a license" (add later if needed)

3. **Click "Create repository"**

4. **Copy the repository URL**
   - It will look like: `https://github.com/YOUR_USERNAME/de-peenk-courtroom.git`

### Option B: Via GitHub CLI (If you have it installed)

```bash
gh repo create de-peenk-courtroom --public --description "A gamified, highly secure dispute resolution platform for women"
```

---

## 🚀 Step 2: Initialize Git and Push

### If Starting Fresh (No Git Yet)

Open your terminal in the project root and run:

```bash
# Initialize git repository
git init

# Add all files (respects .gitignore)
git add .

# Create first commit
git commit -m "🎉 Initial commit: Complete De Peenk Courtroom platform

Features:
- Cinematic 3-scene intro
- Signup with gender/religion
- 3-day free trial with countdown
- 3 credit types (Listener, Coins, Virtual)
- CJ & Lawyer slot systems
- Video ad rewards
- Real-time Gallery Talk
- Ad management (5 tiers)
- Male 2x pricing
- Credit exhaustion system
- Daily rewards & streaks
- 50+ UI components
- Complete documentation"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/de-peenk-courtroom.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### If Git is Already Initialized

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "🎉 Complete De Peenk Courtroom platform with all features"

# Add remote (if not already added)
git remote add origin https://github.com/YOUR_USERNAME/de-peenk-courtroom.git

# Push
git push -u origin main
```

---

## 🔐 Step 3: Authentication

When you run `git push`, GitHub will ask for authentication:

### Option A: Personal Access Token (Recommended)

1. **Create a token**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name: `de-peenk-courtroom`
   - Select scopes: ✅ `repo` (full control of private repositories)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Use the token when prompted**
   - When Git asks for password, paste your token instead
   - Or use credential helper to save it:
     ```bash
     git config --global credential.helper store
     ```

### Option B: GitHub CLI (Easiest)

If you have GitHub CLI installed:

```bash
gh auth login
```

Follow the prompts, then push normally.

### Option C: SSH Keys (Advanced)

If you prefer SSH:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy the output and add to https://github.com/settings/keys

# Use SSH URL instead
git remote set-url origin git@github.com:YOUR_USERNAME/de-peenk-courtroom.git
git push -u origin main
```

---

## ✅ Step 4: Verify Push

After pushing, you should see output like:

```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 8 threads
Compressing objects: 100% (120/120), done.
Writing objects: 100% (150/150), 1.23 MiB | 5.67 MiB/s, done.
Total 150 (delta 30), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (30/30), done.
To https://github.com/YOUR_USERNAME/de-peenk-courtroom.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

**Check GitHub**: Refresh your repository page - all files should be there!

---

## 📋 What Gets Pushed

### ✅ Included (87+ files)

**Source Code:**
- All React components (35+)
- All library files (23+)
- Hooks and utilities
- Main App.tsx

**Configuration:**
- package.json
- vite.config.js
- tsconfig.json
- .gitignore
- .env.example

**Documentation:**
- README.md
- 20+ guide files
- Prisma schema

**Assets:**
- index.html
- CSS files
- Audio placeholders

### ❌ Excluded (via .gitignore)

- `node_modules/` (dependencies - install with `npm install`)
- `dist/` (build output)
- `.env` files (secrets)
- IDE settings
- OS files

---

## 🔧 Step 5: Post-Push Setup

### 1. Set Up Repository Settings

Go to your repository on GitHub and configure:

**Settings → General:**
- ✅ Allow auto-merge
- ✅ Automatically delete head branches

**Settings → Branches:**
- Add branch protection rule for `main`
- ✅ Require pull request reviews (if working with team)

**Settings → Secrets and variables → Actions:**
- Add your environment variables:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `PAYSTACK_SECRET_KEY`
  - `SUPABASE_URL`
  - etc.

### 2. Add Topics/Tags

On your repo page, click "About" → "Edit" and add topics:
- `nextjs`
- `typescript`
- `tailwindcss`
- `prisma`
- `supabase`
- `paystack`
- `women-empowerment`
- `courtroom`
- `gamification`

### 3. Enable GitHub Pages (Optional)

If you want to host the demo:

**Settings → Pages:**
- Source: Deploy from a branch
- Branch: `main` / `root`
- Save

Your site will be live at: `https://YOUR_USERNAME.github.io/de-peenk-courtroom`

---

## 🔄 Step 6: Future Updates

When you make changes:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "✨ Add new feature: XYZ"

# Push to GitHub
git push
```

### Commit Message Guidelines

Use emoji prefixes for clarity:
- 🎉 `Initial commit` or `Major feature`
- ✨ `New feature`
- 🐛 `Bug fix`
- 📝 `Documentation update`
- 🎨 `UI/Style changes`
- ♻️ `Code refactoring`
- ⚡ `Performance improvements`
- 🔒 `Security fixes`

---

## 📊 Step 7: Add README Badges (Optional)

Add these badges to your README for a professional look:

```markdown
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/de-peenk-courtroom?style=social)
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/de-peenk-courtroom?style=social)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/de-peenk-courtroom)
![GitHub pull requests](https://img.shields.io/github/issues-pr/YOUR_USERNAME/de-peenk-courtroom)
![License](https://img.shields.io/github/license/YOUR_USERNAME/de-peenk-courtroom)
![GitHub last commit](https://img.shields.io/github/last-commit/YOUR_USERNAME/de-peenk-courtroom)
```

---

## 🎯 Quick Command Summary

Here's everything in one place:

```bash
# 1. Create .gitignore (already done)
# 2. Create .env.example (already done)

# 3. Initialize git
git init

# 4. Add all files
git add .

# 5. Commit
git commit -m "🎉 Initial commit: Complete De Peenk Courtroom platform"

# 6. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/de-peenk-courtroom.git

# 7. Rename to main
git branch -M main

# 8. Push
git push -u origin main
```

---

## 🆘 Troubleshooting

### Issue: "fatal: remote origin already exists"

**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/de-peenk-courtroom.git
```

### Issue: "Authentication failed"

**Solution:**
- Use Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`

### Issue: "Updates were rejected because the remote contains work"

**Solution:**
```bash
# Pull first, then push
git pull origin main --rebase
git push -u origin main
```

### Issue: Large files won't push

**Solution:**
- Check .gitignore is working
- Remove large files from git:
  ```bash
  git rm -r --cached node_modules
  git commit -m "Remove node_modules"
  git push
  ```

---

## ✅ Checklist

Before you finish, verify:

- [ ] Repository created on GitHub
- [ ] All files pushed successfully
- [ ] README displays correctly
- [ ] .gitignore is working (no node_modules)
- [ ] .env.example is present (no secrets)
- [ ] Repository description added
- [ ] Topics/tags added
- [ ] Branch protection set up (optional)
- [ ] GitHub Secrets configured (for deployment)

---

## 🎉 You're Done!

Your De Peenk Courtroom project is now live on GitHub!

**Share it:**
- Copy the repository URL
- Share with your team
- Add to your portfolio
- Show it off! 🎊

**Repository URL:** `https://github.com/YOUR_USERNAME/de-peenk-courtroom`

---

## 📞 Need Help?

- **Git documentation**: https://git-scm.com/doc
- **GitHub guides**: https://guides.github.com
- **GitHub support**: https://support.github.com

---

**"We Listen. We Judge. We Advise. We Compensate."** 💖⚖️👑

Your platform is ready to share with the world! 🌍✨
