/* ============================================
   LRC MEDI+ HEALTHCARE - Firebase Configuration
   ============================================ */

// ============================================
// FIREBASE CONFIGURATION
// NOTE: This project uses the Firebase CDN Compat SDK (loaded via <script> tags).
// Do NOT use ES module imports here — use firebase.initializeApp() directly.
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyCG9WlRHqox8Klw1A8rPE0Hvs4n2G_DmBk",
    authDomain: "lrc-medi-plus.firebaseapp.com",
    projectId: "lrc-medi-plus",
    storageBucket: "lrc-medi-plus.firebasestorage.app",
    messagingSenderId: "786638236444",
    appId: "1:786638236444:web:e4c94a790df89d01f968d9",
    measurementId: "G-BSLMGKG2CL"
};

// ============================================
// INITIALIZE FIREBASE (CDN Compat mode)
// ============================================
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db   = firebase.firestore();

// _isFirebaseConfigured is always true now (real credentials are set)
const _isFirebaseConfigured = true;


// ============================================
// ADMIN EMAIL (Hardcoded for admin access)
// ============================================
const ADMIN_EMAIL = "mediiplus.healthcare@gmail.com";

// ============================================
// PRODUCT IMAGE MAP (Static placeholder images)
// ============================================
const PRODUCT_IMAGES = {
    'manual-wheelchair': 'images/banner.jpg',
    'electric-wheelchair': 'https://images.unsplash.com/photo-1589810635657-232948472d98?w=400&h=300&fit=crop',
    'lightweight-wheelchair': 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&h=300&fit=crop',
    'standard-hospital-bed': 'images/hospital-bed-1.jpg',
    'icu-bed': 'images/hospital-bed-1.jpg',
    'semi-electric-bed': 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=400&h=300&fit=crop',
    'surgical-kit': 'https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=400&h=300&fit=crop',
    'suction-machine': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=300&fit=crop',
    'oxygen-concentrator': 'images/flyer.jpg',
    'bp-monitor': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop',
    'pulse-oximeter': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    'nebulizer': 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400&h=300&fit=crop',
    'patient-monitor': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop',
    'infusion-pump': 'https://images.unsplash.com/photo-1530497610245-b1baa2b64a2e?w=400&h=300&fit=crop',
    'cpap-machine': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop'
};

const CATEGORY_IMAGES = {
    // Equipment Categories
    'Wheelchair': 'images/cat_wheelchair.png',
    'Hospital Beds': 'images/cat_hospital_bed.png',
    'Surgical Equipment': 'images/cat_surgical_equipment.png',
    'Personal Care': 'images/cat_personal_care.png',
    'Other Healthcare Devices': 'images/cat_other_devices.png',
    'Walkers': 'images/cat_walkers.png',
    'BiPAP / CPAP Ventilators': 'images/cat_ventilators.png',
    'Oxygen Concentrators': 'images/cat_oxygen.png',
    
    // Medicine Categories
    'Pain Relief': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    'Antibiotics': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop',
    'Vitamins & Supplements': 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=400&h=300&fit=crop',
    'First Aid': 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b5?w=400&h=300&fit=crop',
    'Diabetes Care': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop',
    'Heart Care': 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=300&fit=crop',
    'Digestives': 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=300&fit=crop',
    'Respiratory Care': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=300&fit=crop'
};

const CATEGORY_ICONS = {
    // Equipment Icons
    'Wheelchair': 'fa-wheelchair',
    'Hospital Beds': 'fa-bed',
    'Surgical Equipment': 'fa-scissors',
    'Personal Care': 'fa-heart-pulse',
    'Other Healthcare Devices': 'fa-laptop-medical',
    'Walkers': 'fa-person-walking-with-cane',
    'BiPAP / CPAP Ventilators': 'fa-lungs',
    'Oxygen Concentrators': 'fa-wind',
    
    // Medicine Icons
    'Pain Relief': 'fa-pills',
    'Antibiotics': 'fa-capsules',
    'Vitamins & Supplements': 'fa-leaf',
    'First Aid': 'fa-briefcase-medical',
    'Diabetes Care': 'fa-syringe',
    'Heart Care': 'fa-heart-circle-check',
    'Digestives': 'fa-stomach',
    'Respiratory Care': 'fa-lungs-virus'
};

// ============================================
// SEED DATA - Initial Products
// ============================================
const SEED_PRODUCTS = [
    // Wheelchair Category
    {
        name: 'Manual Wheelchair',
        description: 'Durable manual wheelchair with comfortable seating and easy-fold mechanism. Suitable for indoor and outdoor use. Features adjustable footrests and armrests for maximum comfort.',
        price: 5999,
        rentPricePerMonth: 150,
        category: 'Wheelchair',
        imageKey: 'manual-wheelchair',
        isTrending: true
    },
    {
        name: 'Electric Wheelchair',
        description: 'Battery-powered electric wheelchair with joystick control. Long battery life, comfortable cushioned seat, and smooth ride technology. Ideal for users needing powered mobility.',
        price: 45000,
        rentPricePerMonth: 800,
        category: 'Wheelchair',
        imageKey: 'electric-wheelchair',
        isTrending: true
    },
    {
        name: 'Lightweight Folding Wheelchair',
        description: 'Ultra-lightweight aluminum frame wheelchair that folds compactly for travel. Weighs only 12 kg, making it easy to transport and store.',
        price: 8500,
        rentPricePerMonth: 200,
        category: 'Wheelchair',
        imageKey: 'lightweight-wheelchair',
        isTrending: false
    },
    // Hospital Beds Category
    {
        name: 'Standard Hospital Bed',
        description: 'Manual crank hospital bed with adjustable head and foot sections. Includes side rails and IV pole holder. Perfect for home care and nursing facilities.',
        price: 18000,
        rentPricePerMonth: 500,
        category: 'Hospital Beds',
        imageKey: 'standard-hospital-bed',
        isTrending: true
    },
    {
        name: 'ICU Bed with Side Rails',
        description: 'Premium ICU-grade bed with full electric adjustment, CPR function, and collapsible side rails. Features Trendelenburg positioning and backup battery.',
        price: 35000,
        rentPricePerMonth: 900,
        category: 'Hospital Beds',
        imageKey: 'icu-bed',
        isTrending: true
    },
    {
        name: 'Semi-Electric Hospital Bed',
        description: 'Cost-effective semi-electric bed with electric head and foot adjustment. Manual bed height adjustment. Includes innerspring mattress.',
        price: 25000,
        rentPricePerMonth: 650,
        category: 'Hospital Beds',
        imageKey: 'semi-electric-bed',
        isTrending: false
    },
    // Surgical Equipment Category
    {
        name: 'Surgical Instrument Kit',
        description: 'Complete surgical instrument kit with 42 pieces including forceps, scissors, scalpel handles, and retractors. Made from premium stainless steel.',
        price: 12000,
        rentPricePerMonth: 400,
        category: 'Surgical Equipment',
        imageKey: 'surgical-kit',
        isTrending: false
    },
    {
        name: 'Portable Suction Machine',
        description: 'Medical-grade portable suction machine with adjustable suction pressure. Battery operated with AC charging. Ideal for emergency and home care.',
        price: 15000,
        rentPricePerMonth: 450,
        category: 'Surgical Equipment',
        imageKey: 'suction-machine',
        isTrending: true
    },
    {
        name: 'Oxygen Concentrator 5L',
        description: 'Medical oxygen concentrator with 5 liters per minute output. Low noise operation, built-in nebulizer port, and oxygen purity alarm system.',
        price: 45000,
        rentPricePerMonth: 1000,
        category: 'Surgical Equipment',
        imageKey: 'oxygen-concentrator',
        isTrending: true
    },
    // Personal Care Category
    {
        name: 'Digital Blood Pressure Monitor',
        description: 'Automatic digital blood pressure monitor with irregular heartbeat detection. Large LCD display, memory for 120 readings, and WHO indicator.',
        price: 2500,
        rentPricePerMonth: 80,
        category: 'Personal Care',
        imageKey: 'bp-monitor',
        isTrending: false
    },
    {
        name: 'Fingertip Pulse Oximeter',
        description: 'Medical-grade pulse oximeter for measuring blood oxygen saturation (SpO2) and pulse rate. OLED display with auto-rotate feature.',
        price: 1200,
        rentPricePerMonth: 50,
        category: 'Personal Care',
        imageKey: 'pulse-oximeter',
        isTrending: false
    },
    {
        name: 'Nebulizer Machine',
        description: 'Compressor nebulizer for respiratory therapy. Efficient drug delivery system with adjustable flow rate. Comes with adult and child masks.',
        price: 3500,
        rentPricePerMonth: 100,
        category: 'Personal Care',
        imageKey: 'nebulizer',
        isTrending: true
    },
    // Other Healthcare Devices Category
    {
        name: 'Multi-Parameter Patient Monitor',
        description: 'Advanced patient monitor tracking ECG, SpO2, NIBP, temperature, and respiration rate. 12.1-inch color display with alarm management.',
        price: 65000,
        rentPricePerMonth: 1500,
        category: 'Other Healthcare Devices',
        imageKey: 'patient-monitor',
        isTrending: true
    },
    {
        name: 'Infusion Pump',
        description: 'Volumetric infusion pump with precise flow rate control. Anti-free-flow mechanism, air bubble detection, and dose error reduction system.',
        price: 28000,
        rentPricePerMonth: 700,
        category: 'Other Healthcare Devices',
        imageKey: 'infusion-pump',
        isTrending: false
    },
    {
        name: 'CPAP Machine',
        description: 'Continuous Positive Airway Pressure machine for sleep apnea treatment. Auto-adjusting pressure, humidifier included, and silicone mask.',
        price: 38000,
        rentPricePerMonth: 900,
        category: 'Other Healthcare Devices',
        productType: 'equipment',
        imageKey: 'cpap-machine',
        isTrending: false
    },
    // ============== MEDICINES ==============
    {
        name: 'Paracetamol 500mg (Strip of 15)',
        description: 'Effective pain relief and fever reduction medication. Can be used for headaches, toothaches, and minor body pains.',
        price: 25,
        rentPricePerMonth: 25, // For UI consistency
        category: 'Pain Relief',
        productType: 'medicine',
        imageKey: 'paracetamol',
        isTrending: true
    },
    {
        name: 'Amoxicillin 250mg (Strip of 10)',
        description: 'Broad-spectrum penicillin antibiotic used to treat various bacterial infections. Prescription required.',
        price: 85,
        rentPricePerMonth: 85,
        category: 'Antibiotics',
        productType: 'medicine',
        imageKey: 'amoxicillin',
        isTrending: true
    },
    {
        name: 'Multivitamin Supplements (Bottle of 60)',
        description: 'Daily multivitamin to support overall health, energy levels, and immune system function.',
        price: 350,
        rentPricePerMonth: 350,
        category: 'Vitamins & Supplements',
        productType: 'medicine',
        imageKey: 'vitamins',
        isTrending: false
    },
    {
        name: 'Premium First Aid Kit',
        description: 'Complete emergency first aid kit with bandages, antiseptic wipes, gauze dressings, and basic medical scissors.',
        price: 550,
        rentPricePerMonth: 550,
        category: 'First Aid',
        productType: 'medicine',
        imageKey: 'first-aid',
        isTrending: true
    },
    {
        name: 'Metformin Hydrochloride 500mg',
        description: 'Oral antidiabetic medication used to treat type 2 diabetes and manage blood sugar levels.',
        price: 60,
        rentPricePerMonth: 60,
        category: 'Diabetes Care',
        productType: 'medicine',
        imageKey: 'metformin',
        isTrending: false
    },
    {
        name: 'Digene Antacid Gel (200ml)',
        description: 'Fast acting antacid gel providing immediate relief from acidity, heartburn, and gas indigestion.',
        price: 120,
        rentPricePerMonth: 120,
        category: 'Digestives',
        productType: 'medicine',
        imageKey: 'digene',
        isTrending: true
    }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get product image URL by image key
 */
function getProductImage(imageKey) {
    return PRODUCT_IMAGES[imageKey] || generatePlaceholderSVG(imageKey || 'Product');
}

/**
 * Generate an SVG placeholder image as a data URI
 */
function generatePlaceholderSVG(text, width = 400, height = 300) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#e3f2fd"/>
                <stop offset="100%" style="stop-color:#f0f4f8"/>
            </linearGradient>
        </defs>
        <rect fill="url(#bg)" width="${width}" height="${height}"/>
        <text fill="#94a3b8" font-family="Arial, sans-serif" font-size="14" font-weight="600" text-anchor="middle" x="${width / 2}" y="${height / 2 - 10}">
            <tspan x="${width / 2}" dy="0">${escapeXml(text.replace(/-/g, ' '))}</tspan>
        </text>
        <text fill="#cbd5e1" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" x="${width / 2}" y="${height / 2 + 15}">LRC Medi+</text>
    </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function escapeXml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Format price in INR
 */
function formatPrice(price) {
    return '\u20B9' + Number(price).toLocaleString('en-IN');
}

/**
 * Show toast notification
 */
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        warning: 'fa-triangle-exclamation',
        info: 'fa-circle-info'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${icons[type] || icons.info}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 4000);
}

/**
 * Show/hide loading overlay
 */
function showLoader() {
    const loader = document.getElementById('loaderOverlay');
    if (loader) loader.classList.add('show');
}

function hideLoader() {
    const loader = document.getElementById('loaderOverlay');
    if (loader) loader.classList.remove('show');
}

/**
 * Seed products into Firestore if collection is empty
 */
async function seedProducts() {
    try {
        const snapshot = await db.collection('products').limit(1).get();
        let itemsToSeed = [];

        if (snapshot.empty) {
            // Seed everything if totally empty
            itemsToSeed = SEED_PRODUCTS;
        } else {
            // Check if there are any medicines
            const medSnap = await db.collection('products').where('productType', '==', 'medicine').limit(1).get();
            if (medSnap.empty) {
                // If no medicines exist, filter SEED_PRODUCTS to only medicines and seed them
                itemsToSeed = SEED_PRODUCTS.filter(p => p.productType === 'medicine');
            }
        }

        if (itemsToSeed.length > 0) {
            console.log('Seeding products...');
            const batch = db.batch();
            itemsToSeed.forEach(product => {
                const ref = db.collection('products').doc();
                const productType = product.productType || 'equipment';
                batch.set(ref, {
                    ...product,
                    productType,
                    image: getProductImage(product.imageKey) || CATEGORY_IMAGES[product.category],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            await batch.commit();
            console.log('Products seeded successfully!');
        }
    } catch (error) {
        console.error('Error seeding products:', error);
    }
}

/**
 * Check if current user is admin
 */
function isAdmin(email) {
    return email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Get current user data from Firestore
 */
async function getUserData(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

/**
 * Generate a short order ID
 */
function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'LRC-';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Format date for display
 */
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Initialize dark mode from localStorage
 * (The inline <script> in <head> already sets it before CSS loads;
 *  this ensures it stays correct if called after header injection too)
 */
function initTheme() {
    const savedTheme = localStorage.getItem('lrc-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('lrc-theme', next);
}

/**
 * Initialize common page elements
 */
function initCommonUI() {
    // Theme
    initTheme();

    // Theme toggle button
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 20);
        }
    });

    // Mobile menu toggle removed (replaced by bottom nav)

    // User menu dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            userDropdown.classList.remove('show');
        });
    }

    // Update cart badge
    updateCartBadge();
}

/**
 * Update cart badge count
 */
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('lrc-cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

/**
 * Update navigation based on auth state
 */
function updateNavAuth(user) {
    const authLinks = document.getElementById('authLinks');
    const userMenu = document.getElementById('userMenu');
    const adminLink = document.getElementById('adminLink');

    if (user) {
        if (authLinks) authLinks.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        if (adminLink) {
            adminLink.classList.toggle('hidden', !isAdmin(user.email));
        }

        // Update user name display
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay) {
            getUserData(user.uid).then(data => {
                if (data) {
                    userNameDisplay.textContent = data.name || user.email.split('@')[0];
                }
            });
        }
    } else {
        if (authLinks) authLinks.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
        if (adminLink) adminLink.classList.add('hidden');
    }
}

// ============================================
// LOGO SVG HTML (reusable across pages)
// ============================================
const LOGO_SVG = `<img src="images/main-logo.png" alt="LRC Medi+ Healthcare Logo" style="width: 100%; height: 100%; object-fit: contain;">`;

// ============================================
// COMMON HEADER HTML
// ============================================
function getHeaderHTML(activePage) {
    return `
    <header class="header" id="mainHeader">
        <div class="container">
            <a href="index.html" class="logo">
                <div class="logo-icon">${LOGO_SVG}</div>
                <div class="logo-text">
                    <span class="brand-name">LRC <span>Medi+</span></span>
                    <span class="brand-sub">Healthcare</span>
                </div>
            </a>

            <nav class="nav-links" id="navLinks">
                <a href="index.html" class="${activePage === 'home' ? 'active' : ''}">
                    <i class="fa-solid fa-house"></i> <span>Home</span>
                </a>
                <a href="store.html" class="${activePage === 'store' ? 'active' : ''}">
                    <i class="fa-solid fa-stethoscope"></i> <span>Store</span>
                </a>
                <a href="medicines.html" class="${activePage === 'medicines' ? 'active' : ''}">
                    <i class="fa-solid fa-pills"></i> <span>Rx</span>
                </a>
                <a href="cart.html" class="cart-link ${activePage === 'cart' ? 'active' : ''}">
                    <i class="fa-solid fa-cart-shopping"></i> <span>Cart</span>
                    <span class="cart-badge" id="cartBadge" style="display:none">0</span>
                </a>
                <a href="admin.html" class="${activePage === 'admin' ? 'active' : ''} hidden" id="adminLink">
                    <i class="fa-solid fa-shield-halved"></i> Admin
                </a>
            </nav>

            <div class="nav-actions">
                <div class="theme-toggle-icon">
                    <i class="fa-solid fa-sun"></i>
                    <div class="theme-toggle" id="themeToggle" title="Toggle dark mode"></div>
                    <i class="fa-solid fa-moon"></i>
                </div>

                <div id="authLinks">
                    <a href="login.html" class="btn btn-outline btn-sm">
                        <i class="fa-solid fa-right-to-bracket"></i> Login
                    </a>
                </div>

                <div class="user-menu hidden" id="userMenu">
                    <button class="user-menu-btn" id="userMenuBtn">
                        <i class="fa-solid fa-circle-user"></i>
                        <span id="userNameDisplay">User</span>
                        <i class="fa-solid fa-chevron-down" style="font-size:0.6rem"></i>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="profile.html">
                            <i class="fa-solid fa-user"></i> My Profile
                        </a>
                        <a href="profile.html#orders">
                            <i class="fa-solid fa-box"></i> My Orders
                        </a>
                        <div class="divider"></div>
                        <button onclick="handleLogout()">
                            <i class="fa-solid fa-right-from-bracket"></i> Logout
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </header>`;
}

// ============================================
// COMMON FOOTER HTML
// ============================================
function getFooterHTML() {
    return `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="index.html" class="logo">
                        <div class="logo-icon">${LOGO_SVG}</div>
                        <div class="logo-text">
                            <span class="brand-name">LRC <span>Medi+</span></span>
                            <span class="brand-sub">Healthcare</span>
                        </div>
                    </a>
                    <p>Hospital Equipment Material, Surgical &amp; Healthcare Product Rental and Sale. Serving Navi Mumbai with quality medical equipment.</p>
                    <div class="footer-contact">
                        <a href="tel:+919152295170"><i class="fa-solid fa-phone"></i> +91 91522 95170</a>
                        <a href="tel:+919699009192"><i class="fa-solid fa-phone"></i> +91 96990 09192</a>
                        <a href="mailto:mediiplus.healthcare@gmail.com"><i class="fa-solid fa-envelope"></i> mediiplus.healthcare@gmail.com</a>
                        <a href="#"><i class="fa-solid fa-location-dot"></i> Ulwe, Navi Mumbai &amp; Govandi, Mumbai</a>
                    </div>
                </div>
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="index.html"><i class="fa-solid fa-chevron-right"></i> Home</a></li>
                        <li><a href="store.html"><i class="fa-solid fa-chevron-right"></i> Store</a></li>
                        <li><a href="cart.html"><i class="fa-solid fa-chevron-right"></i> Cart</a></li>
                        <li><a href="profile.html"><i class="fa-solid fa-chevron-right"></i> Profile</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Categories</h4>
                    <ul>
                        <li><a href="store.html?category=Wheelchair"><i class="fa-solid fa-chevron-right"></i> Wheelchair</a></li>
                        <li><a href="store.html?category=Hospital Beds"><i class="fa-solid fa-chevron-right"></i> Hospital Beds</a></li>
                        <li><a href="store.html?category=Surgical Equipment"><i class="fa-solid fa-chevron-right"></i> Surgical Equipment</a></li>
                        <li><a href="store.html?category=Personal Care"><i class="fa-solid fa-chevron-right"></i> Personal Care</a></li>
                        <li><a href="store.html?category=Walkers"><i class="fa-solid fa-chevron-right"></i> Walkers</a></li>
                        <li><a href="store.html?category=BiPAP / CPAP Ventilators"><i class="fa-solid fa-chevron-right"></i> Ventilators</a></li>
                        <li><a href="store.html?category=Oxygen Concentrators"><i class="fa-solid fa-chevron-right"></i> Oxygen</a></li>
                        <li><a href="store.html?category=Other Healthcare Devices"><i class="fa-solid fa-chevron-right"></i> Other Devices</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="store.html"><i class="fa-solid fa-chevron-right"></i> Equipment Sale</a></li>
                        <li><a href="store.html"><i class="fa-solid fa-chevron-right"></i> Equipment Rental</a></li>
                        <li><a href="#"><i class="fa-solid fa-chevron-right"></i> Home Delivery</a></li>
                        <li><a href="#"><i class="fa-solid fa-chevron-right"></i> Support</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} LRC Medi+ Healthcare. All rights reserved. | Ajinkya Gursal</p>
                <div class="footer-social">
                    <a href="#" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                    <a href="#" title="YouTube"><i class="fa-brands fa-youtube"></i></a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Floating Contact Buttons -->
    <div class="float-btn-group">
        <a class="float-btn float-whatsapp"
           href="https://wa.me/919152295170?text=Hello%20LRC%20Medi%2B%20Healthcare!%20I%20would%20like%20to%20enquire%20about%20your%20medical%20equipment."
           target="_blank" rel="noopener noreferrer"
           data-tooltip="Chat on WhatsApp" title="Chat on WhatsApp">
            <i class="fa-brands fa-whatsapp"></i>
        </a>
        <a class="float-btn float-call"
           href="tel:+919152295170"
           data-tooltip="Call Us Now" title="Call Now">
            <i class="fa-solid fa-phone"></i>
        </a>
        <button class="float-btn float-chatbot" id="mainChatbotBtn" onclick="toggleChatbot()" data-tooltip="Chat with AI" title="Chat with AI" style="border:none; cursor:pointer;">
            <i class="fa-solid fa-robot"></i>
        </button>
    </div>`;
}

// ============================================
// COMMON PAGE COMPONENTS
// ============================================
function getToastContainerHTML() {
    return '<div class="toast-container" id="toastContainer"></div>';
}

function getLoaderHTML() {
    return `
    <div class="loader-overlay" id="loaderOverlay">
        <div class="loader">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    </div>`;
}

// Handle logout
function handleLogout() {
    auth.signOut().then(() => {
        localStorage.removeItem('lrc-cart'); // Clear the local cart
        showToast('success', 'Logged Out', 'You have been successfully logged out.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }).catch(error => {
        showToast('error', 'Error', error.message);
    });
}

// Load dynamically
document.addEventListener('DOMContentLoaded', () => {
    // 1. First attempt to load API keys
    const configScript = document.createElement('script');
    configScript.src = 'js/api-keys.js';
    
    // When config loads (or fails), load the chatbot script
    configScript.onload = loadChatbot;
    configScript.onerror = loadChatbot; 
    
    document.body.appendChild(configScript);
    
    function loadChatbot() {
        if (!document.getElementById('chatbot-script')) {
            const script = document.createElement('script');
            script.id = 'chatbot-script';
            script.src = 'js/chatbot.js';
            document.body.appendChild(script);
        }
    }
});
