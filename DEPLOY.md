# Deployment Instructions

## Deploy to Vercel Project: prj_TQvjHKYQU8p8k00uoVKrfxX1TSIy

### Step 1: Authenticate with Vercel

First, you need to log in to Vercel:

```bash
npx vercel login
```

This will open a browser window for you to authenticate.

### Step 2: Link to Your Project

Link this directory to your Vercel project:

```bash
npx vercel link --project prj_TQvjHKYQU8p8k00uoVKrfxX1TSIy
```

### Step 3: Deploy to Production

Deploy to production:

```bash
npx vercel --prod
```

Or use the deployment script:

```bash
./deploy.sh
```

## Alternative: One-Command Deploy

After authentication, you can also run:

```bash
npx vercel --prod --yes
```

The project will be automatically linked on first deployment.

## Files Ready for Deployment

- ✅ `index.html` - Main website
- ✅ `styles.css` - Styling with block colors
- ✅ `script.js` - Interactive features
- ✅ `vercel.json` - Vercel configuration

Your website is ready to deploy! 🚀

