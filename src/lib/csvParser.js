// Minimal CSV parser (no deps)
export function parseCSV(csvText) {
  if (!csvText) return [];
  const lines = csvText.trim().split(/\r?\n/);
  const headers = lines.shift().split(',').map(h => h.trim());
  return lines.map(l => {
    const cols = l.split(',').map(c => c.trim());
    const obj = {};
    headers.forEach((h, i) => (obj[h] = cols[i] ?? ''));
    return obj;
  });
}
