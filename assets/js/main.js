/**
 * Coralgenz Global - Frontend Interactions & Dynamic Engine
 * Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveals();
  initCounters();
  initSmoothScroll();
});

/* Sticky Navbar & Mobile Drawer */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
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

/* Scroll Reveal using IntersectionObserver */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-init');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
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
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* Number Counter Animation */
function initCounters() {
  const counterElements = document.querySelectorAll('.count-up');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 1800;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out expo
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentCount = Math.floor(easeOut * targetVal);

          el.textContent = `${prefix}${currentCount}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${prefix}${targetVal}${suffix}`;
          }
        }

        requestAnimationFrame(updateCount);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

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

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('threeDotsDropdown');
  if (dropdown && !dropdown.contains(e.target) && !e.target.closest('.three-dots-btn')) {
    dropdown.style.display = 'none';
  }
});

window.toggleThreeDotsMenu = toggleThreeDotsMenu;
window.toggleMobileServicesMenu = toggleMobileServicesMenu;

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

/* Live 4D Interactive Spatial Parallax for Credential Pass */
function init4DPassTilt() {
  const passCard = document.getElementById('credentialPass4D');
  const stage = document.querySelector('.corp-stage-4d');
  if (!passCard || !stage) return;

  stage.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;
    const rect = passCard.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const rotX = Math.max(-12, Math.min(12, -y / 15));
    const rotY = Math.max(-14, Math.min(14, x / 15));
    passCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px)`;
  });

  stage.addEventListener('mouseleave', () => {
    passCard.style.transform = '';
  });
}

/* Live 3D Interactive Parallax for Hero 3D Logo Stage */
function init3DHeroTilt() {
  const heroStage = document.getElementById('hero3DStage') || document.getElementById('hero4DShowcase');
  const heroSection = document.getElementById('hero');
  if (!heroStage || !heroSection) return;

  heroSection.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 991) return;
    const rect = heroStage.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const rotX = Math.max(-10, Math.min(10, -y / 22));
    const rotY = Math.max(-12, Math.min(12, x / 22));
    heroStage.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    heroStage.style.transform = '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init4DPassTilt();
  init3DHeroTilt();
});




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
    if (isActive && chip.parentElement) {
      const rail = chip.parentElement;
      const chipLeft = chip.offsetLeft;
      const chipWidth = chip.offsetWidth;
      const railScroll = rail.scrollLeft;
      const railWidth = rail.clientWidth;
      if (chipLeft < railScroll || (chipLeft + chipWidth) > (railScroll + railWidth)) {
        rail.scrollTo({ left: Math.max(0, chipLeft - (railWidth - chipWidth) / 2), behavior: 'smooth' });
      }
    }
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
  const isMobile = window.innerWidth <= 768;
  let scrollOffset;
  if (isMobile) {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const trackHalfWidth = track.clientWidth / 2;
    scrollOffset = cardCenter - trackHalfWidth;
  } else {
    const trackLeft = track.getBoundingClientRect().left;
    const cardLeft = card.getBoundingClientRect().left;
    scrollOffset = cardLeft - trackLeft + track.scrollLeft;
  }
  track.scrollTo({ left: Math.max(0, scrollOffset), behavior: 'smooth' });
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
    if (isActive && chip.parentElement) {
      const rail = chip.parentElement;
      const chipLeft = chip.offsetLeft;
      const chipWidth = chip.offsetWidth;
      const railScroll = rail.scrollLeft;
      const railWidth = rail.clientWidth;
      if (chipLeft < railScroll || (chipLeft + chipWidth) > (railScroll + railWidth)) {
        rail.scrollTo({ left: Math.max(0, chipLeft - (railWidth - chipWidth) / 2), behavior: 'smooth' });
      }
    }
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
  const isMobile = window.innerWidth <= 768;
  let scrollOffset;
  if (isMobile) {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const trackHalfWidth = track.clientWidth / 2;
    scrollOffset = cardCenter - trackHalfWidth;
  } else {
    const trackLeft = track.getBoundingClientRect().left;
    const cardLeft = card.getBoundingClientRect().left;
    scrollOffset = cardLeft - trackLeft + track.scrollLeft;
  }
  track.scrollTo({ left: Math.max(0, scrollOffset), behavior: 'smooth' });
  updateWhyDots(index);
}

window.slideWhy = slideWhy;
window.jumpWhySlide = jumpWhySlide;

// Auto-sync active preview chips and dots with zero buffering & zero fluctuation
document.addEventListener('DOMContentLoaded', () => {
  const whyTrack = document.getElementById('whyTrack');
  let whyAnimId;
  if (whyTrack) {
    const handleWhyScroll = () => {
      if (isProgrammaticWhy) return;
      if (whyAnimId) cancelAnimationFrame(whyAnimId);
      whyAnimId = requestAnimationFrame(() => {
        if (isProgrammaticWhy) return;
        const cards = whyTrack.querySelectorAll('.why-graphical-card');
        const trackBounds = whyTrack.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;
        const targetPoint = isMobile 
          ? (trackBounds.left + trackBounds.width / 2) 
          : (trackBounds.left + 35);
        let closestIdx = 0;
        let minDiff = Infinity;
        cards.forEach((card, idx) => {
          const cardBounds = card.getBoundingClientRect();
          const cardPoint = isMobile 
            ? (cardBounds.left + cardBounds.width / 2) 
            : cardBounds.left;
          const diff = Math.abs(cardPoint - targetPoint);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        if (currentWhyIndex !== closestIdx) {
          currentWhyIndex = closestIdx;
          updateWhyDots(closestIdx);
        }
      });
    };

    whyTrack.addEventListener('scroll', handleWhyScroll, { passive: true });
    whyTrack.addEventListener('scrollend', () => {
      isProgrammaticWhy = false;
    });
  }

  const valuesTrack = document.getElementById('valuesTrack');
  let valAnimId;
  if (valuesTrack) {
    const handleValScroll = () => {
      if (isProgrammaticVal) return;
      if (valAnimId) cancelAnimationFrame(valAnimId);
      valAnimId = requestAnimationFrame(() => {
        if (isProgrammaticVal) return;
        const cards = valuesTrack.querySelectorAll('.v-slide-card');
        const trackBounds = valuesTrack.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;
        const targetPoint = isMobile 
          ? (trackBounds.left + trackBounds.width / 2) 
          : (trackBounds.left + 35);
        let closestIdx = 0;
        let minDiff = Infinity;
        cards.forEach((card, idx) => {
          const cardBounds = card.getBoundingClientRect();
          const cardPoint = isMobile 
            ? (cardBounds.left + cardBounds.width / 2) 
            : cardBounds.left;
          const diff = Math.abs(cardPoint - targetPoint);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        if (currentValIndex !== closestIdx) {
          currentValIndex = closestIdx;
          updateValueDots(closestIdx);
        }
      });
    };

    valuesTrack.addEventListener('scroll', handleValScroll, { passive: true });
    valuesTrack.addEventListener('scrollend', () => {
      isProgrammaticVal = false;
    });
  }
});

