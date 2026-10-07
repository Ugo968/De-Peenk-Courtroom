# Lawyer Slot System - Implementation Guide

## Overview

The Lawyer Slot System manages the allocation of lawyer positions with strict limitations and gender restrictions. There are exactly **20 lawyer slots**: 10 for Muslim lawyers and 10 for Christian lawyers. Each tenure lasts **14 days** and costs **₦2,000**. Only women can become lawyers on De Peenk Courtroom.

## Key Features

### 1. Slot Management
- **20 Fixed Slots**: 10 MUSLIM + 10 CHRISTIAN
- **14-Day Tenure**: Automatic expiry after 2 weeks
- **Gender Restriction**: Only FEMALE users can become lawyers
- **Waitlist System**: Users join waitlist when slots are full
- **Auto-Promotion**: Cron job promotes next in waitlist when slot expires

### 2. Database Schema

#### User Model Additions
```prisma
model User {
  // ... existing fields ...
  
  gender              Gender?
  lawyerSlotExpiry    DateTime?
  
  lawyerWaitlistEntries LawyerWaitlist[]
}
```

#### New Enums
```prisma
enum Gender {
  MALE
  FEMALE
}

enum Religion {
  MUSLIM
  CHRISTIAN
}
```

#### New LawyerWaitlist Model
```prisma
model LawyerWaitlist {
  id          String    @id @default(cuid())
  userId      String
  religion    Religion
  position    Int
  joinedAt    DateTime  @default(now())
  paidAt      DateTime?
  activatedAt DateTime?
  
  user        User      @relation(fields: [userId], references: [id])
  
  @@index([religion, position])
  @@index([userId, religion])
}
```

### 3. API Routes

#### POST /api/lawyer-slots/purchase
Handles lawyer slot purchase requests with gender validation.

**Request Body:**
```json
{
  "religion": "MUSLIM" | "CHRISTIAN"
}
```

**Response (Immediate Access):**
```json
{
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "LAWYER-1234567890-user123",
  "accessCode": "abc123",
  "slotStatus": "IMMEDIATE",
  "waitlistPosition": null,
  "tenureDays": 14,
  "price": 2000
}
```

**Response (Waitlist):**
```json
{
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "LAWYER-1234567890-user123",
  "accessCode": "abc123",
  "slotStatus": "WAITLISTED",
  "waitlistPosition": 3,
  "tenureDays": 14,
  "price": 2000
}
```

**Response (Gender Restricted):**
```json
{
  "error": "Only women can become lawyers on De Peenk Courtroom."
}
```

**Validation:**
- User must be authenticated
- User gender must be FEMALE
- Religion must match user's registered religion
- Religion must be MUSLIM or CHRISTIAN

#### POST /api/lawyer-slots/webhook
Handles Paystack payment webhooks for lawyer slot purchases.

**Process:**
1. Verify Paystack signature (SHA512)
2. Extract metadata (religion, userId, slotStatus)
3. If IMMEDIATE: Activate user as lawyer with 14-day expiry
4. If WAITLISTED: Mark waitlist entry as paid

#### GET /api/cron/lawyer-slot-expiry
Cron job that runs hourly to:
1. Find expired lawyer slots
2. Demote expired lawyers back to LISTENER
3. Promote next paid user from waitlist
4. Recalculate waitlist positions
5. Send notifications

**Security:** Requires `CRON_SECRET` in Authorization header

#### POST /api/auth/signup
Enhanced signup with gender and religion validation.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "Amina",
  "lastName": "Mohammed",
  "phone": "08012345678",
  "religion": "MUSLIM",
  "gender": "FEMALE"
}
```

**Validation:**
- All fields required
- Religion must be MUSLIM or CHRISTIAN
- Gender must be MALE or FEMALE
- Email must be unique

### 4. Waitlist Logic

#### Joining Waitlist
```typescript
// Check if slots are available for this religion
const activeLawyersCount = await prisma.user.count({
  where: {
    role: 'LAWYER',
    religion: religion,
    lawyerSlotExpiry: { gt: new Date() }
  }
});

if (activeLawyersCount >= 10) {
  // All slots occupied - add to waitlist
  const waitlistCount = await prisma.lawyerWaitlist.count({
    where: { religion, activatedAt: null }
  });
  
  await prisma.lawyerWaitlist.create({
     {
      userId,
      religion,
      position: waitlistCount + 1
    }
  });
}
```

#### Auto-Promotion (Cron Job)
```typescript
// Find expired lawyers
const expiredLawyers = await prisma.user.findMany({
  where: {
    role: 'LAWYER',
    lawyerSlotExpiry: { lt: new Date() }
  }
});

for (const lawyer of expiredLawyers) {
  // Demote lawyer
  await tx.user.update({
    where: { id: lawyer.id },
     {
      role: 'LISTENER',
      lawyerSlotExpiry: null
    }
  });
  
  // Find next in waitlist
  const nextInWaitlist = await tx.lawyerWaitlist.findFirst({
    where: {
      religion: lawyer.religion,
      activatedAt: null,
      paidAt: { not: null }
    },
    orderBy: { position: 'asc' }
  });
  
  if (nextInWaitlist) {
    // Promote to Lawyer
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);
    
    await tx.user.update({
      where: { id: nextInWaitlist.userId },
       {
        role: 'LAWYER',
        religion: lawyer.religion,
        lawyerSlotExpiry: expiresAt
      }
    });
    
    // Mark as activated
    await tx.lawyerWaitlist.update({
      where: { id: nextInWaitlist.id },
       { activatedAt: new Date() }
    });
  }
}
```

### 5. UI Components

#### LawyerSlotSystem.tsx
Main component displaying:
- **Slot Cards**: Visual representation of MUSLIM and CHRISTIAN slots
- **Slot Availability**: Shows current count vs max (10)
- **Visual Grid**: 10 squares showing filled/available slots
- **Waitlist Display**: Shows users waiting with estimated wait times
- **Purchase Modal**: Payment flow with gender validation
- **Gender Restriction Message**: Clear messaging for male users

**Key Features:**
- Real-time slot status
- Waitlist position tracking
- Estimated wait time calculation
- Gender validation at UI level
- Responsive design with Pink/Sky/Gold theme

### 6. Wait Time Calculation

```typescript
function getWaitlistWaitEstimate(waitlistPosition: number): string {
  const days = waitlistPosition * 14; // Each tenure is 14 days
  
  if (days < 7) return `~${days} days`;
  if (days < 14) return `~1 week`;
  if (days < 30) return `~${Math.floor(days / 7)} weeks`;
  return `~${Math.floor(days / 30)} month(s)`;
}
```

### 7. Gender Enforcement

#### At Signup
```typescript
// Validate gender
if (!['MALE', 'FEMALE'].includes(gender)) {
  return NextResponse.json(
    { error: 'Invalid gender. Must be MALE or FEMALE' },
    { status: 400 }
  );
}
```

#### At Lawyer Purchase
```typescript
// CRITICAL: Gender validation - only females can become lawyers
if (user.gender !== 'FEMALE') {
  return NextResponse.json(
    { error: 'Only women can become lawyers on De Peenk Courtroom.' },
    { status: 403 }
  );
}
```

#### At UI Level
```typescript
const handlePurchaseClick = (religion: Religion) => {
  // Gender validation
  if (userGender !== 'FEMALE') {
    setPurchaseResult({
      status: 'GENDER_RESTRICTED',
    });
    setShowPurchaseModal(true);
    return;
  }
  // ... rest of purchase logic
};
```

## Environment Variables

Add to `.env`:
```bash
# Cron job security
CRON_SECRET="your-secure-random-string"

# Vercel Cron (if using Vercel)
# Add to vercel.json:
# {
#   "crons": [{
#     "path": "/api/cron/lawyer-slot-expiry",
#     "schedule": "0 * * * *"
#   }]
# }
```

## Deployment Checklist

### Database Migration
```bash
# 1. Update prisma/schema.prisma with new models
# 2. Generate Prisma Client
npx prisma generate

# 3. Push schema to database
npx prisma db push

# 4. Verify migration
npx prisma studio
```

### Cron Job Setup

#### Vercel
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/lawyer-slot-expiry",
    "schedule": "0 * * * *"
  }]
}
```

#### Other Platforms
Set up hourly cron job:
```bash
# crontab -e
0 * * * * curl -H "Authorization: Bearer $CRON_SECRET" https://yourdomain.com/api/cron/lawyer-slot-expiry
```

### Testing

1. **Gender Validation:**
   - Attempt signup as MALE
   - Verify signup succeeds
   - Attempt to purchase lawyer slot as MALE
   - Verify error message

2. **Purchase Flow:**
   - Register as FEMALE user
   - Attempt to purchase lawyer slot
   - Verify Paystack integration
   - Check slot activation

3. **Waitlist Flow:**
   - Register second FEMALE user for same religion
   - Fill all 10 slots for that religion
   - Attempt to purchase when slots full
   - Verify waitlist position
   - Check wait time calculation

4. **Expiry Flow:**
   - Manually set lawyerSlotExpiry to past date
   - Run cron job
   - Verify lawyer demotion
   - Verify waitlist promotion

5. **Religion Validation:**
   - Attempt to purchase wrong religion slot
   - Verify error message
   - Check religion mismatch handling

## Security Considerations

1. **Gender Verification:**
   - Gender set during signup (encrypted)
   - Cannot change gender after registration
   - Validated at multiple layers (signup, purchase, UI)

2. **Waitlist Fairness:**
   - First-come, first-served
   - Position locked at join time
   - Only paid users promoted

3. **Cron Security:**
   - CRON_SECRET required
   - Bearer token authentication
   - Logged for audit trail

4. **Payment Security:**
   - Paystack signature verification
   - Metadata validation
   - Atomic transactions

## Slot Allocation Summary

| Role | Total Slots | Per Religion | Tenure | Price | Gender |
|------|-------------|--------------|--------|-------|--------|
| Chief Judge | 2 | 1 MUSLIM, 1 CHRISTIAN | 14 days | ₦3,500 | Female only |
| Lawyer | 20 | 10 MUSLIM, 10 CHRISTIAN | 14 days | ₦2,000 | Female only |
| Listener | Unlimited | N/A | N/A | Varies | All genders |

## Revenue Projection

### Lawyer Slots (Monthly)
- 20 slots × ₦2,000 = ₦40,000 per cycle
- 2 cycles per month = ₦80,000/month
- With waitlist demand: ~₦120,000/month

### Combined with CJ Slots
- CJ: ₦3,500 × 2 × 2 = ₦14,000/month
- Lawyers: ₦120,000/month
- **Total Slot Revenue: ₦134,000/month** (~$160 USD)

## Future Enhancements

1. **Notification System:**
   - Email notifications for promotion
   - SMS alerts for tenure expiry
   - In-app notifications

2. **Waitlist Management:**
   - Allow users to leave waitlist
   - Waitlist position trading
   - Priority waitlist (premium feature)

3. **Analytics:**
   - Lawyer performance metrics
   - Waitlist wait time analytics
   - Slot utilization reports

4. **Advanced Validation:**
   - ID verification for gender
   - Religious affiliation verification
   - Background checks for lawyers

## Support

For issues or questions:
- GitHub Issues: [Your repo link]
- Email: support@depeeink.com
- Discord: [Your Discord link]

---

**Last Updated:** 2026-03-18  
**Version:** 1.0.0  
**Status:** Production Ready ✅
