# Configuration

This page explains all configuration options available in the Portfolio-ManideepSP project.

## 📄 Main Configuration File

The primary configuration file is located at `src/lib/config.json`. This file controls most aspects of your portfolio.

## 🎯 Configuration Sections

### Hero Section

Controls the main hero/header information displayed on the homepage.

```json
{
  "hero": {
    "name": "Manideep Sriperambudhuru",
    "firstName": "Manideep",
    "lastName": "Sriperambudhuru",
    "role": "AI Fullstack Engineer",
    "title": "AI • Data • ML",
    "tagline": "I build data & ML systems that scale. Currently shipping backend services and production ML pipelines at scale."
  }
}
```

**Fields:**
- `name` - Full name displayed in header
- `firstName` - First name (used in greetings)
- `lastName` - Last name
- `role` - Your current role/title
- `title` - Short skill summary
- `tagline` - Professional tagline/bio

### Social Links

Configure your social media and professional profiles.

```json
{
  "social": {
    "github": "manideepsp",
    "linkedin": "manideepsp",
    "email": "manideepsp.16@gmail.com"
  }
}
```

**Fields:**
- `github` - GitHub username (not full URL)
- `linkedin` - LinkedIn username (not full URL)
- `email` - Contact email address

### Resume Configuration

Configure which resume to display and download.

```json
{
  "resume": {
    "displayLink": "/resumes/Default Applied ML-AI Engineer Resume.pdf",
    "downloadFilename": "Default Applied ML-AI Engineer Resume.pdf"
  }
}
```

**Fields:**
- `displayLink` - Path to the resume PDF for viewing (relative to `public/`)
- `downloadFilename` - Suggested filename when downloading

**Managing Multiple Resumes:**

1. Place all resume PDFs in `public/resumes/`
2. Update `displayLink` to point to your primary resume
3. The resume viewer allows switching between different versions

### Navigation Links

Customize the main navigation menu.

```json
{
  "navLinks": [
    { "label": "Home", "href": "/" },
    { "label": "Projects", "href": "/projects" },
    { "label": "Resume", "href": "/resume" },
    { "label": "About", "href": "/about" },
    { "label": "Contact", "href": "/contact" }
  ]
}
```

**Fields:**
- `label` - Text displayed in navigation
- `href` - URL path (internal or external)

**Adding Custom Links:**

```json
{
  "navLinks": [
    { "label": "Home", "href": "/" },
    { "label": "Blog", "href": "https://yourblog.com" },
    { "label": "Projects", "href": "/projects" }
  ]
}
```

### Custom Domain

If you have a custom domain, configure it here.

```json
{
  "customDomain": "www.yourportfolio.com"
}
```

Leave empty (`""`) if using GitHub Pages default domain.

### Contact Form Configuration

Configure the Cloudflare Worker for the contact form.

```json
{
  "contactWorkerUrl": "https://portfolio-manideepsp.manideepsp-16.workers.dev/",
  "contactFallback": {
    "repo": "Portfolio-ManideepSP",
    "autoRedirect": true,
    "delayMs": 5000,
    "showFallbackButton": true
  }
}
```

**Fields:**
- `contactWorkerUrl` - URL of your deployed Cloudflare Worker
- `contactFallback.repo` - Repository name for fallback GitHub Issues
- `contactFallback.autoRedirect` - Auto-redirect to GitHub Issues if Worker fails
- `contactFallback.delayMs` - Delay before auto-redirect
- `contactFallback.showFallbackButton` - Show manual fallback button

See [Contact Form Setup](Contact-Form-Setup) for Worker deployment.

## 📝 Content Configuration

### About Page Content

Edit `content/about.md` to customize your about page:

```markdown
# About Me

Your introduction, background, and story.

## Experience

### Company Name (2020 - Present)
**Position Title**

- Achievement 1
- Achievement 2

## Education

Your educational background...

## Skills

Your technical and soft skills...
```

The markdown file supports:
- Headings (H1-H6)
- Lists (ordered and unordered)
- Links
- Bold and italic text
- Code blocks

### Projects Configuration

Projects are defined directly in the page files. Edit `src/pages/projects.astro` to configure your projects:

```javascript
const projects = [
  {
    name: 'Project Name',
    owner: 'your-github-username',
    repo: 'repository-name',
    description: 'Short project description',
    tags: ['React', 'Node.js', 'MongoDB']
  }
];
```

The README for each project is automatically fetched from GitHub.

## 🎨 Styling Configuration

### Color Scheme

Colors are defined in `src/styles/vars.css`:

```css
:root {
  --bg: #0b0f12;           /* Background color */
  --surface: #0f1720;      /* Card background */
  --muted: #94a3b8;        /* Muted text */
  --text: #e6eef6;         /* Main text */
  --accent: #00d4ff;       /* Primary accent (cyan) */
  --accent-2: #7c5cff;     /* Secondary accent (violet) */
  --glass: rgba(255,255,255,0.04); /* Glass effect */
}
```

**Customizing Colors:**

1. Open `src/styles/vars.css`
2. Modify the color values
3. Save and see changes in real-time (dev mode)

### Typography

Font configuration in `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

**Changing Fonts:**

1. Choose fonts from [Google Fonts](https://fonts.google.com/)
2. Update the `@import` URL
3. Update the `font-family` property

## 🔧 Build Configuration

### Astro Configuration

Edit `astro.config.mjs` for build settings:

```javascript
export default defineConfig({
  site: 'https://manideepsp.github.io',
  base: '/Portfolio-ManideepSP',
  // ... other options
});
```

**Important Settings:**
- `site` - Your site URL
- `base` - Base path for GitHub Pages (repository name)

### GitHub Pages Configuration

Update for your GitHub username and repo:

```javascript
site: 'https://your-username.github.io',
base: '/your-repo-name',
```

## 🔐 Environment Variables

For local development with private repos, create `.env`:

```bash
# GitHub Personal Access Token (optional, for private repos)
GITHUB_TOKEN=your_github_token_here

# Cloudflare Worker URL (if different from config.json)
PUBLIC_CONTACT_WORKER_URL=https://your-worker.workers.dev/
```

**Note:** Never commit `.env` to version control!

## 📦 Package Configuration

### Dependencies Management

Edit `package.json` to manage dependencies:

```json
{
  "dependencies": {
    "astro": "^5.16.4",
    "react": "^18.0.0",
    // ... other dependencies
  }
}
```

**Updating Dependencies:**

```bash
# Update all dependencies
npm update

# Update specific package
npm update astro

# Check for outdated packages
npm outdated
```

## ✅ Configuration Validation

Run the validation script to check your configuration:

```bash
npm run validate
```

This checks:
- Config.json syntax
- Resume file paths
- Project references
- Required fields

## 🔄 Dynamic Configuration

Some values can be set at build time using environment variables:

```bash
# Build with custom base URL
ASTRO_BASE=/custom-path npm run build

# Build with custom site URL
ASTRO_SITE=https://custom.domain.com npm run build
```

## 📋 Configuration Checklist

Before deployment, verify:

- [ ] `config.json` has your personal information
- [ ] Social links are correct
- [ ] Resume files exist in `public/resumes/`
- [ ] Resume paths in config match actual files
- [ ] About content is updated
- [ ] Projects list is configured
- [ ] Cloudflare Worker URL is set (if using contact form)
- [ ] Site and base URLs are correct for deployment
- [ ] Color scheme matches your preferences

## 💡 Best Practices

1. **Keep config.json clean** - Only change values, don't add/remove keys
2. **Use absolute paths** - For public assets, use paths starting with `/`
3. **Test locally** - Always test changes with `npm run dev`
4. **Validate before commit** - Run `npm run validate`
5. **Backup config** - Keep a copy of your working config

## 🚨 Common Configuration Errors

### Resume Not Loading

**Problem:** 404 error when viewing resume

**Solution:** 
- Check file path in config.json matches actual file in `public/resumes/`
- Path should start with `/resumes/`, not `public/resumes/`

### Contact Form Not Working

**Problem:** Contact form submission fails

**Solution:**
- Verify `contactWorkerUrl` is correct
- Check Cloudflare Worker is deployed
- See [Contact Form Setup](Contact-Form-Setup) for Worker configuration

### Incorrect Base URL

**Problem:** Links broken after deployment

**Solution:**
- Update `base` in `astro.config.mjs` to match repository name
- Example: `base: '/Portfolio-ManideepSP'`

## 🤝 Need Help?

- Review [Troubleshooting](Troubleshooting) guide
- Check [example config.json](https://github.com/manideepsp/Portfolio-ManideepSP/blob/main/src/lib/config.json)
- Open an [issue](https://github.com/manideepsp/Portfolio-ManideepSP/issues)

---

**Next**: Learn about [deployment to GitHub Pages](Deployment)
