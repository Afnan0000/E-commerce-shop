document.addEventListener('DOMContentLoaded', () => {
    renderCheckoutSummary();

    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
});

function renderCheckoutSummary() {
    const container = document.getElementById('checkout-items');
    const products = typeof getProducts === 'function' ? getProducts() : [];
    const cart = getCart();

    if (!container) return;

    let total = 0;
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('place-order-btn').disabled = true;
        return;
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            const row = document.createElement('div');
            row.className = 'summary-item';
            row.innerHTML = `
          <span>${product.title} x ${item.quantity}</span>
          <span>${itemTotal.toFixed(2)} SAR</span>
        `;
            container.appendChild(row);
        }
    });

    document.getElementById('summary-subtotal').textContent = `${total.toFixed(2)} SAR`;
    document.getElementById('summary-total').textContent = `${total.toFixed(2)} SAR`;
}

function handlePlaceOrder(e) {
    if (e) e.preventDefault();

    const form = document.getElementById('checkout-form');
    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const btn = document.getElementById('place-order-btn');
    btn.textContent = 'Processing...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Success!
        // Clear cart
        localStorage.removeItem('mugs_cart_v1'); // clear underlying data
        // Optional: trigger cart icon update if we stay on page, but we're redirecting

        showToast('Order placed successfully! Redirecting...');

        // Redirect to home after short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    }, 2000);
}

