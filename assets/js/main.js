/* assets/js/main.js
   Central cart utilities, cart preview, toast notifications and initialization
   - Persists cart to localStorage under key 'mugs_cart_v1'
   - Exposes addToCart(productId) used by pages
   - Renders small preview dropdown when clicking cart icon
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
  try { localStorage.setItem('mugs_cart_update_ts', Date.now().toString()); } catch {}
}

// add item (id must match products.json ids)
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === productId);
  if (idx >= 0) cart[idx].quantity += qty;
  else cart.push({ id: productId, quantity: qty });
  saveCart(cart);
  showToast('تمت إضافة المنتج إلى السلة'); // Arabic toast
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
    if (cart[idx].quantity === 0) cart.splice(idx,1);
    saveCart(cart);
  }
}

// total items
function totalItems() {
  return getCart().reduce((s,i)=> s + Number(i.quantity || 0), 0);
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
  toastTimer = setTimeout(()=> el.classList.remove('show'), ms);
}

/* cart preview dropdown: builds a small preview by fetching product data */
async function buildCartPreview() {
  const previewWrap = document.getElementById('cart-preview-wrap');
  if (!previewWrap) return;

  const cart = getCart();
  if (cart.length === 0) {
    previewWrap.innerHTML = `<div style="padding:12px;text-align:center;color:#666;">سلتك فارغة</div>`;
    return;
  }

  // load products.json (cached by browser)
  try {
    const res = await fetch('data/products.json', {cache: 'no-store'});
    const products = await res.json();
    const lines = [];
    let total = 0;
    // show up to 3 items
    const show = cart.slice(0,3);
    show.forEach(ci=>{
      const p = products.find(x=>x.id === ci.id);
      if (!p) return;
      total += p.price * ci.quantity;
      lines.push(`
        <div class="item" style="display:flex;align-items:center;gap:8px;padding:8px 0;">
          <img src="${p.image}" alt="${escapeHtml(p.title)}" style="width:56px;height:56px;border-radius:8px;object-fit:cover;">
          <div style="flex:1;">
            <div style="font-weight:700;color:#0b4f7a">${escapeHtml(p.title)}</div>
            <div style="font-size:0.92rem;color:#666">x ${ci.quantity} • ${(p.price * ci.quantity).toFixed(2)} SAR</div>
          </div>
          <button aria-label="Remove ${escapeHtml(p.title)}" style="background:transparent;border:0;color:#c33;cursor:pointer" data-remove="${p.id}">حـذف</button>
        </div>
      `);
    });

    // footer with total and view cart
    lines.push(`<div class="total" style="display:flex;justify-content:space-between;align-items:center;padding-top:10px">
      <div style="font-weight:700">الإجمالي</div><div style="font-weight:700">${total.toFixed(2)} ر.س</div>
    </div>`);
    lines.push(`<div style="text-align:center;margin-top:10px;"><a class="btn-primary" href="cart.html" style="padding:8px 14px;font-size:0.95rem">عرض السلة</a></div>`);

    previewWrap.innerHTML = lines.join('');
    // attach remove handlers
    previewWrap.querySelectorAll('[data-remove]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id = Number(e.currentTarget.getAttribute('data-remove'));
        removeFromCart(id);
        buildCartPreview();
        showToast('تمت إزالة المنتج');
      });
    });

  } catch (err) {
    console.error(err);
    previewWrap.innerHTML = `<div style="padding:12px;color:#666;">خطأ في تحميل السلة</div>`;
  }
}

/* helpers */
function escapeHtml(str='') {
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}

/* toggle cart preview display */
function bindCartPreviewToggle() {
  const trigger = document.getElementById('cart-toggle');
  const preview = document.getElementById('cart-preview-wrap');
  if (!trigger || !preview) return;
  let open = false;

  function show() {
    preview.style.display = 'block';
    open = true;
    buildCartPreview();
  }
  function hide() {
    preview.style.display = 'none';
    open = false;
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (open) hide(); else show();
  });

  // close when clicking outside
  document.addEventListener('click', (e) => {
    if (!preview.contains(e.target) && e.target !== trigger) hide();
  });
}

/* keep in sync across tabs: listen for storage changes */
window.addEventListener('storage', (e) => {
  if (e.key === CART_KEY || e.key === 'mugs_cart_update_ts') {
    updateCartIcon();
    // rebuild preview if visible
    const preview = document.getElementById('cart-preview-wrap');
    if (preview && preview.style.display === 'block') buildCartPreview();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  updateCartIcon();
  bindCartPreviewToggle();
});
