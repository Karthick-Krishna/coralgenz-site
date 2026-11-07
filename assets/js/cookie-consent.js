/**
 * Coralgenz Global - Enterprise Cookie & Privacy Consent Engine
 * Pure Vanilla JavaScript - Fully Accessible (WCAG 2.1 AA / GDPR / CCPA compliant)
 * Provides 'Accept All', 'Reject All', and Granular Category Preferences site-wide.
 */

const COOKIE_CONSENT_KEY = 'coralgenz_cookie_consent_v1';
const COOKIE_VERSION = '1.0';

/**
 * Get current saved consent state
 */
export function getCookieConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === COOKIE_VERSION) {
      return parsed;
    }
  } catch (e) {
    console.warn('[Coralgenz Cookies] Error reading stored consent:', e);
  }
  return null;
}

/**
 * Save consent state to localStorage & document.cookie
 */
export function saveCookieConsent(status, preferences = {}) {
  const consent = {
    status, // 'accepted' | 'rejected' | 'custom'
    version: COOKIE_VERSION,
    timestamp: new Date().toISOString(),
    necessary: true, // Always true
    analytics: Boolean(preferences.analytics),
    preferences: Boolean(preferences.preferences),
    marketing: Boolean(preferences.marketing)
  };

  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch (e) {
    console.warn('[Coralgenz Cookies] localStorage unavailable:', e);
  }

  // Set standard cookie for server/edge routing checks
  const maxAge = 365 * 24 * 60 * 60; // 1 year
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `coralgenz_consent=${status}; max-age=${maxAge}; path=/; SameSite=Lax${secure}`;

  // Purge non-essential cookies if rejected
  if (status === 'rejected' || !consent.analytics) {
    purgeNonEssentialCookies();
  }

  // Dispatch custom event for telemetry or tag managers
  window.dispatchEvent(new CustomEvent('coralgenz:cookieConsentUpdated', {
    detail: consent
  }));

  return consent;
}

/**
 * Clean up third-party or optional cookies when rejected
 */
function purgeNonEssentialCookies() {
  const preserve = ['coralgenz_consent', 'coralgenz_theme', 'session_id'];
  try {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (!preserve.includes(name) && !name.startsWith('coralgenz_essential_')) {
        const domain = window.location.hostname;
        document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `${name}=; path=/; domain=${domain}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `${name}=; path=/; domain=.${domain}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    }
  } catch (e) {
    // Non-blocking
  }
}

/**
 * Render Cookie Consent Banner & Preferences Modal
 */
export function initCookieConsent() {
  if (typeof document === 'undefined') return;

  // Prevent duplicate initialization
  if (document.getElementById('coralgenzCookieBanner')) return;

  const currentConsent = getCookieConsent();

  // Create UI container
  const host = document.createElement('div');
  host.id = 'coralgenzCookieRoot';
  host.innerHTML = `
    <!-- Cookie Floating Trigger Badge (Always accessible to manage preferences) -->
    <button type="button" 
      id="coralgenzCookieTrigger" 
      class="coralgenz-cookie-trigger ${currentConsent ? 'is-visible' : ''}" 
      aria-label="Manage Cookie & Privacy Preferences"
      title="Cookie Settings">
      <span class="cookie-trigger-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
          <path d="M8.5 8.5v.01"></path>
          <path d="M16 15.5v.01"></path>
          <path d="M12 12v.01"></path>
          <path d="M11 17v.01"></path>
          <path d="M7 13v.01"></path>
        </svg>
      </span>
      <span class="cookie-trigger-label">Cookie Settings</span>
    </button>

    <!-- Cookie Consent Bottom Banner -->
    <aside id="coralgenzCookieBanner" 
      class="coralgenz-cookie-banner ${!currentConsent ? 'is-active' : ''}" 
      role="region" 
      aria-label="Cookie & Privacy Consent"
      aria-describedby="cookieBannerDesc">
      <div class="cookie-banner-inner">
        <div class="cookie-banner-content">
          <div class="cookie-banner-badge" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
              <circle cx="8.5" cy="8.5" r="1" fill="#f59e0b"></circle>
              <circle cx="16" cy="15.5" r="1" fill="#f59e0b"></circle>
              <circle cx="12" cy="12" r="1" fill="#f59e0b"></circle>
              <circle cx="11" cy="17" r="1" fill="#f59e0b"></circle>
              <circle cx="7" cy="13" r="1" fill="#f59e0b"></circle>
            </svg>
            <span>Privacy &amp; Cookie Preferences</span>
          </div>
          <p id="cookieBannerDesc" class="cookie-banner-text">
            We use essential cookies to ensure our platform operates securely. With your consent, we also utilize analytics and personalization cookies to measure performance and optimize your enterprise software experience. You can <strong>Accept All</strong>, <strong>Reject All</strong> non-essential cookies, or customize your settings.
          </p>
          <div class="cookie-banner-links">
            <a href="/privacy-policy" class="cookie-policy-link">Read our Privacy &amp; Cookie Policy</a>
            <span class="cookie-link-separator" aria-hidden="true">•</span>
            <button type="button" id="cookieOpenPreferencesLink" class="cookie-text-btn">Customize Settings</button>
          </div>
        </div>

        <div class="cookie-banner-actions">
          <button type="button" id="cookieRejectAllBtn" class="cookie-btn cookie-btn-reject" aria-label="Reject all optional cookies">
            Reject All
          </button>
          <button type="button" id="cookieAcceptAllBtn" class="cookie-btn cookie-btn-accept" aria-label="Accept all cookies">
            Accept All
          </button>
        </div>
      </div>
    </aside>

    <!-- Granular Cookie Preferences Modal -->
    <div id="coralgenzCookieModal" 
      class="coralgenz-cookie-modal-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="cookieModalTitle" 
      aria-describedby="cookieModalDesc"
      style="display: none;">
      <div class="cookie-modal-container">
        <div class="cookie-modal-header">
          <div class="cookie-modal-title-wrap">
            <div class="cookie-modal-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066ff" stroke-width="2.5">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                <circle cx="8.5" cy="8.5" r="1" fill="#0066ff"></circle>
                <circle cx="16" cy="15.5" r="1" fill="#0066ff"></circle>
                <circle cx="12" cy="12" r="1" fill="#0066ff"></circle>
                <circle cx="11" cy="17" r="1" fill="#0066ff"></circle>
                <circle cx="7" cy="13" r="1" fill="#0066ff"></circle>
              </svg>
            </div>
            <div>
              <h2 id="cookieModalTitle" class="cookie-modal-title">Cookie &amp; Privacy Preferences</h2>
              <p id="cookieModalDesc" class="cookie-modal-subtitle">
                Manage how cookies and telemetry are utilized across your session.
              </p>
            </div>
          </div>
          <button type="button" id="cookieModalCloseBtn" class="cookie-modal-close" aria-label="Close cookie preferences">&times;</button>
        </div>

        <div class="cookie-modal-body">
          <!-- Category 1: Strictly Necessary -->
          <div class="cookie-category-item">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <span class="cookie-category-name">Strictly Necessary Cookies</span>
                <span class="cookie-badge cookie-badge-required">Always Active</span>
              </div>
              <div class="cookie-switch-wrap">
                <input type="checkbox" id="catNecessary" class="cookie-switch-input" checked disabled aria-disabled="true">
                <label for="catNecessary" class="cookie-switch-label" aria-hidden="true"></label>
              </div>
            </div>
            <p class="cookie-category-desc">
              Essential for core functionality, security verification, secure forms, network transmission, and protecting against CSRF attacks. Cannot be deactivated.
            </p>
          </div>

          <!-- Category 2: Performance & Analytics -->
          <div class="cookie-category-item">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <label for="catAnalytics" class="cookie-category-name">Performance &amp; Analytics</label>
                <span class="cookie-badge cookie-badge-optional">Optional</span>
              </div>
              <div class="cookie-switch-wrap">
                <input type="checkbox" id="catAnalytics" class="cookie-switch-input" role="switch" aria-checked="false">
                <label for="catAnalytics" class="cookie-switch-label" aria-hidden="true"></label>
              </div>
            </div>
            <p class="cookie-category-desc">
              Enables anonymous telemetry, Core Web Vitals measurement, and page load optimization to enhance application responsiveness and reliability.
            </p>
          </div>

          <!-- Category 3: Personalization & Preferences -->
          <div class="cookie-category-item">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <label for="catPreferences" class="cookie-category-name">Personalization &amp; Interface</label>
                <span class="cookie-badge cookie-badge-optional">Optional</span>
              </div>
              <div class="cookie-switch-wrap">
                <input type="checkbox" id="catPreferences" class="cookie-switch-input" role="switch" aria-checked="false">
                <label for="catPreferences" class="cookie-switch-label" aria-hidden="true"></label>
              </div>
            </div>
            <p class="cookie-category-desc">
              Remembers your interface selections, localized region formats, and interactive software simulation configurations across sessions.
            </p>
          </div>

          <!-- Category 4: Marketing & Partner Telemetry -->
          <div class="cookie-category-item">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <label for="catMarketing" class="cookie-category-name">Partner &amp; Campaign Attribution</label>
                <span class="cookie-badge cookie-badge-optional">Optional</span>
              </div>
              <div class="cookie-switch-wrap">
                <input type="checkbox" id="catMarketing" class="cookie-switch-input" role="switch" aria-checked="false">
                <label for="catMarketing" class="cookie-switch-label" aria-hidden="true"></label>
              </div>
            </div>
            <p class="cookie-category-desc">
              Helps evaluate collaborated software releases, Microsoft/Salesforce partner program referrals, and outreach campaigns.
            </p>
          </div>
        </div>

        <div class="cookie-modal-footer">
          <div class="cookie-modal-footer-left">
            <button type="button" id="modalRejectAllBtn" class="cookie-btn cookie-btn-reject">
              Reject All
            </button>
          </div>
          <div class="cookie-modal-footer-right">
            <button type="button" id="modalSavePreferencesBtn" class="cookie-btn cookie-btn-save">
              Save Preferences
            </button>
            <button type="button" id="modalAcceptAllBtn" class="cookie-btn cookie-btn-accept">
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(host);

  // Setup DOM references
  const banner = document.getElementById('coralgenzCookieBanner');
  const modal = document.getElementById('coralgenzCookieModal');
  const trigger = document.getElementById('coralgenzCookieTrigger');
  const acceptAllBtn = document.getElementById('cookieAcceptAllBtn');
  const rejectAllBtn = document.getElementById('cookieRejectAllBtn');
  const openPrefLink = document.getElementById('cookieOpenPreferencesLink');
  const modalCloseBtn = document.getElementById('cookieModalCloseBtn');
  const modalSaveBtn = document.getElementById('modalSavePreferencesBtn');
  const modalAcceptAllBtn = document.getElementById('modalAcceptAllBtn');
  const modalRejectAllBtn = document.getElementById('modalRejectAllBtn');

  const catAnalytics = document.getElementById('catAnalytics');
  const catPreferences = document.getElementById('catPreferences');
  const catMarketing = document.getElementById('catMarketing');

  let lastActiveElement = null;

  // Initialize checkboxes from saved state
  function syncCheckboxesFromConsent() {
    const consent = getCookieConsent();
    if (consent) {
      catAnalytics.checked = Boolean(consent.analytics);
      catPreferences.checked = Boolean(consent.preferences);
      catMarketing.checked = Boolean(consent.marketing);
    } else {
      catAnalytics.checked = false;
      catPreferences.checked = false;
      catMarketing.checked = false;
    }
  }

  // Open modal
  function openModal() {
    lastActiveElement = document.activeElement;
    syncCheckboxesFromConsent();
    modal.style.display = 'flex';
    // Force reflow for CSS transition
    void modal.offsetWidth;
    modal.classList.add('is-open');
    document.body.classList.add('cookie-modal-open');

    // Accessibility focus management
    setTimeout(() => {
      modalCloseBtn.focus();
    }, 50);
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('cookie-modal-open');
    setTimeout(() => {
      modal.style.display = 'none';
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }, 280);
  }

  // Dismiss banner
  function dismissBanner() {
    if (banner) {
      banner.classList.remove('is-active');
      banner.classList.add('is-closing');
      setTimeout(() => {
        banner.style.display = 'none';
        if (trigger) trigger.classList.add('is-visible');
      }, 350);
    }
  }

  // Action: Accept All
  function handleAcceptAll() {
    saveCookieConsent('accepted', {
      analytics: true,
      preferences: true,
      marketing: true
    });
    catAnalytics.checked = true;
    catPreferences.checked = true;
    catMarketing.checked = true;
    dismissBanner();
    closeModal();
  }

  // Action: Reject All
  function handleRejectAll() {
    saveCookieConsent('rejected', {
      analytics: false,
      preferences: false,
      marketing: false
    });
    catAnalytics.checked = false;
    catPreferences.checked = false;
    catMarketing.checked = false;
    dismissBanner();
    closeModal();
  }

  // Action: Save Custom Preferences
  function handleSavePreferences() {
    saveCookieConsent('custom', {
      analytics: catAnalytics.checked,
      preferences: catPreferences.checked,
      marketing: catMarketing.checked
    });
    dismissBanner();
    closeModal();
  }

  // Event Listeners for Banner
  if (acceptAllBtn) acceptAllBtn.addEventListener('click', handleAcceptAll);
  if (rejectAllBtn) rejectAllBtn.addEventListener('click', handleRejectAll);
  if (openPrefLink) openPrefLink.addEventListener('click', openModal);

  // Event Listeners for Modal
  if (modalAcceptAllBtn) modalAcceptAllBtn.addEventListener('click', handleAcceptAll);
  if (modalRejectAllBtn) modalRejectAllBtn.addEventListener('click', handleRejectAll);
  if (modalSaveBtn) modalSaveBtn.addEventListener('click', handleSavePreferences);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  // Floating trigger
  if (trigger) trigger.addEventListener('click', openModal);

  // Modal Backdrop click to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Modal Keyboard Navigation & Focus Trap (Escape to close, Tab trap)
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });

  // Global delegation for footer links or buttons with data-open-cookie-preferences
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-open-cookie-preferences], a[href="#cookie-preferences"]');
    if (target) {
      e.preventDefault();
      openModal();
    }
  });

  // Expose global API
  window.CoralgenzCookies = {
    openPreferences: openModal,
    acceptAll: handleAcceptAll,
    rejectAll: handleRejectAll,
    getConsent: getCookieConsent,
    resetConsent: () => {
      try {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        document.cookie = 'coralgenz_consent=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      } catch (err) {}
      if (banner) {
        banner.style.display = 'block';
        void banner.offsetWidth;
        banner.classList.add('is-active');
      }
    }
  };
}
