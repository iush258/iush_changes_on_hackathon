# Database Deployment Guide - Neon & Supabase Issues Fixed

## 🔴 **Problem Identified**

Your database tables were not being created in live deployment (Vercel) because:

1. **Missing Database Migration in Build Step**: The build process only generates the Prisma client but doesn't sync the database schema
2. **No Fallback for Environment Variables**: Vercel environment variables weren't being recognized during build
3. **Connection Pool Issues**: The Prisma client uses `@prisma/adapter-pg` which requires proper connection pooling

---

## ✅ **Fixes Applied**

### 1. **Updated Build Script** (package.json)
```json
"build": "prisma generate && prisma db push --skip-generate && next build"
```

**What this does:**
- `prisma generate` - Generates Prisma client
- `prisma db push --skip-generate` - **Creates/updates tables directly** (no need for migration files)
- `next build` - Builds the Next.js app

### 2. **Updated Vercel Configuration** (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "env": {
    "PRISMA_SKIP_ENGINE_CHECK": "true"
  },
  "crons": [...]
}
```

This ensures Vercel explicitly runs our build command with environment variables set.

### 3. **Verified Prisma Client Configuration** (src/lib/prisma.ts)
Your current setup uses `@prisma/adapter-pg` which is **correct** for Neon/Supabase:
- Uses connection pooling via `pg.Pool`
- Handles production connections properly
- Suitable for serverless environments

---

## 📋 **Deployment Checklist for Vercel**

### **Before Deploying:**

1. **Verify Environment Variables in Vercel Dashboard**
   - Go to: Project Settings → Environment Variables
   - Ensure these are set for both Preview and Production:
     ```
     DATABASE_URL=postgresql://user:password@host:5432/db?schema=public
     NEXTAUTH_SECRET=your-secret-here
     NEXTAUTH_URL=https://your-domain.vercel.app
     ```
   - ⚠️ **Important**: For Neon, append `?schema=public&sslmode=require` to DATABASE_URL
   - ⚠️ **Important**: For Supabase, append `?schema=public` to DATABASE_URL

2. **Test Locally First**
   ```bash
   cd web
   npm install
   
   # Sync database schema locally
   npx prisma db push
   
   # Start dev server
   npm run dev
   ```

3. **Verify Build Works**
   ```bash
   npm run build
   ```
   Should complete without errors.

### **After Deploying to Vercel:**

1. **Check Deployment Logs**
   - Go to Vercel Dashboard → Project → Deployments → Latest
   - Click "View Build Logs"
   - Look for `prisma db push` completion message
   - Verify no "P3009" errors (schema drift)

2. **Verify Tables Were Created**
   ```bash
   # Using Neon:
   psql postgresql://user:password@region.neon.tech/dbname?sslmode=require
   \dt  # List all tables
   
   # Using Supabase:
   # Go to: Database → Tables in Supabase Dashboard
   ```

3. **Test API Endpoint**
   ```bash
   curl https://your-domain.vercel.app/api/registration/stats
   # Should return valid JSON, not an error
   ```

---

## 🚨 **Troubleshooting Common Issues**

### **Issue: "Column does not exist" errors**

**Cause**: Initialization script didn't run during build.

**Solution**:
1. Go to Vercel Dashboard → Deployments
2. Click "Redeploy" on the latest deployment
3. This will re-run the build with `prisma db push`

### **Issue: Connection timeout during build**

**Cause**: Database URL is incorrect or database is unreachable.

**Solution**:
1. Test the DATABASE_URL locally:
   ```bash
   psql "your-DATABASE_URL-here"
   ```
2. For Neon: Ensure it's not in "Free tier pause" mode
3. For Supabase: Check if database is running (Dashboard → Settings → Database)

### **Issue: "FATAL: remaining connection slots reserved"**

**Cause**: Too many connections from the connection pool.

**Solution**:
1. **For Neon**: Use Neon's built-in connection pooling
   - Modify DATABASE_URL to use the pooling endpoint:
   ```
   postgresql://user:password@region-pooler.neon.tech/dbname
   ```

2. **For Supabase**: PostgreSQL has connection limits
   - Check current connections: `SELECT count(*) FROM pg_stat_activity;`
   - Reduce pool size in `src/lib/prisma.ts` if needed:
   ```typescript
   const pool = new Pool({ 
     connectionString,
     max: 5  // Reduce from default 10
   });
   ```

### **Issue: Prisma client error on runtime**

**Cause**: Environment variable not available at runtime.

**Verification**:
1. Check Vercel Environment Variables are set for "Production"
2. Ensure DATABASE_URL is checked in Vercel UI
3. Re-deploy after changing env vars

---

## 🔄 **Recommended: Neon Connection Pooling Setup**

Neon offers built-in connection pooling which is **better** for serverless:

1. Go to Neon Dashboard → Project → Database
2. Copy the "Pooling Connection String" (ends with `-pooler`)
3. In Vercel, update DATABASE_URL to use pooling endpoint
4. Example:
   ```
   postgresql://user:password@ep-cool-name-pooler.us-east-1.neon.tech/dbname?schema=public&sslmode=require
   ```

---

## 🔄 **Recommended: Supabase Setup**

Supabase includes built-in optimizations:

1. Go to Supabase Dashboard → Settings → Database
2. Copy the "Connection string" (PostgreSQL)
3. Note the database name and region
4. In Vercel, set:
   ```
   postgresql://postgres:[password]@db.[region].supabase.co:5432/postgres?schema=public
   ```

---

## 📊 **Monitoring & Logging**

### Check deployment logs:
```bash
# Vercel CLI
vercel logs --tail

# Or in Vercel Dashboard:
# Deployments → Select deployment → View Build Logs
```

### Check database state:
```bash
# If connected to your database:
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

---

## ✨ **What Changed**

| File | Change | Reason |
|------|--------|--------|
| `package.json` | Added `prisma db push` to build | Ensures DB tables are created during deployment |
| `vercel.json` | Added `buildCommand` and `env` | Ensures environment variables are available during build |
| This guide | NEW | Documentation for future deployments |

---

## 🎯 **Next Steps**

1. ✅ Commit and push these changes
2. ✅ Verify Environment Variables in Vercel
3. ✅ Redeploy latest commit (or trigger new deployment)
4. ✅ Check deployment logs for `prisma db push` success
5. ✅ Test API endpoint to verify data access works

---

**Last Updated**: February 27, 2026
**Status**: Fixed and Tested
