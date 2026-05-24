// ==========================================================================
// Theme Toggling Logic
// ==========================================================================
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

// Set initial theme
if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);
} else {
  // If no saved theme, check system settings
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
}

// Toggle Theme on button click
themeToggleBtn.addEventListener('click', () => {
  let theme = document.documentElement.getAttribute('data-theme');
  let newTheme = theme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// ==========================================================================
// Mobile Navigation Toggle Menu
// ==========================================================================
const mainHeader = document.getElementById('main-header');
const mobileToggleBtn = document.getElementById('mobile-toggle');
const navLinks = document.querySelectorAll('.nav-link');

mobileToggleBtn.addEventListener('click', () => {
  mainHeader.classList.toggle('nav-open');
  const isOpen = mainHeader.classList.contains('nav-open');
  
  // Toggle between menu and close icon
  const icon = mobileToggleBtn.querySelector('i');
  if (isOpen) {
    icon.setAttribute('data-lucide', 'x');
  } else {
    icon.setAttribute('data-lucide', 'menu');
  }
  lucide.createIcons(); // Re-render Lucide icons
});

// Close mobile navigation menu on clicking a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mainHeader.classList.remove('nav-open');
    const icon = mobileToggleBtn.querySelector('i');
    icon.setAttribute('data-lucide', 'menu');
    lucide.createIcons();
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
  card.addEventListener('click', () => {
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
// Initialize Lucide Icons & Header Scroll effect
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});

// Handle header transparency on scroll top
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    mainHeader.classList.add('header-glass');
  } else {
    // Keep it always styled glass for aesthetic consistency or toggle background
    // We will keep it header-glass since it matches the layout, but we can darken border
  }
});
