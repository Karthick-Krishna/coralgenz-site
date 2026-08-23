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
        knowMore: resolve('know-more.html'),
        notFound: resolve('404.html'),
        customSoftware: resolve('custom-software-development.html'),
        domainDeployment: resolve('domain-and-deployment-service.html'),
        frontendModernization: resolve('frontend-modernization.html'),
        fullStackSoftware: resolve('full-stack-software.html'),
        legacySoftware: resolve('legacy-software-modernization.html'),
        microsoft: resolve('microsoft.html'),
        modernAdminDashboards: resolve('modern-admin-dashboards.html'),
        mvpDevelopment: resolve('mvp-development.html'),
        pwaDevelopment: resolve('pwa-development.html'),
        salesforce: resolve('salesforce.html')
      }
    }
  }
});
