/**
 * Portfolio — Abdirahman Ali Mohamed
 * script.js — Modular JavaScript for all interactions
 *
 * Modules:
 *  1. Navigation (sticky, hamburger, active link)
 *  2. Typing Animation
 *  3. Scroll Reveal
 *  4. Skill Bar Animation
 *  5. Contact Form
 *  6. Footer Year
 */

'use strict';

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/**
 * Shorthand querySelector
 * @param {string} selector
 * @param {Element} [scope=document]
 * @returns {Element|null}
 */
const qs = (selector, scope = document) => scope.querySelector(selector);

/**
 * Shorthand querySelectorAll returning array
 * @param {string} selector
 * @param {Element} [scope=document]
 * @returns {Element[]}
 */
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/**
 * Throttle function — limits calls to once per `delay` ms
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
const throttle = (fn, delay) => {
  let lastTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn(...args);
    }
  };
};


/* ============================================================
   1. NAVIGATION MODULE
   ============================================================ */
const Navigation = (() => {

  const navbar    = qs('#navbar');
  const hamburger = qs('#hamburger');
  const navLinks  = qs('#navLinks');
  const links     = qsa('.nav-link');

  /**
   * Toggle scrolled class on navbar for glassmorphism effect
   */
  const handleScroll = throttle(() => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }, 80);

  /**
   * Toggle mobile menu open/closed
   */
  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  /**
   * Close mobile menu
   */
  const closeMenu = () => {
    navLinks.classList.remove('nav-open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  /**
   * Highlight nav link corresponding to visible section
   */
  const updateActiveLink = () => {
    const sections = qsa('section[id]');
    const scrollY  = window.scrollY + 120; // offset for navbar height

    let current = '';

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      const section = link.getAttribute('data-section');
      link.classList.toggle('active', section === current);
    });
  };

  /**
   * Initialise all navigation listeners
   */
  const init = () => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    hamburger.addEventListener('click', toggleMenu);

    // Close menu when a nav link is clicked
    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        closeMenu();
      }
    });

    // Handle Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Initial call
    handleScroll();
  };

  return { init };
})();


/* ============================================================
   2. TYPING ANIMATION MODULE
   ============================================================ */
const TypingAnimation = (() => {

  const phrases = [
    'Full Stack Developer',
    'Web Application Builder',
    'System Architect',
    'Problem Solver',
    'PHP & JavaScript Dev',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let typingTimer = null;

  const typedEl = qs('#typedText');

  /**
   * Typing/deleting tick function
   */
  const tick = () => {
    const currentPhrase = phrases[phraseIndex];
    const displayText   = isDeleting
      ? currentPhrase.slice(0, charIndex - 1)
      : currentPhrase.slice(0, charIndex + 1);

    typedEl.textContent = displayText;

    if (!isDeleting) {
      charIndex++;
      if (charIndex === currentPhrase.length) {
        // Pause at end before deleting
        isDeleting = true;
        typingTimer = setTimeout(tick, 1800);
        return;
      }
    } else {
      charIndex--;
      if (charIndex === 0) {
        // Move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingTimer = setTimeout(tick, 400);
        return;
      }
    }

    const speed = isDeleting ? 60 : 90;
    typingTimer = setTimeout(tick, speed);
  };

  const init = () => {
    if (!typedEl) return;
    // Short delay before starting
    setTimeout(tick, 700);
  };

  return { init };
})();


/* ============================================================
   3. SCROLL REVEAL MODULE
   ============================================================ */
const ScrollReveal = (() => {

  /**
   * IntersectionObserver to trigger reveal animations
   */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Animate once only
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  const init = () => {
    const elements = qsa('[data-reveal]');
    elements.forEach(el => observer.observe(el));
  };

  return { init };
})();


/* ============================================================
   4. SKILL BAR ANIMATION MODULE
   ============================================================ */
const SkillBars = (() => {

  let animated = false;

  /**
   * Animate all skill bars to their target width
   */
  const animate = () => {
    if (animated) return;
    animated = true;

    qsa('.skill-bar__fill').forEach(bar => {
      const targetWidth = bar.getAttribute('data-width');
      if (targetWidth) {
        // Small delay to let the CSS transition run after reveal
        requestAnimationFrame(() => {
          bar.style.width = targetWidth + '%';
        });
      }
    });
  };

  /**
   * Observe skills section — start animation when visible
   */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Brief delay so element reveal animation completes first
          setTimeout(animate, 400);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const init = () => {
    const skillsSection = qs('#skills');
    if (skillsSection) observer.observe(skillsSection);
  };

  return { init };
})();


/* ============================================================
   5. CONTACT FORM MODULE
   ============================================================ */
const ContactForm = (() => {

  const form       = qs('#contactForm');
  const statusEl   = qs('#formStatus');
  const submitBtn  = qs('#submitBtn');

  /**
   * Validate a single field
   * @param {HTMLElement} field
   * @returns {boolean}
   */
  const validateField = (field) => {
    const value = field.value.trim();

    if (field.required && !value) {
      field.classList.add('error');
      return false;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        field.classList.add('error');
        return false;
      }
    }

    field.classList.remove('error');
    return true;
  };

  /**
   * Show status message
   * @param {string} message
   * @param {'success'|'error'} type
   */
  const showStatus = (message, type) => {
    statusEl.textContent = message;
    statusEl.className   = `form-status ${type}`;

    // Auto-clear after 5 seconds
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className   = 'form-status';
    }, 5000);
  };

  /**
   * Handle real form submission via Formspree AJAX
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields   = qsa('.form-input, .form-textarea', form);
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      showStatus('Please fill in all required fields correctly.', 'error');
      return;
    }

    const endpoint = form.getAttribute('action');
    if (!endpoint || endpoint.includes('YOUR_FORMSP_ID')) {
      showStatus('Form endpoint not configured. Please add your Formspree ID.', 'error');
      console.error('Contact Form Error: action attribute still contains "YOUR_FORMSP_ID"');
      return;
    }

    // Prepare data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Disable button and show sending state
    const btnText = qs('.btn-text', submitBtn);
    const originalText = btnText.textContent;
    submitBtn.disabled   = true;
    btnText.textContent  = 'Sending…';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showStatus('✓ Message sent! I\'ll get back to you as soon as possible.', 'success');
        form.reset();
        fields.forEach(f => f.classList.remove('error'));
      } else {
        const result = await response.json();
        showStatus(result.error || 'Oops! There was a problem sending your message.', 'error');
      }
    } catch (error) {
      showStatus('Oops! There was a network error. Please try again later.', 'error');
      console.error('Submission error:', error);
    } finally {
      submitBtn.disabled  = false;
      btnText.textContent = originalText;
    }
  };

  /**
   * Live validation: remove error on input
   */
  const handleInput = (e) => {
    if (e.target.classList.contains('error')) {
      validateField(e.target);
    }
  };

  const init = () => {
    if (!form) return;
    form.addEventListener('submit', handleSubmit);
    form.addEventListener('input', handleInput);
  };

  return { init };
})();


/* ============================================================
   6. FOOTER YEAR MODULE
   ============================================================ */
const FooterYear = (() => {
  const init = () => {
    const yearEl = qs('#footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  };

  return { init };
})();


/* ============================================================
   7. SMOOTH SCROLL ENHANCEMENT
   ============================================================ */
const SmoothScroll = (() => {

  /**
   * Intercept anchor clicks for smooth controlled scrolling
   * (works alongside CSS scroll-behavior: smooth)
   */
  const init = () => {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
          10
        ) || 72;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      }
    });
  };

  return { init };
})();


/* ============================================================
   8. INITIALISER — DOMContentLoaded
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
  TypingAnimation.init();
  ScrollReveal.init();
  SkillBars.init();
  ContactForm.init();
  FooterYear.init();
  SmoothScroll.init();
});
