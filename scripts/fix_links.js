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

console.log(`Found ${htmlFiles.length} HTML files to update.`);

// Map of replacements for href attributes
const replacements = [
  // Anchors on index
  { regex: /href=["'](?:\.\.\/)?index\.html#about["']/g, replace: 'href="/#about"' },
  { regex: /href=["'](?:\.\.\/)?index\.html#services["']/g, replace: 'href="/#services"' },
  { regex: /href=["'](?:\.\.\/)?index\.html#certifications["']/g, replace: 'href="/#certifications"' },
  { regex: /href=["'](?:\.\.\/)?index\.html#partners["']/g, replace: 'href="/#partners"' },
  { regex: /href=["'](?:\.\.\/)?index\.html#products["']/g, replace: 'href="/#products"' },
  { regex: /href=["'](?:\.\.\/)?index\.html["']/g, replace: 'href="/"' },

  // Subpages in our-highlights
  { regex: /href=["'](?:\.\.\/)?(?:our-highlights\/)?worlds-first-secure-format\.html(["'#])/g, replace: 'href="/our-highlights/worlds-first-secure-format$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-highlights\/)?coralgenz-vault-security\.html(["'#])/g, replace: 'href="/our-highlights/coralgenz-vault-security$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-highlights\/)?coralgenz-qr-telemetry\.html(["'#])/g, replace: 'href="/our-highlights/coralgenz-qr-telemetry$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-highlights\/)?coralgenz-compiler-engine\.html(["'#])/g, replace: 'href="/our-highlights/coralgenz-compiler-engine$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-highlights\/)?clean-architecture-standards\.html(["'#])/g, replace: 'href="/our-highlights/clean-architecture-standards$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-highlights\/)?microsoft-salesforce-partner\.html(["'#])/g, replace: 'href="/our-highlights/microsoft-salesforce-partner$1' },
  { regex: /href=["'](?:\.\.\/)?our-highlights\.html(["'#])/g, replace: 'href="/our-highlights$1' },

  // Subpages in our-services
  { regex: /href=["'](?:\.\.\/)?(?:our-services\/)?custom-software-development\.html(["'#])/g, replace: 'href="/our-services/custom-software-development$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-services\/)?domain-and-deployment-service\.html(["'#])/g, replace: 'href="/our-services/domain-and-deployment-service$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-services\/)?frontend-modernization\.html(["'#])/g, replace: 'href="/our-services/frontend-modernization$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-services\/)?full-stack-software\.html(["'#])/g, replace: 'href="/our-services/full-stack-software$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-services\/)?legacy-software-modernization\.html(["'#])/g, replace: 'href="/our-services/legacy-software-modernization$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-services\/)?modern-admin-dashboards\.html(["'#])/g, replace: 'href="/our-services/modern-admin-dashboards$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-services\/)?mvp-development\.html(["'#])/g, replace: 'href="/our-services/mvp-development$1' },
  { regex: /href=["'](?:\.\.\/)?(?:our-services\/)?pwa-development\.html(["'#])/g, replace: 'href="/our-services/pwa-development$1' },
  { regex: /href=["'](?:\.\.\/)?our-services\.html(["'#])/g, replace: 'href="/our-services$1' },

  // Products & other root pages
  { regex: /href=["'](?:\.\.\/)?our-products\.html(["'#])/g, replace: 'href="/our-products$1' },
  { regex: /href=["'](?:\.\.\/)?coralgenz-vault\.html(["'#])/g, replace: 'href="/coralgenz-vault$1' },
  { regex: /href=["'](?:\.\.\/)?coralgenz-compiler\.html(["'#])/g, replace: 'href="/coralgenz-compiler$1' },
  { regex: /href=["'](?:\.\.\/)?coralgenz-qr\.html(["'#])/g, replace: 'href="/coralgenz-qr$1' },
  { regex: /href=["'](?:\.\.\/)?team\.html(["'#])/g, replace: 'href="/team$1' },
  { regex: /href=["'](?:\.\.\/)?karthick-krishna\.html(["'#])/g, replace: 'href="/karthick-krishna$1' },
  { regex: /href=["'](?:\.\.\/)?thanvanth-h\.html(["'#])/g, replace: 'href="/thanvanth-h$1' },
  { regex: /href=["'](?:\.\.\/)?sharveshwaran-r\.html(["'#])/g, replace: 'href="/sharveshwaran-r$1' },
  { regex: /href=["'](?:\.\.\/)?know-more\.html(["'#])/g, replace: 'href="/know-more$1' },
  { regex: /href=["'](?:\.\.\/)?contact\.html(["'#])/g, replace: 'href="/contact$1' },
  { regex: /href=["'](?:\.\.\/)?microsoft\.html(["'#])/g, replace: 'href="/microsoft$1' },
  { regex: /href=["'](?:\.\.\/)?salesforce\.html(["'#])/g, replace: 'href="/salesforce$1' },
  { regex: /href=["'](?:\.\.\/)?privacy-policy\.html(["'#])/g, replace: 'href="/privacy-policy$1' },
  { regex: /href=["'](?:\.\.\/)?coralgenz-vault-privacy\.html(["'#])/g, replace: 'href="/coralgenz-vault-privacy$1' }
];

let totalReplacements = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Replace href links
  for (const { regex, replace } of replacements) {
    const matches = content.match(regex);
    if (matches) {
      totalReplacements += matches.length;
      content = content.replace(regex, replace);
    }
  }

  // 2. Clean JSON-LD schema .html URLs
  content = content.replace(/https:\/\/coralgenz\.co\.in\/([a-zA-Z0-9_\-\/]+)\.html(#|[",])/g, 'https://coralgenz.co.in/$1$2');

  // 3. For 404.html add noindex if missing
  if (path.basename(file) === '404.html' && !content.includes('robots')) {
    content = content.replace('<head>', '<head>\n  <meta name="robots" content="noindex, follow">');
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.relative(rootDir, file)}`);
  }
}

console.log(`\nSuccessfully applied ${totalReplacements} href replacements across HTML files.`);
