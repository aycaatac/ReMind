/* ReMind — site behaviour
   Tiny, dependency-free. Progressive enhancement only.
   ------------------------------------------------------------------- */
(() => {
  'use strict';

  // 1. Bridge data-delay attributes onto a CSS variable, so the load-time
  //    animations can be staggered without per-element CSS.
  const delayed = document.querySelectorAll('[data-delay]');
  delayed.forEach((el) => {
    el.style.setProperty('--d', `${el.dataset.delay}ms`);
  });

  // 2. Sticky nav: add a thin border once the page has scrolled past the hero.
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 3. Reveal-on-scroll for elements marked `.reveal-up`.
  //    Uses IntersectionObserver, falls back to immediate visibility.
  const targets = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window && targets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('is-visible'));
  }

  // 4. Smooth in-page anchors that respect the sticky nav height.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    });
  });
})();
