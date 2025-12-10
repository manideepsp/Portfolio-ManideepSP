# Cloudflare Worker: Contact Proxy

This folder contains a minimal Cloudflare Worker that accepts POSTed contact forms and triggers a `repository_dispatch` event on your GitHub repo. The GitHub Action `contact_issue_from_dispatch.yml` in `.github/workflows/` will then create an issue from the payload.

How it works
- Client POSTs form JSON to the Worker endpoint.
- Worker calls `POST /repos/:owner/:repo/dispatches` with `event_type: 'contact_form'` and `client_payload`.
- GitHub Actions workflow triggered by `repository_dispatch` creates an issue using `peter-evans/create-issue-from-file`.

Security
- Store your GitHub personal access token (PAT) in the Worker secret (dont hardcode in source).
- Token only needs `repo` scope for private repos or `public_repo` for public repos. For creating issues on the same repository using Actions you can rely on the Action's `GITHUB_TOKEN` instead, but dispatch endpoint requires auth from the Worker.

Deploying the Worker (quick steps)
1. Install Wrangler (Cloudflare CLI) and authenticate: `npm i -g wrangler` and `wrangler login`.
2. Add a secret for your token: `wrangler secret put GLOBAL_GITHUB_TOKEN` and paste the token.
3. Publish the Worker: `wrangler publish cloudflare-worker/contact-proxy.js --name portfolio-contact-proxy` (adjust name as needed).

Client usage (from the site)
POST JSON to the Worker URL:
{
  "owner": "your-github-username",
  "repo": "portfolio-site",
  "title": "[Portfolio Contact] Name — email",
  "name": "Recruiter Name",
  "email": "recruiter@example.com",
  "position": "Hiring for ...",
  "message": "Message contents"
}

The Worker returns `{ ok: true }` on success.
