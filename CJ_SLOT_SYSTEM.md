# Chief Judge Slot System - Implementation Guide

## Overview

The Chief Judge Slot System manages the allocation of CJ positions based on religious affiliation. There are exactly **2 slots**: one for Muslim CJs and one for Christian CJs. Each tenure lasts **14 days** and costs **₦3,500**.

## Key Features

### 1. Slot Management
- **2 Fixed Slots**: MUSLIM and CHRISTIAN
- **14-Day Tenure**: Automatic expiry after 2 weeks
- **Queue System**: Users join queue when slot is occupied
- **Auto-Promotion**: Cron job promotes next in queue when slot expires

### 2. Database Schema

#### User Model Additions
```prisma
model User {
  // ... existing fields ...
  
  religion        Religion?
  cjSlotExpiry    DateTime?
  cjSlotReligion  String?  // MUSLIM or CHRISTIAN
  
  cjQueueEntries  CJQueue[]
}
```

#### New CJQueue Model
```prisma
model CJQueue {
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

#### Religion Enum
```prisma
enum Religion {
  MUSLIM
  CHRISTIAN
}
```

### 3. API Routes

#### POST /api/cj-slots/purchase
Handles CJ slot purchase requests.

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
  "reference": "CJ-1234567890-user123",
  "accessCode": "abc123",
  "slotStatus": "IMMEDIATE",
  "queuePosition": null,
  "tenureDays": 14,
  "price": 3500
}
```

**Response (Queue):**
```json
{
  "authorizationUrl": "https://checkout.paystack.com/...",
  "reference": "CJ-1234567890-user123",
  "accessCode": "abc123",
  "slotStatus": "QUEUED",
  "queuePosition": 3,
  "tenureDays": 14,
  "price": 3500
}
```

**Validation:**
- User must be authenticated
- Religion must match user's registered religion
- Religion must be MUSLIM or CHRISTIAN

#### POST /api/cj-slots/webhook
Handles Paystack payment webhooks for CJ slot purchases.

**Process:**
1. Verify Paystack signature (SHA512)
2. Extract metadata (religion, userId, slotStatus)
3. If IMMEDIATE: Activate user as CJ with 14-day expiry
4. If QUEUED: Mark queue entry as paid

#### GET /api/cron/cj-slot-expiry
Cron job that runs hourly to:
1. Find expired CJ slots
2. Demote expired CJs back to LISTENER
3. Promote next paid user from queue
4. Recalculate queue positions
5. Send notifications

**Security:** Requires `CRON_SECRET` in Authorization header

### 4. Queue Logic

#### Joining Queue
```typescript
// Check if slot is occupied
const currentHolder = await prisma.user.findFirst({
  where: {
    role: 'CHIEF_JUDGE',
    cjSlotReligion: religion,
    cjSlotExpiry: { gt: new Date() }
  }
});

if (currentHolder) {
  // Add to queue
  const queueCount = await prisma.cjQueue.count({
    where: { religion, activatedAt: null }
  });
  
  await prisma.cjQueue.create({
    data: {
      userId,
      religion,
      position: queueCount + 1
    }
  });
}
```

#### Auto-Promotion (Cron Job)
```typescript
// Find expired CJs
const expiredCJs = await prisma.user.findMany({
  where: {
    role: 'CHIEF_JUDGE',
    cjSlotExpiry: { lt: new Date() }
  }
});

for (const cj of expiredCJs) {
  // Demote CJ
  await tx.user.update({
    where: { id: cj.id },
    data: {
      role: 'LISTENER',
      cjSlotExpiry: null,
      cjSlotReligion: null
    }
  });
  
  // Find next in queue
  const nextInQueue = await tx.cjQueue.findFirst({
    where: {
      religion: cj.cjSlotReligion,
      activatedAt: null,
      paidAt: { not: null }
    },
    orderBy: { position: 'asc' }
  });
  
  if (nextInQueue) {
    // Promote to CJ
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);
    
    await tx.user.update({
      where: { id: nextInQueue.userId },
      data: {
        role: 'CHIEF_JUDGE',
        cjSlotReligion: cj.cjSlotReligion,
        cjSlotExpiry: expiresAt
      }
    });
    
    // Mark as activated
    await tx.cjQueue.update({
      where: { id: nextInQueue.id },
      data: { activatedAt: new Date() }
    });
  }
}
```

### 5. UI Components

#### CJSlotSystem.tsx
Main component displaying:
- **Slot Cards**: Visual representation of MUSLIM and CHRISTIAN slots
- **Current Holder**: Shows anonymous handle, cases handled, reputation
- **Progress Bar**: Visual tenure progress
- **Queue Display**: Shows users waiting with estimated wait times
- **Purchase Modal**: Payment flow with Paystack integration

**Key Features:**
- Real-time slot status
- Queue position tracking
- Estimated wait time calculation
- Responsive design with Pink/Sky/Gold theme

### 6. Wait Time Calculation

```typescript
function getQueueWaitEstimate(queuePosition: number): string {
  const days = queuePosition * 14; // Each tenure is 14 days
  
  if (days < 7) return `~${days} days`;
  if (days < 14) return `~1 week`;
  if (days < 30) return `~${Math.floor(days / 7)} weeks`;
  return `~${Math.floor(days / 30)} month(s)`;
}
```

### 7. Notifications

When a user is promoted from queue to CJ:
```typescript
// TODO: Implement notification system
await sendNotification({
  userId: nextInQueue.userId,
  type: 'CJ_PROMOTED',
  message: `Congratulations! You are now the Chief Judge for the ${religion} slot. Your tenure begins now and lasts 14 days.`,
  data: {
    religion,
    expiresAt: expiresAt.toISOString()
  }
});
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
#     "path": "/api/cron/cj-slot-expiry",
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
    "path": "/api/cron/cj-slot-expiry",
    "schedule": "0 * * * *"
  }]
}
```

#### Other Platforms
Set up hourly cron job:
```bash
# crontab -e
0 * * * * curl -H "Authorization: Bearer $CRON_SECRET" https://yourdomain.com/api/cron/cj-slot-expiry
```

### Testing

1. **Purchase Flow:**
   - Register as MUSLIM user
   - Attempt to purchase CJ slot
   - Verify Paystack integration
   - Check slot activation

2. **Queue Flow:**
   - Register second MUSLIM user
   - Attempt to purchase when slot occupied
   - Verify queue position
   - Check wait time calculation

3. **Expiry Flow:**
   - Manually set cjSlotExpiry to past date
   - Run cron job
   - Verify CJ demotion
   - Verify queue promotion

4. **Religion Validation:**
   - Attempt to purchase wrong religion slot
   - Verify error message
   - Check religion mismatch handling

## Security Considerations

1. **Religion Verification:**
   - Religion set during signup (encrypted)
   - Cannot change religion after registration
   - Validated on CJ purchase

2. **Queue Fairness:**
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

## Future Enhancements

1. **Notification System:**
   - Email notifications for promotion
   - SMS alerts for tenure expiry
   - In-app notifications

2. **Queue Management:**
   - Allow users to leave queue
   - Queue position trading
   - Priority queue (premium feature)

3. **Analytics:**
   - CJ performance metrics
   - Queue wait time analytics
   - Slot utilization reports

4. **Multi-Religion Support:**
   - Expand to other religions
   - Dynamic slot creation
   - Regional CJ slots

## Support

For issues or questions:
- GitHub Issues: [Your repo link]
- Email: support@depeeink.com
- Discord: [Your Discord link]

---

**Last Updated:** 2026-03-18
**Version:** 1.0.0
