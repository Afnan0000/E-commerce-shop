document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-container');

  fetch('data/products.json')
    .then(response => response.json())
    .then(products => {
      productsContainer.innerHTML = ''; // تفريغ الحاوية
      products.forEach(product => {
        productsContainer.innerHTML += `
          <div class="product-card">
            <a href="product.html?id=${product.id}">
              <img src="${product.image}" alt="${product.title}">
              <h3>${product.title}</h3>
              <p class="price">${product.price.toFixed(2)} ر.س</p>
            </a>
            <button onclick="addToCart(${product.id})">أضف للسلة</button>
          </div>
        `;
      });
    });
});
