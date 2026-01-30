# Contact Form Setup

This guide explains how to set up the serverless contact form using Cloudflare Workers to create GitHub Issues.

## 📋 Overview

The contact form uses a serverless architecture:

```
User fills form → Cloudflare Worker → GitHub API → GitHub Issue created
```

**Benefits:**
- ✅ No backend server needed
- ✅ Free tier available (100k requests/day)
- ✅ Secure (GitHub token not exposed)
- ✅ Anonymous submissions (users don't need GitHub account)

## 🚀 Quick Start

### Prerequisites

- GitHub account
- Cloudflare account (free)
- GitHub Personal Access Token
- Wrangler CLI installed

### Step 1: Create Cloudflare Account

1. Go to [Cloudflare](https://www.cloudflare.com/)
2. Sign up for a free account
3. Verify your email

### Step 2: Install Wrangler CLI

```bash
# Install globally
npm install -g wrangler

# Or use the local version (already in project)
npx wrangler --version
```

### Step 3: Login to Cloudflare

```bash
npx wrangler login
```

This opens a browser window to authenticate.

### Step 4: Create GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Give it a name: "Portfolio Contact Form"
4. Select scopes:
   - ✅ `repo` (or just `public_repo` if repository is public)
5. Click **Generate token**
6. **Copy the token** (you won't see it again!)

### Step 5: Configure Worker

The worker code is in `cloudflare-worker/worker.js`. Review the configuration:

```javascript
// cloudflare-worker/worker.js

const GITHUB_REPO = 'manideepsp/Portfolio-ManideepSP'; // Your repo
const CORS_ORIGIN = 'https://manideepsp.github.io'; // Your site URL
```

**Update these values:**
- `GITHUB_REPO`: Your GitHub username/repository
- `CORS_ORIGIN`: Your deployed site URL (or use `*` for development)

### Step 6: Set Worker Secret

Store your GitHub token securely:

```bash
# Set the token as a secret
npx wrangler secret put GITHUB_TOKEN

# Paste your GitHub token when prompted
```

**Important:** Never commit the token to version control!

### Step 7: Deploy Worker

```bash
# Deploy to Cloudflare
npm run deploy:worker

# Or manually
cd cloudflare-worker
npx wrangler deploy
```

### Step 8: Get Worker URL

After deployment, you'll see output like:

```
Published portfolio-contact (2.34 sec)
  https://portfolio-contact.YOUR-SUBDOMAIN.workers.dev
```

**Copy this URL!**

### Step 9: Update Site Configuration

Update `src/lib/config.json`:

```json
{
  "contactWorkerUrl": "https://portfolio-contact.YOUR-SUBDOMAIN.workers.dev/",
  "contactFallback": {
    "repo": "Portfolio-ManideepSP",
    "autoRedirect": true,
    "delayMs": 5000,
    "showFallbackButton": true
  }
}
```

### Step 10: Test Contact Form

1. Rebuild and deploy your site: `npm run build`
2. Visit the contact page
3. Fill out the form
4. Submit
5. Check your GitHub repository issues

## 🔧 Configuration Details

### Worker Configuration (`wrangler.jsonc`)

```jsonc
{
  "name": "portfolio-contact",
  "main": "worker.js",
  "compatibility_date": "2024-01-01",
  
  "vars": {
    "GITHUB_REPO": "manideepsp/Portfolio-ManideepSP",
    "CORS_ORIGIN": "https://manideepsp.github.io"
  },
  
  "routes": [
    {
      "pattern": "portfolio-contact.YOUR-SUBDOMAIN.workers.dev",
      "zone_name": ""
    }
  ]
}
```

**Configuration Options:**

- `name`: Worker name (must be unique in your account)
- `main`: Entry point file
- `compatibility_date`: Cloudflare runtime version
- `vars`: Environment variables (public)
- `routes`: Custom domains (optional)

### Environment Variables

**Public Variables** (in `wrangler.jsonc`):
- `GITHUB_REPO`: Repository to create issues in
- `CORS_ORIGIN`: Allowed origin for CORS

**Secret Variables** (via `wrangler secret put`):
- `GITHUB_TOKEN`: GitHub Personal Access Token

### Worker Code Explained

```javascript
// cloudflare-worker/worker.js

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return handleCORS()
  }

  // Validate request method
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    // Parse request body
    const formData = await request.json()
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return new Response('Missing required fields', { status: 400 })
    }

    // Create GitHub issue
    const issue = await createGitHubIssue(formData)
    
    // Return success
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': CORS_ORIGIN
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function createGitHubIssue(formData) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/issues`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      title: `Contact: ${formData.name}`,
      body: `**Name:** ${formData.name}
**Email:** ${formData.email}
**Message:**

${formData.message}`
    })
  })
  
  return await response.json()
}
```

## 🔒 Security Best Practices

### Token Scoping

Use minimal permissions:
- ✅ `public_repo` for public repositories
- ❌ Full `repo` unless needed

### CORS Configuration

Restrict to your domain:

```javascript
// Good - specific origin
const CORS_ORIGIN = 'https://yoursite.github.io';

// Development only - wildcard
const CORS_ORIGIN = '*';
```

### Input Validation

The worker validates:
- Required fields present
- Email format valid
- Message length reasonable

### Rate Limiting

Add rate limiting to prevent abuse:

```javascript
// Example rate limiting (add to worker)
const RATE_LIMIT = 5; // 5 requests
const RATE_WINDOW = 3600; // per hour

// Use Cloudflare KV for storage
// Implementation details in Cloudflare docs
```

## 🧪 Testing

### Local Testing

```bash
# Start local development server
cd cloudflare-worker
npx wrangler dev

# Worker available at http://localhost:8787
```

Test with curl:

```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

### Production Testing

1. Deploy worker: `npm run deploy:worker`
2. Update site config with worker URL
3. Deploy site
4. Test form submission
5. Verify issue created on GitHub

## 🔄 Fallback Mechanism

If the Worker fails, the form falls back to GitHub Issues:

```javascript
// In ContactForm component
try {
  // Try Worker first
  await fetch(workerUrl, { method: 'POST', body: formData })
} catch (error) {
  // Fallback to GitHub Issues URL
  const issueUrl = `https://github.com/${repo}/issues/new?title=${title}&body=${body}`
  window.open(issueUrl, '_blank')
}
```

Configure fallback in `config.json`:

```json
{
  "contactFallback": {
    "repo": "Portfolio-ManideepSP",
    "autoRedirect": true,    // Auto-redirect on Worker failure
    "delayMs": 5000,         // Wait 5s before redirect
    "showFallbackButton": true // Show manual fallback button
  }
}
```

## 📊 Monitoring

### View Worker Logs

```bash
# Tail worker logs
npx wrangler tail
```

### Cloudflare Dashboard

1. Go to Cloudflare Dashboard
2. Select **Workers & Pages**
3. Click your worker
4. View **Metrics** tab for:
   - Request count
   - Error rate
   - Response time
   - CPU time

### GitHub Webhook

Set up webhook to track issue creation:

1. Repository → Settings → Webhooks
2. Add webhook
3. Payload URL: Your monitoring endpoint
4. Events: Issues

## 🐛 Troubleshooting

### Worker Deployment Fails

**Error:** "Authentication error"

**Solution:** Re-login to Cloudflare
```bash
npx wrangler login
```

### CORS Errors

**Error:** "Access to fetch blocked by CORS policy"

**Solution:** Check `CORS_ORIGIN` matches your site URL exactly

```javascript
// Must match exactly (including https://)
const CORS_ORIGIN = 'https://yoursite.github.io';
```

### GitHub API Error

**Error:** "Bad credentials"

**Solution:** Regenerate GitHub token and update secret

```bash
npx wrangler secret put GITHUB_TOKEN
```

### Rate Limit Exceeded

**Error:** "API rate limit exceeded"

**Solution:** 
- Check token has correct permissions
- Implement request caching
- Add rate limiting to Worker

### Issues Not Created

**Checklist:**
- [ ] GitHub token has `repo` or `public_repo` scope
- [ ] Repository name is correct in worker config
- [ ] Token is not expired
- [ ] Repository exists and token has access

## 🚀 Advanced Configuration

### Custom Domain

Point a custom subdomain to your worker:

1. Add DNS record in Cloudflare:
   ```
   Type: CNAME
   Name: contact
   Target: portfolio-contact.workers.dev
   ```

2. Update worker route in `wrangler.jsonc`:
   ```jsonc
   "routes": [
     {
       "pattern": "contact.yourdomain.com/*",
       "zone_name": "yourdomain.com"
     }
   ]
   ```

### Multiple Environments

Set up staging and production:

```jsonc
// wrangler.jsonc
{
  "env": {
    "staging": {
      "name": "portfolio-contact-staging",
      "vars": {
        "GITHUB_REPO": "username/test-repo"
      }
    },
    "production": {
      "name": "portfolio-contact",
      "vars": {
        "GITHUB_REPO": "username/Portfolio-ManideepSP"
      }
    }
  }
}
```

Deploy to specific environment:

```bash
# Deploy to staging
npx wrangler deploy --env staging

# Deploy to production
npx wrangler deploy --env production
```

### Add Spam Protection

Implement honeypot field:

```javascript
// In worker
if (formData.honeypot) {
  // Likely a bot
  return new Response('Success', { status: 200 })
}
```

Add to form:

```html
<!-- Hidden honeypot field -->
<input type="text" name="honeypot" style="display:none" />
```

## 💰 Cost Estimation

Cloudflare Workers Free Tier:
- ✅ 100,000 requests/day
- ✅ 10ms CPU time per request
- ✅ Unlimited workers

**For a portfolio contact form, you'll likely stay within free tier.**

Paid Plan ($5/month):
- 10 million requests/month included
- Additional requests: $0.50/million

## 📚 Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub API Docs](https://docs.github.com/en/rest)

## 🤝 Need Help?

- Check [Troubleshooting](Troubleshooting) guide
- Review Worker logs: `npx wrangler tail`
- Open an [issue](https://github.com/manideepsp/Portfolio-ManideepSP/issues)

---

**Next**: Learn about common issues in [Troubleshooting](Troubleshooting)
