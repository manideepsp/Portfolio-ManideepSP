# Architecture

This page explains the technical architecture and design decisions behind the Portfolio-ManideepSP project.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Content Sources                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ config.json│  │ Markdown   │  │  GitHub    │            │
│  │            │  │   Files    │  │  READMEs   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Astro Build Process                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │  1. Fetch GitHub READMEs (build-time)              │    │
│  │  2. Process Markdown → HTML                        │    │
│  │  3. Render React Components                        │    │
│  │  4. Bundle CSS/JS                                  │    │
│  │  5. Optimize Assets                                │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Static Output (dist/)                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  HTML + CSS + JS + Assets                          │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               GitHub Pages CDN Deployment                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Runtime Services (Separate)                │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Contact Form → Cloudflare Worker → GitHub Issues  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Design Philosophy

### Static-First Approach

The portfolio uses a **static-first architecture** where all content is generated at build time:

**Benefits:**
- ⚡ **Lightning fast** - No server-side processing
- 💰 **Zero cost** - Host on GitHub Pages for free
- 🔒 **Secure** - No server to hack, minimal attack surface
- 🌐 **Global CDN** - Fast loading worldwide
- 📈 **Scalable** - Handle unlimited traffic

**Trade-offs:**
- Content updates require rebuild
- Dynamic features need external services (Cloudflare Workers)

### Component Architecture

The project follows a component-based architecture:

```
┌──────────────────────────────────────────────┐
│              Page Components                 │
│  (index.astro, projects.astro, etc.)        │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│            Layout Components                 │
│         (BaseLayout.astro)                   │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│          Reusable Components                 │
│  (Header, Footer, ProjectCard, etc.)        │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│              Utility Functions               │
│  (readmeFetcher, csvParser, etc.)           │
└──────────────────────────────────────────────┘
```

## 📦 Technology Stack

### Core Framework: Astro

**Why Astro?**
- 🚀 **Performance** - Ships zero JS by default
- 🔧 **Flexibility** - Use React, Vue, Svelte, or vanilla JS
- 📝 **Content-focused** - Built for content-heavy sites
- 🎯 **SEO-friendly** - Generates static HTML

**How Astro Works:**
1. Astro components (`.astro`) handle page structure
2. React components (`.jsx`) handle interactive UI
3. Build process renders everything to static HTML
4. Only necessary JavaScript is shipped to client

### UI Framework: React

Used selectively for interactive components:
- ProjectCard interactions
- Resume viewer
- Contact form
- Scroll animations

**Hydration Strategy:**
```javascript
// Only hydrate on client when needed
<Component client:load />      // Hydrate immediately
<Component client:visible />   // Hydrate when visible
<Component client:idle />      // Hydrate when idle
```

### Styling: Custom CSS + CSS Variables

**Approach:**
- CSS Variables for theming
- BEM-like naming convention
- No CSS framework bloat
- Responsive design with media queries

**File Structure:**
```
styles/
├── vars.css       # CSS variables (colors, spacing)
├── global.css     # Global styles
└── animations.css # Animation definitions
```

### Content Processing

#### Markdown Processing Pipeline

```
Raw Markdown
    │
    ▼
┌─────────────────┐
│  remark-parse   │  Parse markdown to AST
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ remark-rehype   │  Transform to HTML AST
└─────────────────┘
    │
    ▼
┌─────────────────┐
│rehype-sanitize  │  Sanitize HTML for security
└─────────────────┘
    │
    ▼
┌─────────────────┐
│rehype-stringify │  Convert to HTML string
└─────────────────┘
    │
    ▼
Safe HTML Output
```

**Libraries Used:**
- `remark` - Markdown processor
- `rehype` - HTML processor
- `rehype-sanitize` - Security sanitization
- `unified` - Pipeline orchestration

## 🔄 Data Flow

### Build-Time Data Flow

```
1. Config Loading
   config.json → JavaScript Object

2. Content Loading
   about.md → Parsed Markdown → HTML

3. Project READMEs
   GitHub API/Raw → Cached → Parsed → HTML

4. Page Generation
   Data + Templates → Static HTML

5. Asset Optimization
   Images, CSS, JS → Optimized → dist/
```

### Runtime Data Flow (Contact Form)

```
User fills form
    │
    ▼
Client-side validation
    │
    ▼
POST to Cloudflare Worker
    │
    ▼
Worker validates & forwards
    │
    ▼
GitHub API creates issue
    │
    ▼
Success response to user
```

## 🏗️ Project Structure Deep Dive

### Source Directory (`src/`)

```
src/
├── pages/              # Route-based pages
│   ├── index.astro    # Homepage (/)
│   ├── projects.astro # Projects page (/projects)
│   ├── resume.astro   # Resume page (/resume)
│   ├── about.astro    # About page (/about)
│   └── contact.astro  # Contact page (/contact)
│
├── components/         # Reusable components
│   ├── Header.jsx     # Site header/navigation
│   ├── Footer.jsx     # Site footer
│   ├── ProjectCard.jsx # Project card component
│   └── ...
│
├── layouts/           # Page layouts
│   └── BaseLayout.astro # Base HTML structure
│
├── lib/               # Utilities and helpers
│   ├── config.json    # Site configuration
│   ├── readmeFetcher.js # Fetch GitHub READMEs
│   └── csvParser.js   # Parse CSV files
│
└── styles/            # Global styles
    ├── vars.css       # CSS variables
    └── global.css     # Global CSS
```

### Content Directory (`content/`)

```
content/
└── about.md          # About page markdown content
```

Stores markdown content that's processed at build time.

### Public Directory (`public/`)

```
public/
├── resumes/          # Resume PDF files
│   └── *.pdf
├── og/               # Open Graph images
└── images/           # Static images
```

Files here are served as-is without processing.

## 🔐 Security Architecture

### Build-Time Security

1. **Markdown Sanitization**
   - All markdown is sanitized with `rehype-sanitize`
   - Prevents XSS attacks from README content
   - Removes dangerous HTML tags

2. **Content Security Policy**
   - Implemented via meta tags
   - Restricts script sources
   - Prevents inline script execution

3. **Dependency Security**
   - Regular dependency audits
   - Minimal dependencies
   - Locked dependency versions

### Runtime Security (Contact Form)

1. **Cloudflare Worker Isolation**
   - Worker runs in isolated environment
   - Secrets stored in Worker environment
   - No tokens exposed to client

2. **Input Validation**
   - Client-side validation
   - Server-side validation in Worker
   - Rate limiting in Worker

3. **GitHub Token Scoping**
   - Minimal scope (only repo:issues)
   - Stored securely in Cloudflare
   - Never exposed to client

## 📊 Performance Architecture

### Build Optimization

```
Source Files → Astro Build Pipeline
    │
    ├─→ HTML: Minified
    ├─→ CSS: Bundled, Minified, Purged
    ├─→ JS: Bundled, Minified, Tree-shaken
    └─→ Images: Optimized
```

### Loading Strategy

1. **Critical CSS** - Inlined in `<head>`
2. **Lazy Loading** - Images loaded on scroll
3. **Code Splitting** - Per-page JavaScript bundles
4. **Preloading** - Critical resources preloaded
5. **Caching** - Aggressive caching headers

### Performance Metrics

Target Lighthouse Scores:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 🚀 Deployment Architecture

### CI/CD Pipeline

```
Push to main branch
    │
    ▼
GitHub Actions triggered
    │
    ├─→ Install dependencies
    ├─→ Run validation
    ├─→ Build static site
    ├─→ Run tests (if any)
    └─→ Deploy to gh-pages branch
        │
        ▼
    GitHub Pages serves site
        │
        ▼
    Global CDN distribution
```

### Deployment Workflow

```yaml
# .github/workflows/deploy.yml
1. Checkout code
2. Setup Node.js
3. Install dependencies (npm ci)
4. Validate configuration
5. Build project (npm run build)
6. Deploy to gh-pages branch
```

## 🔌 External Integrations

### GitHub API Integration

**Purpose:** Fetch project READMEs

**Methods:**
1. **Raw.githubusercontent.com** (Public repos)
   - No authentication needed
   - Simple HTTP GET
   - Fast and reliable

2. **GitHub API** (Private repos)
   - Requires authentication token
   - More features (metadata, stats)
   - Rate limited (5000 req/hour)

### Cloudflare Workers Integration

**Purpose:** Contact form backend

**Architecture:**
```
Client → Cloudflare Worker → GitHub API
   │          │                    │
   │          └─ Validation        │
   │          └─ Rate limiting     │
   │          └─ Authentication    │
   │                               │
   └───────────────────────────────┘
              Response
```

## 🎨 Rendering Pipeline

### Page Rendering Process

```
1. Route Request
   URL → Astro Router

2. Data Fetching
   Load config, markdown, READMEs

3. Component Rendering
   Astro components → HTML
   React components → HTML (or hydrated)

4. Layout Application
   Content → Layout → Complete page

5. Asset Injection
   CSS, JS, images → Final HTML

6. Response
   Optimized HTML → Client
```

## 🧪 Testing Architecture

### Validation Layers

1. **Config Validation**
   - JSON schema validation
   - Required fields check
   - Type checking

2. **Build Validation**
   - All pages build successfully
   - No broken links
   - Assets exist

3. **Runtime Validation**
   - Forms work correctly
   - Navigation functions
   - Responsive design

## 📈 Scalability Considerations

### Horizontal Scalability

- Static files scale infinitely on CDN
- No server-side bottlenecks
- GitHub Pages handles high traffic

### Content Scalability

- Build time increases with project count
- README caching reduces build time
- Incremental builds possible with Astro

### Performance at Scale

- Lazy loading prevents initial bloat
- Code splitting keeps bundles small
- CDN caching reduces server load

## 🔄 Update Workflow

### Content Updates

```
1. Update source files (config, markdown, etc.)
2. Commit to main branch
3. GitHub Actions rebuilds site
4. New version deployed automatically
```

### Dependency Updates

```
1. Run npm update
2. Test locally
3. Commit package.json and package-lock.json
4. Deploy via CI/CD
```

## 💡 Design Patterns

### Patterns Used

1. **Static Site Generation (SSG)** - Build-time rendering
2. **Component-Based Architecture** - Reusable UI components
3. **Configuration-Driven** - Behavior controlled by config
4. **Markdown-Based Content** - Content in markdown files
5. **Progressive Enhancement** - Works without JavaScript
6. **Mobile-First Design** - Responsive from smallest screen

## 🎓 Learning from Architecture

**Key Takeaways:**
- Static sites are fast, secure, and cheap
- Build-time generation enables zero-runtime cost
- External services handle dynamic features
- Component architecture promotes reusability
- Configuration-driven design enables easy customization

---

**Next**: Learn how to [deploy your portfolio](Deployment)
