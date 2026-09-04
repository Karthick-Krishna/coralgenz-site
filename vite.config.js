import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
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
        modernAdminDashboards: resolve('our-services/modern-admin-dashboards.html'),
        mvpDevelopment: resolve('our-services/mvp-development.html'),
        pwaDevelopment: resolve('our-services/pwa-development.html'),
        salesforce: resolve('salesforce.html'),
        qr: resolve('coralgenz-qr.html'),
        vault: resolve('coralgenz-vault.html'),
        compiler: resolve('coralgenz-compiler.html'),
        ourServices: resolve('our-services.html'),
        ourProducts: resolve('our-products.html'),
        contact: resolve('contact.html')
      }
    }
  }
});
