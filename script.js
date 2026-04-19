/* ═══════════════════════════════════════════
   AARISHA — Main JavaScript
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Custom Cursor ──
  const cursor = document.getElementById('customCursor');
  let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animateCursor() {
    cursorX += (targetX - cursorX) * 0.15;
    cursorY += (targetY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .collection-card, .product-card, input, textarea');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  // Hide cursor on touch devices
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    document.documentElement.style.cursor = 'auto';
    document.body.style.cursor = 'auto';
  }

  // ── Sticky Navigation ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  });

  // ── Hamburger Menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Parallax Hero ──
  const heroParallax = document.getElementById('heroParallax');
  window.addEventListener('scroll', () => {
    if (heroParallax) {
      const offset = window.scrollY * 0.4;
      heroParallax.style.transform = `translateY(${offset}px)`;
    }
  });

  // ── Intersection Observer — Reveal Animations ──
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.children).filter(c =>
          c.classList.contains('reveal') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right')
        ) : [];
        const index = siblings.indexOf(entry.target);
        const delay = index >= 0 ? index * 150 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Generate Featured Product Cards ──
  const featuredScroll = document.getElementById('featuredScroll');
  const productImages = [
    { src: 'Earrings/WhatsApp Image 2026-04-18 at 3.00.49 PM (1).jpeg', name: 'Golden Drop Earrings' },
    { src: 'Rings/WhatsApp Image 2026-04-18 at 3.01.10 PM.jpeg', name: 'Emerald Band Ring' },
    { src: 'Bracelets/WhatsApp Image 2026-04-18 at 3.00.24 PM.jpeg', name: 'Pearl Chain Bracelet' },
    { src: 'Earrings/WhatsApp Image 2026-04-18 at 3.00.50 PM.jpeg', name: 'Crystal Stud Set' },
    { src: 'Rings/WhatsApp Image 2026-04-18 at 3.01.10 PM (1).jpeg', name: 'Vintage Rose Ring' },
    { src: 'Bracelets/WhatsApp Image 2026-04-18 at 3.00.25 PM.jpeg', name: 'Gold Cuff Bracelet' },
    { src: 'Earrings/WhatsApp Image 2026-04-18 at 3.00.51 PM.jpeg', name: 'Chandelier Drops' },
    { src: 'Rings/WhatsApp Image 2026-04-18 at 3.01.11 PM (1).jpeg', name: 'Diamond Solitaire' },
  ];

  if (featuredScroll) {
    productImages.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card reveal';
      card.innerHTML = `
        <div class="product-card-img"><img src="${p.src}" alt="${p.name}"></div>
        <div class="product-card-info">
          <h4>${p.name}</h4>
          <span class="price">₹ —</span>
        </div>`;
      featuredScroll.appendChild(card);
    });

    // Re-observe new cards
    featuredScroll.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Add hover for cursor
    featuredScroll.querySelectorAll('.product-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Drag-to-scroll
    let isDown = false, startX, scrollLeft;
    featuredScroll.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - featuredScroll.offsetLeft;
      scrollLeft = featuredScroll.scrollLeft;
    });
    featuredScroll.addEventListener('mouseleave', () => isDown = false);
    featuredScroll.addEventListener('mouseup', () => isDown = false);
    featuredScroll.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - featuredScroll.offsetLeft;
      featuredScroll.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  }

  // ── Generate Instagram Placeholders ──
  const instaGrid = document.getElementById('instaGrid');
  const instaImages = [
    'Earrings/WhatsApp Image 2026-04-18 at 3.00.49 PM.jpeg',
    'Bracelets/WhatsApp Image 2026-04-18 at 3.00.24 PM (1).jpeg',
    'Rings/WhatsApp Image 2026-04-18 at 3.01.10 PM (2).jpeg',
    'Earrings/WhatsApp Image 2026-04-18 at 3.00.50 PM (1).jpeg',
    'Bracelets/WhatsApp Image 2026-04-18 at 3.00.25 PM (1).jpeg',
  ];

  if (instaGrid) {
    instaImages.forEach(src => {
      const div = document.createElement('div');
      div.className = 'insta-placeholder reveal';
      div.innerHTML = `<img src="${src}" alt="Instagram" style="width:100%;height:100%;object-fit:cover;">`;
      instaGrid.appendChild(div);
    });
    instaGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  // ── Collection Detail Modal ──
  const collectionModal = document.getElementById('collectionModal');
  const modalBackBtn = document.getElementById('modalBackBtn');
  const modalTitle = document.getElementById('modalCategoryTitle');
  const modalGrid = document.getElementById('modalProductGrid');

  // Category product catalogs — maps each folder's images to product names & prices
  const categoryData = {
    Earrings: [
      { src: 'Earrings/WhatsApp Image 2026-04-18 at 3.00.49 PM (1).jpeg', name: 'Golden Hoop Earrings', price: '₹ 1,299' },
      { src: 'Earrings/WhatsApp Image 2026-04-18 at 3.00.49 PM.jpeg', name: 'Classic Drop Studs', price: '₹ 999' },
      { src: 'Earrings/WhatsApp Image 2026-04-18 at 3.00.50 PM (1).jpeg', name: 'Pearl Dangle Earrings', price: '₹ 1,499' },
      { src: 'Earrings/WhatsApp Image 2026-04-18 at 3.00.50 PM (2).jpeg', name: 'Emerald Chandelier Drops', price: '₹ 1,899' },
      { src: 'Earrings/WhatsApp Image 2026-04-18 at 3.00.50 PM.jpeg', name: 'Crystal Stud Set', price: '₹ 799' },
      { src: 'Earrings/WhatsApp Image 2026-04-18 at 3.00.51 PM (1).jpeg', name: 'Vintage Rose Danglers', price: '₹ 1,599' },
      { src: 'Earrings/WhatsApp Image 2026-04-18 at 3.00.51 PM (2).jpeg', name: 'Floral Jhumka Earrings', price: '₹ 1,199' },
      { src: 'Earrings/WhatsApp Image 2026-04-18 at 3.00.51 PM.jpeg', name: 'Minimalist Bar Studs', price: '₹ 699' },
    ],
    Rings: [
      { src: 'Rings/WhatsApp Image 2026-04-18 at 3.01.10 PM (1).jpeg', name: 'Vintage Rose Ring', price: '₹ 1,099' },
      { src: 'Rings/WhatsApp Image 2026-04-18 at 3.01.10 PM (2).jpeg', name: 'Dainty Stackable Band', price: '₹ 599' },
      { src: 'Rings/WhatsApp Image 2026-04-18 at 3.01.10 PM.jpeg', name: 'Emerald Solitaire Ring', price: '₹ 1,799' },
      { src: 'Rings/WhatsApp Image 2026-04-18 at 3.01.11 PM (1).jpeg', name: 'Diamond Twist Band', price: '₹ 2,199' },
      { src: 'Rings/WhatsApp Image 2026-04-18 at 3.01.11 PM (2).jpeg', name: 'Pearl Statement Ring', price: '₹ 899' },
      { src: 'Rings/WhatsApp Image 2026-04-18 at 3.01.11 PM.jpeg', name: 'Gold Signet Ring', price: '₹ 1,399' },
    ],
    Bracelets: [
      { src: 'Bracelets/WhatsApp Image 2026-04-18 at 3.00.23 PM.jpeg', name: 'Charm Chain Bracelet', price: '₹ 1,499' },
      { src: 'Bracelets/WhatsApp Image 2026-04-18 at 3.00.24 PM (1).jpeg', name: 'Pearl Cuff Bangle', price: '₹ 1,299' },
      { src: 'Bracelets/WhatsApp Image 2026-04-18 at 3.00.24 PM (2).jpeg', name: 'Twisted Gold Bangle', price: '₹ 1,699' },
      { src: 'Bracelets/WhatsApp Image 2026-04-18 at 3.00.24 PM.jpeg', name: 'Delicate Link Bracelet', price: '₹ 999' },
      { src: 'Bracelets/WhatsApp Image 2026-04-18 at 3.00.25 PM (1).jpeg', name: 'Crystal Tennis Bracelet', price: '₹ 2,499' },
      { src: 'Bracelets/WhatsApp Image 2026-04-18 at 3.00.25 PM (2).jpeg', name: 'Layered Chain Set', price: '₹ 1,899' },
      { src: 'Bracelets/WhatsApp Image 2026-04-18 at 3.00.25 PM.jpeg', name: 'Emerald Stone Cuff', price: '₹ 1,599' },
      { src: 'Bracelets/WhatsApp Image 2026-04-18 at 3.00.26 PM.jpeg', name: 'Minimalist Bar Bracelet', price: '₹ 799' },
    ],
    NeckPieces: []
  };

  const displayNames = { Earrings: 'Earrings', Rings: 'Rings', Bracelets: 'Bracelets', NeckPieces: 'Neck Pieces' };

  function openCollectionModal(category) {
    const products = categoryData[category] || [];
    const title = displayNames[category] || category;
    modalTitle.textContent = title;
    modalGrid.innerHTML = '';

    if (products.length === 0) {
      modalGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--gold);font-family:var(--font-heading);font-size:20px;font-style:italic;padding:60px 0;">Coming Soon — Stay Tuned</p>';
    } else {
      products.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'modal-product-card';
        card.style.animationDelay = `${i * 80}ms`;
        card.innerHTML = `
          <div class="modal-product-card-img"><img src="${p.src}" alt="${p.name}"></div>
          <div class="modal-product-card-info">
            <h4>${p.name}</h4>
            <span class="price">${p.price}</span>
          </div>`;
        modalGrid.appendChild(card);

        // Cursor hover
        card.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        card.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
    }

    collectionModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    collectionModal.scrollTop = 0;
  }

  function closeCollectionModal() {
    collectionModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Attach click to collection cards
  document.querySelectorAll('.collection-card[data-category]').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      openCollectionModal(cat);
    });
  });

  modalBackBtn.addEventListener('click', closeCollectionModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && collectionModal.classList.contains('open')) {
      closeCollectionModal();
    }
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
