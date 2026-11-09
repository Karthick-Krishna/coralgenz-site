/**
 * Coralgenz Global - Enterprise Cookie & Privacy Consent Management System
 * Compliant with GDPR, CCPA/CPRA, and India DPDP Act.
 *
 * Provides:
 * - Immediate first-party consent evaluation & persistence (localStorage + cookie)
 * - Granular 4-category management (Necessary, Functional, Analytics, Marketing)
 * - Genuine enforcement: blocks/unblocks tracking scripts, purges non-consented cookies
 * - WCAG 2.1 AA accessible UI: focus trapping, keyboard navigation, ARIA semantics
 * - Attractive, low-profile banner (ultra-compact mobile height)
 * - Interactive floating Cookie icon after accept/reject
 * - Complete "Reset Cookies Data" capability that resets preferences and re-prompts the banner
 */

const STORAGE_KEY = 'coralgenz_consent_v1';
const COOKIE_NAME = 'coralgenz_consent';
const CONSENT_VERSION = '1.0';
const RETENTION_DAYS = 180; // 6 months consent retention

/**
 * Reads stored consent from localStorage or document.cookie
 * Returns valid consent object or null if missing, expired, or version mismatch.
 */
export function getCookieConsent() {
  try {
    let consent = null;

    // 1. Try localStorage
    const localRaw = localStorage.getItem(STORAGE_KEY);
    if (localRaw) {
      try {
        consent = JSON.parse(localRaw);
      } catch (e) {}
    }

    // 2. Fallback to cookie
    if (!consent && typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
      if (match && match[1]) {
        try {
          consent = JSON.parse(decodeURIComponent(match[1]));
        } catch (e) {}
      }
    }

    if (!consent) return null;

    // Validate version
    if (consent.consentVersion !== CONSENT_VERSION) return null;

    // Validate retention period
    if (consent.consentTimestamp) {
      const timestamp = new Date(consent.consentTimestamp).getTime();
      const ageDays = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
      if (ageDays > RETENTION_DAYS) return null;
    }

    return {
      necessary: true,
      functional: Boolean(consent.functional),
      analytics: Boolean(consent.analytics),
      marketing: Boolean(consent.marketing),
      consentStatus: consent.consentStatus || 'custom',
      consentTimestamp: consent.consentTimestamp || new Date().toISOString(),
      consentVersion: CONSENT_VERSION
    };
  } catch (err) {
    console.warn('[Coralgenz Consent] Error reading consent storage:', err);
    return null;
  }
}

/**
 * Checks if a specific cookie category has been granted consent.
 */
export function hasConsent(category) {
  if (category === 'necessary') return true;
  const consent = getCookieConsent();
  if (!consent) return false;
  return Boolean(consent[category]);
}

/**
 * Purges third-party or optional cookies when rejected
 */
function purgeCookiesForCategory(category) {
  if (typeof document === 'undefined') return;

  const patterns = [];
  if (category === 'analytics') {
    patterns.push(/^_ga/, /^_gid/, /^_gat/, /^_clck/, /^_clsk/, /^amp_/);
  } else if (category === 'marketing') {
    patterns.push(/^_fbp/, /^_fbc/, /^_gcl/, /^__gads/, /^IDE$/);
  }

  try {
    const cookies = document.cookie.split(';');
    const domains = [
      window.location.hostname,
      '.' + window.location.hostname,
      window.location.hostname.replace(/^www\./, ''),
      '.' + window.location.hostname.replace(/^www\./, '')
    ];

    cookies.forEach((c) => {
      const name = c.split('=')[0].trim();
      const shouldPurge = patterns.some((p) => p.test(name));
      if (shouldPurge) {
        domains.forEach((d) => {
          document.cookie = `${name}=; path=/; domain=${d}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });
        document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    });
  } catch (err) {
    // Non-blocking
  }
}

/**
 * Executes unblocked scripts flagged with [data-cookie-category]
 */
function activateConsentedScripts(consent) {
  if (typeof document === 'undefined') return;

  const candidates = document.querySelectorAll('script[type="text/plain"][data-cookie-category]');
  candidates.forEach((script) => {
    const cat = script.getAttribute('data-cookie-category');
    if (cat && consent[cat] === true) {
      const activeScript = document.createElement('script');
      // Copy attributes
      Array.from(script.attributes).forEach((attr) => {
        if (attr.name !== 'type' && attr.name !== 'data-cookie-category') {
          activeScript.setAttribute(attr.name, attr.value);
        }
      });
      activeScript.type = 'text/javascript';
      if (script.innerHTML) {
        activeScript.innerHTML = script.innerHTML;
      }
      script.parentNode.insertBefore(activeScript, script);
      script.remove();
    }
  });
}

/**
 * Synchronizes with Google Consent Mode v2 if present or pushes to dataLayer
 */
function updateGoogleConsentMode(consent) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  const consentUpdate = {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    functionality_storage: consent.functional ? 'granted' : 'denied',
    personalization_storage: consent.functional ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
    security_storage: 'granted'
  };

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', consentUpdate);
  } else {
    gtag('consent', 'update', consentUpdate);
  }
}

/**
 * Applies active consent policies across the browser environment
 */
function applyConsent(consent) {
  // 1. Google Consent Mode sync
  updateGoogleConsentMode(consent);

  // 2. Unblock scripts
  activateConsentedScripts(consent);

  // 3. Purge rejected categories
  if (!consent.analytics) {
    purgeCookiesForCategory('analytics');
  }
  if (!consent.marketing) {
    purgeCookiesForCategory('marketing');
  }

  // 4. Dispatch custom standard events
  const eventDetail = { detail: consent };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('coralgenz:consent-updated', eventDetail));
    window.dispatchEvent(new CustomEvent('coralgenz:cookieConsentUpdated', eventDetail));
  }
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent('coralgenz:consent-updated', eventDetail));
  }
}

/**
 * Saves consent record to localStorage and document.cookie
 */
export function saveCookieConsent(status, preferences = {}) {
  const consent = {
    necessary: true,
    functional: Boolean(preferences.functional),
    analytics: Boolean(preferences.analytics),
    marketing: Boolean(preferences.marketing),
    consentStatus: status, // 'accepted' | 'rejected' | 'custom'
    consentTimestamp: new Date().toISOString(),
    consentVersion: CONSENT_VERSION
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch (err) {
    console.warn('[Coralgenz Consent] localStorage write failed:', err);
  }

  try {
    const maxAge = RETENTION_DAYS * 24 * 60 * 60;
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isHttps ? '; Secure' : '';
    const cookiePayload = encodeURIComponent(JSON.stringify(consent));
    document.cookie = `${COOKIE_NAME}=${cookiePayload}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
  } catch (err) {
    console.warn('[Coralgenz Consent] Cookie write failed:', err);
  }

  applyConsent(consent);
  return consent;
}

/**
 * Resets all stored consent data, clears cookies, and restores default state
 */
export function resetCookieConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[Coralgenz Consent] localStorage remove failed:', err);
  }

  try {
    const domains = [
      window.location.hostname,
      '.' + window.location.hostname,
      window.location.hostname.replace(/^www\./, ''),
      '.' + window.location.hostname.replace(/^www\./, '')
    ];
    domains.forEach((d) => {
      document.cookie = `${COOKIE_NAME}=; path=/; domain=${d}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch (err) {
    console.warn('[Coralgenz Consent] Cookie clear failed:', err);
  }

  // Purge tracking cookies
  purgeCookiesForCategory('analytics');
  purgeCookiesForCategory('marketing');

  // Reset Google Consent Mode
  updateGoogleConsentMode({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  // Dispatch events
  const eventDetail = { detail: null };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('coralgenz:consent-reset', eventDetail));
    window.dispatchEvent(new CustomEvent('coralgenz:consent-updated', eventDetail));
    window.dispatchEvent(new CustomEvent('coralgenz:cookieConsentUpdated', eventDetail));
  }
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent('coralgenz:consent-reset', eventDetail));
  }
}

/**
 * Runs a callback immediately if category is granted, or registers it for when consent is given
 */
export function runWithConsent(category, callback) {
  if (hasConsent(category)) {
    try {
      callback();
    } catch (e) {
      console.error(e);
    }
  } else if (typeof window !== 'undefined') {
    const handler = (e) => {
      if (e.detail && e.detail[category]) {
        window.removeEventListener('coralgenz:consent-updated', handler);
        try {
          callback();
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('coralgenz:consent-updated', handler);
  }
}

/**
 * Initializes the Cookie Consent Banner, Modal, and Floating Trigger
 */
export function initCookieConsent() {
  if (typeof document === 'undefined') return;

  // Prevent duplicate mounts
  if (document.getElementById('coralgenzCookieRoot')) return;

  const currentConsent = getCookieConsent();

  // If already consented, apply enforcement right away without showing banner
  if (currentConsent) {
    applyConsent(currentConsent);
  }

  // Inject UI container into the document
  const root = document.createElement('div');
  root.id = 'coralgenzCookieRoot';
  root.innerHTML = `
    <!-- Floating Cookie Settings Icon (appears once user makes a choice) -->
    <button type="button"
      id="coralgenzCookieTrigger"
      class="coralgenz-cookie-trigger ${currentConsent ? 'is-visible' : ''}"
      aria-label="Manage Cookie &amp; Privacy Preferences"
      title="Cookie Settings &amp; Data Reset">
      <span class="cookie-trigger-icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
          <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor"></circle>
          <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor"></circle>
          <circle cx="11.5" cy="12.5" r="1.1" fill="currentColor"></circle>
          <circle cx="10" cy="17" r="1.1" fill="currentColor"></circle>
          <circle cx="7" cy="13.5" r="1.1" fill="currentColor"></circle>
        </svg>
      </span>
      <span class="cookie-trigger-tooltip">Cookie Settings &amp; Reset</span>
    </button>

    <!-- First-Time Cookie Consent Banner (compact & low height on mobile) -->
    <aside id="coralgenzCookieBanner"
      class="coralgenz-cookie-banner ${!currentConsent ? 'is-active' : ''}"
      role="region"
      aria-label="Cookie &amp; Privacy Consent"
      aria-live="polite">
      <div class="cookie-banner-inner">
        <div class="cookie-banner-main">
          <div class="cookie-banner-icon-wrap" aria-hidden="true">
            <svg class="cookie-banner-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
              <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor"></circle>
              <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor"></circle>
              <circle cx="11.5" cy="12.5" r="1.1" fill="currentColor"></circle>
              <circle cx="10" cy="17" r="1.1" fill="currentColor"></circle>
              <circle cx="7" cy="13.5" r="1.1" fill="currentColor"></circle>
            </svg>
          </div>
          <div class="cookie-banner-content">
            <div class="cookie-banner-heading-row">
              <span class="cookie-banner-title">Cookie Preferences</span>
              <span class="cookie-banner-tag">Privacy Choice</span>
            </div>
            <p class="cookie-banner-text">
              We use essential &amp; analytics cookies to ensure performance and privacy.
              <a href="/privacy-policy" class="cookie-link">Policy</a>
            </p>
          </div>
        </div>
        <div class="cookie-banner-actions">
          <button type="button" id="cookieAcceptAll" class="cookie-btn cookie-btn-accept">
            <span class="btn-text-full">Accept All</span>
            <span class="btn-text-mobile">Accept</span>
          </button>
          <button type="button" id="cookieRejectAll" class="cookie-btn cookie-btn-reject">
            <span class="btn-text-full">Reject All</span>
            <span class="btn-text-mobile">Reject</span>
          </button>
          <button type="button" id="cookieCustomize" class="cookie-btn cookie-btn-customize" title="Customize cookie preferences">
            <svg class="cookie-btn-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span class="btn-text-full">Customize</span>
            <span class="btn-text-mobile">Custom</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Floating Reset Notification Toast -->
    <div id="coralgenzCookieToast" class="cookie-reset-toast" role="status" aria-live="polite">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <span>Cookie preferences reset. Please choose your options.</span>
    </div>

    <!-- Detailed Preferences Modal Dialog -->
    <div id="coralgenzCookieModal"
      class="coralgenz-cookie-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coralgenzModalTitle"
      aria-describedby="coralgenzModalDesc"
      style="display: none;">
      <div class="cookie-modal-backdrop" id="cookieModalBackdrop"></div>
      <div class="cookie-modal-card">
        <div class="cookie-modal-header">
          <div class="cookie-modal-title-wrap">
            <div class="cookie-modal-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor"></circle>
                <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor"></circle>
                <circle cx="11.5" cy="12.5" r="1.1" fill="currentColor"></circle>
                <circle cx="10" cy="17" r="1.1" fill="currentColor"></circle>
                <circle cx="7" cy="13.5" r="1.1" fill="currentColor"></circle>
              </svg>
            </div>
            <div>
              <h2 id="coralgenzModalTitle" class="cookie-modal-title">Customize Cookie Preferences</h2>
              <p id="coralgenzModalDesc" class="cookie-modal-subtitle">
                Manage data processing categories or reset all saved preferences back to initial state.
              </p>
            </div>
          </div>
          <button type="button" id="cookieModalClose" class="cookie-modal-close" aria-label="Close preferences dialog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="cookie-modal-body">
          <!-- Reset Informational Card -->
          <div class="cookie-reset-notice">
            <div class="cookie-reset-notice-content">
              <span class="cookie-reset-notice-badge">Data Autonomy</span>
              <p class="cookie-reset-notice-text">
                Need to clear stored consents? Click <strong>Reset Cookies Data</strong> below to wipe all saved preferences and re-display the initial decision prompt.
              </p>
            </div>
          </div>

          <!-- Category A: Strictly Necessary -->
          <div class="cookie-category-card">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <div class="cookie-category-title-row">
                  <h3 class="cookie-category-name">Strictly Necessary Cookies</h3>
                  <span class="cookie-category-badge cookie-badge-required">Always Enabled</span>
                </div>
                <p class="cookie-category-desc">
                  Required for essential website functionality, navigation, TLS encryption, CSRF protection, and securely saving your privacy preferences. These cookies cannot be turned off.
                </p>
              </div>
              <div class="cookie-toggle-wrap">
                <input type="checkbox" id="catNecessary" class="cookie-toggle-input" checked disabled aria-label="Strictly Necessary Cookies (Always Enabled)">
                <label for="catNecessary" class="cookie-toggle-switch is-disabled"></label>
              </div>
            </div>
          </div>

          <!-- Category B: Functional Cookies -->
          <div class="cookie-category-card">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <div class="cookie-category-title-row">
                  <h3 class="cookie-category-name">Functional Cookies</h3>
                  <span class="cookie-category-badge">Optional</span>
                </div>
                <p class="cookie-category-desc">
                  Enable enhanced functionality and personalization, such as remembering your theme choices, interactive form states, language preferences, and customized views.
                </p>
              </div>
              <div class="cookie-toggle-wrap">
                <input type="checkbox" id="catFunctional" class="cookie-toggle-input" aria-label="Toggle Functional Cookies">
                <label for="catFunctional" class="cookie-toggle-switch"></label>
              </div>
            </div>
          </div>

          <!-- Category C: Analytics Cookies -->
          <div class="cookie-category-card">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <div class="cookie-category-title-row">
                  <h3 class="cookie-category-name">Analytics Cookies</h3>
                  <span class="cookie-category-badge">Optional</span>
                </div>
                <p class="cookie-category-desc">
                  Help us understand website traffic, visitor interactions, page performance, and popular features using aggregated statistical insights so we can continuously optimize speed and usability.
                </p>
              </div>
              <div class="cookie-toggle-wrap">
                <input type="checkbox" id="catAnalytics" class="cookie-toggle-input" aria-label="Toggle Analytics Cookies">
                <label for="catAnalytics" class="cookie-toggle-switch"></label>
              </div>
            </div>
          </div>

          <!-- Category D: Marketing Cookies -->
          <div class="cookie-category-card">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <div class="cookie-category-title-row">
                  <h3 class="cookie-category-name">Marketing &amp; Advertising Cookies</h3>
                  <span class="cookie-category-badge">Optional</span>
                </div>
                <p class="cookie-category-desc">
                  Used to measure advertising campaign efficacy, conversion tracking, and deliver personalized commercial messages relevant to your professional interests across partner platforms.
                </p>
              </div>
              <div class="cookie-toggle-wrap">
                <input type="checkbox" id="catMarketing" class="cookie-toggle-input" aria-label="Toggle Marketing &amp; Advertising Cookies">
                <label for="catMarketing" class="cookie-toggle-switch"></label>
              </div>
            </div>
          </div>
        </div>

        <div class="cookie-modal-footer">
          <div class="cookie-modal-footer-left">
            <button type="button" id="modalResetConsent" class="cookie-btn cookie-btn-reset" title="Wipe stored consent data and display initial accept/reject prompt">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              <span>Reset Cookies Data</span>
            </button>
            <button type="button" id="modalRejectAll" class="cookie-btn cookie-btn-reject">Reject All</button>
          </div>
          <div class="cookie-modal-footer-right">
            <button type="button" id="modalAcceptAll" class="cookie-btn cookie-btn-secondary">Accept All</button>
            <button type="button" id="modalSavePreferences" class="cookie-btn cookie-btn-accept">Save Preferences</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  // Cache elements
  const trigger = document.getElementById('coralgenzCookieTrigger');
  const banner = document.getElementById('coralgenzCookieBanner');
  const modal = document.getElementById('coralgenzCookieModal');
  const toast = document.getElementById('coralgenzCookieToast');
  const modalCloseBtn = document.getElementById('cookieModalClose');
  const modalBackdrop = document.getElementById('cookieModalBackdrop');

  const bannerAcceptBtn = document.getElementById('cookieAcceptAll');
  const bannerRejectBtn = document.getElementById('cookieRejectAll');
  const bannerCustomizeBtn = document.getElementById('cookieCustomize');

  const modalResetBtn = document.getElementById('modalResetConsent');
  const modalRejectBtn = document.getElementById('modalRejectAll');
  const modalAcceptBtn = document.getElementById('modalAcceptAll');
  const modalSaveBtn = document.getElementById('modalSavePreferences');

  const catFunctional = document.getElementById('catFunctional');
  const catAnalytics = document.getElementById('catAnalytics');
  const catMarketing = document.getElementById('catMarketing');

  let lastActiveElement = null;
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    if (message) {
      const span = toast.querySelector('span');
      if (span) span.textContent = message;
    }
    toast.classList.add('is-visible');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  // Sync checkboxes with active consent
  function syncCheckboxes() {
    const consent = getCookieConsent();
    if (consent) {
      catFunctional.checked = Boolean(consent.functional);
      catAnalytics.checked = Boolean(consent.analytics);
      catMarketing.checked = Boolean(consent.marketing);
    } else {
      // Clean GDPR standard: optional cookies default to OFF until user choices are made
      catFunctional.checked = false;
      catAnalytics.checked = false;
      catMarketing.checked = false;
    }
  }

  // Open preferences modal
  function openPreferences() {
    lastActiveElement = document.activeElement;
    syncCheckboxes();
    modal.style.display = 'flex';
    void modal.offsetWidth; // Force reflow
    modal.classList.add('is-open');
    document.body.classList.add('cookie-modal-open');

    setTimeout(() => {
      if (modalCloseBtn) modalCloseBtn.focus();
    }, 60);
  }

  // Close preferences modal
  function closePreferences() {
    modal.classList.remove('is-open');
    document.body.classList.remove('cookie-modal-open');
    setTimeout(() => {
      modal.style.display = 'none';
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }, 280);
  }

  // Hide the banner smoothly and reveal floating cookie icon
  function dismissBanner() {
    if (!banner) return;
    banner.classList.remove('is-active');
    banner.classList.add('is-closing');
    setTimeout(() => {
      banner.style.display = 'none';
      if (trigger) {
        trigger.classList.add('is-visible');
      }
    }, 320);
  }

  // Handlers
  function onAcceptAll() {
    saveCookieConsent('accepted', {
      functional: true,
      analytics: true,
      marketing: true
    });
    catFunctional.checked = true;
    catAnalytics.checked = true;
    catMarketing.checked = true;
    dismissBanner();
    closePreferences();
  }

  function onRejectAll() {
    saveCookieConsent('rejected', {
      functional: false,
      analytics: false,
      marketing: false
    });
    catFunctional.checked = false;
    catAnalytics.checked = false;
    catMarketing.checked = false;
    dismissBanner();
    closePreferences();
  }

  function onSavePreferences() {
    saveCookieConsent('custom', {
      functional: catFunctional.checked,
      analytics: catAnalytics.checked,
      marketing: catMarketing.checked
    });
    dismissBanner();
    closePreferences();
  }

  // Feature: Reset cookies data -> wipes stored records, hides trigger, and re-pops up banner
  function onResetConsent() {
    resetCookieConsent();
    catFunctional.checked = false;
    catAnalytics.checked = false;
    catMarketing.checked = false;

    closePreferences();

    // Hide floating cookie trigger
    if (trigger) {
      trigger.classList.remove('is-visible');
    }

    // Re-display initial accept / reject / customize banner
    if (banner) {
      banner.style.display = 'block';
      void banner.offsetWidth; // Force reflow
      banner.classList.remove('is-closing');
      banner.classList.add('is-active');
      banner.classList.add('banner-reset-highlight');
      setTimeout(() => {
        banner.classList.remove('banner-reset-highlight');
      }, 1400);
    }

    showToast('Cookie preferences reset. Please select your options.');
  }

  // Event bindings
  if (bannerAcceptBtn) bannerAcceptBtn.addEventListener('click', onAcceptAll);
  if (bannerRejectBtn) bannerRejectBtn.addEventListener('click', onRejectAll);
  if (bannerCustomizeBtn) bannerCustomizeBtn.addEventListener('click', openPreferences);

  if (modalResetBtn) modalResetBtn.addEventListener('click', onResetConsent);
  if (modalAcceptBtn) modalAcceptBtn.addEventListener('click', onAcceptAll);
  if (modalRejectBtn) modalRejectBtn.addEventListener('click', onRejectAll);
  if (modalSaveBtn) modalSaveBtn.addEventListener('click', onSavePreferences);

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePreferences);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closePreferences);

  if (trigger) trigger.addEventListener('click', openPreferences);

  // Keyboard navigation & Focus trap
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closePreferences();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Global click delegation: any link or button with data-open-cookie-preferences or href="#cookie-settings"
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-open-cookie-preferences], a[href="#cookie-settings"], a[href="#cookie-preferences"]');
    if (target) {
      e.preventDefault();
      openPreferences();
    }
  });

  // Expose global API
  window.CoralgenzConsent = {
    getConsent: getCookieConsent,
    hasConsent,
    saveConsent: saveCookieConsent,
    resetConsent: resetCookieConsent,
    openPreferences,
    closePreferences,
    acceptAll: onAcceptAll,
    rejectAll: onRejectAll,
    savePreferences: onSavePreferences,
    resetData: onResetConsent,
    runWithConsent
  };

  // Backward compatibility alias
  window.CoralgenzCookies = window.CoralgenzConsent;
}
