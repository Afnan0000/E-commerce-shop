// --- إدارة سلة المشتريات (Cart Management) ---

// دالة للحصول على السلة من التخزين المحلي (localStorage)
function getCart() {
  // إذا كانت السلة موجودة، قم بتحويلها من نص إلى كائن، وإلا فابدأ بسلة فارغة
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// دالة لحفظ السلة في التخزين المحلي
function saveCart(cart) {
  // قم بتحويل كائن السلة إلى نص واحفظه
  localStorage.setItem('cart', JSON.stringify(cart));
}

// دالة لإضافة منتج إلى السلة
function addToCart(productId) {
  const cart = getCart();
  // ابحث إذا كان المنتج موجوداً بالفعل
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    // إذا كان موجوداً، زد الكمية
    existingItem.quantity++;
  } else {
    // إذا لم يكن موجوداً، أضفه مع كمية 1
    cart.push({ id: productId, quantity: 1 });
  }
  
  saveCart(cart);
  updateCartIcon(); // تحديث أيقونة السلة
  alert('تمت إضافة المنتج إلى السلة!');
}

// دالة لتحديث عدد المنتجات في أيقونة السلة
function updateCartIcon() {
  const cart = getCart();
  // حساب العدد الإجمالي للمنتجات (وليس عدد الأنواع المختلفة)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? 'inline' : 'none';
  }
}

// قم بتحديث أيقونة السلة عند تحميل أي صفحة
document.addEventListener('DOMContentLoaded', updateCartIcon);
