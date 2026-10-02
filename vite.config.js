import { resolve } from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'clean-urls-dev-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          const [pathname, search] = req.url.split('?');
          if (pathname && !pathname.includes('.') && pathname !== '/') {
            const potentialPath = resolve('.' + pathname + '.html');
            if (fs.existsSync(potentialPath)) {
              req.url = pathname + '.html' + (search ? '?' + search : '');
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        team: resolve('team.html'),
        karthickKrishna: resolve('karthick-krishna.html'),
        thanvanthH: resolve('thanvanth-h.html'),
        sharveshwaranR: resolve('sharveshwaran-r.html'),
        knowMore: resolve('know-more.html'),
        notFound: resolve('404.html'),
        customSoftware: resolve('our-services/custom-software-development.html'),
        domainDeployment: resolve('our-services/domain-and-deployment-service.html'),
        frontendModernization: resolve('our-services/frontend-modernization.html'),
        fullStackSoftware: resolve('our-services/full-stack-software.html'),
        legacySoftware: resolve('our-services/legacy-software-modernization.html'),
        microsoft: resolve('microsoft.html'),
        shopify: resolve('shopify.html'),
        modernAdminDashboards: resolve('our-services/modern-admin-dashboards.html'),
        mvpDevelopment: resolve('our-services/mvp-development.html'),
        pwaDevelopment: resolve('our-services/pwa-development.html'),
        salesforce: resolve('salesforce.html'),
        qr: resolve('coralgenz-qr.html'),
        vault: resolve('coralgenz-vault.html'),
        compiler: resolve('coralgenz-compiler.html'),
        ourServices: resolve('our-services.html'),
        ourProducts: resolve('our-products.html'),
        contact: resolve('contact.html'),
        ourHighlights: resolve('our-highlights.html'),
        highlightSecureFormat: resolve('our-highlights/worlds-first-secure-format.html'),
        highlightVault: resolve('our-highlights/coralgenz-vault-security.html'),
        highlightQr: resolve('our-highlights/coralgenz-qr-telemetry.html'),
        highlightCompiler: resolve('our-highlights/coralgenz-compiler-engine.html'),
        highlightCleanArch: resolve('our-highlights/clean-architecture-standards.html'),
        highlightPartner: resolve('our-highlights/microsoft-salesforce-partner.html')
      }
    }
  }
});
