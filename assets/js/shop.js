/* assets/js/shop.js
   Loads data/products.json and builds the products grid.
   Adds accessible Add-to-cart buttons which call addToCart(productId).
   Uses responsive srcset if you provide multiple image sizes; otherwise loads single image lazily.
*/

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('products-container') || document.getElementById('featured-products');
  if (!container) return;

  fetch('data/products.json', {cache: 'no-store'})
    .then(r => {
      if (!r.ok) throw new Error('Failed to load products');
      return r.json();
    })
    .then(products => {
      // if there is featured-products container, show first 2, otherwise show all
      const isFeatured = container.id === 'featured-products';
      const list = isFeatured ? products.slice(0,2) : products;
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
            />
            <h3>${escapeHtml(p.title)}</h3>
            <div class="price">${p.price.toFixed(2)} ر.س</div>
          </a>
          <div class="product-actions" role="group" aria-label="Product actions">
            <button class="btn btn-outline" onclick="window.location='product.html?id=${p.id}'">عرض</button>
            <button class="btn btn-add" data-add="${p.id}">أضف للسلة</button>
          </div>
        `;
        container.appendChild(card);
      });

      // attach add buttons
      container.querySelectorAll('[data-add]').forEach(btn=>{
        btn.addEventListener('click', (e) => {
          const id = Number(e.currentTarget.getAttribute('data-add'));
          addToCart(id, 1);
        });
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = '<p style="color:#666">خطأ في تحميل المنتجات. حاول مرة أخرى لاحقًا.</p>';
    });
});

// helper (same as in main.js but safe to include here)
function escapeHtml(str='') { return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }
