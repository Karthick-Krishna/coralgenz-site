import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const htmlFiles = [];

function findHtml(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtml(full);
    } else if (entry.name.endsWith('.html')) {
      htmlFiles.push(full);
    }
  }
}
findHtml(rootDir);

console.log('Total HTML files found:', htmlFiles.length);

const linkReport = {
  htmlLinks: [],
  brokenLinks: [],
  brokenAnchors: [],
  schemaIssues: [],
  ogIssues: []
};

const cleanRoutes = new Set();
const fileAnchorMap = new Map();

for (const file of htmlFiles) {
  const rel = path.relative(rootDir, file);
  let cleanRoute = '/' + rel.replace(/\\/g, '/');
  if (cleanRoute.endsWith('index.html')) {
    cleanRoute = cleanRoute.replace('index.html', '');
  } else {
    cleanRoute = cleanRoute.replace(/\.html$/, '');
  }
  if (cleanRoute.length > 1 && cleanRoute.endsWith('/')) {
    cleanRoute = cleanRoute.slice(0, -1);
  }
  cleanRoutes.add(cleanRoute);

  const content = fs.readFileSync(file, 'utf8');
  const idRegex = /id=["']([^"']+)["']/g;
  const ids = new Set();
  let m;
  while ((m = idRegex.exec(content)) !== null) {
    ids.add(m[1]);
  }
  fileAnchorMap.set(file, ids);
}

console.log('Valid clean routes count:', cleanRoutes.size);

for (const file of htmlFiles) {
  const relFile = path.relative(rootDir, file);
  const fileDir = path.dirname(file);
  const content = fs.readFileSync(file, 'utf8');

  // Check hrefs in <a> tags
  const hrefRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const rawHref = match[1].trim();
    if (!rawHref || rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) {
      continue;
    }

    if (rawHref.includes('.html')) {
      linkReport.htmlLinks.push({ file: relFile, href: rawHref });
    }

    const [target, hash] = rawHref.split('#');

    let targetFilePath;
    if (!target) {
      targetFilePath = file;
    } else if (target.startsWith('/')) {
      let cleanTarget = target;
      if (!cleanTarget.endsWith('.html') && cleanTarget !== '/') {
        cleanTarget += '.html';
      } else if (cleanTarget === '/') {
        cleanTarget = '/index.html';
      }
      targetFilePath = path.join(rootDir, cleanTarget.replace(/^\//, ''));
    } else {
      let cleanTarget = target;
      if (!cleanTarget.endsWith('.html')) {
        cleanTarget += '.html';
      }
      targetFilePath = path.resolve(fileDir, cleanTarget);
    }

    if (target && !fs.existsSync(targetFilePath)) {
      linkReport.brokenLinks.push({ file: relFile, href: rawHref, resolved: path.relative(rootDir, targetFilePath) });
    } else if (hash && fs.existsSync(targetFilePath)) {
      const ids = fileAnchorMap.get(targetFilePath);
      if (ids && !ids.has(hash)) {
        linkReport.brokenAnchors.push({ file: relFile, href: rawHref, targetFile: path.relative(rootDir, targetFilePath), hash });
      }
    }
  }

  // Check Schema and OpenGraph for .html
  const schemaRegex = /"url":\s*"([^"]+)"/g;
  let sMatch;
  while ((sMatch = schemaRegex.exec(content)) !== null) {
    if (sMatch[1].includes('.html')) {
      linkReport.schemaIssues.push({ file: relFile, url: sMatch[1] });
    }
  }

  const ogRegex = /<meta\s+(?:property|name)=["'](?:og:url|twitter:url)["']\s+content=["']([^"']+)["']/gi;
  let ogMatch;
  while ((ogMatch = ogRegex.exec(content)) !== null) {
    if (ogMatch[1].includes('.html')) {
      linkReport.ogIssues.push({ file: relFile, url: ogMatch[1] });
    }
  }
}

console.log('\n================ AUDIT SUMMARY ================');
console.log('Total .html href links found:', linkReport.htmlLinks.length);
console.log('Total broken links (404 targets):', linkReport.brokenLinks.length);
if (linkReport.brokenLinks.length > 0) {
  console.log('\n--- BROKEN LINKS (404s) ---');
  linkReport.brokenLinks.forEach(b => console.log(`[${b.file}] -> "${b.href}" (resolves to: ${b.resolved})`));
}

console.log('\nTotal broken anchors:', linkReport.brokenAnchors.length);
if (linkReport.brokenAnchors.length > 0) {
  console.log('\n--- BROKEN ANCHORS ---');
  linkReport.brokenAnchors.slice(0, 30).forEach(b => console.log(`[${b.file}] -> "${b.href}" (missing #${b.hash} in ${b.targetFile})`));
}

console.log('\nTotal Schema URL issues (.html):', linkReport.schemaIssues.length);
if (linkReport.schemaIssues.length > 0) {
  console.log('\n--- SCHEMA ISSUES ---');
  linkReport.schemaIssues.forEach(s => console.log(`[${s.file}] -> "${s.url}"`));
}

console.log('\nTotal OG/Twitter URL issues (.html):', linkReport.ogIssues.length);
if (linkReport.ogIssues.length > 0) {
  console.log('\n--- OG ISSUES ---');
  linkReport.ogIssues.forEach(s => console.log(`[${s.file}] -> "${s.url}"`));
}
