// Menu item images: set src from dish name (slug) and hide if image missing
function slugFromText(text) {
  return (text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'placeholder';
}
document.querySelectorAll('.menu-item').forEach(function (item) {
  var h4 = item.querySelector('h4');
  var img = item.querySelector('.menu-item-img');
  if (!h4 || !img) return;
  var slug = slugFromText(h4.textContent);
  img.src = 'assets/menu/' + slug + '.jpg';
  img.alt = h4.textContent.trim();
  img.onerror = function () {
    img.classList.add('menu-item-img--missing');
  };
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect: add .scrolled for shadow (CSS handles style)
var header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.pageYOffset > 20);
    });
}

// Mobile menu toggle
var navToggle = document.getElementById('nav-toggle');
var navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
        var open = navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });
    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

