// main.js
const CART_KEY = "myshop_cart";

function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product, qty = 1) {
  const cart = getCart();
  const item = cart.find(i => i.id === product.id);
  if (item) item.qty += qty;
  else cart.push({ ...product, qty });
  saveCart(cart);
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").textContent = total;
}

document.addEventListener("DOMContentLoaded", updateCartCount);
