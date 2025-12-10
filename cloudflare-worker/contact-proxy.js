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
    const token = GLOBAL_GITHUB_TOKEN; // set via Worker secret/ENV (see README)

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
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
