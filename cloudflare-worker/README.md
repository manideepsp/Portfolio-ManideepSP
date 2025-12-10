**Cloudflare Worker — Contact Proxy**

- **Purpose**: This Worker (`contact-proxy.js`) receives POSTed contact-form JSON from your website and forwards it to GitHub as a `repository_dispatch` event. A GitHub Actions workflow (`.github/workflows/contact_issue_from_dispatch.yml`) consumes that event and creates an issue.

**Environment variables / bindings (names & where they apply)**
- **`CLOUDFLARE_API_TOKEN`** (used by `wrangler` when deploying; correct spelling is `CLOUDFLARE_API_TOKEN`). Some older examples use `CF_API_TOKEN` or a different name — ensure you set the token name your tooling expects. This is NOT read by the Worker at runtime; it's used by the CLI/CI to authenticate with Cloudflare.
- **`GLOBAL_GITHUB_TOKEN`** (Worker runtime secret binding) — the Worker expects the GitHub PAT to be available as a secret binding named `GLOBAL_GITHUB_TOKEN`. The worker code is defensive and also checks common alternative binding names at runtime (`GITHUB_TOKEN`, `GH_TOKEN`) if `GLOBAL_GITHUB_TOKEN` is not present.

Important: Do NOT store secrets in source code. Use `wrangler secret put` for runtime Worker secrets, and repository secrets for CI.

**Required token permissions**
- Cloudflare token: `Account -> Workers -> Scripts -> Edit` (scoped to the target account).
- GitHub PAT: for private repositories give `repo` scope; for public repositories `public_repo` may suffice. The token is used to call the GitHub REST API (`/repos/:owner/:repo/dispatches` and other endpoints used by workflows).

**Deploy locally (quick)**
1. Set the Cloudflare token in your PowerShell session (do not commit it):
```powershell
$env:CLOUDFLARE_API_TOKEN = 'PASTE_YOUR_CLOUDFLARE_API_TOKEN'
```
2. Deploy with Wrangler (via `npx` so you don't need a global install):
```powershell
npx wrangler deploy --env production
```

**Add the GitHub PAT to the Worker runtime**
```powershell
$env:CLOUDFLARE_API_TOKEN = 'PASTE_YOUR_CLOUDFLARE_API_TOKEN'
npx wrangler secret put GLOBAL_GITHUB_TOKEN --env production
# Paste the GitHub PAT when prompted
npx wrangler secret list --env production
```

**Test the Worker**
- PowerShell (Invoke-RestMethod):
```powershell
$body = @{
  title = "Contact from website: Test"
  name  = "Jane Tester"
  email = "test@example.com"
  position = "QA"
  message = "This is a quick test"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'https://<your-worker-url>' -Method Post -Body $body -ContentType 'application/json' -Verbose
```
- curl:
```bash
curl -X POST 'https://<your-worker-url>' \
  -H "Content-Type: application/json" \
  -d '{"title":"Contact from website","name":"Tester","email":"test@example.com","position":"QA","message":"Hello"}'
```

Expected success response: `{"ok":true}`

**CI / GitHub Actions**
- To allow CI to publish the Worker, add a repository secret (example name):
  - `CLOUDFLARE_API_TOKEN` — Cloudflare token for CI
  - `GLOBAL_GITHUB_TOKEN` — GitHub PAT for workflows that need to call the GitHub API

Example using the GitHub CLI (`gh`):
```bash
gh secret set CLOUDFLARE_API_TOKEN --body 'PASTE_CLOUDFLARE_TOKEN' --repo manideepsp/Portfolio-ManideepSP
gh secret set GLOBAL_GITHUB_TOKEN --body 'PASTE_GITHUB_PAT' --repo manideepsp/Portfolio-ManideepSP
```

**Using `WRANGLER_ENV` with npm scripts**
- The repository includes npm scripts that deploy/upload secrets for a Wrangler environment. These scripts read the `WRANGLER_ENV` environment variable and default to `production` when not set.

Examples (PowerShell):
```powershell
# Deploy using the default (production)
npm run deploy:worker

# Deploy using a different Wrangler environment (e.g., staging)
$env:WRANGLER_ENV = 'staging'
npm run deploy:worker

# Upload the runtime GitHub token to the specified Wrangler env
$env:WRANGLER_ENV = 'production'
npm run secret:put:worker
```

**Debugging & logs**
- Tail live Worker logs while testing:
```powershell
$env:CLOUDFLARE_API_TOKEN = 'PASTE_YOUR_CLOUDFLARE_API_TOKEN'
npx wrangler tail --env production --open
```
- If the Worker returns errors about `GLOBAL_GITHUB_TOKEN` missing, ensure you set the runtime secret with `wrangler secret put` and that the name matches one of the checked binding names (`GLOBAL_GITHUB_TOKEN`, `GITHUB_TOKEN`, `GH_TOKEN`).

**Common issues & fixes**
- Authentication error from Cloudflare CLI: ensure you set a valid Cloudflare token in `CLOUDFLARE_API_TOKEN` and that it has `Workers: Edit` permission for the account in `wrangler.toml`.
- 403 from GitHub when creating issues: validate the GitHub PAT scopes (needs `repo` for private repos) and that the token is correctly uploaded as a Worker secret.
- Repository policy blocks third-party actions: this repo requires actions to be owned by `manideepsp`; the contact workflow uses `curl`+`jq` instead of external actions to comply.

**Extras**
- If you want a standardized npm script, I can add a `deploy:worker` script to the root `package.json` that runs `npx wrangler deploy --env production`.
- If your environment doesn't have `jq` on the runner, I can convert the workflow's script to a Python-based implementation.

If you'd like me to add the `deploy:worker` npm script or convert the workflow to Python for compatibility, tell me which option you prefer and I'll implement it.
