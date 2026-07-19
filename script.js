/* ═══════════════════════════════════════════
   AARISHA — Main JavaScript
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = ['127.0.0.1', 'localhost'].includes(location.hostname) ? 'http://127.0.0.1:8000' : `${location.origin}/api`;
  document.addEventListener('error', event => {
    const image = event.target;
    if (image.tagName === 'IMG' && !image.src.endsWith('/placeholder.svg')) image.src = 'placeholder.svg';
  }, true);

  // ── Custom Cursor ──
  // ── Sticky Navigation ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
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
  if (featuredScroll) {
    fetch(`${API_BASE_URL}/products`)
      .then(response => response.ok ? response.json() : [])
      .then(products => products.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = 'product-card reveal';
      card.style.animationDelay = `${index * 80}ms`;
      card.innerHTML = `
        <div class="product-card-img"><img src="${product.image_url}" alt="${product.name}"></div>
        <div class="product-card-info">
          <h4>${product.name}</h4>
          <span class="price">₹ ${Number(product.price).toLocaleString('en-IN')}</span>
        </div>`;
      featuredScroll.appendChild(card);
      revealObserver.observe(card);
    }))
      .catch(() => {});

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
  instaImages.fill('placeholder.svg');

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
  const CART_STORAGE_KEY = 'aarisha-cart-v1';
  const apiCategories = { Earrings: 'earrings', Rings: 'rings', Bracelets: 'bracelets', NeckPieces: 'necklaces' };
  let cart = JSON.parse(sessionStorage.getItem(CART_STORAGE_KEY) || '[]');

  const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(value));
  const priceNumber = value => typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.]/g, '')) || 0;
  const productKey = product => String(product.id || product.src || product.name);

  function saveCart() {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    renderCart();
  }

  function addToCart(product) {
    const normalized = { id: productKey(product), serverProductId: product.id || null, name: product.name, price: priceNumber(product.price), src: product.image_url || product.src };
    const existing = cart.find(item => item.id === normalized.id);
    existing ? existing.quantity += 1 : cart.push({ ...normalized, quantity: 1 });
    saveCart();
  }

  function renderCart() {
    const items = document.getElementById('cartItems');
    const count = document.getElementById('cartCount');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    count.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartTotal').textContent = money(total);
    items.innerHTML = cart.length ? cart.map(item => `<article class="cart-item"><img src="${item.src}" alt="${item.name}"><div><h3>${item.name}</h3><p>${money(item.price)}</p><div class="cart-quantity"><button type="button" data-cart-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-cart-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button></div></div><button class="cart-remove" type="button" data-cart-action="remove" data-id="${item.id}" aria-label="Remove ${item.name}">&times;</button></article>`).join('') : '<p class="cart-empty">Your bag is waiting for a little sparkle.</p>';
  }

  function setCartOpen(open) {
    document.getElementById('cartDrawer').classList.toggle('open', open);
    document.getElementById('cartScrim').classList.toggle('open', open);
    document.getElementById('cartDrawer').setAttribute('aria-hidden', String(!open));
  }

  document.getElementById('cartToggle').addEventListener('click', () => setCartOpen(true));
  document.getElementById('cartClose').addEventListener('click', () => setCartOpen(false));
  document.getElementById('cartScrim').addEventListener('click', () => setCartOpen(false));
  document.getElementById('cartItems').addEventListener('click', event => {
    const button = event.target.closest('[data-cart-action]');
    if (!button) return;
    const item = cart.find(entry => entry.id === button.dataset.id);
    if (!item) return;
    if (button.dataset.cartAction === 'increase') item.quantity += 1;
    if (button.dataset.cartAction === 'decrease') item.quantity -= 1;
    if (button.dataset.cartAction === 'remove' || item.quantity < 1) cart = cart.filter(entry => entry.id !== item.id);
    saveCart();
  });
  document.getElementById('whatsappOrder').addEventListener('click', async () => {
    if (!cart.length) return;
    if (cart.some(item => !item.serverProductId)) return alert('Connect the catalogue API before ordering on WhatsApp.');
    try {
      const response = await fetch(`${API_BASE_URL}/orders/whatsapp-link`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart.map(item => ({ product_id: item.serverProductId, quantity: item.quantity })) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Unable to create WhatsApp order link.');
      window.open(data.url, '_blank', 'noopener');
    } catch (error) { alert(error.message); }
  });
  renderCart();

  const displayNames = { Earrings: 'Earrings', Rings: 'Rings', Bracelets: 'Bracelets', NeckPieces: 'Neck Pieces' };

  async function openCollectionModal(category) {
    let products = [];
    const title = displayNames[category] || category;
    modalTitle.textContent = title;
    modalGrid.innerHTML = '';

    try {
      const response = await fetch(`${API_BASE_URL}/products/${apiCategories[category]}`);
      if (!response.ok) throw new Error('Unable to load products.');
      products = (await response.json()).map(product => ({ ...product, src: product.image_url, price: money(product.price) }));
    } catch (_) {}

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
        const addButton = document.createElement('button');
        addButton.className = 'add-to-cart';
        addButton.type = 'button';
        addButton.textContent = p.in_stock === false ? 'Out of Stock' : 'Add to Bag';
        addButton.disabled = p.in_stock === false;
        addButton.addEventListener('click', () => addToCart(p));
        card.appendChild(addButton);
        modalGrid.appendChild(card);

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
