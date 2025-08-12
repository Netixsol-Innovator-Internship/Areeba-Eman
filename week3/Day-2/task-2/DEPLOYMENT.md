# Deployment Guide - Task Manager API

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account (free): https://vercel.com
- MongoDB Atlas account (free): https://cloud.mongodb.com
- Git repository with your code

### Step 1: Setup MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to https://cloud.mongodb.com
   - Sign up for free account
   - Create a new cluster (free tier available)

2. **Configure Database Access**
   - Go to "Database Access" in sidebar
   - Add new database user
   - Choose "Password" authentication
   - Set username and strong password
   - Grant "Read and write to any database" role

3. **Configure Network Access**
   - Go to "Network Access" in sidebar
   - Add IP Address: `0.0.0.0/0` (allow access from anywhere)
   - Or add specific Vercel IP ranges for better security

4. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `taskmanager`

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect it's a Node.js project
5. Add environment variables (see Step 3)
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI
1. **Install Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Login to Vercel**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy**
   \`\`\`bash
   vercel
   \`\`\`

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

| Variable | Value | Example |
|----------|-------|---------|
| `MONGODB_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0.mongodb.net/taskmanager` |
| `JWT_SECRET` | Strong random string (64+ characters) | Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `NODE_ENV` | `production` | `production` |

### Step 4: Test Your Deployment

1. **Health Check**
   \`\`\`
   GET https://your-app.vercel.app/health
   \`\`\`

2. **API Documentation**
   \`\`\`
   https://your-app.vercel.app/api-docs
   \`\`\`

3. **Test Registration**
   \`\`\`bash
   curl -X POST https://your-app.vercel.app/api/users/register \\
     -H "Content-Type: application/json" \\
     -d '{"name":"Test User","email":"test@example.com","password":"Password123"}'
   \`\`\`

## 🔧 Alternative Deployment Options

### Deploy to Railway

1. Go to https://railway.app
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

### Deploy to Render

1. Go to https://render.com
2. Create new Web Service
3. Connect your repository
4. Add environment variables
5. Deploy

### Deploy to Heroku

1. Install Heroku CLI
2. \`\`\`bash
   heroku create your-app-name
   heroku config:set MONGODB_URI="your-connection-string"
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set NODE_ENV="production"
   git push heroku main
   \`\`\`

## 🔒 Security Checklist

- [ ] Strong JWT secret (64+ characters)
- [ ] MongoDB user with minimal required permissions
- [ ] Network access restricted (if possible)
- [ ] Environment variables properly set
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS configured for your domain
- [ ] Rate limiting implemented (optional)

## 📊 Monitoring & Maintenance

### Vercel Analytics
- Enable in Vercel Dashboard → Project → Analytics
- Monitor API performance and usage

### MongoDB Atlas Monitoring
- Monitor database performance in Atlas dashboard
- Set up alerts for high usage

### Error Tracking
Consider adding error tracking services:
- Sentry: https://sentry.io
- LogRocket: https://logrocket.com
- Rollbar: https://rollbar.com

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string format
   - Verify database user credentials
   - Ensure network access is configured

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token format in requests
   - Ensure token hasn't expired

3. **Vercel Function Timeout**
   - Functions timeout after 10s on free plan
   - Optimize database queries
   - Consider upgrading plan for longer timeouts

4. **CORS Issues**
   - Update CORS configuration in server.js
   - Add your frontend domain to allowed origins

### Getting Help

1. Check Vercel deployment logs
2. Monitor MongoDB Atlas logs
3. Use API documentation at `/api-docs`
4. Test with Postman collection
5. Check GitHub issues or create new one

## 📈 Scaling Considerations

### Database Scaling
- MongoDB Atlas auto-scales
- Consider database indexing for better performance
- Monitor query performance

### API Scaling
- Vercel automatically scales functions
- Consider caching for frequently accessed data
- Implement rate limiting for production

### Monitoring
- Set up uptime monitoring
- Monitor API response times
- Track error rates and user activity
