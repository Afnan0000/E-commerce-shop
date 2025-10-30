/* assets/js/product.js
   Renders product details by reading id from URL and fetching data/products.json.
   Uses addToCart function from main.js
*/
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('product-details-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  if (!id) {
    container.innerHTML = '<p>لم يتم تحديد المنتج.</p>';
    return;
  }

  try {
    const res = await fetch('data/products.json', {cache:'no-store'});
    const products = await res.json();
    const p = products.find(x => x.id === id);
    if (!p) {
      container.innerHTML = '<p>المنتج غير موجود.</p>';
      return;
    }

    document.title = p.title + ' - متجر الأكواب';

    container.innerHTML = `
      <div style="display:flex;gap:28px;flex-wrap:wrap;">
        <div style="flex:1;min-width:260px;max-width:520px">
          <img src="${p.image}" alt="${escapeHtml(p.title)}" style="width:100%;border-radius:12px;object-fit:cover;"/>
        </div>
        <div style="flex:1;min-width:240px;">
          <h1 style="margin-top:0">${escapeHtml(p.title)}</h1>
          <p style="color:#555">${escapeHtml(p.description)}</p>
          <p style="font-size:1.4rem;font-weight:700;color:#0b4f7a">${p.price.toFixed(2)} ر.س</p>
          <div style="display:flex;gap:12px;align-items:center;margin-top:12px;">
            <label for="qty" style="font-weight:700">الكمية</label>
            <input id="qty" type="number" value="1" min="1" style="width:80px;padding:8px;border-radius:8px;border:1px solid #e6e9ee">
          </div>
          <div style="margin-top:18px;">
            <button id="btnAdd" class="btn-primary" style="font-size:1rem;padding:10px 18px">أضف للسلة</button>
            <a href="shop.html" class="btn-outline" style="margin-inline-start:8px;padding:10px 14px;border-radius:10px">العودة للمتجر</a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnAdd').addEventListener('click', ()=>{
      const qty = Math.max(1, Number(document.getElementById('qty').value || 1));
      addToCart(p.id, qty);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>حدث خطأ أثناء تحميل المنتج.</p>';
  }
});

function escapeHtml(str='') { return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }
