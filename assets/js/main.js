/* assets/js/main.js
   Central cart utilities, toast notifications and initialization
   - Persists cart to localStorage under key 'mugs_cart_v1'
   - Exposes addToCart(productId) used by pages
   - Works with file:// protocol
*/

const CART_KEY = 'mugs_cart_v1';

// get cart from localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    console.warn('Failed parsing cart', e);
    return [];
  }
}

// save cart
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartIcon();
  // broadcast to other tabs
  try { localStorage.setItem('mugs_cart_update_ts', Date.now().toString()); } catch { }
}

// add item (id must match product ids)
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === productId);
  if (idx >= 0) cart[idx].quantity += qty;
  else cart.push({ id: productId, quantity: qty });
  saveCart(cart);
  showToast('Product added to cart');
}

// remove item completely
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
}

// set specific quantity
function setQuantity(productId, qty) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === productId);
  if (idx >= 0) {
    cart[idx].quantity = Math.max(0, Math.floor(qty));
    if (cart[idx].quantity === 0) cart.splice(idx, 1);
    saveCart(cart);
  }
}

// total items
function totalItems() {
  return getCart().reduce((s, i) => s + Number(i.quantity || 0), 0);
}

// update cart count badge in header
function updateCartIcon() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const t = totalItems();
  badge.textContent = t;
  badge.style.display = t > 0 ? 'inline-block' : 'none';
}

/* toast UI */
let toastTimer = null;
function showToast(text, ms = 2200) {
  let el = document.getElementById('global-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'global-toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

/* helpers */
function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[m]));
}

/* keep in sync across tabs: listen for storage changes */
window.addEventListener('storage', (e) => {
  if (e.key === CART_KEY || e.key === 'mugs_cart_update_ts') {
    updateCartIcon();
  }
  if (e.key === 'mugs_theme') {
    applyTheme(e.newValue);
  }
});

/* ===== Theme Management ===== */
const THEME_KEY = 'mugs_theme';

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme);
}

function initTheme() {
  const theme = getPreferredTheme();
  applyTheme(theme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Initialize theme immediately to prevent flash
initTheme();

document.addEventListener('DOMContentLoaded', () => {
  updateCartIcon();

  // Setup theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Mobile Menu Logic
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';
  document.body.appendChild(mobileMenu);

  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('nav') ? document.querySelector('nav').innerHTML : '';
  const authLinks = document.getElementById('auth-links') ? document.getElementById('auth-links').innerHTML : '';

  // Copy links to mobile menu
  mobileMenu.innerHTML = `
    ${navLinks}
    <div style="margin-top:20px; text-align:center; width:100%; display:flex; flex-direction:column; align-items:center gap:12px;">
      ${authLinks}
    </div>
  `;

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      if (isOpen) {
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        mobileMenu.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
});
