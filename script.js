/* ============================================================
   富田建設工業 ホームページ — script.js
   ============================================================ */
(() => {
  'use strict';

  /* ---------- Header: scroll state + mobile nav toggle ---------- */
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  const onScroll = () => {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Gallery: filter ---------- */
  const filterButtons = document.querySelectorAll('.filter-tabs button');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const category = btn.dataset.filter;

      galleryItems.forEach((item) => {
        const match = category === 'all' || item.dataset.category === category;
        item.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Gallery: lightbox ---------- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-inner img');
  const lightboxCat = document.querySelector('.lightbox-caption .cat');
  const lightboxTtl = document.querySelector('.lightbox-caption .ttl');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  const galleryList = Array.from(galleryItems);
  let currentIndex = 0;

  function visibleItems() {
    return galleryList.filter((item) => !item.classList.contains('is-hidden'));
  }

  function openLightbox(item) {
    const items = visibleItems();
    currentIndex = items.indexOf(item);
    renderLightbox(items);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function renderLightbox(items) {
    const item = items[currentIndex];
    if (!item) return;
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCat.textContent = item.querySelector('.cat').textContent;
    lightboxTtl.textContent = item.querySelector('.ttl').textContent;
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function step(delta) {
    const items = visibleItems();
    if (!items.length) return;
    currentIndex = (currentIndex + delta + items.length) % items.length;
    renderLightbox(items);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => step(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => step(1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  /* ---------- Contact form ----------
     仕様書の指示により、メール送信機能は実装していません（フォームの見た目のみ）。
     実際の送信処理を行う場合は、下記の送信先APIやメールサービス（例：フォーム送信API、
     Google Apps Script、PHPのmail()関数など）と接続してください。
  ---------------------------------------------------------------- */
  const contactForm = document.querySelector('.contact-form');
  const formSuccess = document.querySelector('.form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      // TODO: ここに実際の送信処理（fetch等）を実装してください。
      console.log('[お問い合わせ] フォーム送信（デモ）:', Object.fromEntries(new FormData(contactForm)));

      formSuccess.classList.add('is-visible');
      contactForm.reset();
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
