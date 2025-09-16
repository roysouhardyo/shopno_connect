# 🚀 Vercel Deployment Guide for Shopno Connect

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:
- ✅ GitHub repository: `https://github.com/roysouhardyo/shopno_connect.git`
- ✅ MongoDB Atlas database set up
- ✅ BulkSMSBD account for SMS functionality
- ✅ Vercel account (free tier available)

## 🔧 Step-by-Step Deployment

### 1. **Prepare Your Repository**

Make sure your GitHub repository is up to date:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. **Deploy to Vercel**

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository: `roysouhardyo/shopno_connect`
4. Vercel will auto-detect it's a Next.js project
5. Click **"Deploy"**

#### Option B: Using Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 3. **Configure Environment Variables**

After deployment, add environment variables in Vercel Dashboard:

1. Go to your project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable Name | Value | Notes |
|---------------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/database` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-super-secure-jwt-secret` | Generate a strong 64+ character string |
| `BULKSMSBD_API_KEY` | `your-api-key` | From BulkSMSBD dashboard |
| `BULKSMSBD_SENDER_ID` | `your-sender-id` | From BulkSMSBD dashboard |
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` | Your Vercel app URL |
| `NEXTAUTH_SECRET` | `your-nextauth-secret` | Generate a strong secret |

**Optional (for later):**
| Variable Name | Value | Notes |
|---------------|-------|-------|
| `RUPANTORPAY_API_KEY` | `your-payment-api-key` | When ready to add payments |
| `RUPANTORPAY_SECRET_KEY` | `your-payment-secret` | When ready to add payments |
| `RUPANTORPAY_WEBHOOK_SECRET` | `your-webhook-secret` | When ready to add payments |

### 4. **Update Domain Settings**

After adding environment variables:
1. Go to **Settings** → **Domains**
2. Note your Vercel domain (e.g., `shopno-connect-xyz.vercel.app`)
3. Update `NEXTAUTH_URL` environment variable with this domain
4. Redeploy the application

### 5. **Verify Deployment**

Check these URLs work correctly:
- ✅ Homepage: `https://your-app.vercel.app`
- ✅ Admin: `https://your-app.vercel.app/admin`
- ✅ API Health: `https://your-app.vercel.app/api/auth/me`

## 🔒 Security Checklist

- [ ] All environment variables are set in Vercel (not in code)
- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB Atlas has proper IP restrictions
- [ ] NEXTAUTH_URL matches your production domain

## 🚨 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:** Ensure all dependencies are in `package.json`:
```bash
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue: Database connection fails
**Solution:** 
1. Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Vercel)
2. Verify `MONGODB_URI` format in Vercel environment variables

### Issue: SMS not working
**Solution:**
1. Verify BulkSMSBD credentials in Vercel dashboard
2. Check account balance in BulkSMSBD
3. Test with development mode first

### Issue: Authentication errors
**Solution:**
1. Ensure `NEXTAUTH_URL` matches your Vercel domain exactly
2. Generate new `NEXTAUTH_SECRET` if needed
3. Clear browser cookies and try again

## 📊 Performance Optimization

Vercel automatically optimizes your Next.js app with:
- ✅ Edge caching
- ✅ Image optimization
- ✅ Automatic HTTPS
- ✅ Global CDN

## 💰 Cost Estimation

**Vercel Free Tier includes:**
- 100GB bandwidth/month
- 1000 serverless function invocations/day
- Custom domains
- Automatic HTTPS

**Upgrade needed if you exceed:**
- 100GB bandwidth → Pro plan ($20/month)
- 1000 function calls/day → Pro plan

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys!
```

## 📱 Mobile Testing

Test your deployed app on mobile devices:
- iOS Safari
- Android Chrome
- Check responsive design
- Test touch interactions

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Add your custom domain in Vercel dashboard
   - Update DNS records as instructed

2. **Analytics** (Optional)
   - Enable Vercel Analytics in project settings
   - Monitor performance and usage

3. **Payment Gateway**
   - Add RupantorPay credentials when ready
   - Test payment flow in production

## 🆘 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review function logs in Vercel dashboard
3. Test locally with production environment variables
4. Contact Vercel support if needed

---

**🎉 Congratulations!** Your Shopno Connect app is now live on Vercel!

**Live URL:** `https://your-app-name.vercel.app`