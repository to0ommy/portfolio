// Progressive enhancements: the pages and project links work without JavaScript.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
}
menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation?.classList.toggle('is-open', !isOpen);
});
navigation?.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});

const filterBar = document.querySelector('.project-filters');
if (filterBar) {
  filterBar.hidden = false;
  const cards = [...document.querySelectorAll('.project-card')];
  const count = document.querySelector('.project-count');
  filterBar.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    const category = button.dataset.filter;
    filterBar.querySelectorAll('button').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    cards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
    });
    const visibleCount = cards.filter(card => !card.hidden).length;
    count.textContent = `${String(visibleCount).padStart(2, '0')} projects`;
  });
}

const copyButton = document.querySelector('[data-copy-email]');
if (copyButton && navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  let resetTimer;
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    clearTimeout(resetTimer);
    try {
      await navigator.clipboard.writeText('jili.you@mail.utoronto.ca');
      status.textContent = 'Email copied!';
    } catch {
      status.textContent = 'Please select the email address to copy it.';
    }
    resetTimer = setTimeout(() => { status.textContent = ''; }, 4500);
  });
}
document.querySelectorAll('[data-year]').forEach(item => {
  item.textContent = new Date().getFullYear();
});

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.06 });
  document.querySelectorAll('[data-reveal]').forEach(item => {
    item.classList.add('will-reveal');
    observer.observe(item);
  });
}
