

// ==========================================================================
// Mobile Navigation Toggle Menu
// ==========================================================================
const mainHeader = document.getElementById('main-header');
const mobileToggleBtn = document.getElementById('mobile-toggle');
const navLinks = document.querySelectorAll('.nav-link');

mobileToggleBtn.addEventListener('click', () => {
  mainHeader.classList.toggle('nav-open');
});

// Close mobile navigation menu on clicking a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mainHeader.classList.remove('nav-open');
  });
});

// ==========================================================================
// Custom Eased Smooth Scroll (Flutter-style scroll physics for the web)
// ==========================================================================
// Instead of relying on the browser's native (linear, instant) wheel scroll,
// this intercepts wheel input and animates window.scrollY toward a moving
// target with exponential easing every frame -- the same "catch up to a
// target with a damping factor" model used by ScrollPhysics/AnimationController
// in Flutter, giving the page a smooth, weighted, momentum-like feel.
const smoothScroll = (() => {
  const EASE = 0.09; // lower = smoother/slower catch-up, higher = snappier
  const STOP_THRESHOLD = 0.5;
  let current = window.scrollY;
  let target = window.scrollY;
  let rafId = null;

  function maxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  function clamp(value) {
    return Math.max(0, Math.min(value, maxScroll()));
  }

  function step() {
    current += (target - current) * EASE;

    if (Math.abs(target - current) < STOP_THRESHOLD) {
      current = target;
      window.scrollTo({ top: current, left: 0, behavior: 'auto' });
      rafId = null;
      return;
    }

    window.scrollTo({ top: current, left: 0, behavior: 'auto' });
    rafId = requestAnimationFrame(step);
  }

  function ensureRunning() {
    if (rafId === null) {
      rafId = requestAnimationFrame(step);
    }
  }

  function isScrollLocked(el) {
    // Elements with their own scroll region (horizontal nav, lightbox
    // thumbnails) should keep native wheel behavior; and don't hijack
    // scrolling while the fullscreen lightbox modal is open.
    const galleryModal = document.getElementById('gallery-modal');
    if (galleryModal && galleryModal.classList.contains('active')) return true;
    return !!(el.closest('#nav-menu') || el.closest('.lightbox-thumbnails-wrapper'));
  }

  window.addEventListener('wheel', (e) => {
    if (isScrollLocked(e.target)) return;
    e.preventDefault();
    target = clamp(target + e.deltaY);
    ensureRunning();
  }, { passive: false });

  // Keep our internal state in sync with any scroll that happens outside
  // our own animation loop (keyboard, scrollbar drag, programmatic jumps).
  window.addEventListener('scroll', () => {
    if (rafId === null) {
      current = window.scrollY;
      target = window.scrollY;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    target = clamp(target);
  });

  return {
    scrollTo(y) {
      target = clamp(y);
      ensureRunning();
    }
  };
})();

// Route in-page anchor links through the eased scroll instead of an
// instant/native jump, offsetting for the fixed header height.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const targetEl = document.querySelector(hash);
    if (!targetEl) return;

    e.preventDefault();
    const headerOffset = document.getElementById('main-header').offsetHeight + 12;
    const destination = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
    smoothScroll.scrollTo(destination);
  });
});

// ==========================================================================
// Intersection Observer for Scroll Reveal Animations
// ==========================================================================
const revealElements = document.querySelectorAll('.scroll-reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target); // Stop observing once revealed
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
});

revealElements.forEach(element => {
  revealObserver.observe(element);
});

// ==========================================================================
// Navigation Active Section Highlighting on Scroll
// ==========================================================================
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let currentActive = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    // Highlight links when scroll is past the top offset minus offset margin
    if (window.scrollY >= (sectionTop - 200)) {
      currentActive = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentActive}`) {
      link.classList.add('active');
    }
  });
});

// ==========================================================================
// Project Screenshot Gallery Lightbox Modal
// ==========================================================================
const projectGalleries = {
  redawa_erp: [
    'assets/images/eorder/1.webp',
    'assets/images/eorder/2.webp',
    'assets/images/eorder/3.webp',
    'assets/images/eorder/4.webp',
    'assets/images/eorder/5.webp',
    'assets/images/eorder/6.webp',
    'assets/images/eorder/7.webp',
    'assets/images/eorder/8.webp',
    'assets/images/eorder/9.webp',
    'assets/images/eorder/10.webp',
    'assets/images/eorder/11.webp',
    'assets/images/eorder/12.webp',
    'assets/images/eorder/13.webp',
    'assets/images/eorder/14.webp',
    'assets/images/eorder/15.webp',
    'assets/images/eorder/16.webp',
    'assets/images/eorder/17.webp',
    'assets/images/eorder/18.webp',
    'assets/images/eorder/19.webp',
    'assets/images/eorder/20.webp'
  ],
  waste_classifier: [
    'assets/images/pinned/waste_classifier/1.webp',
    'assets/images/pinned/waste_classifier/2.webp',
    'assets/images/pinned/waste_classifier/3.webp',
    'assets/images/pinned/waste_classifier/4.webp'
  ],
  taskflow: [
    'assets/images/pinned/taskflow/1.webp',
    'assets/images/pinned/taskflow/2.webp',
    'assets/images/pinned/taskflow/3.webp',
    'assets/images/pinned/taskflow/4.webp'
  ],
  github_explorer: [
    'assets/images/pinned/github_explorer/1.webp',
    'assets/images/pinned/github_explorer/2.webp',
    'assets/images/pinned/github_explorer/3.webp',
    'assets/images/pinned/github_explorer/4.webp'
  ],
  resource_management: [
    'assets/images/pinned/resource_management/1.webp',
    'assets/images/pinned/resource_management/2.webp',
    'assets/images/pinned/resource_management/3.webp',
    'assets/images/pinned/resource_management/4.webp'
  ],
  court_click: [
    'assets/images/pinned/court_click/1.webp',
    'assets/images/pinned/court_click/2.webp',
    'assets/images/pinned/court_click/3.webp',
    'assets/images/pinned/court_click/4.webp'
  ]
};

let currentProject = '';
let currentImageIndex = 0;

const galleryModal = document.getElementById('gallery-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
const lightboxCloseBtn = document.getElementById('lightbox-close');
const lightboxPrevBtn = document.getElementById('lightbox-prev');
const lightboxNextBtn = document.getElementById('lightbox-next');

// Open Lightbox
function openGallery(projectId) {
  currentProject = projectId;
  currentImageIndex = 0;
  
  updateLightbox();
  renderThumbnails();
  
  galleryModal.classList.add('active');
  galleryModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent page scrolling
}

// Close Lightbox
function closeGallery() {
  galleryModal.classList.remove('active');
  galleryModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Restore page scrolling
}

// Update Lightbox image & indicators
function updateLightbox() {
  const images = projectGalleries[currentProject];
  if (!images || !images.length) return;
  
  // Transition fade effect
  lightboxImg.style.opacity = 0;
  setTimeout(() => {
    lightboxImg.setAttribute('src', images[currentImageIndex]);
    lightboxImg.style.opacity = 1;
  }, 150);
  
  lightboxCounter.textContent = `Image ${currentImageIndex + 1} of ${images.length}`;
  
  // Update active thumbnail
  const thumbs = lightboxThumbnails.querySelectorAll('.lightbox-thumb');
  thumbs.forEach((thumb, idx) => {
    if (idx === currentImageIndex) {
      thumb.classList.add('active');
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      thumb.classList.remove('active');
    }
  });
}

// Render thumbnail previews
function renderThumbnails() {
  lightboxThumbnails.innerHTML = '';
  const images = projectGalleries[currentProject];
  if (!images) return;
  
  images.forEach((imgSrc, idx) => {
    const thumb = document.createElement('div');
    thumb.className = `lightbox-thumb ${idx === currentImageIndex ? 'active' : ''}`;
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `Thumbnail ${idx + 1}`;
    
    thumb.appendChild(img);
    
    thumb.addEventListener('click', () => {
      currentImageIndex = idx;
      updateLightbox();
    });
    
    lightboxThumbnails.appendChild(thumb);
  });
}

// Navigation functions
function nextImage() {
  const images = projectGalleries[currentProject];
  if (!images) return;
  currentImageIndex = (currentImageIndex + 1) % images.length;
  updateLightbox();
}

// Event Listeners for Gallery Buttons
document.querySelectorAll('.project-gallery-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid triggering card selection
    const proj = btn.getAttribute('data-project');
    openGallery(proj);
  });
});

// Clicking anywhere on a project card opens its screenshot gallery
document.querySelectorAll('.project-card[data-project-id]').forEach(card => {
  card.addEventListener('click', (e) => {
    // If the click is inside a link or button (e.g. Play Store, View Repo), let it act normally
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    const proj = card.getAttribute('data-project-id');
    if (projectGalleries[proj]) {
      openGallery(proj);
    }
  });
});

function prevImage() {
  const images = projectGalleries[currentProject];
  if (!images) return;
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  updateLightbox();
}

// Modal navigation listeners
lightboxCloseBtn.addEventListener('click', closeGallery);
lightboxPrevBtn.addEventListener('click', prevImage);
lightboxNextBtn.addEventListener('click', nextImage);

// Close on clicking the backdrop
galleryModal.addEventListener('click', (e) => {
  if (e.target === galleryModal) {
    closeGallery();
  }
});

// Keyboard Accessibility
document.addEventListener('keydown', (e) => {
  if (!galleryModal.classList.contains('active')) return;
  
  if (e.key === 'Escape') {
    closeGallery();
  } else if (e.key === 'ArrowRight') {
    nextImage();
  } else if (e.key === 'ArrowLeft') {
    prevImage();
  }
});

// ==========================================================================
// Contact Form Submission (FormSubmit.co API Integration)
// ==========================================================================
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Please enter your name.';
      if (value.trim().length < 2) return 'Name looks too short.';
      return '';
    },
    email: (value) => {
      if (!value.trim()) return 'Please enter your email.';
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    },
    subject: (value) => {
      if (!value.trim()) return 'Please add a subject.';
      if (value.trim().length < 3) return 'Subject looks too short.';
      return '';
    },
    message: (value) => {
      if (!value.trim()) return 'Please enter a message.';
      if (value.trim().length < 10) return 'Message should be at least 10 characters.';
      return '';
    }
  };

  function fieldFor(name) {
    return contactForm.querySelector(`[name="${name}"]`);
  }

  function validateSingle(name) {
    const field = fieldFor(name);
    const errorEl = document.getElementById(`error-${name}`);
    if (!field || !errorEl) return true;

    const message = validators[name](field.value);
    field.classList.toggle('input-invalid', !!message);
    errorEl.textContent = message;
    return !message;
  }

  function validateAll() {
    let isValid = true;
    Object.keys(validators).forEach(name => {
      if (!validateSingle(name)) isValid = false;
    });
    return isValid;
  }

  // Validate a field once it's left, and re-validate live as the user
  // corrects an already-flagged field so the error clears as soon as it's fixed.
  Object.keys(validators).forEach(name => {
    const field = fieldFor(name);
    if (!field) return;
    field.addEventListener('blur', () => validateSingle(name));
    field.addEventListener('input', () => {
      if (field.classList.contains('input-invalid')) validateSingle(name);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateAll()) {
      const firstInvalid = contactForm.querySelector('.input-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span><i data-lucide="loader"></i>';
    lucide.createIcons();

    // Prepare JSON payload
    const formData = new FormData(contactForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Web3Forms AJAX delivery
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(res => {
      if (res.success) {
        alert('Thank you! Your message has been sent successfully to trvishnuprasad1992@gmail.com.');
        contactForm.reset();
      } else {
        throw new Error(res.message || 'Submission failed');
      }
    })
    .catch(error => {
      alert('Oops! Something went wrong. Please try again or email directly to trvishnuprasad1992@gmail.com.');
      console.error('Error submitting contact form:', error);
    })
    .finally(() => {
      // Restore button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      lucide.createIcons();
    });
  });
}

// ==========================================================================
// Initialize Lucide Icons, Contact Form & Header Scroll effect
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initContactForm();
});

// Handle header transparency on scroll top
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    mainHeader.classList.add('header-glass');
  } else {
    // Keep it always styled glass for aesthetic consistency
  }
});
