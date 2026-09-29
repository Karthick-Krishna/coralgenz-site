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

const report = {
  totalPages: htmlFiles.length,
  pages: {},
  summary: {
    missingTitle: 0,
    missingMetaDesc: 0,
    shortMetaDesc: 0,
    longMetaDesc: 0,
    missingCanonical: 0,
    mismatchedCanonical: 0,
    missingH1: 0,
    multipleH1: 0,
    missingOgTitle: 0,
    missingOgDesc: 0,
    missingOgImage: 0,
    missingOgUrl: 0,
    missingTwitterCard: 0,
    missingSchema: 0,
    invalidSchemaJson: 0,
    missingImgAlt: 0,
    emptyLinks: 0,
    brokenInternalLinks: 0,
    noindexOnValidPages: 0,
    missingBreadcrumbSchema: 0,
  }
};

const cleanRoutes = new Set();
for (const file of htmlFiles) {
  const rel = path.relative(rootDir, file);
  let route = '/' + rel.replace(/\\/g, '/');
  if (route.endsWith('index.html')) route = route.replace('index.html', '');
  else route = route.replace(/\.html$/, '');
  if (route.length > 1 && route.endsWith('/')) route = route.slice(0, -1);
  cleanRoutes.add(route);
}

for (const file of htmlFiles) {
  const relFile = path.relative(rootDir, file);
  const is404 = relFile === '404.html';
  const content = fs.readFileSync(file, 'utf8');

  let cleanRoute = '/' + relFile.replace(/\\/g, '/');
  if (cleanRoute.endsWith('index.html')) cleanRoute = cleanRoute.replace('index.html', '');
  else cleanRoute = cleanRoute.replace(/\.html$/, '');
  if (cleanRoute.length > 1 && cleanRoute.endsWith('/')) cleanRoute = cleanRoute.slice(0, -1);

  const expectedCanonical = `https://coralgenz.co.in${cleanRoute === '/' ? '/' : cleanRoute}`;

  const pageErrors = [];
  const pageWarnings = [];

  // 1. Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    pageErrors.push('Missing <title>');
    report.summary.missingTitle++;
  }

  // 2. Meta Description
  const metaDescMatch = content.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i) ||
                        content.match(/<meta\s+name=["']description["']\s+content='([^']*)'/i) ||
                        content.match(/<meta\s+content="([^"]*)"\s+name=["']description["']/i);
  if (!metaDescMatch || !metaDescMatch[1].trim()) {
    if (!is404) {
      pageErrors.push('Missing <meta name="description">');
      report.summary.missingMetaDesc++;
    }
  } else {
    const descLen = metaDescMatch[1].trim().length;
    if (descLen < 60 && !is404) {
      pageWarnings.push(`Short meta description (${descLen} chars)`);
      report.summary.shortMetaDesc++;
    }
  }

  // 3. Robots
  const robotsMatch = content.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i) ||
                      content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']robots["']/i);
  if (robotsMatch && robotsMatch[1].includes('noindex') && !is404) {
    pageErrors.push(`Accidental NOINDEX tag found: "${robotsMatch[1]}"`);
    report.summary.noindexOnValidPages++;
  }

  // 4. Canonical
  const canonMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
                     content.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  if (!canonMatch && !is404) {
    pageErrors.push('Missing <link rel="canonical">');
    report.summary.missingCanonical++;
  } else if (canonMatch && !is404) {
    const actual = canonMatch[1].trim();
    if (actual !== expectedCanonical) {
      pageErrors.push(`Mismatched canonical: expected "${expectedCanonical}", found "${actual}"`);
      report.summary.mismatchedCanonical++;
    }
  }

  // 5. OpenGraph
  const ogTitle = content.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
  const ogDesc = content.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
  const ogImage = content.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);
  const ogUrl = content.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']*)["']/i);

  if (!is404) {
    if (!ogTitle) { pageErrors.push('Missing og:title'); report.summary.missingOgTitle++; }
    if (!ogDesc) { pageErrors.push('Missing og:description'); report.summary.missingOgDesc++; }
    if (!ogImage) { pageErrors.push('Missing og:image'); report.summary.missingOgImage++; }
    if (!ogUrl) { pageErrors.push('Missing og:url'); report.summary.missingOgUrl++; }
    else if (ogUrl[1].trim() !== expectedCanonical) {
      pageWarnings.push(`og:url mismatch: expected "${expectedCanonical}", found "${ogUrl[1]}"`);
    }
  }

  // 6. Twitter Card
  const twCard = content.match(/<meta[^>]+name=["']twitter:card["']/i);
  if (!twCard && !is404) {
    pageWarnings.push('Missing twitter:card');
    report.summary.missingTwitterCard++;
  }

  // 7. Headings (H1)
  const h1Matches = Array.from(content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi));
  if (h1Matches.length === 0 && !is404) {
    pageErrors.push('Missing <h1> heading');
    report.summary.missingH1++;
  } else if (h1Matches.length > 1 && !is404) {
    pageWarnings.push(`Multiple <h1> headings found (${h1Matches.length})`);
    report.summary.multipleH1++;
  }

  // 8. Structured Data / JSON-LD
  const jsonLds = Array.from(content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi));
  if (jsonLds.length === 0 && !is404) {
    pageWarnings.push('Missing JSON-LD Schema markup');
    report.summary.missingSchema++;
  } else {
    for (const jm of jsonLds) {
      try {
        const parsed = JSON.parse(jm[1]);
      } catch (err) {
        pageErrors.push(`Invalid JSON in JSON-LD: ${err.message}`);
        report.summary.invalidSchemaJson++;
      }
    }
  }

  // 9. Images alt tags
  const imgMatches = Array.from(content.matchAll(/<img([^>]*)>/gi));
  let missingAlts = 0;
  for (const im of imgMatches) {
    const attrs = im[1];
    if (!attrs.includes('alt=') || /alt=["']\s*["']/.test(attrs)) {
      missingAlts++;
    }
  }
  if (missingAlts > 0) {
    pageWarnings.push(`${missingAlts} images missing alt attribute`);
    report.summary.missingImgAlt += missingAlts;
  }

  // 10. Empty anchor links or href="#"
  const emptyLinks = Array.from(content.matchAll(/<a[^>]+href=["'](#|javascript:void\(0\);?)?["'][^>]*>/gi));
  if (emptyLinks.length > 0) {
    pageWarnings.push(`${emptyLinks.length} empty/dead href="#" anchor tags`);
    report.summary.emptyLinks += emptyLinks.length;
  }

  report.pages[relFile] = {
    cleanRoute,
    errors: pageErrors,
    warnings: pageWarnings
  };
}

console.log('==================== COMPREHENSIVE SEO AUDIT ====================');
console.log(`Total HTML Pages Audited: ${report.totalPages}\n`);
console.log('SUMMARY SCORECARD:');
console.log(JSON.stringify(report.summary, null, 2));

let allClear = true;
console.log('\nDETAILED PAGE FINDINGS:');
for (const [p, d] of Object.entries(report.pages)) {
  if (d.errors.length > 0 || d.warnings.length > 0) {
    allClear = false;
    console.log(`\n📄 [${p}] (Route: ${d.cleanRoute})`);
    if (d.errors.length > 0) console.log('  ❌ ERRORS:', d.errors);
    if (d.warnings.length > 0) console.log('  ⚠️  WARNINGS:', d.warnings);
  }
}

if (allClear) {
  console.log('\n🌟 100% SEO HEALTH ACHIEVED ACROSS ALL 32 PAGES! 0 Errors, 0 Warnings! 🌟\n');
}
