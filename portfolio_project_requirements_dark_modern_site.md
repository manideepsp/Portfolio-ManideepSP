# Portfolio Website Requirements Document (LLM-Ready)

## 1. Project Overview
**Purpose:** Build a polished, dark modern portfolio website that showcases engineering work, ML/data projects, resume versions, and allows contact via GitHub Issues as form submission.

**Platform:** Static site hosted on GitHub Pages.

**Tech stack:** Astro (preferred) or Vite + React. Use vanilla JS/TS and lightweight dependencies for markdown rendering (rehype/remark) and CSS (Tailwind optional but not required).

**Core functionality:** Data-driven content (README fetch, CSV parse, markdown content), visually modern UI, recruiter-oriented navigation, issue-based contact form, resume switching, CI-driven builds.

---

## 2. Visual & Design Requirements
### Theme: Dark Modern
- Black/charcoal base
- Neon cyan + secondary violet accent
- Strong typography (Inter / Satoshi)
- Minimal, high contrast, clean layout
- Scroll reveal animations
- Glass card layout for projects
- Animated hero and micro interactions
- Responsive across mobile / tablet / desktop

### Inspiration reference
- brittanychiang.com
- joshwcomeau.com
(Do not copy; combine styles in original execution.)

---

## 3. Pages & Site Structure
### Pages
- Home (`/`)
  - Hero headline + sub headline
  - Primary CTAs (View projects / Download resume)
  - Showcase top 3 projects
- Projects (`/projects`)
  - Cards for each project
  - Expanded view using README fetched from GitHub
  - Tech stack filter (optional)
- Resume (`/resume`)
  - View inline viewer + download
  - Switch between multiple resumes stored in `/public/resumes/`
- About (`/about`)
  - Story + timeline of experience
- Contact (`/contact`)
  - Form implemented via GitHub Issues prefilling
  - Email fallback

### Navigation Layout
- Sticky transparent nav with blur backdrop
- Left aligned logo, right aligned navigation links

### Component Requirements
- Header/NavBar
- Footer
- ProjectCard
- Timeline
- MarkdownRenderer
- ScrollRevealWrapper
- ResumeViewer

---

## 4. Repository Structure (file tree)
```
portfolio-site/
├─ public/
│  ├─ resumes/
│  │  ├─ resume_latest.pdf
│  │  └─ resume_data_engineer.pdf
│  ├─ og/
│  └─ images/
├─ src/
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ projects.astro
│  │  ├─ resume.astro
│  │  ├─ about.astro
│  │  └─ contact.astro
│  ├─ components/
│  │  ├─ Header.jsx
│  │  ├─ Footer.jsx
│  │  ├─ ProjectCard.jsx
│  │  ├─ ProjectDetail.jsx
│  │  ├─ Timeline.jsx
│  │  ├─ MarkdownRenderer.jsx
│  │  ├─ ScrollRevealWrapper.jsx
│  │  └─ ResumeViewer.jsx
│  ├─ lib/
│  │  ├─ readmeFetcher.js
│  │  ├─ readmeFetcherApi.js
│  │  ├─ csvParser.js
│  │  ├─ config.json
│  │  └─ githubForm.js
│  └─ styles/
│     ├─ vars.css
│     └─ global.css
├─ content/
│  ├─ about.md
│  ├─ skills.csv
│  └─ experience.md
├─ .github/
│  └─ workflows/
│     ├─ build_and_deploy.yml
│     └─ contact_issue_from_dispatch.yml
├─ package.json
└─ astro.config.mjs
```

---

## 5. Content Source Strategy
### Config-driven data
`src/lib/config.json` controls display content:
```json
{
  "name": "Ashish Sp",
  "title": "Software Engineer • Data & ML",
  "githubUsername": "USERNAME",
  "resume": "resume_latest.pdf",
  "projectsRepoList": [
    "user/project-a",
    "user/project-b"
  ]
}
```

### Markdown content
- `/content/about.md`
- `/content/experience.md`
- `/content/skills.csv` (parsed into badges or visual elements)

---

## 6. Dynamic Project README Fetch
### A. Raw.githubusercontent.com method (build-time, public repos) — preferred for simplicity
**Usage:** Fetch the raw README at build time and render it.

`src/lib/readmeFetcher.js` (ES module for build-time use):
```js
export async function fetchReadme(ownerRepo, branch = 'main') {
  const url = `https://raw.githubusercontent.com/${ownerRepo}/${branch}/README.md`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.text();
}
```

**Notes:** Works only if README.md exists in the default branch and repo is public.

### B. GitHub API method (supports private repos & metadata) — CI-only
**Usage:** Use only from CI (GitHub Actions) where token is stored as secret.

`src/lib/readmeFetcherApi.js` (Node for build):
```js
import fetch from 'node-fetch';
export async function fetchReadmeApi(ownerRepo, token, branch='main'){
  const url = `https://api.github.com/repos/${ownerRepo}/contents/README.md?ref=${branch}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3.raw' }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.text();
}
```

**Notes:** Put `GH_README_TOKEN` in GitHub Actions secrets and call this function during the build job. Do not expose token client-side.

### Markdown rendering & sanitization
Use `remark` + `rehype` to convert markdown to HTML and `rehype-sanitize` to strip unsafe tags. Preserve heading structure for accessibility.

---

## 7. CSV parsing (client or build)
Small CSV parser (no deps):

`src/lib/csvParser.js`
```js
export function parseCSV(csvText) {
  const lines = csvText.trim().split(/?
/);
  const headers = lines.shift().split(',').map(h => h.trim());
  return lines.map(l => {
    const cols = l.split(',').map(c => c.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = cols[i] ?? '');
    return obj;
  });
}
```

---

## 8. GitHub Issues as Contact Form — Implementations
Two-tier approach (immediate fallback + secure automation later):

### Option 1 — Prefilled "New Issue" link (zero-cost, no backend)
**Client-side form behavior:** open GitHub's new issue page with `title` and `body` prefilled.

**Implementation snippet (client-side):**
```html
<form id="contactForm"> ... </form>
<script>
  const owner = 'your-github-username';
  const repo = 'portfolio-site';
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const title = encodeURIComponent(`[Portfolio Contact] ${f.name.value} — ${f.email.value}`);
    const body = encodeURIComponent(`**Name:** ${f.name.value}
**Email:** ${f.email.value}
**Position:** ${f.position.value}

---

${f.message.value}`);
    const url = `https://github.com/${owner}/${repo}/issues/new?title=${title}&body=${body}`;
    window.open(url, '_blank');
  });
</script>
```

**Pros:** Free, zero secrets, instant.  **Cons:** Recruiter must be logged into GitHub to submit.

### Option 2 — Secure automatic issue creation (recommended later)
**Flow:** client → Cloudflare Worker (proxy) → GitHub `repository_dispatch` or create issue API → GitHub Actions/Workflow reads payload (optional) → create issue using secret token.

**Why:** Keeps tokens secure, allows anonymous recruiters to submit without GitHub login.

**A. Cloudflare Worker proxy (free tier) — sample**
```js
addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});
async function handle(req){
  const payload = await req.json();
  const repo = 'your-username/portfolio-site';
  const token = 'CLOUDFLARE_WRAPPER_SHOULD_CALL_ACTION';
  // Instead: Worker calls GitHub API using a token stored in Worker secret
  const ghRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${TOKEN_FROM_WRAPPER}`, 'Accept':'application/vnd.github.v3+json' },
    body: JSON.stringify({ title: payload.title, body: payload.body })
  });
  return new Response(JSON.stringify({ ok: ghRes.ok }), { status: 200 });
}
```

**Security:** Store token in Worker secrets (not in code). Cloudflare Worker free tier is effectively free for low traffic.

**B. GitHub Actions repository_dispatch approach**
- Client POSTS to the GitHub REST endpoint `/repos/{owner}/{repo}/dispatches` to trigger a `repository_dispatch` event. That endpoint requires authentication; therefore the client cannot call it securely.
- Better flow: client → Cloudflare Worker (public) → call GitHub `dispatches` with token stored in Worker secret → Action triggers and creates issue (Action has more expressive capabilities).

**Sample Action to create issue on `repository_dispatch`:**
```yaml
name: Create Contact Issue
on:
  repository_dispatch:
    types: [contact_form]
jobs:
  create_issue:
    runs-on: ubuntu-latest
    steps:
      - name: Create issue
        uses: peter-evans/create-issue-from-file@v4
        with:
          title: "${{ github.event.client_payload.title }}"
          body: |
            **From:** ${{ github.event.client_payload.name }}  
            **Email:** ${{ github.event.client_payload.email }}  
            **Position:** ${{ github.event.client_payload.position }}  

            ${{ github.event.client_payload.message }}
          assignees: your-github-username
```

**Notes:** This keeps GitHub tokens in Actions secrets and Worker secrets, preventing client-side leaks.

---

## 9. UI Layout Wireframe Breakdown (component mapping)
All components should follow the design system tokens.

### Home (Hero + Highlights)
- **HeroSection**: Headline (H1), Subline (P), CTAs (buttons)
- **KeyStats**: small badges (years experience, projects shipped)
- **FeaturedProjects**: horizontal card row (ProjectCard)
- **Footer**: contact links

### Projects
- **ProjectsPage**: filters (chips), grid of ProjectCard
- **ProjectCard**: title, short desc (first paragraph of README), tech tags, link to repo, CTA "Read More"
- **ProjectDetail (toggle)**: full rendered README, repo metadata (stars, last updated)

### Resume
- **ResumeViewer**: dropdown to choose active resume (based on config), iframe viewer, download link

### About
- **AboutContent**: markdown from content/about.md
- **Timeline**: Timeline component rendering experience.md entries with date, role, bullets

### Contact
- **ContactForm**: fields (name, email, position, message), submit flows:
  1. open prefilled issue (default)
  2. call proxy endpoint (if Cloudflare Worker available)
- **SocialLinks**: GitHub, LinkedIn, Email

---

## 10. Design System (colors, typography, spacing scale)
### Colors
```
--bg: #0b0f12;           /* very dark charcoal */
--surface: #0f1720;      /* slightly lighter card bg */
--muted: #94a3b8;        /* muted text */
--text: #e6eef6;         /* main text */
--accent: #00d4ff;       /* cyan accent */
--accent-2: #7c5cff;     /* violet for secondary */
--glass: rgba(255,255,255,0.04);
```

### Typography (Google fonts)
- **Primary:** Inter (400/600/700/800) or Satoshi if available
- **Scale:**
  - H1: 48px (desktop) / 34px (mobile) — weight 700
  - H2: 28–36px — weight 600
  - H3: 20–24px — weight 600
  - Body: 16px — weight 400, line-height 1.6
  - Small: 14px — muted
- **Monospace:** `ui-monospace, SFMono-Regular, Menlo, monospace`

### Spacing scale (multiples of 8px)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

### Border radius & shadows
- Radius: 14px
- Glass blur: 8px
- Card shadow: `0 8px 24px rgba(2,6,23,0.8)`

---

## 11. Accessibility & SEO
- Use semantic HTML
- Alt text on images
- High contrast text
- Meta tags + OG images
- Ensure keyboard navigation on interactive elements

---

## 12. Deployment Automation Strategy
Two approaches: `docs/` on `main` (simple) or `gh-pages` branch (common). Prefer GitHub Actions build + deploy to `gh-pages` for clean main branch.

### A. GitHub Actions: Build & Deploy to gh-pages (recommended)
**High-level:** On push to `main`, run `npm ci`, `npm run build` → push `dist/` to `gh-pages` branch using `peaceiris/actions-gh-pages`.

`.github/workflows/build_and_deploy.yml` (example):
```yaml
name: Build and Deploy
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Notes:** If using Astro, set `outDir` to `dist` or adjust `publish_dir` accordingly. This uses the built-in `GITHUB_TOKEN` so no extra secrets needed for deployment.

### B. Build to `docs/` (alternative)
- Configure Astro to output to `docs/` and set Pages to serve `/docs` from `main` branch (simpler, no gh-pages branch). Use `npm run build` and committed `docs/` to repo (not ideal if build artifacts are committed).

### C. CI for README API (private repos)
- If using `fetchReadmeApi`, set secret `GH_README_TOKEN` in repo settings and reference in the build step as env var. Example in Action: `env: GH_README_TOKEN: ${{ secrets.GH_README_TOKEN }}`.

### D. Automated Issue Creation via repository_dispatch
- If using Cloudflare Worker proxy to call dispatch, keep Action `contact_issue_from_dispatch.yml` to respond. Worker must hold token with minimal scope for `repo:issues`.

---

## 13. GitHub Actions: Contact Issue Workflow (example)
`.github/workflows/contact_issue_from_dispatch.yml` (runs when repository_dispatch event occurs):
```yaml
name: Create Contact Issue
on:
  repository_dispatch:
    types: [contact_form]
jobs:
  create_issue:
    runs-on: ubuntu-latest
    steps:
      - name: Create issue from payload
        uses: peter-evans/create-issue-from-file@v4
        with:
          title: "${{ github.event.client_payload.title }}"
          body: |
            **From:** ${{ github.event.client_payload.name }}  
            **Email:** ${{ github.event.client_payload.email }}  
            **Position:** ${{ github.event.client_payload.position }}  

            ${{ github.event.client_payload.message }}
          assignees: your-github-username
```

**Secrets & Permissions:** The workflow uses the `GITHUB_TOKEN` automatically; make sure the token has permissions to create issues for the repo (default is OK for same-repo workflows).

---

## 14. Code Snippets Summary
### README raw fetch (client or build)
```
https://raw.githubusercontent.com/<owner>/<repo>/main/README.md
```

### Prefill issue URL
```
https://github.com/<owner>/<repo>/issues/new?title=<encoded>&body=<encoded>
```

### Build & deploy Action (peaceiris) — see section 12A

---

## 15. Functionality Checklist (expanded)
- [ ] Dark modern theme implemented
- [ ] Scroll reveal animations
- [ ] Hero + CTA implemented
- [ ] Projects page reads READMEs dynamically
- [ ] CSV parsed and rendered for skills
- [ ] Resume viewer + downloadable selector
- [ ] Contact page uses GitHub Issues prefill
- [ ] (Optional) Cloudflare Worker deployed & repository_dispatch flow working
- [ ] Responsive design
- [ ] SEO + meta + OG images
- [ ] Accessible text contrast
- [ ] Tests: basic smoke test for pages and contact flow

---

## 16. Operational Notes & Security
- Never expose personal access tokens client-side.
- Use GitHub Actions secrets for any token used at build-time.
- Use Cloudflare Workers or similar as a secure proxy for writing to GitHub API.

---

## 17. Next steps / Deliverables (what the LLM or developer should do next)
1. Create the GitHub repo `portfolio-site` and add file skeleton.
2. Implement base layout & CSS tokens.
3. Implement `fetchReadme` and Projects page (build-time).
4. Implement contact form prefill (Option 1) and test.
5. Add GitHub Actions for build & deploy.
6. (Optional) Deploy Cloudflare Worker + update contact flow to proxy for anonymous submissions.

---

## 18. Success Definition
Website must:
- Look polished and modern
- Highlight projects professionally
- Make contacting easy
- Be updateable dynamically via markdown & repo updates
- Deploy from GitHub without backend cost

**Completion criteria:** Production URL live with working projects list and contact form.

---

## Appendix: ASCII Architecture Diagram (LLM-friendly)

```
+----------------------+        +----------------------+      +------------------+
|   Recruiter Browser  | <----> |   GitHub Pages Site  | <--> |   GitHub Repos   |
| (Client: HTML/JS)    |        | (Static files served)|      | (project/README) |
+----------------------+        +----------------------+      +------------------+
        |                                   ^   
        | Contact form -> opens prefilled    |   README fetch (raw.githubusercontent)
        | issue URL (or POST to Worker)     |   (build-time) or API (CI)
        v                                   |
+----------------------+                    |
|  Cloudflare Worker   |--------------------+
|  (optional proxy)    |  --calls--> GitHub API (create issue or dispatches)
+----------------------+                    |
        ^                                    v
        |                             +---------------------+
        |                             | GitHub Actions CI   |
        |                             | (build + deploy)    |
        |                             | - fetch private READMEs
        |                             | - build site        |
        |                             | - deploy to gh-pages|
        |                             +---------------------+
        |                                    |
        +------------------------------------+
                     (push to main triggers CI)
```

---

*Document prepared to be LLM-consumable: clear json snippets, file paths, code blocks, and actionable steps for an LLM or developer to implement the portfolio site end-to-end.*

