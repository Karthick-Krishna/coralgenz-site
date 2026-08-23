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

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('threeDotsDropdown');
  if (dropdown && !dropdown.contains(e.target) && !e.target.closest('.three-dots-btn')) {
    dropdown.style.display = 'none';
  }
});

window.toggleThreeDotsMenu = toggleThreeDotsMenu;

/* Certification Card Dropdown Toggle */
function toggleCertDropdown(e) {
  if (e) e.preventDefault();
  const content = document.getElementById('certDropdownContent');
  const toggleBtn = document.querySelector('.cert-v2-dropdown-toggle');
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

/* Values Principle Studio - Slider & Filter Logic */
let currentValIndex = 0;

function updateValueDots(index) {
  const dots = document.querySelectorAll('#valuesDots .v-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function slideValues(direction) {
  const track = document.getElementById('valuesTrack');
  const cards = document.querySelectorAll('.v-slide-card:not([style*="display: none"])');
  if (!track || cards.length === 0) return;

  currentValIndex += direction;
  if (currentValIndex < 0) currentValIndex = cards.length - 1;
  if (currentValIndex >= cards.length) currentValIndex = 0;

  const targetCard = cards[currentValIndex];
  if (targetCard) {
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
  updateValueDots(currentValIndex);
}

function jumpValueSlide(index) {
  const cards = document.querySelectorAll('.v-slide-card:not([style*="display: none"])');
  if (!cards[index]) return;
  currentValIndex = index;
  cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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

/* Why Choose Us - Slider Logic */
let currentWhyIndex = 0;

function updateWhyDots(index) {
  const dots = document.querySelectorAll('#whyDots .why-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function slideWhy(direction) {
  const track = document.getElementById('whyTrack');
  const cards = track ? track.querySelectorAll('.why-graphical-card') : [];
  if (!track || cards.length === 0) return;

  currentWhyIndex += direction;
  if (currentWhyIndex < 0) currentWhyIndex = cards.length - 1;
  if (currentWhyIndex >= cards.length) currentWhyIndex = 0;

  const targetCard = cards[currentWhyIndex];
  if (targetCard) {
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }
  updateWhyDots(currentWhyIndex);
}

function jumpWhySlide(index) {
  const track = document.getElementById('whyTrack');
  const cards = track ? track.querySelectorAll('.why-graphical-card') : [];
  if (!cards[index]) return;
  currentWhyIndex = index;
  cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  updateWhyDots(index);
}

window.slideWhy = slideWhy;
window.jumpWhySlide = jumpWhySlide;

// Auto-sync active dots on scroll/swipe for both tracks
document.addEventListener('DOMContentLoaded', () => {
  const whyTrack = document.getElementById('whyTrack');
  if (whyTrack) {
    whyTrack.addEventListener('scroll', () => {
      const cards = whyTrack.querySelectorAll('.why-graphical-card');
      const trackRect = whyTrack.getBoundingClientRect();
      cards.forEach((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        if (cardRect.left >= trackRect.left - 40 && cardRect.left <= trackRect.left + trackRect.width / 2) {
          currentWhyIndex = idx;
          updateWhyDots(idx);
        }
      });
    }, { passive: true });
  }

  const valuesTrack = document.getElementById('valuesTrack');
  if (valuesTrack) {
    valuesTrack.addEventListener('scroll', () => {
      const cards = valuesTrack.querySelectorAll('.v-slide-card');
      const trackRect = valuesTrack.getBoundingClientRect();
      cards.forEach((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        if (cardRect.left >= trackRect.left - 40 && cardRect.left <= trackRect.left + trackRect.width / 2) {
          currentValIndex = idx;
          updateValueDots(idx);
        }
      });
    }, { passive: true });
  }
});

