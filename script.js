/* =========================================================
   Terasiri Delight — script.js
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  var header      = document.getElementById('siteHeader');
  var nav         = document.getElementById('nav');
  var navToggle   = document.getElementById('navToggle');
  var navBackdrop = document.getElementById('navBackdrop');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0. Page-load sequence, year, logo fallback ---------- */
  document.body.classList.add('is-ready');

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var brandLogo = document.getElementById('brandLogo');
  if (brandLogo) {
    brandLogo.addEventListener('error', function () { brandLogo.remove(); });
    if (brandLogo.complete && brandLogo.naturalWidth === 0) brandLogo.remove();
  }

  /* ---------- 1. Mobile menu ---------- */
  function openNav() {
    nav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    navBackdrop.hidden = false;
    document.body.classList.add('is-locked');
  }
  function closeNav() {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    navBackdrop.hidden = true;
    document.body.classList.remove('is-locked');
  }
  function isNavOpen() { return nav.classList.contains('is-open'); }

  navToggle.addEventListener('click', function () { isNavOpen() ? closeNav() : openNav(); });
  navBackdrop.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isNavOpen()) { closeNav(); navToggle.focus(); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 880 && isNavOpen()) closeNav();
  });

  /* ---------- 2. Smooth scrolling with fixed-header offset ---------- */
  function headerHeight() { return header ? header.getBoundingClientRect().height : 0; }

  document.querySelectorAll('a[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      if (isNavOpen()) closeNav();

      var offset = (id === '#home') ? 0 : headerHeight() - 1;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top < 0 ? 0 : top, behavior: reduceMotion ? 'auto' : 'smooth' });

      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  /* ---------- 3. Header state + back to top ---------- */
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 40);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 4. Active link tracking ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (l) {
      l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 5. Scroll reveal ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    revealItems.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 6. Category filtering ---------- */
  var filters    = document.querySelectorAll('.filter');
  var cards      = document.querySelectorAll('#productGrid .card');
  var emptyState = document.getElementById('emptyState');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-filter');

      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      var shown = 0;
      cards.forEach(function (card) {
        var match = (value === 'all') || card.getAttribute('data-category') === value;
        card.classList.toggle('is-hidden', !match);
        if (match) {
          shown++;
          if (!reduceMotion) {
            card.style.animation = 'none';
            void card.offsetWidth;
            card.style.animation = 'rise .45s cubic-bezier(.22,.68,.36,1) forwards';
          }
        }
      });

      if (emptyState) emptyState.hidden = shown !== 0;
    });
  });

  /* ---------- 7. Missing image fallbacks ---------- */
  document.querySelectorAll('.card-media img').forEach(function (img) {
    function fail() { img.parentElement.classList.add('no-image'); }
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  document.querySelectorAll('.gallery-item img').forEach(function (img) {
    function fail() { img.closest('.gallery-item').classList.add('is-broken'); }
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------- 8. Gallery lightbox ---------- */
  var lightbox  = document.getElementById('lightbox');
  var lbImage   = document.getElementById('lbImage');
  var lbCaption = document.getElementById('lbCaption');
  var lbClose   = document.getElementById('lbClose');
  var lbPrev    = document.getElementById('lbPrev');
  var lbNext    = document.getElementById('lbNext');
  var galleryBtns = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var currentIndex = 0;
  var lastFocused = null;

  function visibleItems() {
    return galleryBtns.filter(function (b) { return !b.classList.contains('is-broken'); });
  }

  function showImage(index) {
    var items = visibleItems();
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    var img = items[currentIndex].querySelector('img');
    lbImage.src = img.getAttribute('src');
    lbImage.alt = img.getAttribute('alt') || '';
    lbCaption.textContent = img.getAttribute('alt') || '';
  }

  function openLightbox(btn) {
    lastFocused = document.activeElement;
    showImage(visibleItems().indexOf(btn));
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    lbImage.src = '';
    document.body.classList.remove('is-locked');
    if (lastFocused) lastFocused.focus();
  }

  galleryBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { openLightbox(btn); });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', function () { showImage(currentIndex - 1); });
  if (lbNext)  lbNext.addEventListener('click', function () { showImage(currentIndex + 1); });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  /* ---------- 9. Contact form validation (front-end only) ---------- */
  var form        = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  var resetBtn    = document.getElementById('resetForm');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function setError(input, message) {
    var field = input.closest('.field');
    var box   = field.querySelector('.error');
    field.classList.toggle('has-error', Boolean(message));
    box.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateField(input) {
    var value = input.value.trim();

    if (input.id === 'name') {
      if (!value)           { setError(input, 'Enter your name.'); return false; }
      if (value.length < 2) { setError(input, 'Name looks too short.'); return false; }
    }

    if (input.id === 'phone') {
      var digits = value.replace(/\D/g, '');
      if (!value) { setError(input, 'Enter a contact number.'); return false; }
      if (digits.length < 10 || digits.length > 13) {
        setError(input, 'Enter a valid contact number.'); return false;
      }
    }

    if (input.id === 'email') {
      if (!value)                    { setError(input, 'Enter your email address.'); return false; }
      if (!emailPattern.test(value)) { setError(input, 'Enter a valid email address.'); return false; }
    }

    if (input.id === 'message' && value.length > 800) {
      setError(input, 'Keep the message under 800 characters.'); return false;
    }

    setError(input, '');
    return true;
  }

  if (form) {
    var inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('has-error')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      inputs.forEach(function (input) {
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      form.hidden = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      form.reset();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      formSuccess.hidden = true;
      form.hidden = false;
      form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('has-error'); });
      form.querySelectorAll('.error').forEach(function (er) { er.textContent = ''; });
      form.querySelector('#name').focus();
    });
  }

});