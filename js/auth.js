/* ============================================
   LRC MEDI+ HEALTHCARE - Authentication Module
   Handles login, registration, and profile
   ============================================ */

// ============================================
// FORM VALIDATION
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateMobile(mobile) {
    const re = /^[6-9]\d{9}$/;
    return re.test(mobile);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showFieldError(fieldId, message) {
    const group = document.getElementById(fieldId)?.closest('.form-group');
    if (group) {
        group.classList.add('has-error');
        const errorEl = group.querySelector('.form-error');
        if (errorEl) errorEl.textContent = message;
    }
}

function clearFieldError(fieldId) {
    const group = document.getElementById(fieldId)?.closest('.form-group');
    if (group) {
        group.classList.remove('has-error');
    }
}

function clearAllErrors(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    }
}

// ============================================
// REGISTRATION
// ============================================
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const mobile = document.getElementById('regMobile').value.trim();
    const address = document.getElementById('regAddress').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Clear previous errors
    clearAllErrors('registerForm');

    // Validate
    let hasError = false;

    if (!name) {
        showFieldError('regName', 'Name is required');
        hasError = true;
    }

    if (!email) {
        showFieldError('regEmail', 'Email is required');
        hasError = true;
    } else if (!validateEmail(email)) {
        showFieldError('regEmail', 'Please enter a valid email address');
        hasError = true;
    }

    if (!mobile) {
        showFieldError('regMobile', 'Mobile number is required');
        hasError = true;
    } else if (!validateMobile(mobile)) {
        showFieldError('regMobile', 'Please enter a valid 10-digit mobile number');
        hasError = true;
    }

    if (!address) {
        showFieldError('regAddress', 'Address is required');
        hasError = true;
    }

    if (!password) {
        showFieldError('regPassword', 'Password is required');
        hasError = true;
    } else if (!validatePassword(password)) {
        showFieldError('regPassword', 'Password must be at least 6 characters');
        hasError = true;
    }

    if (password !== confirmPassword) {
        showFieldError('regConfirmPassword', 'Passwords do not match');
        hasError = true;
    }

    if (hasError) return;

    // Show loader
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-inline"></span> Creating Account...';
    btn.disabled = true;

    try {
        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Store additional user data in Firestore
        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            mobile: mobile,
            address: address,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Update display name
        await user.updateProfile({ displayName: name });

        showToast('success', 'Account Created!', 'Welcome to LRC Medi+ Healthcare');
        
        // Redirect after showing toast
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {
        console.error('Registration error:', error);
        let errorMsg = 'Registration failed. Please try again.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMsg = 'This email is already registered. Please login instead.';
                showFieldError('regEmail', errorMsg);
                break;
            case 'auth/weak-password':
                errorMsg = 'Password is too weak. Please use a stronger password.';
                showFieldError('regPassword', errorMsg);
                break;
            case 'auth/invalid-email':
                errorMsg = 'Invalid email address.';
                showFieldError('regEmail', errorMsg);
                break;
            default:
                showToast('error', 'Registration Failed', error.message);
        }

        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// ============================================
// LOGIN
// ============================================
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    clearAllErrors('loginForm');

    let hasError = false;

    if (!email) {
        showFieldError('loginEmail', 'Email is required');
        hasError = true;
    } else if (!validateEmail(email)) {
        showFieldError('loginEmail', 'Please enter a valid email address');
        hasError = true;
    }

    if (!password) {
        showFieldError('loginPassword', 'Password is required');
        hasError = true;
    }

    if (hasError) return;

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-inline"></span> Signing In...';
    btn.disabled = true;

    try {
        await auth.signInWithEmailAndPassword(email, password);

        showToast('success', 'Welcome Back!', 'You have been logged in successfully');

        // Check if admin and redirect accordingly
        if (isAdmin(email)) {
            setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
        } else {
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        }

    } catch (error) {
        console.error('Login error:', error);
        let errorMsg = 'Login failed. Please try again.';

        switch (error.code) {
            case 'auth/user-not-found':
                errorMsg = 'No account found with this email.';
                showFieldError('loginEmail', errorMsg);
                break;
            case 'auth/wrong-password':
                errorMsg = 'Incorrect password. Please try again.';
                showFieldError('loginPassword', errorMsg);
                break;
            case 'auth/too-many-requests':
                errorMsg = 'Too many failed attempts. Please try again later.';
                break;
            case 'auth/invalid-credential':
                errorMsg = 'Invalid email or password.';
                break;
            default:
                errorMsg = error.message;
        }

        showToast('error', 'Login Failed', errorMsg);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// ============================================
// ADMIN LOGIN
// ============================================
async function handleAdminLogin(e) {
    e.preventDefault();

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;

    clearAllErrors('adminLoginForm');

    if (!email || !password) {
        showToast('error', 'Error', 'Please fill in all fields');
        return;
    }

    // Check if email matches admin email
    if (!isAdmin(email)) {
        showToast('error', 'Access Denied', 'You are not authorized as admin.');
        showFieldError('adminEmail', 'This email is not authorized for admin access');
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-inline"></span> Authenticating...';
    btn.disabled = true;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        showToast('success', 'Admin Access Granted', 'Welcome to the admin panel');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } catch (error) {
        showToast('error', 'Login Failed', error.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// ============================================
// PROFILE MANAGEMENT
// ============================================
async function loadProfile() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    showLoader();

    try {
        let userData = await getUserData(user.uid);
        
        // If no user data document exists, fallback to basic auth info
        if (!userData) {
            userData = {
                name: user.displayName || '',
                email: user.email || '',
                mobile: '',
                address: ''
            };
        }

        // Update profile display
        const nameEl = document.getElementById('profileName');
        const emailEl = document.getElementById('profileEmail');
        const mobileEl = document.getElementById('profileMobile');
        const addressEl = document.getElementById('profileAddress');
        const avatarEl = document.getElementById('profileAvatar');

        if (nameEl) nameEl.textContent = userData.name || 'N/A';
        if (emailEl) emailEl.textContent = userData.email || user.email;
        if (mobileEl) mobileEl.textContent = userData.mobile || 'N/A';
        if (addressEl) addressEl.textContent = userData.address || 'N/A';
        if (avatarEl) avatarEl.textContent = (userData.name || user.displayName || user.email || 'U').charAt(0).toUpperCase();

        // Profile sidebar name
        const sidebarName = document.getElementById('sidebarName');
        const sidebarEmail = document.getElementById('sidebarEmail');
        if (sidebarName) sidebarName.textContent = userData.name || user.displayName || 'User';
        if (sidebarEmail) sidebarEmail.textContent = userData.email || user.email;

        // Fill edit form
        const editName = document.getElementById('editName');
        const editMobile = document.getElementById('editMobile');
        const editAddress = document.getElementById('editAddress');
        if (editName) editName.value = userData.name || user.displayName || '';
        if (editMobile) editMobile.value = userData.mobile || '';
        if (editAddress) editAddress.value = userData.address || '';

        // Load order history
        await loadOrderHistory(user.uid);

    } catch (error) {
        console.error('Error loading profile:', error);
        showToast('error', 'Error', 'Failed to load profile data');
    }

    hideLoader();
}

async function handleProfileUpdate(e) {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return;

    const name = document.getElementById('editName').value.trim();
    const mobile = document.getElementById('editMobile').value.trim();
    const address = document.getElementById('editAddress').value.trim();

    if (!name || !mobile || !address) {
        showToast('warning', 'Missing Fields', 'Please fill in all fields');
        return;
    }

    if (!validateMobile(mobile)) {
        showToast('error', 'Invalid Mobile', 'Please enter a valid 10-digit mobile number');
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-inline"></span> Saving...';
    btn.disabled = true;

    try {
        await db.collection('users').doc(user.uid).set({
            name: name,
            mobile: mobile,
            address: address
        }, { merge: true });

        await user.updateProfile({ displayName: name });

        showToast('success', 'Profile Updated', 'Your information has been saved');
        
        // Refresh profile display
        loadProfile();

        // Switch back to info tab
        switchProfileTab('info');

    } catch (error) {
        showToast('error', 'Update Failed', error.message);
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
}

async function loadOrderHistory(userId) {
    const container = document.getElementById('orderHistory');
    if (!container) return;

    try {
        // NOTE: Using only .where() avoids the composite index requirement.
        // We sort by createdAt in JavaScript after fetching.
        const snapshot = await db.collection('orders')
            .where('userId', '==', userId)
            .get();

        if (snapshot.empty) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-box-open empty-icon"></i>
                    <h3>No Orders Yet</h3>
                    <p>Your order history will appear here once you make a purchase.</p>
                    <a href="store.html" class="btn btn-primary">
                        <i class="fa-solid fa-store"></i> Browse Store
                    </a>
                </div>`;
            return;
        }

        // Sort by createdAt descending in JS (avoids Firestore composite index)
        const orders = [];
        snapshot.forEach(doc => orders.push({ _id: doc.id, ...doc.data() }));
        orders.sort((a, b) => {
            const ta = a.createdAt?.toMillis?.() || 0;
            const tb = b.createdAt?.toMillis?.() || 0;
            return tb - ta;
        });

        let html = '';
        orders.forEach(order => {
            const orderId = order.orderId || order._id.substring(0, 8).toUpperCase();

            let itemsHtml = '';
            if (order.products && order.products.length > 0) {
                order.products.forEach(item => {
                    itemsHtml += `
                        <div class="order-item">
                            <span class="item-name">${item.name}</span>
                            <span class="item-qty">x${item.quantity || 1}</span>
                            <span class="item-price">${formatPrice(item.totalPrice || item.price)}</span>
                        </div>`;
                });
            }

            const statusClass = `status-${(order.status || 'pending').toLowerCase()}`;
            const canCancel = order.status === 'pending';

            html += `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <span class="order-id">Order #${orderId}</span>
                            <span class="order-date">${formatDate(order.createdAt)}</span>
                        </div>
                        <span class="order-status ${statusClass}">${order.status || 'Pending'}</span>
                    </div>
                    <div class="order-body">
                        <div class="order-items">${itemsHtml}</div>
                        <div class="order-footer">
                            <div class="order-total">
                                Total: <span class="amount">${formatPrice(order.totalAmount)}</span>
                                ${order.type === 'rent' ? `<br><span class="text-sm text-muted">Rental: ${order.rentDuration} months</span>` : ''}
                            </div>
                            ${canCancel ? `
                                <button class="btn btn-danger btn-sm" onclick="cancelOrder('${order._id}')">
                                    <i class="fa-solid fa-xmark"></i> Cancel Order
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>`;
        });

        container.innerHTML = html;

    } catch (error) {
        console.error('Error loading orders:', error);
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-triangle-exclamation empty-icon"></i>
                <h3>Error Loading Orders</h3>
                <p>${error.message}</p>
            </div>`;
    }
}



async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    showLoader();

    try {
        await db.collection('orders').doc(orderId).update({
            status: 'cancelled'
        });

        showToast('success', 'Order Cancelled', 'Your order has been cancelled successfully');
        
        const user = auth.currentUser;
        if (user) {
            await loadOrderHistory(user.uid);
        }
    } catch (error) {
        showToast('error', 'Error', 'Failed to cancel order: ' + error.message);
    }

    hideLoader();
}

function switchProfileTab(tab) {
    document.querySelectorAll('.profile-tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.profile-nav a').forEach(el => el.classList.remove('active'));

    const tabContent = document.getElementById(`tab-${tab}`);
    const tabLink = document.querySelector(`.profile-nav a[data-tab="${tab}"]`);
    
    if (tabContent) tabContent.classList.remove('hidden');
    if (tabLink) tabLink.classList.add('active');
}

// ============================================
// PASSWORD TOGGLE
// ============================================
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input?.nextElementSibling?.querySelector('i') || input?.parentElement?.querySelector('.password-toggle i');
    
    if (input) {
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) icon.className = 'fa-solid fa-eye-slash';
        } else {
            input.type = 'password';
            if (icon) icon.className = 'fa-solid fa-eye';
        }
    }
}

// ============================================
// INPUT LISTENERS (Clear errors on type)
// ============================================
function initFormListeners() {
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', () => {
            clearFieldError(input.id);
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initFormListeners();
});
