/* ============================================
   LRC MEDI+ HEALTHCARE - Cart Module
   Handles cart management and checkout
   ============================================ */

// ============================================
// CART STATE
// ============================================
function getCart() {
    return JSON.parse(localStorage.getItem('lrc-cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('lrc-cart', JSON.stringify(cart));
    updateCartBadge();
}

// ============================================
// CART PAGE INITIALIZATION
// ============================================
function initCartPage() {
    renderCart();
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const cartEmptyState = document.getElementById('cartEmpty');

    const cart = getCart();

    if (cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.classList.add('hidden');
        if (cartSummary) cartSummary.classList.add('hidden');
        if (cartEmptyState) cartEmptyState.classList.remove('hidden');
        return;
    }

    if (cartItemsContainer) cartItemsContainer.classList.remove('hidden');
    if (cartSummary) cartSummary.classList.remove('hidden');
    if (cartEmptyState) cartEmptyState.classList.add('hidden');

    // Render cart items
    const itemsList = document.getElementById('cartItemsList');
    const itemCount = document.getElementById('cartItemCount');

    if (itemCount) itemCount.textContent = `${cart.length} item${cart.length !== 1 ? 's' : ''}`;

    if (itemsList) {
        itemsList.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" 
                         onerror="this.src='${generatePlaceholderSVG(item.name, 100, 80)}'">
                </div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <span class="item-type ${item.type === 'buy' ? 'type-buy' : 'type-rent'}">
                        ${item.type === 'buy' ? 'Purchase (COD)' : `Rental - ${item.rentMonths} month${item.rentMonths > 1 ? 's' : ''}`}
                    </span>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                <div class="item-price">
                    <div class="price">${formatPrice(item.totalPrice)}</div>
                    <div class="price-details">
                        ${item.type === 'rent'
                            ? `${formatPrice(item.price)}/month x ${item.rentMonths} months x ${item.quantity}`
                            : `${formatPrice(item.price)} x ${item.quantity}`
                        }
                    </div>
                </div>
                <button class="item-remove" onclick="removeFromCart(${index})" title="Remove item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join('');
    }

    // Update summary
    updateCartSummary(cart);
}

function updateQuantity(index, change) {
    const cart = getCart();
    if (index < 0 || index >= cart.length) return;

    cart[index].quantity = Math.max(1, cart[index].quantity + change);

    // Recalculate total price
    if (cart[index].type === 'rent') {
        cart[index].totalPrice = cart[index].price * cart[index].rentMonths * cart[index].quantity;
    } else {
        cart[index].totalPrice = cart[index].price * cart[index].quantity;
    }

    saveCart(cart);
    renderCart();
}

function removeFromCart(index) {
    const cart = getCart();
    if (index < 0 || index >= cart.length) return;

    const removedItem = cart[index].name;
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();

    showToast('info', 'Item Removed', `${removedItem} has been removed from your cart`);
}

function clearCart() {
    if (!confirm('Are you sure you want to clear your entire cart?')) return;
    saveCart([]);
    renderCart();
    showToast('info', 'Cart Cleared', 'All items have been removed from your cart');
}

function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const delivery = 0; // Free delivery
    const total = subtotal + delivery;

    const subtotalEl = document.getElementById('cartSubtotal');
    const deliveryEl = document.getElementById('cartDelivery');
    const totalEl = document.getElementById('cartTotal');
    const totalItems = document.getElementById('totalItems');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (deliveryEl) deliveryEl.textContent = 'FREE';
    if (totalEl) totalEl.textContent = formatPrice(total);
    if (totalItems) totalItems.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// ============================================
// CHECKOUT / PLACE ORDER
// ============================================
async function placeOrder() {
    const user = auth.currentUser;
    if (!user) {
        showToast('warning', 'Login Required', 'Please login to place an order');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    const cart = getCart();
    if (cart.length === 0) {
        showToast('warning', 'Empty Cart', 'Please add items to your cart before checking out');
        return;
    }

    // Get user data for delivery address
    const userData = await getUserData(user.uid);
    if (!userData || !userData.address) {
        showToast('warning', 'Address Needed', 'Please update your address in your profile before ordering');
        setTimeout(() => window.location.href = 'profile.html', 1500);
        return;
    }

    if (!confirm('Confirm your order? Payment will be Cash on Delivery.')) return;

    showLoader();

    try {
        const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        const hasRental = cart.some(item => item.type === 'rent');
        const maxRentDuration = Math.max(...cart.map(item => item.rentMonths || 0));

        const orderData = {
            orderId: generateOrderId(),
            userId: user.uid,
            userEmail: user.email,
            userName: userData.name || '',
            userMobile: userData.mobile || '',
            userAddress: userData.address || '',
            products: cart.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                type: item.type,
                rentMonths: item.rentMonths || 0,
                totalPrice: item.totalPrice,
                category: item.category
            })),
            totalAmount: totalAmount,
            type: hasRental ? 'rent' : 'buy',
            rentDuration: maxRentDuration,
            status: 'pending',
            paymentMethod: 'Cash on Delivery',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('orders').add(orderData);

        // Clear cart
        saveCart([]);

        hideLoader();

        showToast('success', 'Order Placed!', `Order #${orderData.orderId} has been placed successfully. Payment: Cash on Delivery.`);

        // Redirect to profile/orders
        setTimeout(() => {
            window.location.href = 'profile.html#orders';
        }, 2000);

    } catch (error) {
        console.error('Error placing order:', error);
        hideLoader();
        showToast('error', 'Order Failed', 'Failed to place order: ' + error.message);
    }
}

// ============================================
// ADD TO CART (from store page)
// ============================================
function quickAddToCart(productId) {
    const user = auth.currentUser;
    if (!user) {
        showToast('warning', 'Login Required', 'Please login to add items to cart');
        return;
    }

    // Find product in allProducts array
    const product = allProducts?.find(p => p.id === productId);
    if (!product) {
        showToast('error', 'Error', 'Product not found');
        return;
    }

    let cart = getCart();

    const existingIndex = cart.findIndex(item =>
        item.productId === productId && item.type === 'buy'
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
        cart[existingIndex].totalPrice = cart[existingIndex].price * cart[existingIndex].quantity;
    } else {
        cart.push({
            productId: productId,
            name: product.name,
            image: product.image || getProductImage(product.imageKey),
            price: product.price,
            type: 'buy',
            rentMonths: 0,
            quantity: 1,
            totalPrice: product.price,
            category: product.category
        });
    }

    saveCart(cart);
    showToast('success', 'Added to Cart', `${product.name} added to cart`);
}
