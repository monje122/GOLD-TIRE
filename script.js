/* ============================================================
   Gold Tire 07 – JavaScript (Catalog, Cart & Admin Panel)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ---- Mobile menu toggle ----
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const navClose  = document.getElementById('navClose');
  const navBackdrop = document.getElementById('navBackdrop');

  const openMobileMenu = () => {
    hamburger.classList.add('active');
    navLinks.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (navClose) navClose.addEventListener('click', closeMobileMenu);
  if (navBackdrop) navBackdrop.addEventListener('click', closeMobileMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ---- Scroll animations (IntersectionObserver) ----
  const animatedEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedEls.forEach(el => observer.observe(el));

  // ---- Counter animation ----
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        let current = 0;
        const increment = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = current.toLocaleString() + '+';
        }, 30);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ---- Hero floating particles ----
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '-10px';
      p.style.animationDelay = Math.random() * 6 + 's';
      p.style.animationDuration = (4 + Math.random() * 4) + 's';
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      particlesContainer.appendChild(p);
    }
  }

  // ============================================================
  // ---- DYNAMIC PRODUCT CATALOG & PERSISTENCE ----
  // ============================================================
  const defaultProducts = [
    {
      id: 'caucho-sedan-185-65r15',
      name: 'Caucho Sedán 185/65R15',
      category: 'sedan',
      categoryLabel: 'Sedán',
      badge: 'Popular',
      image: 'images/product1.jpg',
      description: 'Ideal para vehículos de pasajeros. Excelente agarre en pavimento seco y mojado, durabilidad superior.',
      feature1: 'Pavimento',
      feature2: 'Rendimiento',
      requestedCount: 14
    },
    {
      id: 'caucho-suv-235-70r16',
      name: 'Caucho SUV 235/70R16',
      category: 'suv',
      categoryLabel: 'SUV',
      badge: 'Oferta',
      image: 'images/product2.jpg',
      description: 'Diseñado para camionetas y SUVs. Máxima tracción en todo terreno, resistencia contra impactos.',
      feature1: 'Todo terreno',
      feature2: 'Durabilidad',
      requestedCount: 9
    },
    {
      id: 'caucho-offroad-265-75r16',
      name: 'Caucho Off-Road 265/75R16',
      category: 'suv',
      categoryLabel: 'Off-Road',
      badge: '',
      image: 'images/bronco.jpg',
      description: 'Para los más aventureros. Tacos reforzados para barro, arena y rocas con máxima durabilidad.',
      feature1: 'Off-Road',
      feature2: 'Resistencia',
      requestedCount: 18
    },
    {
      id: 'caucho-deportivo-225-45r17',
      name: 'Caucho Deportivo 225/45R17',
      category: 'deportivo',
      categoryLabel: 'Deportivo',
      badge: 'Nuevo',
      image: 'images/product4.jpg',
      description: 'Perfil bajo para máximo rendimiento en curvas. Diseñado para alta velocidad, estabilidad y precisión.',
      feature1: 'Velocidad',
      feature2: 'Precisión',
      requestedCount: 6
    },
    {
      id: 'bateria-duncan-1150',
      name: 'Batería Duncan 1150 (Sellada)',
      category: 'baterias',
      categoryLabel: 'Batería',
      badge: 'Duncan Oficial',
      image: 'images/bateria-duncan.png',
      description: 'Máxima potencia de arranque y tecnología de punta. Libre de mantenimiento. Para camionetas, SUVs y vehículos de alto consumo eléctrico.',
      feature1: '1150 Amperios',
      feature2: 'Garantía Duncan',
      requestedCount: 22
    }
  ];

  let products = [];
  try {
    const saved = localStorage.getItem('gold_tire_products');
    if (saved) {
      products = JSON.parse(saved);
    } else {
      products = defaultProducts;
      localStorage.setItem('gold_tire_products', JSON.stringify(products));
    }
  } catch (e) {
    products = defaultProducts;
  }

  const saveProducts = () => {
    try {
      localStorage.setItem('gold_tire_products', JSON.stringify(products));
    } catch (e) {}
  };

  let currentFilter = 'all';

  const renderCatalogProducts = () => {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const filtered = currentFilter === 'all'
      ? products
      : products.filter(p => p.category === currentFilter);

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #888;">
          <i class="fas fa-box-open" style="font-size: 2.5rem; margin-bottom: 12px; color: #d4a437;"></i>
          <p>No hay productos en esta categoría actualmente.</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(p => {
      const isDuncan = p.category === 'baterias' || (p.badge && p.badge.toLowerCase().includes('duncan'));
      const badgeHTML = p.badge
        ? `<div class="product-badge ${isDuncan ? 'duncan-badge' : (p.badge.toLowerCase() === 'oferta' ? 'sale' : (p.badge.toLowerCase() === 'nuevo' ? 'new' : ''))}">${isDuncan ? '<i class="fas fa-bolt"></i> ' : ''}${p.badge}</div>`
        : '';
      const imgWrapperClass = isDuncan ? 'product-image battery-image-wrapper' : 'product-image';

      html += `
        <div class="product-card" data-category="${p.category}">
          ${badgeHTML}
          <div class="${imgWrapperClass}">
            <img src="${p.image}" alt="${p.name}" />
          </div>
          <div class="product-info">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="product-features">
              ${p.feature1 ? `<span><i class="fas fa-check-circle gold"></i> ${p.feature1}</span>` : ''}
              ${p.feature2 ? `<span><i class="fas fa-shield-alt gold"></i> ${p.feature2}</span>` : ''}
            </div>
            <div class="product-actions">
              <button class="btn btn-gold btn-block add-to-cart-btn"
                      data-id="${p.id}"
                      data-name="${p.name}"
                      data-category="${p.categoryLabel || p.category}"
                      data-image="${p.image}">
                <i class="fas fa-cart-plus"></i> Agregar al Carrito
              </button>
              <a href="https://wa.me/584244961600?text=Hola%20Gold%20Tire%2007%2C%20quisiera%20consultar%20disponibilidad%20y%20precio%20de%3A%20${encodeURIComponent(p.name)}" 
                 target="_blank" class="btn-direct-wa" data-id="${p.id}">
                <i class="fab fa-whatsapp"></i> Consultar directo
              </a>
            </div>
          </div>
        </div>
      `;
    });

    productsGrid.innerHTML = html;
    attachProductCardEvents();
  };

  // Filter tabs click
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderCatalogProducts();
    });
  });

  // ============================================================
  // ---- CART LOGIC (WHATSAPP QUOTE CART) ----
  // ============================================================
  const navCartBadge = document.getElementById('navCartBadge');
  const floatingCartBadge = document.getElementById('floatingCartBadge');
  const cartSummaryCount = document.getElementById('cartSummaryCount');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
  const cartDrawerBody = document.getElementById('cartDrawerBody');
  const openCartBtn = document.getElementById('openCartBtn');
  const floatingCartBtn = document.getElementById('floatingCartBtn');
  const closeCartDrawerBtn = document.getElementById('closeCartDrawerBtn');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const sendWhatsAppOrderBtn = document.getElementById('sendWhatsAppOrderBtn');
  const cartToast = document.getElementById('cartToast');
  const cartToastText = document.getElementById('cartToastText');

  let cart = [];
  try {
    const saved = localStorage.getItem('gold_tire_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  const showToast = (message) => {
    if (!cartToast) return;
    if (cartToastText) cartToastText.textContent = message;
    cartToast.classList.add('show');
    clearTimeout(cartToast._timer);
    cartToast._timer = setTimeout(() => {
      cartToast.classList.remove('show');
    }, 2800);
  };

  const saveCart = () => {
    try {
      localStorage.setItem('gold_tire_cart', JSON.stringify(cart));
    } catch (e) {}
    renderCart();
  };

  const openCart = () => {
    if (cartDrawer) cartDrawer.classList.add('active');
    if (cartDrawerBackdrop) cartDrawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    if (cartDrawer) cartDrawer.classList.remove('active');
    if (cartDrawerBackdrop) cartDrawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  const renderCart = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (navCartBadge) {
      navCartBadge.textContent = totalItems;
      navCartBadge.classList.add('bump');
      setTimeout(() => navCartBadge.classList.remove('bump'), 300);
    }
    if (floatingCartBadge) {
      floatingCartBadge.textContent = totalItems;
      floatingCartBadge.classList.add('bump');
      setTimeout(() => floatingCartBadge.classList.remove('bump'), 300);
    }
    if (cartSummaryCount) {
      cartSummaryCount.textContent = `${totalItems} ${totalItems === 1 ? 'unidad' : 'unidades'}`;
    }

    if (!cartDrawerBody) return;

    if (cart.length === 0) {
      cartDrawerBody.innerHTML = `
        <div class="cart-empty-state">
          <i class="fas fa-shopping-basket"></i>
          <p><strong>Tu carrito de cotización está vacío</strong></p>
          <p style="font-size:0.85rem; margin-top:6px;">Agrega cauchos o baterías Duncan desde nuestro catálogo para solicitar precios por WhatsApp.</p>
        </div>
      `;
      return;
    }

    let html = '';
    cart.forEach(item => {
      html += `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <span class="cart-item-cat">${item.category || 'Producto'}</span>
            <div class="cart-item-qty">
              <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
              <span class="qty-number">${item.quantity}</span>
              <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-action="remove" data-id="${item.id}" title="Eliminar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
    });

    cartDrawerBody.innerHTML = html;

    cartDrawerBody.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const target = cart.find(i => i.id === id);
        if (!target) return;

        if (action === 'increase') {
          target.quantity += 1;
        } else if (action === 'decrease') {
          target.quantity -= 1;
          if (target.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
          }
        }
        saveCart();
      });
    });

    cartDrawerBody.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        cart = cart.filter(i => i.id !== id);
        saveCart();
        showToast('Producto eliminado de la lista');
      });
    });
  };

  const recordRequest = (productId, qty = 1) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      prod.requestedCount = (prod.requestedCount || 0) + qty;
      saveProducts();
    }
  };

  const attachProductCardEvents = () => {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const category = btn.dataset.category || 'Producto';
        const image = btn.dataset.image;

        const existing = cart.find(i => i.id === id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ id, name, category, image, quantity: 1 });
        }

        saveCart();

        const originalHTML = btn.innerHTML;
        btn.classList.add('added');
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
        setTimeout(() => {
          btn.classList.remove('added');
          btn.innerHTML = originalHTML;
        }, 1400);

        showToast(`🛒 ¡${name} agregado al carrito!`);
      };
    });

    document.querySelectorAll('.btn-direct-wa').forEach(link => {
      link.onclick = () => {
        const id = link.dataset.id;
        if (id) recordRequest(id, 1);
      };
    });
  };

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (floatingCartBtn) floatingCartBtn.addEventListener('click', openCart);
  if (closeCartDrawerBtn) closeCartDrawerBtn.addEventListener('click', closeCart);
  if (cartDrawerBackdrop) cartDrawerBackdrop.addEventListener('click', closeCart);

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      if (confirm('¿Deseas vaciar tu lista de cotización?')) {
        cart = [];
        saveCart();
        showToast('Carrito vaciado');
      }
    });
  }

  if (sendWhatsAppOrderBtn) {
    sendWhatsAppOrderBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega al menos un producto para cotizar.');
        return;
      }

      cart.forEach(item => {
        recordRequest(item.id, item.quantity);
      });

      let msg = "¡Hola Multiservicios Gold Tire 07! 👋%0A%0AQuisiera solicitar información, disponibilidad y precios de los siguientes productos de mi carrito:%0A%0A";
      cart.forEach((item, index) => {
        msg += `${index + 1}. *${encodeURIComponent(item.name)}*%0A   📦 Categoría: ${encodeURIComponent(item.category)}%0A   🔢 Cantidad: ${item.quantity} ${item.quantity === 1 ? 'unidad' : 'unidades'}%0A%0A`;
      });
      msg += "📍 Ubicación: San Diego / Valencia, Carabobo.%0A¿Tienen disponibilidad para entrega o instalación? ¡Muchas gracias!";

      window.open(`https://wa.me/584244961600?text=${msg}`, '_blank');
    });
  }

  // ============================================================
  // ---- ADMIN PANEL LOGIC (Auth, Analytics & CRUD) ----
  // ============================================================
  const adminAuthModal = document.getElementById('adminAuthModal');
  const adminAuthBackdrop = document.getElementById('adminAuthBackdrop');
  const adminAuthForm = document.getElementById('adminAuthForm');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const toggleAdminPwdBtn = document.getElementById('toggleAdminPwdBtn');
  const pwdEyeIcon = document.getElementById('pwdEyeIcon');
  const adminAuthError = document.getElementById('adminAuthError');
  const closeAdminAuthBtn = document.getElementById('closeAdminAuthBtn');
  const cancelAdminAuthBtn = document.getElementById('cancelAdminAuthBtn');

  const adminDashboardModal = document.getElementById('adminDashboardModal');
  const adminDashboardBackdrop = document.getElementById('adminDashboardBackdrop');
  const closeAdminDashboardBtn = document.getElementById('closeAdminDashboardBtn');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');

  const openAdminLoginBtn = document.getElementById('openAdminLoginBtn');
  const footerAdminBtn = document.getElementById('footerAdminBtn');
  const navAdminBtn = document.getElementById('navAdminBtn');

  const getAdminPassword = () => {
    return localStorage.getItem('gold_tire_admin_password') || 'gold07';
  };

  const openAuthModal = () => {
    if (adminAuthModal) adminAuthModal.classList.add('active');
    if (adminAuthBackdrop) adminAuthBackdrop.classList.add('active');
    if (adminPasswordInput) {
      adminPasswordInput.value = '';
      adminPasswordInput.focus();
    }
    if (adminAuthError) adminAuthError.classList.remove('show');
    document.body.style.overflow = 'hidden';
  };

  const closeAuthModal = () => {
    if (adminAuthModal) adminAuthModal.classList.remove('active');
    if (adminAuthBackdrop) adminAuthBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  const openDashboardModal = () => {
    closeAuthModal();
    if (adminDashboardModal) adminDashboardModal.classList.add('active');
    if (adminDashboardBackdrop) adminDashboardBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderAdminAnalytics();
    renderAdminInventory();
  };

  const closeDashboardModal = () => {
    if (adminDashboardModal) adminDashboardModal.classList.remove('active');
    if (adminDashboardBackdrop) adminDashboardBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openAdminLoginBtn) openAdminLoginBtn.addEventListener('click', openAuthModal);
  if (footerAdminBtn) footerAdminBtn.addEventListener('click', openAuthModal);
  if (navAdminBtn) navAdminBtn.addEventListener('click', openAuthModal);

  if (closeAdminAuthBtn) closeAdminAuthBtn.addEventListener('click', closeAuthModal);
  if (cancelAdminAuthBtn) cancelAdminAuthBtn.addEventListener('click', closeAuthModal);
  if (adminAuthBackdrop) adminAuthBackdrop.addEventListener('click', closeAuthModal);

  if (closeAdminDashboardBtn) closeAdminDashboardBtn.addEventListener('click', closeDashboardModal);
  if (adminDashboardBackdrop) adminDashboardBackdrop.addEventListener('click', closeDashboardModal);
  if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', () => {
    closeDashboardModal();
    showToast('Sesión de administrador cerrada');
  });

  if (toggleAdminPwdBtn && adminPasswordInput) {
    toggleAdminPwdBtn.addEventListener('click', () => {
      const type = adminPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      adminPasswordInput.setAttribute('type', type);
      if (pwdEyeIcon) {
        pwdEyeIcon.classList.toggle('fa-eye');
        pwdEyeIcon.classList.toggle('fa-eye-slash');
      }
    });
  }

  if (adminAuthForm) {
    adminAuthForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = adminPasswordInput ? adminPasswordInput.value.trim() : '';
      if (entered === getAdminPassword()) {
        openDashboardModal();
      } else {
        if (adminAuthError) adminAuthError.classList.add('show');
        if (adminPasswordInput) {
          adminPasswordInput.select();
          adminPasswordInput.focus();
        }
      }
    });
  }

  const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
  const adminTabContents = document.querySelectorAll('.admin-tab-content');
  adminTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      adminTabBtns.forEach(b => b.classList.remove('active'));
      adminTabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(tabId);
      if (target) target.classList.add('active');

      if (tabId === 'tab-analytics') renderAdminAnalytics();
      if (tabId === 'tab-inventory') renderAdminInventory();
    });
  });

  // ---- Admin Analytics (Resumen de Más Pedidos) ----
  const renderAdminAnalytics = () => {
    const kpiTotalOrders = document.getElementById('kpiTotalOrders');
    const kpiTopProduct = document.getElementById('kpiTopProduct');
    const kpiTopCount = document.getElementById('kpiTopCount');
    const kpiTotalProducts = document.getElementById('kpiTotalProducts');
    const adminProductCount = document.getElementById('adminProductCount');
    const adminStatsTableWrapper = document.getElementById('adminStatsTableWrapper');

    const totalProducts = products.length;
    if (kpiTotalProducts) kpiTotalProducts.textContent = totalProducts;
    if (adminProductCount) adminProductCount.textContent = totalProducts;

    const totalRequests = products.reduce((sum, p) => sum + (p.requestedCount || 0), 0);
    if (kpiTotalOrders) kpiTotalOrders.textContent = totalRequests;

    const sorted = [...products].sort((a, b) => (b.requestedCount || 0) - (a.requestedCount || 0));
    const topProd = sorted[0];

    if (kpiTopProduct) {
      kpiTopProduct.textContent = (topProd && topProd.requestedCount > 0) ? topProd.name : 'Sin pedidos aún';
    }
    if (kpiTopCount) {
      kpiTopCount.textContent = (topProd && topProd.requestedCount > 0) ? `${topProd.requestedCount} cotizaciones recibidas` : '0 pedidos';
    }

    if (!adminStatsTableWrapper) return;

    if (totalRequests === 0) {
      adminStatsTableWrapper.innerHTML = `
        <div style="text-align:center; padding:30px; color:rgba(255,255,255,0.5);">
          <i class="fas fa-chart-pie" style="font-size:2.5rem; color:#d4a437; margin-bottom:10px;"></i>
          <p>Aún no se han registrado cotizaciones. Cuando los clientes envíen carritos o consultas a WhatsApp, aquí verás el ranking en tiempo real.</p>
        </div>
      `;
      return;
    }

    const maxCount = sorted[0].requestedCount || 1;

    let tableHTML = `
      <table class="admin-ranking-table">
        <thead>
          <tr>
            <th style="width:60px;">Posición</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th style="text-align:center; width:130px;">Veces Pedido</th>
            <th>Popularidad</th>
          </tr>
        </thead>
        <tbody>
    `;

    sorted.forEach((p, idx) => {
      const rank = idx + 1;
      const rankClass = rank === 1 ? 'top-1' : (rank === 2 ? 'top-2' : (rank === 3 ? 'top-3' : ''));
      const count = p.requestedCount || 0;
      const pct = Math.round((count / maxCount) * 100);

      tableHTML += `
        <tr>
          <td><span class="rank-badge ${rankClass}">#${rank}</span></td>
          <td>
            <div class="table-product-cell">
              <img src="${p.image}" alt="${p.name}" />
              <div>
                <span class="table-product-name">${p.name}</span>
                ${p.badge ? `<span style="font-size:0.7rem; color:#d4a437; display:block;">[${p.badge}]</span>` : ''}
              </div>
            </div>
          </td>
          <td><span style="color:#d4a437; text-transform:uppercase; font-size:0.8rem; font-weight:700;">${p.categoryLabel || p.category}</span></td>
          <td style="text-align:center;"><strong style="font-size:1.1rem; color:#fff;">${count}</strong></td>
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="popularity-bar-wrapper">
                <div class="popularity-bar-fill" style="width: ${pct}%;"></div>
              </div>
              <span style="font-size:0.75rem; color:rgba(255,255,255,0.6);">${pct}%</span>
            </div>
          </td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    adminStatsTableWrapper.innerHTML = tableHTML;
  };

  const resetStatsBtn = document.getElementById('resetStatsBtn');
  if (resetStatsBtn) {
    resetStatsBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas reiniciar todos los contadores de pedidos a 0?')) {
        products.forEach(p => p.requestedCount = 0);
        saveProducts();
        renderAdminAnalytics();
        showToast('Estadísticas reiniciadas con éxito');
      }
    });
  }

  // ---- Admin Inventory (Gestionar Productos) ----
  const adminProductsList = document.getElementById('adminProductsList');
  const adminProductSearch = document.getElementById('adminProductSearch');

  const renderAdminInventory = (searchTerm = '') => {
    if (!adminProductsList) return;

    let list = products;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = products.filter(p => p.name.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term)));
    }

    if (list.length === 0) {
      adminProductsList.innerHTML = `
        <div style="text-align:center; padding:30px; color:rgba(255,255,255,0.5);">
          <p>No se encontraron productos con ese término.</p>
        </div>
      `;
      return;
    }

    let html = '';
    list.forEach(p => {
      html += `
        <div class="admin-product-row" data-id="${p.id}">
          <img src="${p.image}" alt="${p.name}" />
          <div class="admin-product-row-info">
            <h4 class="admin-product-row-title">${p.name}</h4>
            <div class="admin-product-row-meta">
              <span>Categoría: <strong>${p.categoryLabel || p.category}</strong></span>
              ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
              <span>Solicitudes: <strong>${p.requestedCount || 0}</strong></span>
            </div>
          </div>
          <div class="admin-product-row-actions">
            <button class="btn-action-edit" data-id="${p.id}">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn-action-delete" data-id="${p.id}">
              <i class="fas fa-trash-alt"></i> Eliminar
            </button>
          </div>
        </div>
      `;
    });

    adminProductsList.innerHTML = html;

    adminProductsList.querySelectorAll('.btn-action-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        openProductEditor(id);
      });
    });

    adminProductsList.querySelectorAll('.btn-action-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const target = products.find(p => p.id === id);
        if (!target) return;
        if (confirm(`¿Deseas eliminar "${target.name}" del catálogo?`)) {
          products = products.filter(p => p.id !== id);
          saveProducts();
          renderCatalogProducts();
          renderAdminInventory(adminProductSearch ? adminProductSearch.value : '');
          renderAdminAnalytics();
          showToast(`Producto "${target.name}" eliminado`);
        }
      });
    });
  };

  if (adminProductSearch) {
    adminProductSearch.addEventListener('input', (e) => {
      renderAdminInventory(e.target.value);
    });
  }

  // ---- Product Editor Modal (Agregar / Editar) ----
  const productEditorModal = document.getElementById('productEditorModal');
  const productEditorBackdrop = document.getElementById('productEditorBackdrop');
  const productEditorForm = document.getElementById('productEditorForm');
  const productEditorTitle = document.getElementById('productEditorTitle');
  const editProductId = document.getElementById('editProductId');
  const editProductName = document.getElementById('editProductName');
  const editProductCategory = document.getElementById('editProductCategory');
  const editProductBadge = document.getElementById('editProductBadge');
  const editProductFeature1 = document.getElementById('editProductFeature1');
  const editProductFeature2 = document.getElementById('editProductFeature2');
  const editProductFile = document.getElementById('editProductFile');
  const editProductImageUrl = document.getElementById('editProductImageUrl');
  const imagePreviewImg = document.getElementById('imagePreviewImg');
  const editProductDescription = document.getElementById('editProductDescription');
  const closeProductEditorBtn = document.getElementById('closeProductEditorBtn');
  const cancelProductEditorBtn = document.getElementById('cancelProductEditorBtn');
  const btnOpenNewProductModal = document.getElementById('btnOpenNewProductModal');

  let currentImageData = 'images/product1.jpg';

  const openProductEditor = (productId = null) => {
    if (productId) {
      const prod = products.find(p => p.id === productId);
      if (!prod) return;
      if (productEditorTitle) productEditorTitle.innerHTML = `<i class="fas fa-edit gold"></i> Editar Producto`;
      if (editProductId) editProductId.value = prod.id;
      if (editProductName) editProductName.value = prod.name;
      if (editProductCategory) editProductCategory.value = prod.category;
      if (editProductBadge) editProductBadge.value = prod.badge || '';
      if (editProductFeature1) editProductFeature1.value = prod.feature1 || '';
      if (editProductFeature2) editProductFeature2.value = prod.feature2 || '';
      if (editProductDescription) editProductDescription.value = prod.description || '';
      if (editProductImageUrl) editProductImageUrl.value = prod.image.startsWith('data:') ? '' : prod.image;
      if (editProductFile) editProductFile.value = '';
      currentImageData = prod.image;
      if (imagePreviewImg) imagePreviewImg.src = prod.image;
    } else {
      if (productEditorTitle) productEditorTitle.innerHTML = `<i class="fas fa-plus gold"></i> Agregar Nuevo Producto`;
      if (editProductId) editProductId.value = '';
      if (editProductName) editProductName.value = '';
      if (editProductCategory) editProductCategory.value = 'sedan';
      if (editProductBadge) editProductBadge.value = '';
      if (editProductFeature1) editProductFeature1.value = 'Calidad Garantizada';
      if (editProductFeature2) editProductFeature2.value = 'Alto Rendimiento';
      if (editProductDescription) editProductDescription.value = '';
      if (editProductImageUrl) editProductImageUrl.value = 'images/product1.jpg';
      if (editProductFile) editProductFile.value = '';
      currentImageData = 'images/product1.jpg';
      if (imagePreviewImg) imagePreviewImg.src = 'images/product1.jpg';
    }

    if (productEditorModal) productEditorModal.classList.add('active');
    if (productEditorBackdrop) productEditorBackdrop.classList.add('active');
  };

  const closeProductEditor = () => {
    if (productEditorModal) productEditorModal.classList.remove('active');
    if (productEditorBackdrop) productEditorBackdrop.classList.remove('active');
  };

  if (btnOpenNewProductModal) btnOpenNewProductModal.addEventListener('click', () => openProductEditor(null));
  if (closeProductEditorBtn) closeProductEditorBtn.addEventListener('click', closeProductEditor);
  if (cancelProductEditorBtn) cancelProductEditorBtn.addEventListener('click', closeProductEditor);
  if (productEditorBackdrop) productEditorBackdrop.addEventListener('click', closeProductEditor);

  if (editProductImageUrl) {
    editProductImageUrl.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) {
        currentImageData = val;
        if (imagePreviewImg) imagePreviewImg.src = val;
      }
    });
  }

  if (editProductFile) {
    editProductFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          currentImageData = event.target.result;
          if (imagePreviewImg) imagePreviewImg.src = currentImageData;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (productEditorForm) {
    productEditorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = editProductId ? editProductId.value : '';
      const name = editProductName ? editProductName.value.trim() : '';
      const category = editProductCategory ? editProductCategory.value : 'sedan';
      const badge = editProductBadge ? editProductBadge.value : '';
      const feature1 = editProductFeature1 ? editProductFeature1.value.trim() : '';
      const feature2 = editProductFeature2 ? editProductFeature2.value.trim() : '';
      const description = editProductDescription ? editProductDescription.value.trim() : '';

      const categoryLabels = {
        sedan: 'Sedán',
        suv: 'SUV / Camioneta',
        deportivo: 'Deportivo',
        baterias: 'Baterías',
        camion: 'Camión',
        otro: 'Accesorio'
      };

      if (id) {
        const target = products.find(p => p.id === id);
        if (target) {
          target.name = name;
          target.category = category;
          target.categoryLabel = categoryLabels[category] || category;
          target.badge = badge;
          target.feature1 = feature1;
          target.feature2 = feature2;
          target.description = description;
          target.image = currentImageData;
          showToast(`Producto "${name}" actualizado con éxito`);
        }
      } else {
        const newId = 'prod-' + Date.now();
        products.push({
          id: newId,
          name: name,
          category: category,
          categoryLabel: categoryLabels[category] || category,
          badge: badge,
          feature1: feature1,
          feature2: feature2,
          description: description,
          image: currentImageData,
          requestedCount: 0
        });
        showToast(`Producto "${name}" agregado al catálogo`);
      }

      saveProducts();
      renderCatalogProducts();
      renderAdminInventory(adminProductSearch ? adminProductSearch.value : '');
      renderAdminAnalytics();
      closeProductEditor();
    });
  }

  // Change Admin Password Form
  const changePasswordForm = document.getElementById('changePasswordForm');
  const newAdminPassword = document.getElementById('newAdminPassword');
  const confirmAdminPassword = document.getElementById('confirmAdminPassword');
  const changePasswordMsg = document.getElementById('changePasswordMsg');

  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pwd1 = newAdminPassword ? newAdminPassword.value.trim() : '';
      const pwd2 = confirmAdminPassword ? confirmAdminPassword.value.trim() : '';

      if (pwd1.length < 4) {
        if (changePasswordMsg) {
          changePasswordMsg.className = 'settings-msg error';
          changePasswordMsg.textContent = 'La contraseña debe tener al menos 4 caracteres.';
        }
        return;
      }

      if (pwd1 !== pwd2) {
        if (changePasswordMsg) {
          changePasswordMsg.className = 'settings-msg error';
          changePasswordMsg.textContent = 'Las contraseñas no coinciden.';
        }
        return;
      }

      localStorage.setItem('gold_tire_admin_password', pwd1);
      if (changePasswordMsg) {
        changePasswordMsg.className = 'settings-msg success';
        changePasswordMsg.textContent = '✓ Contraseña actualizada correctamente.';
      }
      if (newAdminPassword) newAdminPassword.value = '';
      if (confirmAdminPassword) confirmAdminPassword.value = '';
      showToast('Nueva contraseña guardada');
    });
  }

  // ============================================================
  // ---- TIRE ANATOMY & INTERACTIVE SHOWCASE LOGIC ----
  // ============================================================
  let currentSpec = 1;
  let isManualInteracting = false;
  let manualTimer = null;

  const specPills    = document.querySelectorAll('.tire-nav-pill');
  const hotspots     = document.querySelectorAll('.tire-hotspot');
  const specCards    = document.querySelectorAll('.spec-card');
  const specDots     = document.querySelectorAll('.spec-dots .dot');
  const prevSpecBtn  = document.getElementById('prevSpecBtn');
  const nextSpecBtn  = document.getElementById('nextSpecBtn');
  const tireMainImg  = document.getElementById('tireMainImg');
  const tireStage    = document.getElementById('tireStage');

  const tireTransformMap = {
    1: 'scale(1.04) rotate(-8deg)',
    2: 'scale(1.08) rotate(12deg)',
    3: 'scale(1.06) rotate(30deg)',
    4: 'scale(1.06) rotate(-20deg)',
    5: 'scale(1.10) rotate(0deg)'
  };

  const switchSpec = (specId, byUser = true) => {
    specId = parseInt(specId);
    if (specId < 1 || specId > 5) return;
    currentSpec = specId;

    if (byUser) {
      isManualInteracting = true;
      clearTimeout(manualTimer);
      manualTimer = setTimeout(() => {
        isManualInteracting = false;
      }, 5000);
    }

    // Update nav pills
    specPills.forEach(pill => {
      pill.classList.toggle('active', parseInt(pill.dataset.spec) === specId);
    });

    // Update hotspots
    hotspots.forEach(hs => {
      hs.classList.toggle('active', parseInt(hs.dataset.spec) === specId);
    });

    // Update cards
    specCards.forEach(card => {
      card.classList.toggle('active', parseInt(card.dataset.spec) === specId);
    });

    // Update dots
    specDots.forEach(dot => {
      dot.classList.toggle('active', parseInt(dot.dataset.spec) === specId);
    });

    // Animate tire image
    if (tireMainImg && tireTransformMap[specId]) {
      tireMainImg.style.transform = tireTransformMap[specId];
    }
  };

  // Nav pills click
  specPills.forEach(pill => {
    pill.addEventListener('click', () => {
      switchSpec(pill.dataset.spec, true);
    });
  });

  // Hotspots click
  hotspots.forEach(hs => {
    hs.addEventListener('click', (e) => {
      e.stopPropagation();
      switchSpec(hs.dataset.spec, true);
    });
  });

  // Prev / Next button click
  if (prevSpecBtn) {
    prevSpecBtn.addEventListener('click', () => {
      const target = currentSpec > 1 ? currentSpec - 1 : 5;
      switchSpec(target, true);
    });
  }

  if (nextSpecBtn) {
    nextSpecBtn.addEventListener('click', () => {
      const target = currentSpec < 5 ? currentSpec + 1 : 1;
      switchSpec(target, true);
    });
  }

  // Dots click
  specDots.forEach(dot => {
    dot.addEventListener('click', () => {
      switchSpec(dot.dataset.spec, true);
    });
  });

  // Scroll-driven animation & progressive step switching
  const specSection = document.getElementById('especificaciones');
  if (specSection) {
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const rect = specSection.getBoundingClientRect();
          const winHeight = window.innerHeight;

          if (rect.top < winHeight && rect.bottom > 0) {
            const progress = (winHeight - rect.top) / (winHeight + rect.height);

            // Subtle continuous 3D rotation with inertia if user isn't overriding with manual hotspot clicks
            if (tireMainImg && !isManualInteracting) {
              const rot = ((progress - 0.5) * 36).toFixed(2);
              const scl = (1.0 + Math.sin(progress * Math.PI) * 0.05).toFixed(3);
              tireMainImg.style.transform = `scale(${scl}) rotate(${rot}deg)`;
            }

            // Progressive step auto-switch as user scrolls through the showcase
            if (!isManualInteracting) {
              if (progress >= 0.15 && progress < 0.32) {
                if (currentSpec !== 1) switchSpec(1, false);
              } else if (progress >= 0.32 && progress < 0.48) {
                if (currentSpec !== 2) switchSpec(2, false);
              } else if (progress >= 0.48 && progress < 0.64) {
                if (currentSpec !== 3) switchSpec(3, false);
              } else if (progress >= 0.64 && progress < 0.80) {
                if (currentSpec !== 4) switchSpec(4, false);
              } else if (progress >= 0.80) {
                if (currentSpec !== 5) switchSpec(5, false);
              }
            }
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }

  // ---- Mobile Touch Swiping (iPhone & Android) ----
  let touchStartX = 0;
  let touchStartY = 0;
  const touchArea = document.getElementById('tireStage');

  if (touchArea) {
    touchArea.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    touchArea.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;

        // Ensure horizontal swipe is dominant and exceeds 45px
        if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
          if (deltaX < 0) {
            // Swiped left -> next specification
            const target = currentSpec < 5 ? currentSpec + 1 : 1;
            switchSpec(target, true);
          } else {
            // Swiped right -> previous specification
            const target = currentSpec > 1 ? currentSpec - 1 : 5;
            switchSpec(target, true);
          }
        }
      }
    }, { passive: true });
  }

  // ---- PC Desktop 3D Mouse Parallax Tilt ----
  const targetFrame = document.getElementById('tireTargetFrame');
  if (targetFrame && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    targetFrame.addEventListener('mousemove', (e) => {
      const rect = targetFrame.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      const rotateX = (-y / (rect.height / 2) * 12).toFixed(2);
      const rotateY = (x / (rect.width / 2) * 12).toFixed(2);
      targetFrame.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    targetFrame.addEventListener('mouseleave', () => {
      targetFrame.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    });
  }

  // ============================================================
  // ---- TIRE MEASURE CALCULATOR & WHATSAPP GENERATOR ----
  // ============================================================
  const calcWidth         = document.getElementById('calcWidth');
  const calcProfile       = document.getElementById('calcProfile');
  const calcRim           = document.getElementById('calcRim');
  const calcFullMeasure   = document.getElementById('calcFullMeasure');
  const calcSideHeight    = document.getElementById('calcSideHeight');
  const calcTotalDiameter = document.getElementById('calcTotalDiameter');
  const calcVehicleType   = document.getElementById('calcVehicleType');
  const calcWhatsAppBtn   = document.getElementById('calcWhatsAppBtn');
  const calcCtaMeasure    = document.getElementById('calcCtaMeasure');

  const updateTireCalculator = () => {
    if (!calcWidth || !calcProfile || !calcRim) return;

    const width   = parseInt(calcWidth.value) || 205;
    const profile = parseInt(calcProfile.value) || 55;
    const rim     = parseInt(calcRim.value) || 16;

    // Calculation formulas:
    // Sidewall height = width * (profile / 100)
    // Rim diameter in mm = rim * 25.4
    // Total diameter = rim_mm + 2 * sidewall
    const sidewallMm   = (width * profile) / 100;
    const rimMm        = rim * 25.4;
    const totalDiamMm  = rimMm + (2 * sidewallMm);
    const totalDiamIn  = totalDiamMm / 25.4;

    // Determine vehicle type suggestion
    let vehicleSuggestion = 'Sedán Compacto / Mediano';
    if (rim <= 14 || (width <= 185 && rim <= 15)) {
      vehicleSuggestion = 'Compacto / Urbano (ej: Aveo, Spark, Corsa, Fiesta, Picanto)';
    } else if (width >= 245 || profile >= 70 || (rim >= 17 && profile >= 65)) {
      vehicleSuggestion = 'Camioneta 4x4 / Pick-up / SUV Grande (ej: Hilux, Fortuner, 4Runner, Bronco, Silverado)';
    } else if (rim >= 18 || (rim >= 17 && profile <= 45)) {
      vehicleSuggestion = 'Deportivo / Coupé / Alta Gama (ej: Mustang, Camaro, BMW Serie 3, Mercedes-Benz)';
    } else if (rim === 16 || rim === 17) {
      vehicleSuggestion = 'SUV / Crossover / Sedán Ejecutivo (ej: Corolla, Civic, Tucson, Tracker, Sportage)';
    }

    const measureString = `${width}/${profile} R${rim}`;

    if (calcFullMeasure)   calcFullMeasure.textContent = measureString;
    if (calcCtaMeasure)    calcCtaMeasure.textContent = measureString;
    if (calcSideHeight)    calcSideHeight.textContent = `${sidewallMm.toFixed(1)} mm`;
    if (calcTotalDiameter) calcTotalDiameter.textContent = `${totalDiamMm.toFixed(1)} mm (${totalDiamIn.toFixed(1)}")`;
    if (calcVehicleType)   calcVehicleType.textContent = vehicleSuggestion;

    if (calcWhatsAppBtn) {
      const waMsg = `Hola Multiservicios Gold Tire 07, estuve revisando su catálogo interactivo y quisiera cotizar disponibilidad y precio para cauchos en medida *${measureString}* (${vehicleSuggestion}). ¡Gracias!`;
      calcWhatsAppBtn.href = `https://wa.me/584244961600?text=${encodeURIComponent(waMsg)}`;
    }
  };

  if (calcWidth)   calcWidth.addEventListener('change', updateTireCalculator);
  if (calcProfile) calcProfile.addEventListener('change', updateTireCalculator);
  if (calcRim)     calcRim.addEventListener('change', updateTireCalculator);

  // Initialize calculator values
  updateTireCalculator();

  // Initial renders
  renderCatalogProducts();
  renderCart();

  // ---- Smooth scroll for nav links (fallback) ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});

// Add fadeIn keyframe dynamically
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);
