/**
 * Coralgenz Global - Frontend Interactions & Dynamic Engine
 * Pure Vanilla JavaScript - High Performance & Ultra-Smooth 60-120fps
 */

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
          const shouldScroll = window.scrollY > 40;
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
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBtn.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* High-Performance RAF-based Scroll Reveal System (Fixes Safari Scroll Halting) */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-init');
  if (!revealElements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach(el => el.classList.add('reveal-visible'));
    return;
  }

  // Convert NodeList to Array for faster manipulation and removal of processed items
  let elementsToReveal = Array.from(revealElements);

  function checkReveals() {
    if (!elementsToReveal.length) return;
    const triggerBottom = window.innerHeight + 80;
    
    elementsToReveal = elementsToReveal.filter(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        el.classList.add('reveal-visible');
        return false; // Remove from array once revealed
      }
      return true; // Keep in array if not yet visible
    });
  }

  // Initial check on load
  checkReveals();

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!elementsToReveal.length) return; // Stop listening when all are revealed
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkReveals();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
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

/* 3-Dot Quick Options Dropdown Toggle */
function toggleThreeDotsMenu(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('threeDotsDropdown');
  if (dropdown) {
    const isHidden = dropdown.style.display === 'none' || dropdown.style.display === '';
    dropdown.style.display = isHidden ? 'flex' : 'none';
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
    btn.classList.toggle('active');
    dropdown.classList.toggle('open');
    const isExpanded = dropdown.classList.contains('open');
    btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
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
    btn.classList.toggle('active');
    dropdown.classList.toggle('open');
    const isExpanded = dropdown.classList.contains('open');
    btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  }
}

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('threeDotsDropdown');
  if (dropdown && !dropdown.contains(e.target) && !e.target.closest('.three-dots-btn')) {
    dropdown.style.display = 'none';
  }
});

window.toggleThreeDotsMenu = toggleThreeDotsMenu;
window.toggleMobileServicesMenu = toggleMobileServicesMenu;
window.toggleMobileHighlightsMenu = toggleMobileHighlightsMenu;

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

/* Values Principle Studio - Slider & Preview Logic */
let currentValIndex = 0;
let isProgrammaticVal = false;
let valProgrammaticTimer = null;

function updateValueDots(index) {
  const dots = document.querySelectorAll('#valuesDots .v-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  const chips = document.querySelectorAll('.values-preview-chip');
  chips.forEach((chip, i) => {
    const isActive = (i === index);
    chip.classList.toggle('active', isActive);
  });
  const cards = document.querySelectorAll('#valuesTrack .v-slide-card');
  cards.forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });
}

function slideValues(direction) {
  const track = document.getElementById('valuesTrack');
  const cards = track ? track.querySelectorAll('.v-slide-card') : [];
  if (!track || cards.length === 0) return;

  currentValIndex = (currentValIndex + direction + cards.length) % cards.length;
  jumpValueSlide(currentValIndex);
}

function jumpValueSlide(index) {
  const track = document.getElementById('valuesTrack');
  const cards = track ? track.querySelectorAll('.v-slide-card') : [];
  if (!track || !cards[index]) return;

  isProgrammaticVal = true;
  if (valProgrammaticTimer) clearTimeout(valProgrammaticTimer);
  valProgrammaticTimer = setTimeout(() => {
    isProgrammaticVal = false;
  }, 450);

  currentValIndex = index;
  const card = cards[index];
  track.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
  updateValueDots(index);
}

function filterValues(category) {
  const tabs = document.querySelectorAll('.v-pill-tab');
  tabs.forEach(tab => {
    const isSelected = tab.getAttribute('onclick')?.includes(`'${category}'`);
    tab.classList.toggle('active', isSelected);
  });

  const cards = document.querySelectorAll('.v-slide-card');
  let firstVisible = -1;
  cards.forEach((card, idx) => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      if (firstVisible === -1) firstVisible = idx;
    } else {
      card.style.display = 'none';
    }
  });

  if (firstVisible !== -1) {
    jumpValueSlide(0);
  }
}

window.slideValues = slideValues;
window.jumpValueSlide = jumpValueSlide;
window.filterValues = filterValues;

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
  if (whyTrack) {
    let ticking = false;
    whyTrack.addEventListener('scroll', () => {
      if (isProgrammaticWhy) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const cards = whyTrack.querySelectorAll('.why-graphical-card');
          if (cards.length > 0) {
            const cardWidth = cards[0].offsetWidth + 18;
            const idx = Math.max(0, Math.min(cards.length - 1, Math.round(whyTrack.scrollLeft / cardWidth)));
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

  const valuesTrack = document.getElementById('valuesTrack');
  if (valuesTrack) {
    let ticking = false;
    valuesTrack.addEventListener('scroll', () => {
      if (isProgrammaticVal) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const cards = valuesTrack.querySelectorAll('.v-slide-card');
          if (cards.length > 0) {
            const cardWidth = cards[0].offsetWidth + 18;
            const idx = Math.max(0, Math.min(cards.length - 1, Math.round(valuesTrack.scrollLeft / cardWidth)));
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
