# Environment Variables Checklist for De Peenk Courtroom Deployment

## Required Environment Variables

### Database (Supabase PostgreSQL)
```bash
# PostgreSQL connection string from Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Direct connection (for migrations)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

### Authentication (NextAuth)
```bash
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-super-secret-key-here"

# Production URL
NEXTAUTH_URL="https://yourdomain.com"

# OAuth Providers (if using)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Supabase (Realtime & Storage)
```bash
# From Supabase Dashboard > Settings > API
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Paystack (Payments)
```bash
# From Paystack Dashboard > Settings > API Keys
PAYSTACK_SECRET_KEY="sk_live_xxxxxxxxxxxxxxxxxxxx"
PAYSTACK_PUBLIC_KEY="pk_live_xxxxxxxxxxxxxxxxxxxx"

# Webhook secret (configure in Paystack Dashboard)
PAYSTACK_WEBHOOK_SECRET="your-webhook-secret"
```

### Encryption (PII Protection)
```bash
# Generate with: openssl rand -hex 32
ENCRYPTION_KEY="your-32-byte-encryption-key-here"
```

### Email Service (Optional - for notifications)
```bash
# Using Resend, SendGrid, or similar
RESEND_API_KEY="your-resend-api-key"
FROM_EMAIL="noreply@depeeink.com"
```

### File Storage (Optional - for evidence uploads)
```bash
# Using Supabase Storage or AWS S3
STORAGE_BUCKET="case-evidence"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
```

### Analytics (Optional)
```bash
# Google Analytics
GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Or Plausible/Umami
ANALYTICS_URL="https://analytics.yourdomain.com"
```

### Rate Limiting (Optional)
```bash
# Using Upstash Redis or similar
REDIS_URL="redis://default:your-password@your-redis-url.upstash.io:6379"
```

## Environment-Specific Configuration

### Development (.env.local)
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/depeeink_dev"
NEXTAUTH_URL="http://localhost:3000"
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxx"
PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxx"
```

### Staging (.env.staging)
```bash
DATABASE_URL="[staging-db-url]"
NEXTAUTH_URL="https://staging.depeeink.com"
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxx"
```

### Production (.env.production)
```bash
DATABASE_URL="[production-db-url]"
NEXTAUTH_URL="https://depeeink.com"
PAYSTACK_SECRET_KEY="sk_live_xxxxxxxxxxxx"
```

## Security Notes

### Critical
- ✅ Never commit `.env` files to Git
- ✅ Use different keys for each environment
- ✅ Rotate keys regularly (every 90 days)
- ✅ Use strong, unique passwords for all services
- ✅ Enable 2FA on all service dashboards

### Database
- ✅ Enable SSL for all database connections
- ✅ Use connection pooling (Supabase handles this)
- ✅ Regular automated backups (Supabase default)
- ✅ Enable Row Level Security (RLS) on all tables

### Authentication
- ✅ Use HTTPS only in production
- ✅ Set secure cookie flags
- ✅ Implement rate limiting on auth endpoints
- ✅ Use strong password requirements

### Payments
- ✅ Verify Paystack signatures on all webhooks
- ✅ Use test keys in development
- ✅ Log all payment transactions
- ✅ Implement idempotency keys

### Encryption
- ✅ Encrypt PII at rest (first name, last name, phone)
- ✅ Use AES-256 encryption
- ✅ Never log decrypted PII
- ✅ Rotate encryption keys annually

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Paystack webhooks configured
- [ ] Supabase Realtime enabled
- [ ] SSL certificates installed
- [ ] DNS configured
- [ ] Email service verified

### Post-Deployment
- [ ] Test user registration
- [ ] Test case filing flow
- [ ] Test payment processing
- [ ] Test real-time chat
- [ ] Verify ad display
- [ ] Check email delivery
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

### Monitoring
- [ ] Error tracking (Sentry/LogRocket)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Payment failure alerts
- [ ] Database connection alerts

## Quick Setup Commands

```bash
# 1. Clone repository
git clone https://github.com/yourusername/depeeink-courtroom.git
cd depeeink-courtroom

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Set up database
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev

# 6. Build for production
npm run build

# 7. Start production server
npm start
```

## Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Supabase: https://supabase.com/docs
- Paystack: https://paystack.com/docs
- NextAuth: https://next-auth.js.org

### Troubleshooting
- Database connection issues: Check DATABASE_URL format
- Payment failures: Verify Paystack keys and webhook URLs
- Auth issues: Check NEXTAUTH_URL matches deployment URL
- Realtime not working: Verify Supabase Realtime is enabled

## Contact

For deployment assistance:
- Email: support@depeeink.com
- Discord: [Your Discord Link]
- Documentation: https://docs.depeeink.com
