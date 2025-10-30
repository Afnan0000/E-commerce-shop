document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('product-details-container');
  
  // 1. الحصول على ID المنتج من رابط الصفحة (URL)
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id')); // تحويل النص إلى رقم

  if (!productId) {
    container.innerHTML = '<p>لم يتم العثور على المنتج. يرجى العودة إلى <a href="shop.html">صفحة المتجر</a>.</p>';
    return;
  }

  // 2. جلب كل المنتجات للعثور على المنتج المطلوب
  fetch('data/products.json')
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === productId);

      if (product) {
        // 3. عرض تفاصيل المنتج
        document.title = product.title; // تحديث عنوان الصفحة
        container.innerHTML = `
          <div style="display: flex; gap: 30px;">
            <img src="${product.image}" alt="${product.title}" style="max-width: 400px; border-radius: 10px;">
            <div>
              <h1>${product.title}</h1>
              <p style="font-size: 1.2em; color: #555;">${product.description}</p>
              <p class="price" style="font-size: 2em;">${product.price.toFixed(2)} ر.س</p>
              <button onclick="addToCart(${product.id})" style="padding: 15px 30px; font-size: 1.2em;">أضف للسلة</button>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = '<p>المنتج غير موجود.</p>';
      }
    });
});
