import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const htmlFiles = [];
function scan(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) scan(p);
    else if (e.name.endsWith('.html')) htmlFiles.push(p);
  }
}
scan(rootDir);

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Standardize property="twitter:* to name="twitter:*
  content = content.replace(/<meta\s+property=["'](twitter:[^"']+)["']/gi, '<meta name="$1"');

  // 2. Fix typos in twitter:url
  content = content.replace('https://coralgenz.co.in/ontact', 'https://coralgenz.co.in/contact');
  content = content.replace('https://coralgenz.co.in/ur-products', 'https://coralgenz.co.in/our-products');
  content = content.replace('https://coralgenz.co.in/ur-services', 'https://coralgenz.co.in/our-services');

  // 3. Fix stray character in contact.html
  content = content.replace('maximum-scale=5.0"> g', 'maximum-scale=5.0">');

  // 4. Clean up our-products.html meta description
  if (path.basename(file) === 'our-products.html') {
    content = content.replace(/<meta\s+name=["']description["'][^>]*>/i, '<meta name="description" content="Explore Coralgenz Global\'s proprietary software suite: Coralgenz Vault (.secure encrypted storage), Cloud Compiler IDE, and Smart QR Telemetry platform.">');
  }

  // 5. Replace anchor with button in index.html
  if (path.basename(file) === 'index.html') {
    content = content.replace(/<a\s+href=["'](?:javascript:void\(0\)|#)["']\s+role=["']button["']\s+aria-label=["']Check Internship Status["']\s+onclick=["']openCourseStatusModal\(event\)["']\s+class=["']btn-clean-secondary["']>/gi, '<button type="button" aria-label="Check Internship Status" onclick="openCourseStatusModal(event)" class="btn-clean-secondary">');
    content = content.replace('</a>\n                  <a href="/contact" class="btn-clean-primary">', '</button>\n                  <a href="/contact" class="btn-clean-primary">');
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', path.relative(rootDir, file));
  }
}

console.log('Precision SEO fixes applied!');
