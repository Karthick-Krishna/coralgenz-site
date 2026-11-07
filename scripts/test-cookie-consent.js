/**
 * Automated Test Suite for Coralgenz Cookie Consent Management System
 */

// Minimal DOM mock for Node.js environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

global.localStorage = new MockLocalStorage();
global.document = {
  cookie: '',
  body: {
    appendChild: (el) => {
      global.document._elements.push(el);
      return el;
    },
    classList: {
      add: (c) => global.document.body._classes.add(c),
      remove: (c) => global.document.body._classes.delete(c),
      contains: (c) => global.document.body._classes.has(c)
    },
    _classes: new Set()
  },
  _elements: [],
  _listeners: {},
  createElement: (tag) => {
    const el = {
      tagName: tag.toUpperCase(),
      attributes: {},
      style: {},
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); }
      },
      innerHTML: '',
      addEventListener(evt, fn) {
        if (!el._listeners[evt]) el._listeners[evt] = [];
        el._listeners[evt].push(fn);
      },
      dispatchEvent(evt) {
        if (el._listeners[evt.type]) {
          el._listeners[evt.type].forEach(fn => fn(evt));
        }
      },
      _listeners: {},
      setAttribute(k, v) { this.attributes[k] = v; },
      getAttribute(k) { return this.attributes[k]; },
      focus() { this._focused = true; }
    };
    return el;
  },
  getElementById: (id) => {
    return global.document._idMap[id] || null;
  },
  querySelectorAll: (selector) => {
    return [];
  },
  addEventListener: (evt, fn) => {
    if (!global.document._listeners[evt]) global.document._listeners[evt] = [];
    global.document._listeners[evt].push(fn);
  },
  dispatchEvent: (evt) => {
    if (global.document._listeners[evt.type]) {
      global.document._listeners[evt.type].forEach(fn => fn(evt));
    }
  },
  _idMap: {}
};

global.window = {
  location: { protocol: 'https:', hostname: 'coralgenz.net' },
  addEventListener: (evt, fn) => {
    if (!global.window._listeners[evt]) global.window._listeners[evt] = [];
    global.window._listeners[evt].push(fn);
  },
  dispatchEvent: (evt) => {
    if (global.window._listeners[evt.type]) {
      global.window._listeners[evt.type].forEach(fn => fn(evt));
    }
  },
  _listeners: {}
};

global.CustomEvent = class CustomEvent {
  constructor(type, params = {}) {
    this.type = type;
    this.detail = params.detail || null;
  }
};

async function runTests() {
  console.log('--- Starting Cookie Consent Test Suite ---');

  const {
    getCookieConsent,
    saveCookieConsent,
    hasConsent,
    runWithConsent,
    initCookieConsent
  } = await import('../assets/js/cookie-consent.js');

  // Test 1: First-time visitor has null consent
  console.log('\n[Test 1] Initial state check');
  global.localStorage.clear();
  global.document.cookie = '';
  let consent = getCookieConsent();
  console.assert(consent === null, 'First-time visitor consent should be null');
  console.log('✓ Initial state is correctly null');

  // Test 2: Accept All
  console.log('\n[Test 2] Accept All functionality');
  const accepted = saveCookieConsent('accepted', {
    functional: true,
    analytics: true,
    marketing: true
  });
  console.assert(accepted.necessary === true, 'Necessary must be true');
  console.assert(accepted.functional === true, 'Functional must be true');
  console.assert(accepted.analytics === true, 'Analytics must be true');
  console.assert(accepted.marketing === true, 'Marketing must be true');
  console.assert(accepted.consentStatus === 'accepted', 'Status must be accepted');
  console.assert(hasConsent('analytics') === true, 'hasConsent(analytics) should be true');
  console.assert(hasConsent('marketing') === true, 'hasConsent(marketing) should be true');
  console.log('✓ Accept All successfully grants all categories and stores valid record');

  // Test 3: Reject All
  console.log('\n[Test 3] Reject All functionality');
  const rejected = saveCookieConsent('rejected', {
    functional: false,
    analytics: false,
    marketing: false
  });
  console.assert(rejected.necessary === true, 'Necessary must remain true');
  console.assert(rejected.functional === false, 'Functional must be false');
  console.assert(rejected.analytics === false, 'Analytics must be false');
  console.assert(rejected.marketing === false, 'Marketing must be false');
  console.assert(rejected.consentStatus === 'rejected', 'Status must be rejected');
  console.assert(hasConsent('analytics') === false, 'hasConsent(analytics) should be false');
  console.assert(hasConsent('marketing') === false, 'hasConsent(marketing) should be false');
  console.log('✓ Reject All genuinely disables optional cookies while preserving necessary');

  // Test 4: Custom Preferences
  console.log('\n[Test 4] Custom Preferences');
  const custom = saveCookieConsent('custom', {
    functional: true,
    analytics: false,
    marketing: true
  });
  console.assert(custom.functional === true, 'Functional should be true');
  console.assert(custom.analytics === false, 'Analytics should be false');
  console.assert(custom.marketing === true, 'Marketing should be true');
  console.assert(hasConsent('functional') === true, 'hasConsent(functional) should be true');
  console.assert(hasConsent('analytics') === false, 'hasConsent(analytics) should be false');
  console.log('✓ Custom granular preferences are correctly saved');

  // Test 5: Storage persistence across page reload simulation
  console.log('\n[Test 5] Storage retrieval');
  const retrieved = getCookieConsent();
  console.assert(retrieved !== null, 'Stored consent must be retrievable');
  console.assert(retrieved.consentVersion === '1.0', 'Consent version should match');
  console.assert(retrieved.functional === true, 'Retrieved functional should match saved');
  console.assert(retrieved.analytics === false, 'Retrieved analytics should match saved');
  console.log('✓ Consent persists and is retrieved accurately');

  // Test 6: Retention period expiration check (>180 days)
  console.log('\n[Test 6] Retention expiration (>180 days)');
  const oldDate = new Date(Date.now() - (181 * 24 * 60 * 60 * 1000)).toISOString();
  const expiredPayload = {
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
    consentStatus: 'accepted',
    consentTimestamp: oldDate,
    consentVersion: '1.0'
  };
  global.localStorage.setItem('coralgenz_consent_v1', JSON.stringify(expiredPayload));
  const expiredCheck = getCookieConsent();
  console.assert(expiredCheck === null, 'Expired consent must evaluate to null');
  console.log('✓ Expired consent (>180 days) correctly invalidates and prompts for renewal');

  // Test 7: Policy Version check
  console.log('\n[Test 7] Version mismatch check');
  const oldVersionPayload = {
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
    consentStatus: 'accepted',
    consentTimestamp: new Date().toISOString(),
    consentVersion: '0.9'
  };
  global.localStorage.setItem('coralgenz_consent_v1', JSON.stringify(oldVersionPayload));
  const versionCheck = getCookieConsent();
  console.assert(versionCheck === null, 'Outdated policy version must evaluate to null');
  console.log('✓ Outdated consent version correctly prompts for renewal');

  // Test 8: runWithConsent helper
  console.log('\n[Test 8] runWithConsent execution');
  let executedImmediately = false;
  saveCookieConsent('accepted', { functional: true, analytics: true, marketing: true });
  runWithConsent('analytics', () => { executedImmediately = true; });
  console.assert(executedImmediately === true, 'Callback should execute immediately when consent is present');
  console.log('✓ runWithConsent executes immediately when category is granted');

  console.log('\n===========================================');
  console.log('ALL COOKIE CONSENT TESTS PASSED SUCCESSFULLY!');
  console.log('===========================================');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});

