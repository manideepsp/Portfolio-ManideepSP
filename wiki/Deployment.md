# Deployment

This guide covers deploying your portfolio to GitHub Pages and other hosting platforms.

## 🚀 GitHub Pages Deployment (Recommended)

GitHub Pages is the recommended deployment method because it's free, automatic, and well-integrated with the project.

### Prerequisites

- GitHub account
- Repository forked or cloned
- GitHub Pages enabled in repository settings

### Step 1: Configure for GitHub Pages

#### Update `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://YOUR-USERNAME.github.io',
  base: '/YOUR-REPO-NAME',
  // ... other config
});
```

**Important:**
- Replace `YOUR-USERNAME` with your GitHub username
- Replace `YOUR-REPO-NAME` with your repository name

**Example:**
```javascript
site: 'https://johnsmith.github.io',
base: '/my-portfolio',
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Source: `Deploy from a branch`
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

### Step 3: Set Up GitHub Actions

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that automatically builds and deploys your site.

**Verify the workflow:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Step 4: Trigger Deployment

Push to the `main` branch to trigger deployment:

```bash
git add .
git commit -m "Configure for GitHub Pages"
git push origin main
```

### Step 5: Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Watch the workflow run
3. Once complete (green checkmark), your site is live!

### Step 6: Access Your Site

Your portfolio will be available at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

## 🔧 Troubleshooting Deployment

### Build Fails

**Check the Actions log:**
1. Go to Actions tab
2. Click on the failed workflow run
3. Review error messages

**Common issues:**
- Missing dependencies → Run `npm install` locally first
- Configuration errors → Check `astro.config.mjs`
- Invalid markdown → Check content files

### 404 Errors After Deployment

**Problem:** All pages except home return 404

**Solution:** Check `base` in `astro.config.mjs` matches repository name

```javascript
// Correct
base: '/Portfolio-ManideepSP',

// Incorrect
base: '/portfolio',  // Wrong repo name
base: '',             // Missing base for repo-based Pages
```

### Assets Not Loading

**Problem:** CSS, images, or JS files return 404

**Solution:** Ensure all asset paths are relative or use the `base` URL

```javascript
// Good - relative path
<img src="/images/photo.jpg" />

// Good - with Astro base
<img src={`${import.meta.env.BASE_URL}images/photo.jpg`} />

// Bad - absolute path without base
<img src="https://example.com/images/photo.jpg" />
```

### Contact Form Not Working

**Problem:** Contact form submissions fail

**Solution:** Deploy Cloudflare Worker first (see [Contact Form Setup](Contact-Form-Setup))

## 🌐 Custom Domain Setup

### Step 1: Purchase Domain

Buy a domain from providers like:
- Namecheap
- Google Domains
- GoDaddy
- Cloudflare

### Step 2: Configure DNS

Add DNS records at your domain provider:

**For apex domain (example.com):**
```
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
```

**For subdomain (www.example.com):**
```
CNAME www   YOUR-USERNAME.github.io
```

### Step 3: Add Custom Domain in GitHub

1. Go to repository **Settings** → **Pages**
2. Enter your custom domain in the **Custom domain** field
3. Click **Save**
4. Wait for DNS check (may take up to 24 hours)
5. Enable **Enforce HTTPS** once DNS is verified

### Step 4: Update Configuration

Update `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://www.yourdomain.com',
  base: '/',  // Root path for custom domain
});
```

Update `src/lib/config.json`:

```json
{
  "customDomain": "www.yourdomain.com"
}
```

### Step 5: Redeploy

```bash
git add .
git commit -m "Add custom domain"
git push origin main
```

## 🔄 Alternative Deployment Options

### Netlify Deployment

#### Option 1: Automatic Git Deployment

1. Sign up at [Netlify](https://www.netlify.com/)
2. Click **Add new site** → **Import an existing project**
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site**

#### Option 2: Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Update configuration for Netlify:**

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://your-site.netlify.app',
  base: '/',  // Root path for Netlify
});
```

### Vercel Deployment

1. Sign up at [Vercel](https://vercel.com/)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - Framework Preset: `Astro`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**

**Update configuration for Vercel:**

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://your-site.vercel.app',
  base: '/',
});
```

### Cloudflare Pages Deployment

1. Sign up at [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Click **Save and Deploy**

**Update configuration:**

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://your-site.pages.dev',
  base: '/',
});
```

## 🔐 Environment Variables for Deployment

### GitHub Actions Secrets

For private repository READMEs, add GitHub token:

1. Generate Personal Access Token:
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` scope
2. Add to repository secrets:
   - Repository → Settings → Secrets and variables → Actions
   - New repository secret: `GITHUB_TOKEN`
   - Paste your token

3. Update workflow to use token:

```yaml
# .github/workflows/deploy.yml
- name: Build
  run: npm run build
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Cloudflare Worker Secrets

See [Contact Form Setup](Contact-Form-Setup) for Worker deployment.

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] Update `config.json` with your information
- [ ] Update `astro.config.mjs` site and base URLs
- [ ] Add resume PDF to `public/resumes/`
- [ ] Update `content/about.md`
- [ ] Test build locally: `npm run build`
- [ ] Test preview locally: `npm run preview`
- [ ] Verify all pages load correctly
- [ ] Check responsive design on mobile
- [ ] Validate configuration: `npm run validate`
- [ ] Review console for errors
- [ ] Test contact form (if Worker deployed)
- [ ] Check all links work
- [ ] Verify images load
- [ ] Test resume viewer

## 🚀 Deployment Commands

### Local Build and Preview

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Access at http://localhost:4321
```

### Manual Deployment to GitHub Pages

If Actions are disabled:

```bash
# Install gh-pages package
npm install -g gh-pages

# Build the site
npm run build

# Deploy to gh-pages branch
gh-pages -d dist
```

## 📊 Post-Deployment

### Verify Deployment

1. **Check site loads:** Visit your deployed URL
2. **Test all pages:** Navigate through all pages
3. **Test mobile:** Check mobile responsiveness
4. **Test contact form:** Submit a test contact
5. **Check console:** No JavaScript errors
6. **Lighthouse audit:** Run performance audit

### Monitor Performance

Use Google PageSpeed Insights:
```
https://pagespeed.web.dev/report?url=YOUR-SITE-URL
```

### Set Up Analytics (Optional)

#### Google Analytics

1. Create GA4 property
2. Get measurement ID
3. Add to `src/layouts/BaseLayout.astro`:

```html
<head>
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
</head>
```

## 🔄 Continuous Deployment

### Automatic Updates

With GitHub Actions, every push to `main` triggers a rebuild:

```bash
# Make changes
git add .
git commit -m "Update content"
git push origin main

# Site automatically rebuilds and deploys
```

### Manual Trigger

Trigger deployment manually without code changes:

1. Go to **Actions** tab
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select branch: `main`
5. Click **Run workflow**

## 🛡️ Security Best Practices

1. **Never commit secrets**
   - Use `.env` locally
   - Use GitHub Secrets for CI/CD
   - Use environment variables in hosting platforms

2. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

3. **Use HTTPS**
   - Enable "Enforce HTTPS" in GitHub Pages settings
   - Always serve over HTTPS

4. **Review deployment logs**
   - Check for leaked secrets
   - Monitor for errors

## 💡 Deployment Tips

1. **Test locally first** - Always build and preview before deploying
2. **Use branches** - Deploy from `main`, develop on feature branches
3. **Monitor builds** - Watch GitHub Actions for failures
4. **Keep logs** - Save build logs for debugging
5. **Version control** - Tag releases for easy rollback

## 🔙 Rolling Back

If deployment breaks:

### Option 1: Revert Commit

```bash
git revert HEAD
git push origin main
```

### Option 2: Deploy Previous Version

```bash
# Check out previous commit
git checkout <previous-commit-hash>

# Force push (use carefully!)
git push origin main --force
```

### Option 3: Manual Deploy from gh-pages

GitHub Pages serves from `gh-pages` branch. The previous version is still there until overwritten.

## 📞 Need Help?

- Review [Troubleshooting](Troubleshooting) guide
- Check [GitHub Pages docs](https://docs.github.com/en/pages)
- Check [Astro deployment docs](https://docs.astro.build/en/guides/deploy/)
- Open an [issue](https://github.com/manideepsp/Portfolio-ManideepSP/issues)

---

**Next**: Set up the [contact form with Cloudflare Worker](Contact-Form-Setup)
