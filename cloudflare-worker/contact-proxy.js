addEventListener('fetch', event => {
  event.respondWith(handle(event));
});

async function handle(event) {
  try {
    const req = event.request;
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    const payload = await req.json();

    // Prepare dispatch payload for repository_dispatch
    const owner = payload.owner || 'manideepsp';
    const repo = payload.repo || 'Portfolio-ManideepSP';
    const client_payload = {
      title: payload.title,
      name: payload.name,
      email: payload.email,
      position: payload.position,
      message: payload.message,
      assignee: payload.assignee || null,
    };

    const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;

    // Resolve GitHub token from common Worker binding/env names.
    // Cloudflare Worker secrets are exposed as global bindings (globalThis).
    // Check a few common names to be resilient to naming differences.
    const token = globalThis.GLOBAL_GITHUB_TOKEN || globalThis.GITHUB_TOKEN || globalThis.GH_TOKEN || null;
    // If token is still not found, return an informative error for debugging.
    if (!token) {
      return new Response(JSON.stringify({ ok: false, error: 'GLOBAL_GITHUB_TOKEN not defined in Worker bindings' }), { status: 500 });
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        // GitHub requires a User-Agent header on REST API requests
        'User-Agent': 'portfolio-contact-proxy (https://github.com/manideepsp/Portfolio-ManideepSP)'
      },
      body: JSON.stringify({ event_type: 'contact_form', client_payload })
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ ok: false, status: res.status, error: text }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
