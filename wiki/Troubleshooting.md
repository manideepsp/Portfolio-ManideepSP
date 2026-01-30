# Troubleshooting

This guide helps you resolve common issues with the Portfolio-ManideepSP project.

## 🔍 General Debugging

### Check Build Logs

```bash
# Build with verbose output
npm run build -- --verbose

# Check for errors
npm run validate
```

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Check Network tab for failed requests

### Check GitHub Actions

1. Go to repository → Actions tab
2. Click on latest workflow run
3. Review logs for errors

## 🚨 Installation Issues

### Node Version Mismatch

**Symptoms:**
```
Error: The engine "node" is incompatible with this module
```

**Solution:**

```bash
# Check your Node version
node -v

# Should be v18 or higher
# Install/use Node 18+
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### NPM Install Fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
```

**Solution 1: Clear cache and reinstall**

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Solution 2: Use legacy peer deps**

```bash
npm install --legacy-peer-deps
```

### Permission Errors

**Symptoms:**
```
EACCES: permission denied
```

**Solution:**

```bash
# Don't use sudo! Fix npm permissions instead
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## 🏗️ Build Issues

### Build Fails

**Symptoms:**
```
npm run build
> Error: Build failed
```

**Solution:**

```bash
# 1. Check for syntax errors
npm run validate

# 2. Clear Astro cache
rm -rf .astro dist

# 3. Rebuild
npm run build

# 4. Check specific error in output
npm run build 2>&1 | grep -i error
```

### Out of Memory

**Symptoms:**
```
FATAL ERROR: Reached heap limit Allocation failed
```

**Solution:**

```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Module Not Found

**Symptoms:**
```
Error: Cannot find module 'some-package'
```

**Solution:**

```bash
# Reinstall dependencies
npm install

# Or install specific package
npm install some-package
```

## 📄 Configuration Issues

### Config Validation Fails

**Symptoms:**
```
npm run validate
> Configuration validation failed
```

**Solution:**

1. Check `src/lib/config.json` syntax:
   ```bash
   # Validate JSON syntax
   node -e "JSON.parse(require('fs').readFileSync('src/lib/config.json'))"
   ```

2. Common issues:
   - Missing comma
   - Extra comma at end
   - Unquoted strings
   - Missing quotes around keys

**Example Fix:**

```json
// ❌ Bad
{
  "name": "John Doe"
  "email": "john@example.com",
}

// ✅ Good
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Resume Not Loading

**Symptoms:**
- 404 error in browser console
- Resume viewer shows blank page

**Solution:**

1. Check file exists:
   ```bash
   ls -la public/resumes/
   ```

2. Check path in `config.json`:
   ```json
   {
     "resume": {
       "displayLink": "/resumes/YourResume.pdf",  // Must start with /
       "downloadFilename": "YourResume.pdf"
     }
   }
   ```

3. File name must match exactly (case-sensitive):
   ```bash
   # ❌ Wrong
   "displayLink": "/resumes/resume.pdf"
   # File: public/resumes/Resume.PDF

   # ✅ Correct
   "displayLink": "/resumes/Resume.PDF"
   # File: public/resumes/Resume.PDF
   ```

### Wrong Base URL

**Symptoms:**
- Homepage works but other pages return 404
- CSS/JS not loading
- Images broken

**Solution:**

Check `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://YOUR-USERNAME.github.io',
  base: '/YOUR-REPO-NAME',  // Must match repository name exactly
});
```

Example:
```javascript
// For repository: github.com/johnsmith/my-portfolio
site: 'https://johnsmith.github.io',
base: '/my-portfolio',  // Not '/My-Portfolio' or '/portfolio'
```

## 🚀 Deployment Issues

### GitHub Actions Fails

**Symptoms:**
- Red X on commit
- Deployment doesn't complete

**Solution:**

1. Check Actions tab for error details

2. Common issues:

   **Build fails:**
   ```bash
   # Test build locally first
   npm run build
   ```

   **Permission denied:**
   - Settings → Actions → General
   - Workflow permissions → Read and write permissions
   - Save

   **Missing secret:**
   - Settings → Secrets → Actions
   - Add required secrets (e.g., GITHUB_TOKEN)

### 404 After Deployment

**Symptoms:**
- Site deployed but shows 404
- Only homepage works

**Solution:**

1. Check GitHub Pages settings:
   - Settings → Pages
   - Source: `gh-pages` branch
   - Folder: `/ (root)`

2. Wait 1-2 minutes for GitHub to update

3. Check `base` in `astro.config.mjs` matches repo name

4. Clear browser cache:
   ```
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

### Assets Not Loading

**Symptoms:**
- Styles not applied
- Images broken
- JavaScript errors

**Solution:**

1. Check browser console for 404 errors

2. Ensure assets use correct base path:

   ```javascript
   // ❌ Wrong
   <img src="/images/photo.jpg" />

   // ✅ Correct (with base)
   <img src={`${import.meta.env.BASE_URL}images/photo.jpg`} />
   
   // ✅ Also correct (Astro handles this)
   <img src="/images/photo.jpg" />  // If base is configured properly
   ```

3. Rebuild and redeploy:
   ```bash
   npm run build
   git add dist
   git commit -m "Rebuild with correct paths"
   git push
   ```

## 📧 Contact Form Issues

### Contact Form Not Submitting

**Symptoms:**
- Form submission fails
- No issue created on GitHub

**Solution:**

1. Check Cloudflare Worker is deployed:
   ```bash
   npx wrangler list
   ```

2. Check Worker URL in `config.json`:
   ```json
   {
     "contactWorkerUrl": "https://your-worker.workers.dev/"
   }
   ```

3. Test Worker directly:
   ```bash
   curl -X POST https://your-worker.workers.dev/ \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","message":"Test"}'
   ```

4. Check browser console for CORS errors

### CORS Errors

**Symptoms:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solution:**

Update `CORS_ORIGIN` in `cloudflare-worker/worker.js`:

```javascript
// Must match your site URL exactly
const CORS_ORIGIN = 'https://yoursite.github.io';

// Or for development
const CORS_ORIGIN = '*';
```

Redeploy worker:
```bash
npm run deploy:worker
```

### GitHub Token Invalid

**Symptoms:**
- Worker returns 401 error
- "Bad credentials" error

**Solution:**

1. Generate new GitHub token:
   - GitHub → Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - Generate new token with `repo` scope

2. Update Worker secret:
   ```bash
   npx wrangler secret put GITHUB_TOKEN
   # Paste new token when prompted
   ```

3. Redeploy:
   ```bash
   npm run deploy:worker
   ```

## 🎨 Styling Issues

### Styles Not Applied

**Symptoms:**
- Page looks unstyled
- Fonts not loading
- Colors wrong

**Solution:**

1. Check CSS files exist:
   ```bash
   ls src/styles/
   ```

2. Check imports in components:
   ```astro
   ---
   import '../styles/global.css';
   import '../styles/vars.css';
   ---
   ```

3. Clear cache and rebuild:
   ```bash
   rm -rf .astro dist
   npm run build
   ```

### Font Not Loading

**Symptoms:**
- Default system font showing
- Console error about font

**Solution:**

1. Check Google Fonts import in `src/styles/global.css`:
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
   ```

2. Check font-family in CSS:
   ```css
   body {
     font-family: 'Inter', sans-serif;
   }
   ```

3. Test font URL in browser

## 🖼️ Image Issues

### Images Not Showing

**Symptoms:**
- Broken image icon
- 404 in console

**Solution:**

1. Check file exists:
   ```bash
   ls public/images/
   ```

2. Check path in code:
   ```html
   <!-- Files in public/ are served from root -->
   <img src="/images/photo.jpg" alt="Photo" />
   ```

3. Check file extension matches:
   ```bash
   # Case-sensitive on Linux/Mac
   # photo.jpg ≠ photo.JPG
   ```

### Image Optimization Issues

**Symptoms:**
- Images load slowly
- Large file sizes

**Solution:**

1. Optimize images before adding:
   ```bash
   # Install imagemagick
   brew install imagemagick  # Mac
   sudo apt install imagemagick  # Linux

   # Optimize
   convert input.jpg -quality 85 -resize 1920x output.jpg
   ```

2. Use modern formats (WebP):
   ```bash
   cwebp input.jpg -q 85 -o output.webp
   ```

## 📱 Responsive Design Issues

### Mobile Layout Broken

**Symptoms:**
- Text too small
- Elements overlap
- Horizontal scroll

**Solution:**

1. Check viewport meta tag in `BaseLayout.astro`:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

2. Test responsive design:
   ```bash
   # Use browser DevTools
   # F12 → Toggle device toolbar (Ctrl+Shift+M)
   ```

3. Check media queries in CSS:
   ```css
   /* Mobile first */
   .element { width: 100%; }
   
   /* Desktop */
   @media (min-width: 768px) {
     .element { width: 50%; }
   }
   ```

## 🐛 JavaScript Errors

### React Hydration Mismatch

**Symptoms:**
```
Warning: Text content did not match. Server: "..." Client: "..."
```

**Solution:**

1. Ensure same data on server and client

2. Don't use `Date.now()` or random values in render:
   ```javascript
   // ❌ Bad
   <div>{Date.now()}</div>

   // ✅ Good
   const timestamp = Date.now();
   <div>{timestamp}</div>
   ```

3. Use `client:only` for client-only components:
   ```astro
   <Component client:only="react" />
   ```

### Scroll Animation Not Working

**Symptoms:**
- ScrollReveal animations don't trigger
- Elements don't fade in

**Solution:**

1. Check ScrollReveal is imported:
   ```javascript
   import ScrollReveal from 'scrollreveal';
   ```

2. Initialize after DOM loads:
   ```javascript
   useEffect(() => {
     ScrollReveal().reveal('.animate', {
       duration: 1000,
       distance: '50px',
       origin: 'bottom'
     });
   }, []);
   ```

3. Check elements have class:
   ```html
   <div class="animate">Content</div>
   ```

## 🔧 Development Server Issues

### Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::4321
```

**Solution:**

```bash
# Option 1: Kill process on port 4321
lsof -ti:4321 | xargs kill -9

# Option 2: Use different port
npm run dev -- --port 3000
```

### Hot Reload Not Working

**Symptoms:**
- Changes don't appear
- Need to refresh manually

**Solution:**

1. Restart dev server:
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

2. Clear cache:
   ```bash
   rm -rf .astro
   ```

3. Check file watcher limits (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

## 📊 Performance Issues

### Slow Build Times

**Symptoms:**
- Build takes several minutes
- High CPU/memory usage

**Solution:**

1. Clear cache before building:
   ```bash
   rm -rf .astro dist node_modules/.cache
   ```

2. Optimize images before adding

3. Reduce number of projects fetched

4. Use build caching in CI:
   ```yaml
   # In .github/workflows/deploy.yml
   - uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

### Large Bundle Size

**Symptoms:**
- Slow page load
- Large JavaScript files

**Solution:**

1. Check bundle size:
   ```bash
   npm run build
   du -sh dist/
   ```

2. Use dynamic imports:
   ```javascript
   // Instead of
   import HeavyComponent from './Heavy';

   // Use
   const HeavyComponent = lazy(() => import('./Heavy'));
   ```

3. Remove unused dependencies:
   ```bash
   npm uninstall unused-package
   ```

## 🔐 Security Issues

### Dependabot Alerts

**Symptoms:**
- GitHub security alerts
- Vulnerable dependencies

**Solution:**

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (may break things)
npm audit fix --force

# Update specific package
npm update vulnerable-package
```

### Token Exposed

**Symptoms:**
- GitHub token committed to repo
- GitHub revoked token

**Solution:**

1. **Immediately** revoke token on GitHub

2. Generate new token

3. Remove from git history:
   ```bash
   # Use BFG Repo-Cleaner or git-filter-branch
   # See GitHub docs for details
   ```

4. Add to `.gitignore`:
   ```
   .env
   .env.local
   *.env
   ```

## 🆘 Getting More Help

### Gather Debug Information

Before asking for help, collect:

```bash
# System info
node -v
npm -v
git --version

# Error logs
npm run build 2>&1 | tee build.log

# Package info
npm list --depth=0
```

### Where to Get Help

1. **Check existing issues**: [GitHub Issues](https://github.com/manideepsp/Portfolio-ManideepSP/issues)
2. **Search documentation**: [Wiki Home](Home)
3. **Create new issue**: Include debug info above
4. **Astro Discord**: [Join here](https://astro.build/chat)

### Creating a Good Issue Report

Include:
- What you were trying to do
- What you expected to happen
- What actually happened
- Error messages (full text)
- System information
- Steps to reproduce

**Template:**
```markdown
## Description
Brief description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Messages
```
Paste error messages here
```

## Environment
- Node version: 
- npm version:
- OS:
- Browser:
```

---

**Related**: See also [Getting Started](Getting-Started) • [Configuration](Configuration) • [Deployment](Deployment)
