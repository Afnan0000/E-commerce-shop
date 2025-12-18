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
});

document.addEventListener('DOMContentLoaded', () => {
  updateCartIcon();
});
