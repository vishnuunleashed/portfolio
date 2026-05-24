

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
// Micro-interaction: Swap Hero Mockup Image based on Project Clicked
// ==========================================================================
const projectCards = document.querySelectorAll('.project-card');
const heroMockupImg = document.getElementById('hero-mockup-img');

projectCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // If the click is inside a link or button (e.g. Play Store button), ignore it
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }

    const cardImgSrc = card.querySelector('.project-image img').getAttribute('src');
    
    // Add smooth fading transition to swap
    heroMockupImg.style.opacity = 0;
    heroMockupImg.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      heroMockupImg.setAttribute('src', cardImgSrc);
      heroMockupImg.style.opacity = 1;
      heroMockupImg.style.transform = 'scale(1)';
    }, 200);
    
    // Smoothly scroll back to Hero section if on desktop so they can see it swap
    if (window.innerWidth > 768) {
      document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ==========================================================================
// Project Screenshot Gallery Lightbox Modal
// ==========================================================================
const projectGalleries = {
  eorder: [
    'assets/images/eorder/1.webp',
    'assets/images/eorder/2.webp',
    'assets/images/eorder/3.webp',
    'assets/images/eorder/4.webp',
    'assets/images/eorder/5.webp'
  ],
  bmet_check: [
    'assets/images/bmet_check/1.webp',
    'assets/images/bmet_check/2.webp',
    'assets/images/bmet_check/3.webp',
    'assets/images/bmet_check/4.webp',
    'assets/images/bmet_check/5.webp',
    'assets/images/bmet_check/6.webp'
  ],
  cybernet_it: [
    'assets/images/cybernet_it/1.webp',
    'assets/images/cybernet_it/2.webp',
    'assets/images/cybernet_it/3.webp',
    'assets/images/cybernet_it/4.webp',
    'assets/images/cybernet_it/5.webp',
    'assets/images/cybernet_it/6.webp'
  ],
  cybernet_agro: [
    'assets/images/cybernet_agro/1.webp',
    'assets/images/cybernet_agro/2.webp',
    'assets/images/cybernet_agro/3.webp'
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
// Projects Carousel Slider Logic
// ==========================================================================
function initProjectsCarousel() {
  const track = document.getElementById('projects-track');
  const prevBtn = document.getElementById('projects-prev');
  const nextBtn = document.getElementById('projects-next');
  const dotsContainer = document.getElementById('projects-dots');
  const cards = Array.from(track.children);
  
  if (!track || !prevBtn || !nextBtn || !dotsContainer || !cards.length) return;
  
  let currentIndex = 0;
  
  // Calculate items per view based on window width
  function getItemsPerView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }
  
  function getMaxIndex() {
    return Math.max(0, cards.length - getItemsPerView());
  }
  
  function updateCarousel() {
    const itemsPerView = getItemsPerView();
    
    // Safety check for index out of bounds on resize
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) {
      currentIndex = maxIdx;
    }
    
    // Calculate slide percentage based on gap (24px)
    const cardWidth = cards[0].getBoundingClientRect().width;
    const offset = currentIndex * (cardWidth + 24); // card width + gap
    
    track.style.transform = `translateX(-${offset}px)`;
    
    // Update nav button disabled state
    prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    
    nextBtn.style.opacity = currentIndex === maxIdx ? '0.3' : '1';
    nextBtn.style.pointerEvents = currentIndex === maxIdx ? 'none' : 'auto';
    
    // Update dots
    const dots = Array.from(dotsContainer.children);
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }
  
  // Render pagination dots
  function renderDots() {
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    
    // Only render dots if there's actually a need to scroll
    if (maxIdx <= 0) return;
    
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    }
  }
  
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    const maxIdx = getMaxIndex();
    if (currentIndex < maxIdx) {
      currentIndex++;
      updateCarousel();
    }
  });
  
  // Responsive resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      renderDots();
      updateCarousel();
    }, 100);
  });
  
  // Initialize
  renderDots();
  updateCarousel();
}

// ==========================================================================
// Contact Form Submission (FormSubmit.co API Integration)
// ==========================================================================
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

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
// Initialize Lucide Icons, Carousel, Contact Form & Header Scroll effect
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initProjectsCarousel();
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
