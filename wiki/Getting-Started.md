# Getting Started

This guide will walk you through setting up the Portfolio-ManideepSP project on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- A text editor (VS Code recommended)

## 🔧 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/manideepsp/Portfolio-ManideepSP.git
cd Portfolio-ManideepSP
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Astro (framework)
- React (for interactive components)
- Tailwind CSS (styling utility)
- Remark/Rehype (markdown processing)
- ScrollReveal (animations)

### Step 3: Start Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## 🎨 First-Time Setup

### 1. Update Configuration

Edit `src/lib/config.json` with your personal information:

```json
{
  "hero": {
    "name": "Your Name",
    "firstName": "Your",
    "lastName": "Name",
    "role": "Your Role",
    "title": "Your • Skills",
    "tagline": "Your professional tagline"
  },
  "social": {
    "github": "your-github-username",
    "linkedin": "your-linkedin-username",
    "email": "your.email@example.com"
  }
}
```

See [Configuration](Configuration) for detailed options.

### 2. Add Your Resume

Place your resume PDF files in the `public/resumes/` directory:

```bash
public/
└── resumes/
    ├── Default Resume.pdf
    ├── Data Engineer Resume.pdf
    └── ML Engineer Resume.pdf
```

Update the resume path in `src/lib/config.json`:

```json
{
  "resume": {
    "displayLink": "/resumes/Default Resume.pdf",
    "downloadFilename": "Default Resume.pdf"
  }
}
```

### 3. Update About Content

Edit `content/about.md` to add your personal story:

```markdown
# About Me

Your introduction and background...

## Experience

Your work experience...

## Skills

Your technical skills...
```

### 4. Configure Projects

Projects are automatically fetched from GitHub. Make sure your GitHub repositories have good README files!

The project list is defined in the homepage (`src/pages/index.astro`) and projects page (`src/pages/projects.astro`).

## 🧪 Testing Your Setup

### Development Mode

```bash
npm run dev
```

This starts a local development server with:
- Hot module replacement
- Fast refresh
- Error overlay

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Preview the production build locally before deployment.

### Validate Projects

```bash
npm run validate
```

This validates that all project configurations are correct.

## 📁 Project Structure Overview

```
Portfolio-ManideepSP/
├── src/
│   ├── pages/           # Route pages (index, projects, about, etc.)
│   ├── components/      # Reusable React/Astro components
│   ├── layouts/         # Page layouts
│   ├── lib/            # Utility functions and config
│   └── styles/         # Global styles
├── content/            # Markdown content (about, etc.)
├── public/             # Static assets (resumes, images)
├── dist/               # Production build output
└── package.json        # Project dependencies
```

## 🎯 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run validate` | Validate project configuration |
| `npm run deploy:worker` | Deploy Cloudflare Worker |

## 🔍 Verification Checklist

After setup, verify the following:

- [ ] Development server runs without errors
- [ ] All pages load correctly (Home, Projects, Resume, About, Contact)
- [ ] Your personal information is displayed
- [ ] Resume PDF is viewable and downloadable
- [ ] About page shows your content
- [ ] Contact form loads (may need Cloudflare Worker for full functionality)

## 🚨 Common Setup Issues

### Port 4321 Already in Use

```bash
# Kill the process using port 4321
lsof -ti:4321 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Node Version Mismatch

```bash
# Check your Node version
node -v

# Should be v18 or higher
# Use nvm to switch versions if needed
nvm use 18
```

### Missing Dependencies

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

Now that you have the project running:

1. **[Configuration](Configuration)** - Customize your portfolio
2. **[Architecture](Architecture)** - Understand how it works
3. **[Deployment](Deployment)** - Deploy to GitHub Pages
4. **[Contact Form Setup](Contact-Form-Setup)** - Enable the contact form

## 💡 Tips

- Use `npm run dev` during development for hot reload
- Always run `npm run build` to test production builds before deploying
- Keep your dependencies updated: `npm update`
- Use the validation script before committing changes

## 🤝 Need Help?

- Check [Troubleshooting](Troubleshooting) for common issues
- Open an [issue on GitHub](https://github.com/manideepsp/Portfolio-ManideepSP/issues)
- Review the [README](https://github.com/manideepsp/Portfolio-ManideepSP/blob/main/README.md)

---

**Next**: Learn how to [configure your portfolio](Configuration)
