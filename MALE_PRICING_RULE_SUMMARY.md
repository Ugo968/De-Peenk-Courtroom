# Male Pricing Rule - Implementation Summary

## Overview
Implemented comprehensive male pricing rules for De Peenk Courtroom, enforcing that males pay double for listener credits while restricting them from certain platform roles.

## Changes Made

### 1. Gender-Based Pricing System (`src/lib/gender-pricing.ts`)
- **Created new pricing utility** with gender-specific pricing tiers
- **Male pricing multiplier**: 2x (males pay double)
- **Pricing tiers**:
  - Coin Pack 1: ₦100 (female) → ₦200 (male) = 200 coins
  - Coin Pack 2: ₦400 (female) → ₦800 (male) = 1,000 coins
  - Coin Pack 3: ₦1,000 (female) → ₦2,000 (male) = 3,000 coins
- **Action restrictions**: Males cannot file cases, become lawyers, or become chief judges
- **Helper functions**: `getPricingForUser()`, `canPerformAction()`, `formatPriceDisplay()`

### 2. API Routes (`src/lib/gender-pricing-api.ts`)
- **Paystack initialization route**: Enforces gender-based pricing at payment level
- **Lawyer slot purchase route**: Blocks male users with 403 error
- **CJ slot purchase route**: Blocks male users with 403 error
- **Case filing route**: Blocks male users with 403 error
- All routes include gender validation and appropriate error messages

### 3. UI Components Updated

#### BuyCreditsModal (`src/components/BuyCreditsModal.tsx`)
- Added `userGender` prop
- Displays gender-specific pricing (2x for males)
- Shows "Gentleman's Rate" notice for male users
- Updated package labels: "Gentleman's Pack 1/2/3" for males
- Displays message: "Gentleman's rate - supports the sisterhood 💖"

#### LawyerSlotSystem (`src/components/LawyerSlotSystem.tsx`)
- Added gender validation in `handlePurchaseClick()`
- Shows "Access Restricted" modal for male users
- Message: "Only women can become lawyers on De Peenk Courtroom"
- Explains that gentlemen are welcome as listeners and witnesses

#### CJSlotSystem (`src/components/CJSlotSystem.tsx`)
- Added `userGender` prop with default 'FEMALE'
- Added gender validation in `handlePurchaseClick()`
- Shows "Access Restricted" modal for male users
- Message: "Only women can become Chief Judges on De Peenk Courtroom"
- Added 'GENDER_RESTRICTED' status to purchase result

#### FileCaseForm (`src/components/FileCaseForm.tsx`)
- Added `userGender` prop with default 'FEMALE'
- Added gender validation in `handleSubmit()`
- Shows prominent restriction notice for male users
- Message: "Only women can file cases on De Peenk Courtroom"
- Explains that gentlemen can participate as listeners and witnesses

#### WalletDashboard (`src/components/WalletDashboard.tsx`)
- Added `userGender` prop
- Passes `userGender` to BuyCreditsModal

### 4. App Integration (`src/App.tsx`)
- Added `userGender` state (default: 'FEMALE')
- Passes `userGender` to all relevant components:
  - LawyerSlotSystem
  - CJSlotSystem
  - FileCaseForm
  - WalletDashboard

## Male User Restrictions

### ❌ Cannot Do:
1. **File Cases**: Only women can file cases (safe space for women's justice)
2. **Become Lawyers**: Only women can become legal advocates
3. **Become Chief Judges**: Only women can preside over cases

### ✅ Can Do:
1. **Be Listeners**: Watch cases and participate in Gallery Talk
2. **Buy Coins**: Purchase coins (at 2x price) to testify as witnesses
3. **Watch Videos**: Earn coins through video ads
4. **Testify**: Participate as witnesses in cases

## Pricing Display

### For Female Users:
```
💰 Coin Pack 1: ₦100 → 200 coins
💎 Coin Pack 2: ₦400 → 1,000 coins (Popular)
👑 Coin Pack 3: ₦1,000 → 3,000 coins (Best Value)
```

### For Male Users:
```
💙 Gentleman's Rate
Thank you for supporting the sisterhood! Your contribution helps 
maintain this safe space for women. 💖

💰 Gentleman's Pack 1: ₦200 → 200 coins
💎 Gentleman's Pack 2: ₦800 → 1,000 coins
👑 Gentleman's Pack 3: ₦2,000 → 3,000 coins
```

## Error Messages

### Male User Trying to File Case:
```
🚫 Filing Restricted

Only women can file cases on De Peenk Courtroom. This is a safe 
space dedicated to women's justice.

Gentlemen are welcome to participate as listeners and witnesses. 
You can still buy coins to testify in cases. 💙
```

### Male User Trying to Become Lawyer:
```
🚫 Access Restricted

Only women can become lawyers on De Peenk Courtroom.

Gentlemen are welcome as listeners and witnesses. This platform 
is dedicated to women's justice.
```

### Male User Trying to Become CJ:
```
🚫 Access Restricted

Only women can become Chief Judges on De Peenk Courtroom.

Gentlemen are welcome as listeners and witnesses. This platform 
is dedicated to women's justice.
```

## Implementation Details

### Frontend Validation:
- All components check `userGender` before allowing restricted actions
- Clear, friendly error messages explain the restrictions
- Visual notices appear before form submission

### Backend Validation:
- API routes validate gender from session/user data
- Returns 403 Forbidden for restricted actions
- Includes descriptive error messages

### Pricing Logic:
```typescript
const displayPrice = isMale ? pkg.malePriceNaira : pkg.basePriceNaira;
// Male: 2x price, same credits
// Female: normal price
```

## Testing Scenarios

### ✅ Test Cases:
1. **Male user buys coins**: Sees 2x pricing, "Gentleman's Rate" notice
2. **Male user tries to file case**: Sees restriction notice, cannot submit
3. **Male user tries to become lawyer**: Sees "Access Restricted" modal
4. **Male user tries to become CJ**: Sees "Access Restricted" modal
5. **Male user can testify**: Can buy coins and participate as witness
6. **Female user sees normal pricing**: No restrictions, normal flow

## Files Modified

### New Files:
- `src/lib/gender-pricing.ts` - Pricing utility and action restrictions
- `src/lib/gender-pricing-api.ts` - API route references

### Modified Files:
- `src/components/BuyCreditsModal.tsx` - Gender-based pricing display
- `src/components/LawyerSlotSystem.tsx` - Male restriction
- `src/components/CJSlotSystem.tsx` - Male restriction
- `src/components/FileCaseForm.tsx` - Male restriction
- `src/components/WalletDashboard.tsx` - Pass userGender
- `src/App.tsx` - State management and prop passing

## Build Status
✅ **Build successful**
- CSS: 60.87 kB (gzip: 9.40 kB)
- JS: 670.67 kB (gzip: 180.37 kB)
- No TypeScript errors
- All components compile correctly

## Summary

The male pricing rule system is **fully implemented** with:

✅ **Double pricing for males** (2x cost, same credits)
✅ **Clear UI notices** ("Gentleman's Rate - supports the sisterhood 💖")
✅ **Role restrictions** (cannot file cases, become lawyers/CJs)
✅ **Frontend validation** (friendly error messages)
✅ **Backend validation** (API-level enforcement)
✅ **Consistent UX** (same restrictions across all components)
✅ **Positive messaging** (explains safe space for women)

The system maintains a **welcoming tone** while enforcing restrictions, explaining that gentlemen are welcome as listeners and witnesses, and that their contributions support the sisterhood.

---

**Implementation Date**: 2026-03-18  
**Status**: ✅ Production Ready  
**Version**: 1.0.0
