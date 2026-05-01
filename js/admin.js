/* ============================================
   LRC MEDI+ HEALTHCARE - Admin Module
   Handles product CRUD, order management
   ============================================ */

let adminProducts = [];
let adminOrders = [];
let editingProductId = null;

// ============================================
// ADMIN INITIALIZATION
// ============================================
async function initAdminPanel() {
    const user = auth.currentUser;
    if (!user || !isAdmin(user.email)) {
        showToast('error', 'Access Denied', 'Admin access required');
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    showLoader();
    await loadAdminStats();
    await loadAdminProducts();
    await loadAdminOrders();
    hideLoader();
}

// ============================================
// ADMIN STATS
// ============================================
async function loadAdminStats() {
    try {
        const productsSnap = await db.collection('products').get();
        const ordersSnap = await db.collection('orders').get();
        const usersSnap = await db.collection('users').get();

        let totalRevenue = 0;
        let pendingOrders = 0;
        ordersSnap.forEach(doc => {
            const order = doc.data();
            if (order.status !== 'cancelled') {
                totalRevenue += order.totalAmount || 0;
            }
            if (order.status === 'pending') pendingOrders++;
        });

        const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
        el('statProducts', productsSnap.size);
        el('statOrders', ordersSnap.size);
        el('statUsers', usersSnap.size);
        el('statRevenue', formatPrice(totalRevenue));
        el('statPending', pendingOrders);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ============================================
// PRODUCT MANAGEMENT
// ============================================
async function loadAdminProducts() {
    try {
        const snapshot = await db.collection('products').get();
        adminProducts = [];
        snapshot.forEach(doc => {
            adminProducts.push({ id: doc.id, ...doc.data() });
        });
        renderAdminProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('error', 'Error', 'Failed to load products');
    }
}

function renderAdminProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (adminProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding:40px">No products found. Add your first product above.</td></tr>';
        return;
    }

    tbody.innerHTML = adminProducts.map(product => `
        <tr>
            <td>
                <img src="${product.image || getProductImage(product.imageKey)}" 
                     alt="${product.name}" class="product-thumb"
                     onerror="this.src='${generatePlaceholderSVG(product.name, 50, 40)}'">
            </td>
            <td><strong>${product.name}</strong></td>
            <td><span class="badge badge-primary">${product.category}</span></td>
            <td><strong>${formatPrice(product.price)}</strong></td>
            <td>${formatPrice(product.rentPricePerMonth)}/month</td>
            <td>
                <button class="btn btn-sm ${product.isTrending ? 'btn-secondary' : 'btn-ghost'}" 
                        onclick="toggleTrending('${product.id}', ${!product.isTrending})"
                        title="${product.isTrending ? 'Remove from trending' : 'Mark as trending'}">
                    <i class="fa-solid fa-fire"></i>
                    ${product.isTrending ? 'Yes' : 'No'}
                </button>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProduct('${product.id}')" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function handleProductTypeChange() {
    const type = document.getElementById('productType').value;
    const catSelect = document.getElementById('productCategory');
    
    const equipmentCats = [
        'Wheelchair', 'Hospital Beds', 'Surgical Equipment', 'Personal Care', 
        'Other Healthcare Devices', 'Walkers', 'BiPAP / CPAP Ventilators', 'Oxygen Concentrators'
    ];
    
    const medicineCats = [
        'Pain Relief', 'Antibiotics', 'Vitamins & Supplements', 'First Aid',
        'Diabetes Care', 'Heart Care', 'Digestives', 'Respiratory Care'
    ];
    
    const catsToShow = type === 'medicine' ? medicineCats : equipmentCats;
    
    catSelect.innerHTML = '<option value="">Select Category</option>' + 
        catsToShow.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

async function handleProductSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDesc').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const rentPrice = parseFloat(document.getElementById('productRentPrice').value);
    const productType = document.getElementById('productType').value || 'equipment';
    const category = document.getElementById('productCategory').value;
    const imageKey = document.getElementById('productImageKey').value.trim();

    if (!name || !description || isNaN(price) || isNaN(rentPrice) || !category) {
        showToast('warning', 'Missing Fields', 'Please fill in all required fields');
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-inline"></span> Saving...';
    btn.disabled = true;

    try {
        const productData = {
            name,
            description,
            price,
            rentPricePerMonth: rentPrice,
            productType,
            category,
            imageKey: imageKey || name.toLowerCase().replace(/\s+/g, '-'),
            image: CATEGORY_IMAGES[category] || getProductImage(imageKey || name.toLowerCase().replace(/\s+/g, '-')),
            isTrending: document.getElementById('productTrending')?.checked || false
        };

        if (editingProductId) {
            await db.collection('products').doc(editingProductId).update(productData);
            showToast('success', 'Product Updated', `${name} has been updated successfully`);
            editingProductId = null;
        } else {
            productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('products').add(productData);
            showToast('success', 'Product Added', `${name} has been added to the store`);
        }

        e.target.reset();
        document.getElementById('productFormTitle').textContent = 'Add New Product';
        document.getElementById('cancelEdit')?.classList.add('hidden');

        await loadAdminProducts();
        await loadAdminStats();

    } catch (error) {
        showToast('error', 'Error', 'Failed to save product: ' + error.message);
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}

function editProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;

    editingProductId = productId;

    // Set Product Type first so categories update
    const productType = product.productType || 'equipment';
    const typeSelect = document.getElementById('productType');
    if(typeSelect) {
        typeSelect.value = productType;
        handleProductTypeChange(); // trigger category repopulation
    }

    document.getElementById('productName').value = product.name;
    document.getElementById('productDesc').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productRentPrice').value = product.rentPricePerMonth;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImageKey').value = product.imageKey || '';
    document.getElementById('productTrending').checked = product.isTrending || false;

    document.getElementById('productFormTitle').textContent = 'Edit Product';
    document.getElementById('cancelEdit')?.classList.remove('hidden');

    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
}

function cancelProductEdit() {
    editingProductId = null;
    document.getElementById('productForm').reset();
    document.getElementById('productFormTitle').textContent = 'Add New Product';
    document.getElementById('cancelEdit')?.classList.add('hidden');
}

async function deleteProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!confirm(`Are you sure you want to delete "${product?.name || 'this product'}"?`)) return;

    showLoader();
    try {
        await db.collection('products').doc(productId).delete();
        showToast('success', 'Product Deleted', 'Product has been removed from the store');
        await loadAdminProducts();
        await loadAdminStats();
    } catch (error) {
        showToast('error', 'Error', 'Failed to delete product: ' + error.message);
    }
    hideLoader();
}

async function toggleTrending(productId, value) {
    try {
        await db.collection('products').doc(productId).update({ isTrending: value });
        showToast('success', 'Updated', `Product ${value ? 'marked as' : 'removed from'} trending`);
        await loadAdminProducts();
    } catch (error) {
        showToast('error', 'Error', 'Failed to update trending status');
    }
}

// ============================================
// ORDER MANAGEMENT
// ============================================
async function loadAdminOrders() {
    try {
        // NOTE: No .orderBy() to avoid composite index requirement — sorted in JS below
        const snapshot = await db.collection('orders').get();

        adminOrders = [];
        snapshot.forEach(doc => {
            adminOrders.push({ id: doc.id, ...doc.data() });
        });

        // Sort by createdAt descending in JS
        adminOrders.sort((a, b) => {
            const ta = a.createdAt?.toMillis?.() || 0;
            const tb = b.createdAt?.toMillis?.() || 0;
            return tb - ta;
        });

        renderAdminOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('error', 'Error', 'Failed to load orders');
    }
}

function renderAdminOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    if (adminOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding:40px">No orders yet.</td></tr>';
        return;
    }

    tbody.innerHTML = adminOrders.map(order => {
        const statusClass = `status-${(order.status || 'pending').toLowerCase()}`;
        const itemNames = order.products ? order.products.map(p => p.name).join(', ') : 'N/A';

        return `
            <tr>
                <td><strong>#${order.orderId || order.id.substring(0, 8).toUpperCase()}</strong></td>
                <td>
                    <div><strong>${order.userName || 'N/A'}</strong></div>
                    <div style="font-size: 0.8rem; margin-top: 4px; color: var(--text-color);">
                        <i class="fa-solid fa-envelope" style="width: 14px; opacity: 0.7;"></i> ${order.userEmail || 'N/A'}<br>
                        <i class="fa-solid fa-phone" style="width: 14px; opacity: 0.7;"></i> ${order.userMobile || 'N/A'}<br>
                        <div style="display: flex; margin-top: 4px; gap: 4px;">
                            <i class="fa-solid fa-location-dot" style="width: 14px; opacity: 0.7; margin-top: 2px;"></i>
                            <span style="max-width: 200px; line-height: 1.3; white-space: normal;">
                                ${order.userAddress || 'No Address Provided'}
                            </span>
                        </div>
                    </div>
                </td>
                <td>
                    <div style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${itemNames}">
                        ${itemNames}
                    </div>
                    <small class="text-muted">${order.type === 'rent' ? 'Rental' : 'Purchase'}</small>
                </td>
                <td><strong>${formatPrice(order.totalAmount)}</strong></td>
                <td>${formatDate(order.createdAt)}</td>
                <td><span class="order-status ${statusClass}">${order.status || 'pending'}</span></td>
                <td>
                    <select class="form-control" style="min-width:120px;padding:6px 10px;font-size:0.75rem" 
                            onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            </tr>`;
    }).join('');
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await db.collection('orders').doc(orderId).update({ status: newStatus });
        showToast('success', 'Status Updated', `Order status changed to ${newStatus}`);

        const order = adminOrders.find(o => o.id === orderId);
        if (order) order.status = newStatus;
        renderAdminOrders();
        loadAdminStats();
    } catch (error) {
        showToast('error', 'Error', 'Failed to update order status');
    }
}

// ============================================
// ADMIN TAB SWITCHING
// ============================================
function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.admin-nav a').forEach(el => el.classList.remove('active'));

    const tabContent = document.getElementById(`admin-${tab}`);
    const tabLink = document.querySelector(`.admin-nav a[data-tab="${tab}"]`);

    if (tabContent) tabContent.classList.remove('hidden');
    if (tabLink) tabLink.classList.add('active');
}
