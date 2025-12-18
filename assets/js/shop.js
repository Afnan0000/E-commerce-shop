/* assets/js/shop.js
   Builds the products grid using embedded product data.
   Works with file:// protocol without requiring a server.
*/

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('products-container') || document.getElementById('featured-products');
  if (!container) return;

  // Use embedded product data (from products-data.js)
  const products = typeof getProducts === 'function' ? getProducts() : [];

  if (products.length === 0) {
    container.innerHTML = '<p style="color:#666">No products available.</p>';
    return;
  }

  // if there is featured-products container, show first 2, otherwise show all
  const isFeatured = container.id === 'featured-products';
  const list = isFeatured ? products.slice(0, 2) : products;
  container.innerHTML = '';

  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="product.html?id=${p.id}" aria-label="${escapeHtml(p.title)}">
        <img 
          src="${p.image}" 
          alt="${escapeHtml(p.title)}"
          loading="lazy"
          width="600" height="400"
          onerror="this.src='images/placeholder.jpg'; this.onerror=null;"
        />
        <h3>${escapeHtml(p.title)}</h3>
        <div class="price">${p.price.toFixed(2)} SAR</div>
      </a>
      <div class="product-actions" role="group" aria-label="Product actions">
        <button class="btn btn-outline" onclick="window.location='product.html?id=${p.id}'">View</button>
        <button class="btn btn-add" data-add="${p.id}">Add to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });

  // attach add buttons
  container.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.getAttribute('data-add'));
      addToCart(id, 1);
    });
  });
});

// helper (same as in main.js but safe to include here)
function escapeHtml(str = '') { return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[m])); }
