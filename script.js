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

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    }
    
    lastScroll = currentScroll;
});

