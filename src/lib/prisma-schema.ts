/**
 * Prisma Schema Reference for De Peenk Courtroom
 * 
 * This file documents the database schema that would be used with
 * Prisma ORM + PostgreSQL (hosted on Supabase).
 * 
 * To use in production, create prisma/schema.prisma with this content.
 */

export const PRISMA_SCHEMA = `
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ ENUMS ============

enum Role {
  LISTENER
  LAWYER
  CHIEF_JUDGE
  PLAINTIFF
}

enum CaseCategory {
  RELATIONSHIPS
  MARRIAGE
  FAMILY
  GIRL_SAFETY
  EDUCATION_CAREER
  MOTHERHOOD
  OTHERS
}

enum CaseStatus {
  OPEN
  CJ_REVIEW
  CJ_ASSIGNED
  CJ_HANDLING
  DELIBERATING
  RESOLVED
}

// ============ MODELS ============

model User {
  id              String   @id @default(uuid())
  role            Role
  anonymousHandle String   @unique
  
  // Encrypted PII fields (encrypted at application layer)
  encryptedFirstName  String?
  encryptedLastName   String?
  encryptedEmail      String  @unique
  encryptedPhone      String?
  encryptedPassword   String
  
  // Gamification
  virtualLawyerCredits Int    @default(0)
  casesWon             Int    @default(0)
  casesFiled           Int    @default(0)
  reputationScore      Int    @default(0)
  level                Int    @default(1)
  
  // Profile
  bio                  String?
  avatarUrl            String?
  isVerified           Boolean @default(false)
  
  // Timestamps
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  // Relations
  wallet               Wallet?
  casesFiledByUser     Case[]       @relation("FiledCases")
  casesHandled         Case[]       @relation("HandledCases")
  testimonies          Testimony[]
  galleryComments      GalleryComment[]
  
  @@map("users")
}

model Wallet {
  id          String   @id @default(uuid())
  userId      String   @unique
  balance     Float    @default(0.0)
  currency    String   @default("NGN")
  
  // Paystack integration
  paystackRef String?
  lastFundedAt DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id])
  
  @@map("wallets")
}

model Case {
  id              String      @id @default(uuid())
  title           String
  description     String
  category        CaseCategory
  status          CaseStatus  @default(OPEN)
  
  // Filing
  plaintiffId     String
  chiefJudgeId    String?
  
  // Case details
  evidence        Json?       // Encrypted evidence files metadata
  isAnonymous     Boolean     @default(true)
  urgency         Int         @default(1) // 1-5 scale
  
  // Resolution
  verdict         String?
  resolvedAt      DateTime?
  
  // Timestamps
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  // Relations
  plaintiff       User        @relation("FiledCases", fields: [plaintiffId], references: [id])
  chiefJudge      User?       @relation("HandledCases", fields: [chiefJudgeId], references: [id])
  testimonies     Testimony[]
  
  @@map("cases")
}

model Testimony {
  id          String   @id @default(uuid())
  content     String
  caseId      String
  authorId    String
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  case        Case     @relation(fields: [caseId], references: [id])
  author      User     @relation(fields: [authorId], references: [id])
  
  @@map("testimonies")
}

model GalleryComment {
  id          String   @id @default(uuid())
  content     String
  authorId    String
  targetType  String   // "CASE" | "TESTIMONY" | "GALLERY"
  targetId    String
  
  createdAt   DateTime @default(now())
  
  author      User     @relation(fields: [authorId], references: [id])
  
  @@map("gallery_comments")
}

model Ad {
  id          String   @id @default(uuid())
  title       String
  content     String
  imageUrl    String?
  linkUrl     String?
  isActive    Boolean  @default(true)
  position    String   @default("SIDEBAR") // SIDEBAR, BANNER, INTERSTITIAL
  
  startDate   DateTime
  endDate     DateTime
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("ads")
}
`;

/**
 * Terminal commands to initialize the Next.js project with all dependencies:
 * 
 * ```bash
 * # 1. Create Next.js project
 * npx create-next-app@latest de-peeink-courtroom --typescript --tailwind --eslint --app --src-dir
 * 
 * # 2. Navigate to project
 * cd de-peeink-courtroom
 * 
 * # 3. Install Prisma
 * npm install prisma --save-dev
 * npm install @prisma/client
 * 
 * # 4. Initialize Prisma
 * npx prisma init --datasource-provider postgresql
 * 
 * # 5. Install Auth & Payment dependencies
 * npm install next-auth @auth/prisma-adapter
 * npm install bcryptjs
 * npm install crypto-js
 * 
 * # 6. Install Paystack
 * npm install paystack-api
 * 
 * # 7. Install Supabase Realtime
 * npm install @supabase/supabase-js
 * 
 * # 8. Install UI dependencies
 * npm install framer-motion lucide-react
 * npm install @headlessui/react
 * 
 * # 9. Set environment variables in .env
 * # DATABASE_URL="postgresql://user:password@host:5432/dbname"
 * # NEXTAUTH_SECRET="your-secret-here"
 * # NEXTAUTH_URL="http://localhost:3000"
 * # PAYSTACK_SECRET_KEY="sk_test_xxx"
 * # PAYSTACK_PUBLIC_KEY="pk_test_xxx"
 * # SUPABASE_URL="https://xxx.supabase.co"
 * # SUPABASE_ANON_KEY="xxx"
 * # ENCRYPTION_KEY="your-32-char-encryption-key"
 * 
 * # 10. Generate Prisma Client
 * npx prisma generate
 * 
 * # 11. Push schema to database
 * npx prisma db push
 * ```
 */
