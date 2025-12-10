// Minimal helpers for contact form (prefill issue URL)
export function makePrefillIssueUrl({ owner, repo, name, email, position, message }) {
  const title = encodeURIComponent(`[Portfolio Contact] ${name} — ${email}`);
  const body = encodeURIComponent(`**Name:** ${name}\n**Email:** ${email}\n**Position:** ${position}\n\n---\n\n${message}`);
  return `https://github.com/${owner}/${repo}/issues/new?title=${title}&body=${body}`;
}
