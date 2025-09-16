# Production Setup Guide for Shopno Connect

This guide covers all the requirements and configurations needed to deploy Shopno Connect to production.

## 🗄️ Database Requirements

### MongoDB Database
- **Service**: MongoDB Atlas (recommended) or self-hosted MongoDB
- **Configuration**: 
  - Create a new cluster for production
  - Set up database user with read/write permissions
  - Configure IP whitelist for your server
  - Get connection string from MongoDB Atlas dashboard

### Database Collections
The app will automatically create these collections:
- `users` - User accounts and profiles
- `notices` - Community notices and announcements
- `events` - Community events
- `galleries` - Photo gallery items
- `payments` - Payment records
- `otps` - OTP verification codes (auto-expires)

## 📱 SMS Gateway Setup

### BulkSMSBD Configuration
- **Service**: BulkSMSBD (Bangladeshi SMS provider)
- **Required**:
  - API Key from BulkSMSBD dashboard
  - Sender ID (approved by provider)
  - Account balance for SMS credits

### Alternative SMS Providers
If you prefer different SMS providers, modify `/src/lib/sms.ts`:
- Twilio
- AWS SNS
- Local SMS gateway

## 🔐 Environment Variables

Create `.env.local` file with these variables:

```env
# Database
MONGODB_URI=your-mongodb-atlas-connection-string-here

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters

# SMS Gateway
BULKSMSBD_API_KEY=your-bulksmsbd-api-key
BULKSMSBD_SENDER_ID=your-sender-id

# Next.js
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

## 🚀 Deployment Platforms

### Recommended: Vercel (Easiest)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Alternative: Railway
1. Connect repository to Railway
2. Add environment variables
3. Deploy with automatic builds

### Alternative: DigitalOcean App Platform
1. Create new app from GitHub
2. Configure environment variables
3. Set build and run commands

### Self-hosted (VPS/Dedicated Server)
Requirements:
- Node.js 18+ 
- PM2 for process management
- Nginx for reverse proxy
- SSL certificate (Let's Encrypt)

## 🔧 Build Configuration

### Build Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Next.js Configuration
The app is already configured for production with:
- Static optimization
- Image optimization
- Automatic code splitting
- Server-side rendering

## 🛡️ Security Considerations

### Required Security Measures
1. **HTTPS**: Always use SSL/TLS in production
2. **Environment Variables**: Never commit secrets to repository
3. **Database Security**: Use strong passwords and IP restrictions
4. **Rate Limiting**: Consider adding rate limiting for API endpoints
5. **CORS**: Configure proper CORS settings
6. **Input Validation**: Already implemented in the app

### Additional Security (Recommended)
- Web Application Firewall (WAF)
- DDoS protection
- Regular security updates
- Database backups
- Monitoring and logging

## 📊 Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics or Mixpanel
- **Uptime Monitoring**: UptimeRobot
- **Performance**: Vercel Analytics or New Relic

## 💾 Backup Strategy

### Database Backups
- MongoDB Atlas: Automatic backups included
- Self-hosted: Set up automated backups with mongodump
- Frequency: Daily backups recommended

### File Backups
- User uploads (if implemented)
- Configuration files
- SSL certificates

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
```

## 📱 Mobile Considerations

### Progressive Web App (PWA)
The app is mobile-responsive but consider adding:
- Service worker for offline functionality
- Web app manifest
- Push notifications

## 🎯 Performance Optimization

### Already Implemented
- Next.js automatic optimizations
- Image optimization
- Code splitting
- Static generation where possible

### Additional Optimizations
- CDN for static assets
- Database indexing (already configured)
- Caching strategies
- Image compression

## 🧪 Testing Before Production

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] Database connection working
- [ ] SMS gateway functional
- [ ] Authentication flow tested
- [ ] Admin panel accessible
- [ ] All pages loading correctly
- [ ] Mobile responsiveness verified
- [ ] SSL certificate installed
- [ ] Backup system configured

### Load Testing
Consider testing with:
- Artillery.js
- Apache Bench
- k6

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- Monitor error logs
- Update dependencies
- Database maintenance
- Security patches
- Performance monitoring
- User feedback collection

### Emergency Contacts
- Database provider support
- SMS gateway support
- Hosting platform support
- Domain registrar support

## 💰 Cost Estimation

### Monthly Costs (Approximate)
- **Database**: $0-25 (MongoDB Atlas M0-M2)
- **Hosting**: $0-20 (Vercel Pro)
- **SMS**: $10-50 (depending on usage)
- **Domain**: $10-15/year
- **SSL**: Free (Let's Encrypt)
- **Total**: ~$20-95/month

## 🚨 Troubleshooting

### Common Issues
1. **Database Connection**: Check MongoDB URI and IP whitelist
2. **SMS Not Working**: Verify API credentials and account balance
3. **Build Failures**: Check Node.js version and dependencies
4. **Authentication Issues**: Verify JWT_SECRET configuration
5. **Performance Issues**: Check database queries and indexes

### Debug Mode
Set `NODE_ENV=development` temporarily to see detailed error messages.

---

## Quick Start Commands

```bash
# 1. Clone and install
git clone <your-repo>
cd shopno-connect
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# 3. Build and deploy
npm run build
npm start

# 4. Or deploy to Vercel
npx vercel --prod
```

For any issues, refer to the troubleshooting section or contact the development team.