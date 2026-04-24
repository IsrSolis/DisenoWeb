/* ============================================================
   DIGITAL ART FESTIVAL — MAIN JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── PAGE LOADER ─────────────────────────────────────────── */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('done'), 600);
    });
  }

  /* ── CUSTOM CURSOR ───────────────────────────────────────── */
  const cursor     = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursor && cursorRing) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left     = e.clientX + 'px';
      cursor.style.top      = e.clientY + 'px';
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top  = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .highlight-card, .org-card, .gallery-cell').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width    = '20px';
        cursor.style.height   = '20px';
        cursorRing.style.width  = '52px';
        cursorRing.style.height = '52px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width    = '12px';
        cursor.style.height   = '12px';
        cursorRing.style.width  = '36px';
        cursorRing.style.height = '36px';
      });
    });
  }

  /* ── HAMBURGER / MOBILE NAV ──────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const siteNav   = document.querySelector('.site-nav');

  if (hamburger && siteNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      siteNav.classList.toggle('open');
    });
  }

  /* ── DROPDOWN (click fallback for touch) ─────────────────── */
  document.querySelectorAll('.nav-item').forEach(item => {
    const link     = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');
    if (!dropdown) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  });

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ── ORGANIZER CAROUSEL ──────────────────────────────────── */
  const track      = document.querySelector('.carousel-track');
  const btnPrev    = document.querySelector('.carousel-btn.prev');
  const btnNext    = document.querySelector('.carousel-btn.next');
  const dots       = document.querySelectorAll('.carousel-dot');

  if (track && btnPrev && btnNext) {
    const cards       = track.querySelectorAll('.org-card');
    const totalCards  = cards.length;
    let   current     = 0;
    let   visibleCount = 3; // default desktop

    const getVisible = () => {
      if (window.innerWidth <= 768)  return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };

    const maxIndex = () => Math.max(0, totalCards - getVisible());

    const updateCarousel = () => {
      visibleCount = getVisible();
      const cardWidth  = track.parentElement.offsetWidth;
      const gapPx      = 24; // 1.5rem
      const singleW    = (cardWidth - gapPx * (visibleCount - 1)) / visibleCount;
      const offset     = current * (singleW + gapPx);
      track.style.transform = `translateX(-${offset}px)`;

      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      btnPrev.style.opacity = current === 0 ? '0.3' : '1';
      btnNext.style.opacity = current >= maxIndex() ? '0.3' : '1';
    };

    btnNext.addEventListener('click', () => {
      if (current < maxIndex()) { current++; updateCarousel(); }
    });
    btnPrev.addEventListener('click', () => {
      if (current > 0) { current--; updateCarousel(); }
    });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { current = i; updateCarousel(); });
    });

    // Touch / drag support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && current < maxIndex()) { current++; }
        else if (diff < 0 && current > 0)     { current--; }
        updateCarousel();
      }
    });

    // Auto-play
    let autoInterval = setInterval(() => {
      current = current >= maxIndex() ? 0 : current + 1;
      updateCarousel();
    }, 4500);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoInterval));
    track.parentElement.addEventListener('mouseleave', () => {
      autoInterval = setInterval(() => {
        current = current >= maxIndex() ? 0 : current + 1;
        updateCarousel();
      }, 4500);
    });

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  }

  /* ── ACTIVE NAV LINK ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });

  /* ── CONTACT FORM ────────────────────────────────────────── */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      btn.textContent = '✦ ¡Enviado!';
      btn.style.background = 'var(--white)';
      setTimeout(() => {
        btn.textContent = 'Enviar Mensaje';
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  /* ── HEADER SCROLL BEHAVIOR ──────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 50
        ? '0 4px 30px rgba(0,0,0,0.5)'
        : 'none';
    });
  }

  /* ── MARQUEE duplicate for seamless loop ─────────────────── */
  const marqueeInner = document.querySelector('.marquee-inner');
  if (marqueeInner) {
    marqueeInner.innerHTML += marqueeInner.innerHTML;
  }

});