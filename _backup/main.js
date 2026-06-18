document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let cart = JSON.parse(localStorage.getItem('purplebite_cart')) || [];
  
  // --- DATABASE / PRODUCTS DATA ---
  const productsData = [
    {
      id: 'p1',
      name: 'Purple Sweet Potato Roll Cake',
      desc: 'Bolu gulung ubi ungu super lembut dengan isian krim vanila premium.',
      price: 45000,
      image: 'images/product_roll_cake.png',
      category: 'cake',
      badge: 'Terlaris'
    },
    {
      id: 'p2',
      name: 'Gourmet Purple Brownies',
      desc: 'Brownies panggang dengan tekstur fudgy dan rasa ubi ungu manis alami yang khas.',
      price: 38000,
      image: 'images/product_brownies.png',
      category: 'brownies',
      badge: 'Premium'
    },
    {
      id: 'p3',
      name: 'Crispy Ubi Ungu Chips',
      desc: 'Keripik ubi ungu renyah bebas pengawet, cemilan sehat kaya serat untuk menemani hari Anda.',
      price: 18000,
      image: 'images/product_chips.png',
      category: 'snack',
      badge: 'Sehat'
    },
    {
      id: 'p4',
      name: 'Purple Taro Premium Latte',
      desc: 'Minuman latte creamy perpaduan taro alami dan ekstrak ubi ungu segar.',
      price: 22000,
      image: 'images/product_roll_cake.png', // Fallback to roll cake or standard if latte generation is cancelled
      category: 'beverage',
      badge: 'Segar'
    }
  ];

  // --- CONFIG ---
  const WHATSAPP_NUMBER = '628123456789'; // Dummy WhatsApp business number

  // --- CORE UI SELECTORS ---
  const header = document.querySelector('header');
  const cartBadge = document.querySelector('.cart-badge');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartItemsList = document.querySelector('.cart-items-list');
  const cartTotalVal = document.getElementById('cartTotalVal');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartOpenBtn = document.getElementById('cartOpenBtn');

  // --- STICKY NAV ON SCROLL ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- NAV ACTIVE PAGE ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- CART FUNCTIONS ---
  const saveCart = () => {
    localStorage.setItem('purplebite_cart', JSON.stringify(cart));
    updateCartUI();
  };

  const updateCartUI = () => {
    // 1. Update Badges
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) {
      cartBadge.textContent = totalQty;
      cartBadge.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    // 2. Render Drawer
    if (cartItemsList) {
      cartItemsList.innerHTML = '';
      if (cart.length === 0) {
        cartItemsList.innerHTML = `
          <div class="cart-empty-message">
            <svg style="margin: 0 auto 1rem; color: var(--color-primary); width: 48px; height: 48px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <p>Keranjang belanja masih kosong.</p>
          </div>
        `;
        if (cartTotalVal) cartTotalVal.textContent = 'Rp 0';
      } else {
        let total = 0;
        cart.forEach(item => {
          const subtotal = item.price * item.qty;
          total += subtotal;

          const itemEl = document.createElement('div');
          itemEl.className = 'cart-item';
          itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <h4 class="cart-item-name">${item.name}</h4>
              <p class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</p>
              <div class="cart-item-qty">
                <button class="qty-btn dec-qty" data-id="${item.id}">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn inc-qty" data-id="${item.id}">+</button>
              </div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">Hapus</button>
          `;
          cartItemsList.appendChild(itemEl);
        });
        if (cartTotalVal) cartTotalVal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
      }
    }

    // 3. Update Delivery Page checkout lists if present
    updateCheckoutUI();
  };

  // --- DRAWER OPEN/CLOSE EVENT LISTENERS ---
  const toggleDrawer = (open) => {
    if (cartDrawer && cartOverlay) {
      if (open) {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
      } else {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
      }
    }
  };

  if (cartOpenBtn) cartOpenBtn.addEventListener('click', () => toggleDrawer(true));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => toggleDrawer(false));
  if (cartOverlay) cartOverlay.addEventListener('click', () => toggleDrawer(false));

  // --- EVENT DELEGATION IN DRAWER ---
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;

      if (e.target.classList.contains('inc-qty')) {
        const item = cart.find(x => x.id === id);
        if (item) item.qty++;
        saveCart();
      } else if (e.target.classList.contains('dec-qty')) {
        const item = cart.find(x => x.id === id);
        if (item) {
          item.qty--;
          if (item.qty <= 0) {
            cart = cart.filter(x => x.id !== id);
          }
          saveCart();
        }
      } else if (e.target.classList.contains('cart-item-remove')) {
        cart = cart.filter(x => x.id !== id);
        saveCart();
      }
    });
  }

  // --- ADD TO CART ACTION ---
  window.addToCart = (productId) => {
    const product = productsData.find(x => x.id === productId);
    if (!product) return;

    const existing = cart.find(x => x.id === productId);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
      });
    }
    saveCart();
    toggleDrawer(true);
  };

  // --- PRODUCTS PAGE SEARCH & FILTER ---
  const catalogGrid = document.getElementById('catalogGrid');
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let activeCategory = 'all';
  let searchQuery = '';

  const renderCatalog = () => {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';

    const filtered = productsData.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--color-text);">
          <svg style="margin: 0 auto 1rem; color: var(--color-primary); width: 48px; height: 48px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3>Produk tidak ditemukan</h3>
          <p>Coba gunakan kata kunci pencarian yang lain.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card animate-fade-in';
      card.innerHTML = `
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
        <div class="product-img-container">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-footer">
            <span class="product-price">Rp ${product.price.toLocaleString('id-ID')}</span>
            <button class="product-btn" onclick="addToCart('${product.id}')" aria-label="Tambah ke keranjang">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
      catalogGrid.appendChild(card);
    });
  };

  // Search input change handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Category filter handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.getAttribute('data-category');
      renderCatalog();
    });
  });

  // Run catalog render on load
  renderCatalog();


  // --- DELIVERY & CHECKOUT PAGE LOGIC ---
  const checkoutItems = document.getElementById('checkoutItems');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryDelivery = document.getElementById('summaryDelivery');
  const summaryTotal = document.getElementById('summaryTotal');
  const checkoutForm = document.getElementById('checkoutForm');
  const paymentLabels = document.querySelectorAll('.payment-radio-label');

  // Set default checkout values
  const deliveryFee = 15000;

  function updateCheckoutUI() {
    if (!checkoutItems) return;
    checkoutItems.innerHTML = '';

    if (cart.length === 0) {
      checkoutItems.innerHTML = `
        <p style="text-align: center; color: var(--color-text); padding: 1.5rem 0;">Keranjang belanja Anda kosong.</p>
      `;
      if (summarySubtotal) summarySubtotal.textContent = 'Rp 0';
      if (summaryDelivery) summaryDelivery.textContent = 'Rp 0';
      if (summaryTotal) summaryTotal.textContent = 'Rp 0';
      return;
    }

    let subtotal = 0;
    cart.forEach(item => {
      const itemPriceTotal = item.price * item.qty;
      subtotal += itemPriceTotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'checkout-summary-item';
      itemEl.innerHTML = `
        <span>${item.name} <strong>x${item.qty}</strong></span>
        <span>Rp ${itemPriceTotal.toLocaleString('id-ID')}</span>
      `;
      checkoutItems.appendChild(itemEl);
    });

    const total = subtotal + deliveryFee;

    if (summarySubtotal) summarySubtotal.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    if (summaryDelivery) summaryDelivery.textContent = `Rp ${deliveryFee.toLocaleString('id-ID')}`;
    if (summaryTotal) summaryTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
  }

  // Payment Option selection style toggling
  paymentLabels.forEach(label => {
    label.addEventListener('click', (e) => {
      paymentLabels.forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
    });
  });

  // Handle Checkout Submit (Redirect to WhatsApp)
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        alert('Keranjang Anda kosong! Silakan pilih produk terlebih dahulu.');
        return;
      }

      // Collect customer details
      const name = document.getElementById('checkoutName').value;
      const phone = document.getElementById('checkoutPhone').value;
      const address = document.getElementById('checkoutAddress').value;
      const notes = document.getElementById('checkoutNotes').value || 'Tidak ada';
      
      const paymentInput = document.querySelector('input[name="payment_method"]:checked');
      const paymentMethod = paymentInput ? paymentInput.value.toUpperCase() : 'COD';

      // Format Items Message
      let itemsMessage = '';
      let subtotal = 0;
      cart.forEach((item, idx) => {
        const cost = item.price * item.qty;
        subtotal += cost;
        itemsMessage += `${idx + 1}. ${item.name} (x${item.qty}) - Rp ${cost.toLocaleString('id-ID')}\n`;
      });

      const total = subtotal + deliveryFee;

      // Construct final WhatsApp Message
      const waMessage = `*Pemesanan Baru - PurpleBite*\n\n` +
                        `*Data Pelanggan:*\n` +
                        `Nama: ${name}\n` +
                        `Telepon: ${phone}\n` +
                        `Alamat Pengiriman:\n${address}\n\n` +
                        `*Rincian Pesanan:*\n` +
                        `${itemsMessage}\n` +
                        `Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n` +
                        `Ongkos Kirim: Rp ${deliveryFee.toLocaleString('id-ID')}\n` +
                        `*Total Bayar: Rp ${total.toLocaleString('id-ID')}*\n\n` +
                        `*Metode Pembayaran:* ${paymentMethod}\n` +
                        `*Catatan:* ${notes}\n\n` +
                        `Terima kasih! Mohon segera konfirmasi pesanan saya.`;

      // URL encode message and redirect
      const encodedMessage = encodeURIComponent(waMessage);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
      
      // Clear Cart
      cart = [];
      saveCart();

      // Open WA link
      window.open(whatsappUrl, '_blank');
    });
  }


  // --- CONTACT FORM LOGIC ---
  const contactForm = document.getElementById('contactForm');
  const successAlert = document.getElementById('successAlert');

  if (contactForm && successAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic input verification
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const message = document.getElementById('contactMessage').value;

      if (!name || !email || !message) {
        return;
      }

      // Show success alert
      successAlert.style.display = 'block';
      successAlert.textContent = `Terima kasih, ${name}! Pesan Anda telah terkirim.`;
      
      // Reset Form
      contactForm.reset();

      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 5000);
    });
  }


  // --- WHATSAPP FLOATING BUTTON CLICK HANDLER ---
  const waFloatingBtn = document.getElementById('waFloatingBtn');
  if (waFloatingBtn) {
    waFloatingBtn.addEventListener('click', () => {
      const defaultMessage = encodeURIComponent('Halo PurpleBite! Saya tertarik dengan produk ubi ungu Anda.');
      window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${defaultMessage}`, '_blank');
    });
  }

  // --- INITIALIZE PAGE ---
  updateCartUI();
});
