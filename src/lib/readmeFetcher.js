// Build-time README fetcher (public repos)
export async function fetchReadme(ownerRepo, branch = 'main') {
  try {
    const url = `https://raw.githubusercontent.com/${ownerRepo}/${branch}/README.md`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return await res.text();
  } catch (err) {
    return `# README not available\n\nCould not fetch README for ${ownerRepo}.`;
  }
}
