/**
 * Coralgenz Global - Frontend Interactions & Dynamic Engine
 * Pure Vanilla JavaScript - High Performance & Ultra-Smooth 60-120fps
 */

import { initCookieConsent, getCookieConsent, saveCookieConsent, resetCookieConsent, hasConsent, runWithConsent } from './cookie-consent.js';

/**
 * Enterprise Anti-Inspect Protection (Lightweight & Non-blocking)
 */
(function initAntiInspect() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true, passive: false });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    if (isCtrlOrCmd) {
      const key = e.key ? e.key.toLowerCase() : '';
      // Block Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S
      if ((e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) || key === 'u' || key === 's') {
        e.preventDefault();
        return false;
      }
    }
  }, { capture: true, passive: false });

  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true, passive: false });
})();

function initCore() {
  initNavbar();
  initScrollReveals();
  initCounters();
  initSmoothScroll();
  init4DPassTilt();
  init3DHeroTilt();
  initSliderTracks();
  initCookieConsent();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCore);
} else {
  initCore();
}

/* Sticky Navbar & Mobile Drawer */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (header) {
    let ticking = false;
    let isScrolled = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldScroll = window.scrollY > 20;
          if (shouldScroll !== isScrolled) {
            isScrolled = shouldScroll;
            header.classList.toggle('scrolled', isScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  if (toggleBtn && mobileMenu) {
    function openMobileDrawer() {
      toggleBtn.classList.add('active');
      mobileMenu.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (header) header.classList.add('nav-drawer-active');

      // Dismiss 3-dots dropdown if open
      const threeDots = document.getElementById('threeDotsDropdown');
      if (threeDots) threeDots.style.display = 'none';

      document.documentElement.classList.add('mobile-nav-locked');
      document.body.classList.add('mobile-nav-locked');
    }

    function closeMobileDrawer() {
      if (!mobileMenu.classList.contains('open') && !toggleBtn.classList.contains('active')) return;
      toggleBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      if (header) header.classList.remove('nav-drawer-active');

      document.documentElement.classList.remove('mobile-nav-locked');
      document.body.classList.remove('mobile-nav-locked');
    }

    window.closeMobileDrawer = closeMobileDrawer;
    window.openMobileDrawer = openMobileDrawer;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !mobileMenu.classList.contains('open');
      if (willOpen) {
        openMobileDrawer();
      } else {
        closeMobileDrawer();
      }
    });

    // Close mobile menu on clicking any navigation link
    mobileMenu.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && !link.classList.contains('mobile-toggle') && !link.classList.contains('no-close')) {
        closeMobileDrawer();
      }
    });

    // Close mobile drawer on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileDrawer();
      }
    });
  }
}

/* Zero-Jank High-Performance Scroll Reveal System */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-init');
  if (!revealElements.length) return;

  function revealElement(el) {
    if (!el.classList.contains('reveal-visible')) {
      el.classList.add('reveal-visible');
    }
  }

  // Instant reveal for reduced-motion or mobile devices to guarantee 120fps scrolling
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 768) {
    revealElements.forEach(revealElement);
    return;
  }

  /* Compositor-native IntersectionObserver: Zero layout reflows on scroll */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '250px 0px 250px 0px',
      threshold: 0.05
    });
    revealElements.forEach(el => observer.observe(el));
    return;
  }

  // Fallback for ancient browsers without IntersectionObserver: reveal immediately
  revealElements.forEach(revealElement);
}

/* Smooth Scrolling for internal hash anchors */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 74;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* Fast & Smooth Number Counter Animation */
function initCounters() {
  const counterElements = document.querySelectorAll('.count-up');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        obs.unobserve(el);
        const targetVal = parseFloat(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 1000;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -8 * progress);
          const currentCount = Math.floor(easeOut * targetVal);

          el.textContent = `${prefix}${currentCount}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${prefix}${targetVal}${suffix}`;
          }
        }

        requestAnimationFrame(updateCount);
      }
    });
  }, { threshold: 0.1 });

  counterElements.forEach(el => observer.observe(el));
}

/* Helper to close other open mobile accordions */
function closeOtherMobileAccordions(except) {
  if (except !== 'highlights') {
    const hToggle = document.querySelector('.mobile-highlights-toggle');
    const hDropdown = document.getElementById('mobileHighlightsDropdown');
    if (hToggle) hToggle.classList.remove('active');
    if (hDropdown) hDropdown.classList.remove('open');
    if (hToggle) hToggle.setAttribute('aria-expanded', 'false');
  }
  if (except !== 'services') {
    const sToggle = document.querySelector('.mobile-services-toggle');
    const sDropdown = document.getElementById('mobileServicesDropdown');
    if (sToggle) sToggle.classList.remove('active');
    if (sDropdown) sDropdown.classList.remove('open');
    if (sToggle) sToggle.setAttribute('aria-expanded', 'false');
  }
  if (except !== 'products') {
    const pToggle = document.querySelector('.mobile-products-toggle');
    const pDropdown = document.getElementById('mobileProductsDropdown');
    if (pToggle) pToggle.classList.remove('active');
    if (pDropdown) pDropdown.classList.remove('open');
    if (pToggle) pToggle.setAttribute('aria-expanded', 'false');
  }
  if (except !== 'policies') {
    const pToggle = document.querySelector('.mobile-policies-toggle');
    const pDropdown = document.getElementById('mobilePoliciesDropdown');
    if (pToggle) pToggle.classList.remove('active');
    if (pDropdown) pDropdown.classList.remove('open');
    if (pToggle) pToggle.setAttribute('aria-expanded', 'false');
  }
}

/* 3-Dot Quick Options Dropdown Toggle */
function toggleThreeDotsMenu(e) {
  if (e) e.stopPropagation();
  if (window.closeMobileDrawer) {
    window.closeMobileDrawer();
  }
  const dropdown = document.getElementById('threeDotsDropdown');
  if (dropdown) {
    const isHidden = dropdown.style.display === 'none' || dropdown.style.display === '';
    dropdown.style.display = isHidden ? 'flex' : 'none';
  }
}

/* Mobile Menu Our Products Dropdown Toggle */
function toggleMobileProductsMenu(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const btn = e?.currentTarget || document.querySelector('.mobile-products-toggle');
  const dropdown = document.getElementById('mobileProductsDropdown');
  if (btn && dropdown) {
    const willOpen = !dropdown.classList.contains('open');
    if (willOpen) closeOtherMobileAccordions('products');
    btn.classList.toggle('active', willOpen);
    dropdown.classList.toggle('open', willOpen);
    btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  }
}

/* Mobile Menu Our Services Dropdown Toggle */
function toggleMobileServicesMenu(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const btn = e?.currentTarget || document.querySelector('.mobile-services-toggle');
  const dropdown = document.getElementById('mobileServicesDropdown');
  if (btn && dropdown) {
    const willOpen = !dropdown.classList.contains('open');
    if (willOpen) closeOtherMobileAccordions('services');
    btn.classList.toggle('active', willOpen);
    dropdown.classList.toggle('open', willOpen);
    btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  }
}

/* Mobile Menu Our Highlights Dropdown Toggle */
function toggleMobileHighlightsMenu(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const btn = e?.currentTarget || document.querySelector('.mobile-highlights-toggle');
  const dropdown = document.getElementById('mobileHighlightsDropdown');
  if (btn && dropdown) {
    const willOpen = !dropdown.classList.contains('open');
    if (willOpen) closeOtherMobileAccordions('highlights');
    btn.classList.toggle('active', willOpen);
    dropdown.classList.toggle('open', willOpen);
    btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  }
}

/* Active Highlight for 3-Line Menu when on/clicking an item inside it */
function updateThreeDotsActiveState() {
  const threeDotsBtn = document.querySelector('.three-dots-btn');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const path = (window.location.pathname.replace(/\/$/, '') || '/').toLowerCase();
  const hash = window.location.hash;
  const href = window.location.href.toLowerCase();

  const isInsideThreeDotsPage = 
    path === '/blog' || href.includes('/blog') ||
    path === '/rate-us' || href.includes('/rate-us') ||
    path === '/team' || href.includes('/team') ||
    path === '/collaborated-products' || href.includes('/collaborated-products') ||
    path === '/karthick-krishna' || href.includes('/karthick-krishna') ||
    path === '/thanvanth-h' || href.includes('/thanvanth-h') ||
    path === '/sharveshwaran-r' || href.includes('/sharveshwaran-r') ||
    path === '/privacy-policy' || href.includes('/privacy-policy') ||
    hash === '#certifications';

  if (threeDotsBtn) {
    if (isInsideThreeDotsPage) {
      threeDotsBtn.classList.add('active', 'is-active-page');
      threeDotsBtn.setAttribute('title', 'Active Menu Section');
    } else {
      threeDotsBtn.classList.remove('active', 'is-active-page');
    }
  }

  if (mobileToggle) {
    if (isInsideThreeDotsPage) {
      mobileToggle.classList.add('is-active-page');
    } else {
      mobileToggle.classList.remove('is-active-page');
    }
  }
}

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('threeDotsDropdown');
  if (dropdown && !dropdown.contains(e.target) && !e.target.closest('.three-dots-btn')) {
    dropdown.style.display = 'none';
  }
  // When an item inside 3-line menu is clicked
  if (e.target.closest('#threeDotsDropdown a')) {
    const threeDotsBtn = document.querySelector('.three-dots-btn');
    if (threeDotsBtn) {
      threeDotsBtn.classList.add('active', 'is-active-page');
    }
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (mobileToggle) {
      mobileToggle.classList.add('is-active-page');
    }
  }
});

document.addEventListener('DOMContentLoaded', updateThreeDotsActiveState);
window.addEventListener('hashchange', updateThreeDotsActiveState);

window.toggleThreeDotsMenu = toggleThreeDotsMenu;
window.toggleMobileProductsMenu = toggleMobileProductsMenu;
window.toggleMobileServicesMenu = toggleMobileServicesMenu;
window.toggleMobileHighlightsMenu = toggleMobileHighlightsMenu;
window.updateThreeDotsActiveState = updateThreeDotsActiveState;

/* Certification Card Dropdown Toggle */
function toggleCertDropdown(e) {
  if (e) e.preventDefault();
  const content = document.getElementById('certDropdownContent');
  const toggleBtn = document.querySelector('.accordion-trigger-clean, .neo-accordion-trigger, .apple-accordion-toggle, .cert-glass-accordion-btn, .cert-v2-dropdown-toggle');
  if (content && toggleBtn) {
    const isOpen = content.classList.contains('open');
    if (isOpen) {
      content.classList.remove('open');
      toggleBtn.classList.remove('active');
    } else {
      content.classList.add('open');
      toggleBtn.classList.add('active');
    }
  }
}
window.toggleCertDropdown = toggleCertDropdown;

/* Available Courses Dropdown Toggle */
function toggleCoursesDropdown(e) {
  if (e) e.preventDefault();
  const content = document.getElementById('coursesDropdownContent');
  const toggleBtn = document.querySelector('.courses-trigger-clean');
  if (content && toggleBtn) {
    const isOpen = content.classList.contains('open');
    if (isOpen) {
      content.classList.remove('open');
      toggleBtn.classList.remove('active');
    } else {
      content.classList.add('open');
      toggleBtn.classList.add('active');
    }
  }
}
window.toggleCoursesDropdown = toggleCoursesDropdown;

/* High-Performance 3D/4D Tilt (Hardware Accelerated & RAF Throttled) */
function init4DPassTilt() {
  const passCard = document.getElementById('credentialPass4D');
  const stage = document.querySelector('.corp-stage-4d');
  if (!passCard || !stage) return;
  let rafId = null;

  stage.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect = passCard.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const rotX = Math.max(-8, Math.min(8, -y / 20));
      const rotY = Math.max(-10, Math.min(10, x / 20));
      passCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    });
  }, { passive: true });

  stage.addEventListener('mouseleave', () => {
    if (rafId) cancelAnimationFrame(rafId);
    passCard.style.transform = '';
  });
}

function init3DHeroTilt() {
  const heroStage = document.getElementById('hero3DStage') || document.getElementById('hero4DShowcase');
  const heroSection = document.getElementById('hero');
  if (!heroStage || !heroSection) return;
  let rafId = null;

  heroSection.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 991) return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect = heroStage.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const rotX = Math.max(-8, Math.min(8, -y / 25));
      const rotY = Math.max(-10, Math.min(10, x / 25));
      heroStage.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    });
  }, { passive: true });

  heroSection.addEventListener('mouseleave', () => {
    if (rafId) cancelAnimationFrame(rafId);
    heroStage.style.transform = '';
  });
}

/* ==========================================================================
   WHAT WE STAND FOR — Codex Principles Interactive Engine
   ========================================================================== */
let activeCodexIndex = 0;
let activeCodexCategory = 'all';

function selectCodexPrinciple(index) {
  activeCodexIndex = index;

  // 1. Update navigation items
  const navItems = document.querySelectorAll('.codex-nav-item');
  let activeItemEl = null;
  navItems.forEach((item) => {
    const idx = parseInt(item.getAttribute('data-index'), 10);
    const isActive = (idx === index);
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-selected', isActive ? 'true' : 'false');
    if (isActive) activeItemEl = item;
  });

  // Smoothly center the active item in the navigation rail on mobile/tablet
  if (activeItemEl) {
    const navRail = document.getElementById('codexNavRail');
    if (navRail && (window.innerWidth <= 900 || navRail.scrollWidth > navRail.clientWidth)) {
      activeItemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // 2. Update detail stage panels
  const panels = document.querySelectorAll('.codex-detail-panel');
  panels.forEach((panel) => {
    const idx = parseInt(panel.getAttribute('data-index'), 10);
    const isActive = (idx === index);
    panel.classList.toggle('active', isActive);
    if (isActive) {
      panel.style.display = 'block';
      panel.classList.remove('panel-fade-in');
      void panel.offsetWidth; // Force reflow
      panel.classList.add('panel-fade-in');
    } else {
      panel.style.display = 'none';
    }
  });
}

function nextCodexPrinciple(step = 1) {
  const navItems = Array.from(document.querySelectorAll('.codex-nav-item')).filter(
    (item) => item.style.display !== 'none'
  );
  if (navItems.length === 0) return;

  const currentVisibleIdx = navItems.findIndex(
    (item) => parseInt(item.getAttribute('data-index'), 10) === activeCodexIndex
  );
  const nextVisibleIdx = (currentVisibleIdx + step + navItems.length) % navItems.length;
  const targetIndex = parseInt(navItems[nextVisibleIdx].getAttribute('data-index'), 10);
  selectCodexPrinciple(targetIndex);
}

function setCodexCategory(category) {
  activeCodexCategory = category;

  // 1. Update filter pill states
  const pills = document.querySelectorAll('.codex-pill');
  pills.forEach((pill) => {
    const cat = pill.getAttribute('data-category');
    const isSelected = (cat === category);
    pill.classList.toggle('active', isSelected);
    pill.setAttribute('aria-selected', isSelected ? 'true' : 'false');
  });

  // 2. Filter Nav Items in Rail
  const navItems = document.querySelectorAll('.codex-nav-item');
  let firstVisibleIndex = -1;
  navItems.forEach((item) => {
    const cat = item.getAttribute('data-category');
    const matches = (category === 'all' || cat === category);
    item.style.display = matches ? 'flex' : 'none';
    if (matches && firstVisibleIndex === -1) {
      firstVisibleIndex = parseInt(item.getAttribute('data-index'), 10);
    }
  });

  // If currently active principle is hidden by filter, switch to first visible
  const activeNavItem = document.querySelector(`.codex-nav-item[data-index="${activeCodexIndex}"]`);
  if (activeNavItem && activeNavItem.style.display === 'none' && firstVisibleIndex !== -1) {
    selectCodexPrinciple(firstVisibleIndex);
  }
}

// Touch swipe support on Mobile Detail Stage for seamless native feel
(function initCodexTouchGestures() {
  const stage = document.getElementById('codexDetailStage');
  if (!stage) return;
  let touchStartX = 0;
  let touchStartY = 0;
  stage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      // Ensure horizontal swipe intent (more horizontal than vertical, min 45px)
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          nextCodexPrinciple(1); // Swipe left -> Next
        } else {
          nextCodexPrinciple(-1); // Swipe right -> Prev
        }
      }
    }
  }, { passive: true });
})();

// Global exposes for inline handlers & programmatic navigation
window.selectCodexPrinciple = selectCodexPrinciple;
window.nextCodexPrinciple = nextCodexPrinciple;
window.setCodexCategory = setCodexCategory;
window.setCodexView = () => {};
window.inspectFromGrid = (idx) => selectCodexPrinciple(idx);
window.toggleCodexAccordion = (idx) => selectCodexPrinciple(idx);

// Backwards compatibility aliases
window.slideValues = (dir) => nextCodexPrinciple(dir);
window.jumpValueSlide = (idx) => selectCodexPrinciple(idx);
window.filterValues = (cat) => setCodexCategory(cat);

/* Why Choose Us - Slider & Preview Logic */
let currentWhyIndex = 0;
let isProgrammaticWhy = false;
let whyProgrammaticTimer = null;

function updateWhyDots(index) {
  const dots = document.querySelectorAll('#whyDots .why-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  const chips = document.querySelectorAll('.why-preview-chip');
  chips.forEach((chip, i) => {
    const isActive = (i === index);
    chip.classList.toggle('active', isActive);
  });
  const cards = document.querySelectorAll('#whyTrack .why-graphical-card');
  cards.forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });
}

function slideWhy(direction) {
  const track = document.getElementById('whyTrack');
  const cards = track ? track.querySelectorAll('.why-graphical-card') : [];
  if (!track || cards.length === 0) return;

  currentWhyIndex = (currentWhyIndex + direction + cards.length) % cards.length;
  jumpWhySlide(currentWhyIndex);
}

function jumpWhySlide(index) {
  const track = document.getElementById('whyTrack');
  const cards = track ? track.querySelectorAll('.why-graphical-card') : [];
  if (!track || !cards[index]) return;

  isProgrammaticWhy = true;
  if (whyProgrammaticTimer) clearTimeout(whyProgrammaticTimer);
  whyProgrammaticTimer = setTimeout(() => {
    isProgrammaticWhy = false;
  }, 450);

  currentWhyIndex = index;
  const card = cards[index];
  track.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
  updateWhyDots(index);
}

window.slideWhy = slideWhy;
window.jumpWhySlide = jumpWhySlide;

/* Ultra-Fast Slider Sync (Zero Reflow / Zero Layout Thrashing) */
function initSliderTracks() {
  const whyTrack = document.getElementById('whyTrack');
  const valuesTrack = document.getElementById('valuesTrack');

  let whyCardWidth = 0;
  let whyCardCount = 0;
  let valCardWidth = 0;
  let valCardCount = 0;

  function measureTracks() {
    if (whyTrack) {
      const card = whyTrack.querySelector('.why-graphical-card');
      const cards = whyTrack.querySelectorAll('.why-graphical-card');
      whyCardCount = cards.length;
      if (card) whyCardWidth = card.offsetWidth + 18;
    }
    if (valuesTrack) {
      const card = valuesTrack.querySelector('.v-slide-card');
      const cards = valuesTrack.querySelectorAll('.v-slide-card');
      valCardCount = cards.length;
      if (card) valCardWidth = card.offsetWidth + 18;
    }
  }

  measureTracks();
  window.addEventListener('resize', measureTracks, { passive: true });

  if (whyTrack) {
    let ticking = false;
    whyTrack.addEventListener('scroll', () => {
      if (isProgrammaticWhy) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (whyCardWidth > 0 && whyCardCount > 0) {
            const idx = Math.max(0, Math.min(whyCardCount - 1, Math.round(whyTrack.scrollLeft / whyCardWidth)));
            if (currentWhyIndex !== idx) {
              currentWhyIndex = idx;
              updateWhyDots(idx);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    whyTrack.addEventListener('scrollend', () => {
      isProgrammaticWhy = false;
    });
  }

  if (valuesTrack) {
    let ticking = false;
    valuesTrack.addEventListener('scroll', () => {
      if (isProgrammaticVal) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (valCardWidth > 0 && valCardCount > 0) {
            const idx = Math.max(0, Math.min(valCardCount - 1, Math.round(valuesTrack.scrollLeft / valCardWidth)));
            if (currentValIndex !== idx) {
              currentValIndex = idx;
              updateValueDots(idx);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    valuesTrack.addEventListener('scrollend', () => {
      isProgrammaticVal = false;
    });
  }
}

/* FAQ Section Toggle (See More / Show Less) */
function toggleFaqQuestions() {
  const hiddenItems = document.querySelectorAll('.home-faq-item.faq-extra');
  const btn = document.getElementById('toggleFaqBtn');
  if (!btn || hiddenItems.length === 0) return;

  const isExpanded = btn.classList.contains('expanded');

  hiddenItems.forEach(item => {
    if (isExpanded) {
      item.style.display = 'none';
      item.removeAttribute('open');
    } else {
      item.style.display = 'block';
    }
  });

  if (isExpanded) {
    btn.classList.remove('expanded');
    const textEl = btn.querySelector('.faq-btn-text');
    if (textEl) textEl.textContent = 'See More Questions';
    const badge = btn.querySelector('.faq-btn-badge');
    if (badge) badge.style.display = 'inline-block';
  } else {
    btn.classList.add('expanded');
    const textEl = btn.querySelector('.faq-btn-text');
    if (textEl) textEl.textContent = 'Show Less';
    const badge = btn.querySelector('.faq-btn-badge');
    if (badge) badge.style.display = 'none';
  }
}
window.toggleFaqQuestions = toggleFaqQuestions;
export { initCookieConsent, getCookieConsent, saveCookieConsent, hasConsent, runWithConsent };
