import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function main() {
  try {
    const cfgPath = join(process.cwd(), 'src', 'lib', 'config.json');
    const cfgRaw = await readFile(cfgPath, 'utf8');
    const cfg = JSON.parse(cfgRaw);
    const domain = (cfg.customDomain || '').toString().trim();
    if (!domain) {
      console.log('No customDomain configured in src/lib/config.json — skipping CNAME creation');
      return;
    }
    const outPath = join(process.cwd(), 'dist', 'CNAME');
    await writeFile(outPath, domain, 'utf8');
    console.log(`Wrote CNAME with domain: ${domain}`);
  } catch (err) {
    console.error('Error while trying to write CNAME:', err);
    process.exitCode = 1;
  }
}

main();
