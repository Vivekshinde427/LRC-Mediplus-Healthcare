/* ============================================
   LRC MEDI+ HEALTHCARE - Store Module
   Handles product listing, categories, search,
   trending slider, and product detail page
   ============================================ */

// ============================================
// HOMEPAGE: TRENDING SLIDER
// ============================================
let sliderPosition = 0;
let trendingProducts = [];
let sliderAutoPlay = null;

async function initTrendingSlider() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    const pageType = document.body.getAttribute('data-page-type');

    try {
        let query = db.collection('products').where('isTrending', '==', true);

        const snapshot = await query.get();

        if (snapshot.empty) {
            track.innerHTML = '<p class="text-center text-muted" style="padding:40px;width:100%">No trending products available.</p>';
            return;
        }

        trendingProducts = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const pType = data.productType || 'equipment';
            // If pageType is defined, only push matching products. 
            if (!pageType || pType === pageType) {
                trendingProducts.push({ id: doc.id, ...data });
            }
        });

        if (trendingProducts.length === 0) {
            track.innerHTML = '<p class="text-center text-muted" style="padding:40px;width:100%">No trending products available.</p>';
            return;
        }

        renderSlider(track);
        initSliderControls();
        startSliderAutoPlay();

    } catch (error) {
        console.error('Error loading trending products:', error);
        track.innerHTML = '<p class="text-center text-muted" style="padding:40px;width:100%">Failed to load trending products.</p>';
    }
}

function renderSlider(track) {
    track.innerHTML = trendingProducts.map(product => `
        <div class="slider-card" onclick="window.location.href='product.html?id=${product.id}'">
            <div class="card-image">
                <img src="${product.image || getProductImage(product.imageKey)}" 
                     alt="${product.name}"
                     onerror="this.src='${generatePlaceholderSVG(product.name)}'">
                <span class="trending-badge">
                    <i class="fa-solid fa-fire"></i> Trending
                </span>
            </div>
            <div class="card-body">
                <h4>${product.name}</h4>
                <div class="card-price">
                    ${formatPrice(product.price)}
                    ${product.productType === 'medicine' ? '' : `<span class="rent-price">Rent: ${formatPrice(product.rentPricePerDay)}/day</span>`}
                </div>
            </div>
        </div>
    `).join('');
}

function initSliderControls() {
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    if (prevBtn) prevBtn.addEventListener('click', () => slideSlider(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => slideSlider(1));

    updateSliderDots();
}

function slideSlider(direction) {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    const cardWidth = 296; // card width + gap
    const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
    const maxPosition = Math.max(0, trendingProducts.length - visibleCards);

    sliderPosition += direction;
    if (sliderPosition < 0) sliderPosition = maxPosition;
    if (sliderPosition > maxPosition) sliderPosition = 0;

    track.style.transform = `translateX(-${sliderPosition * cardWidth}px)`;
    updateSliderDots();

    // Reset autoplay
    stopSliderAutoPlay();
    startSliderAutoPlay();
}

function updateSliderDots() {
    const dotsContainer = document.getElementById('sliderDots');
    if (!dotsContainer) return;

    const track = document.getElementById('sliderTrack');
    const cardWidth = 296;
    const visibleCards = Math.floor((track?.parentElement?.offsetWidth || 900) / cardWidth);
    const totalDots = Math.max(1, trendingProducts.length - visibleCards + 1);

    let dotsHtml = '';
    for (let i = 0; i < totalDots; i++) {
        dotsHtml += `<div class="slider-dot ${i === sliderPosition ? 'active' : ''}" onclick="goToSlide(${i})"></div>`;
    }
    dotsContainer.innerHTML = dotsHtml;
}

function goToSlide(index) {
    const track = document.getElementById('sliderTrack');
    if (!track) return;

    const cardWidth = 296;
    sliderPosition = index;
    track.style.transform = `translateX(-${sliderPosition * cardWidth}px)`;
    updateSliderDots();

    stopSliderAutoPlay();
    startSliderAutoPlay();
}

function startSliderAutoPlay() {
    sliderAutoPlay = setInterval(() => slideSlider(1), 4000);
}

function stopSliderAutoPlay() {
    if (sliderAutoPlay) {
        clearInterval(sliderAutoPlay);
        sliderAutoPlay = null;
    }
}

// ============================================
// HOMEPAGE: CATEGORIES
// ============================================
async function initCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    const pageType = document.body.getAttribute('data-page-type') || 'equipment';

    const equipmentCategories = [
        { name: 'Wheelchair', icon: 'fa-wheelchair' },
        { name: 'Hospital Beds', icon: 'fa-bed' },
        { name: 'Surgical Equipment', icon: 'fa-scissors' },
        { name: 'Personal Care', icon: 'fa-heart-pulse' },
        { name: 'Walkers', icon: 'fa-person-walking-with-cane' },
        { name: 'BiPAP / CPAP Ventilators', icon: 'fa-lungs' },
        { name: 'Oxygen Concentrators', icon: 'fa-wind' },
        { name: 'Other Healthcare Devices', icon: 'fa-laptop-medical' }
    ];

    const medicineCategories = [
        { name: 'Pain Relief', icon: 'fa-pills' },
        { name: 'Antibiotics', icon: 'fa-capsules' },
        { name: 'Vitamins & Supplements', icon: 'fa-leaf' },
        { name: 'First Aid', icon: 'fa-briefcase-medical' },
        { name: 'Diabetes Care', icon: 'fa-syringe' },
        { name: 'Heart Care', icon: 'fa-heart-circle-check' },
        { name: 'Digestives', icon: 'fa-stomach' },
        { name: 'Respiratory Care', icon: 'fa-lungs-virus' }
    ];

    const categories = pageType === 'medicine' ? medicineCategories : equipmentCategories;

    const targetUrl = pageType === 'medicine' ? 'medicines.html' : 'store.html';

    // Get product counts per category
    const counts = {};
    try {
        const snapshot = await db.collection('products').get();
        snapshot.forEach(doc => {
            const cat = doc.data().category;
            counts[cat] = (counts[cat] || 0) + 1;
        });
    } catch (error) {
        console.error('Error getting product counts:', error);
    }

    grid.innerHTML = categories.map((cat, index) => `
        <div class="category-card animate-fadeInUp delay-${(index + 1) * 100}" 
             onclick="window.location.href='${targetUrl}?category=${encodeURIComponent(cat.name)}'">
            <div class="category-image">
                <img src="${CATEGORY_IMAGES[cat.name] || generatePlaceholderSVG(cat.name)}" 
                     alt="${cat.name}"
                     onerror="this.src='${generatePlaceholderSVG(cat.name)}'">
            </div>
            <div class="category-overlay">
                <div class="category-icon">
                    <i class="fa-solid ${cat.icon}"></i>
                </div>
                <div class="category-name">${cat.name}</div>
                <div class="category-count">${counts[cat.name] || 0} Products</div>
            </div>
            <div class="category-arrow">
                <i class="fa-solid fa-arrow-right"></i>
            </div>
        </div>
    `).join('');
}

// ============================================
// STORE PAGE: PRODUCT LISTING
// ============================================
let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';

async function initStorePage() {
    showLoader();

    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        currentCategory = categoryParam;
    }

    const pageType = document.body.getAttribute('data-page-type') || 'equipment';

    try {
        // Load products, filtering out by productType locally
        // (to avoid complex Firestore compound indexes)
        const snapshot = await db.collection('products').get();
        allProducts = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const pType = data.productType || 'equipment';
            if (pType === pageType) {
                allProducts.push({ id: doc.id, ...data });
            }
        });

        // Update page header if category specified
        if (categoryParam) {
            const pageTitle = document.getElementById('storePageTitle');
            const pageDesc = document.getElementById('storePageDesc');
            if (pageTitle) pageTitle.textContent = categoryParam;
            if (pageDesc) pageDesc.textContent = `Browse our ${categoryParam.toLowerCase()} collection`;
        }

        // Render filter buttons
        renderFilterButtons();

        // Apply initial filter
        filterProducts(currentCategory);

        // Auto-scroll to product grid if searching a specific category from URL
        if (categoryParam) {
            setTimeout(() => {
                const target = document.getElementById('filterButtons');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }

    } catch (error) {
        console.error('Error loading products:', error);
        showToast('error', 'Error', 'Failed to load products');
    }

    hideLoader();
}

function renderFilterButtons() {
    const container = document.getElementById('filterButtons');
    if (!container) return;

    const categories = ['all', ...new Set(allProducts.map(p => p.category))];

    container.innerHTML = categories.map(cat => `
        <button class="filter-btn ${cat === currentCategory ? 'active' : ''}" 
                onclick="filterProducts('${cat}')">
            ${cat === 'all' ? 'All Products' : cat}
        </button>
    `).join('');
}

function filterProducts(category) {
    currentCategory = category;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === (category === 'all' ? 'All Products' : category));
    });

    // Filter products
    if (category === 'all') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(p => p.category === category);
    }

    // Apply search filter if search box has value
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.trim().toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
    }

    renderProducts();
}

function searchProducts() {
    filterProducts(currentCategory);
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-box-open empty-icon"></i>
                <h3>No Products Found</h3>
                <p>Try different search terms or browse other categories.</p>
                <button class="btn btn-primary" onclick="filterProducts('all')">
                    <i class="fa-solid fa-rotate-left"></i> Show All Products
                </button>
            </div>`;
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card animate-fadeInUp">
            <div class="card-image">
                <img src="${product.image || getProductImage(product.imageKey)}" 
                     alt="${product.name}"
                     onerror="this.src='${generatePlaceholderSVG(product.name)}'">
                ${product.isTrending ? '<span class="product-badge badge-trending"><i class="fa-solid fa-fire"></i> Trending</span>' : ''}
            </div>
            <div class="card-body">
                <div class="card-category">${product.category}</div>
                <h4 class="card-title">${product.name}</h4>
                <p class="card-desc">${product.description}</p>
                <div class="card-footer">
                    <div>
                        <div class="card-price">${formatPrice(product.price)}</div>
                        ${product.productType === 'medicine' ? '' : `<span class="card-rent-price">Rent: ${formatPrice(product.rentPricePerDay)}/day</span>`}
                    </div>
                    <div style="display:flex;gap:6px;">
                        <button class="card-action-btn" style="background:var(--color-primary-light);color:var(--color-primary);"
                                onclick="event.stopPropagation(); quickAddToCart('${product.id}')" 
                                title="Quick Add to Cart">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                        <button class="card-action-btn" onclick="event.stopPropagation(); window.location.href='product.html?id=${product.id}'" title="View Details">
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handler for entire card
    grid.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = `product.html?id=${filteredProducts[index].id}`;
        });
    });
}

// ============================================
// PRODUCT DETAIL PAGE
// ============================================
let currentProduct = null;
let purchaseType = 'buy';
let rentDays = 1;

async function initProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        showToast('error', 'Error', 'Product not found');
        setTimeout(() => window.location.href = 'store.html', 1500);
        return;
    }

    showLoader();

    try {
        const doc = await db.collection('products').doc(productId).get();

        if (!doc.exists) {
            showToast('error', 'Error', 'Product not found');
            setTimeout(() => window.location.href = 'store.html', 1500);
            hideLoader();
            return;
        }

        currentProduct = { id: doc.id, ...doc.data() };
        renderProductDetail();

    } catch (error) {
        console.error('Error loading product:', error);
        showToast('error', 'Error', 'Failed to load product details');
    }

    hideLoader();
}

function renderProductDetail() {
    const container = document.getElementById('productDetailContainer');
    if (!container || !currentProduct) return;

    const isMedicine = currentProduct.productType === 'medicine';

    // Update breadcrumb
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    const breadcrumbProduct = document.getElementById('breadcrumbProduct');
    if (breadcrumbCategory) {
        breadcrumbCategory.textContent = currentProduct.category;
        // determine base URL dynamically if they clicked from somewhere else
        const targetUrl = isMedicine ? 'medicines.html' : 'store.html';
        breadcrumbCategory.href = `${targetUrl}?category=${encodeURIComponent(currentProduct.category)}`;
    }
    if (breadcrumbProduct) breadcrumbProduct.textContent = currentProduct.name;

    // Update page title
    document.title = `${currentProduct.name} | LRC Medi+ Healthcare`;

    container.innerHTML = `
        <div class="product-detail">
            <div class="product-image-section">
                <img src="${currentProduct.image || getProductImage(currentProduct.imageKey)}" 
                     alt="${currentProduct.name}"
                     onerror="this.src='${generatePlaceholderSVG(currentProduct.name, 500, 400)}'">
            </div>
            <div class="product-info">
                <span class="product-category-label">
                    <i class="fa-solid ${CATEGORY_ICONS[currentProduct.category] || 'fa-box'}"></i>
                    ${currentProduct.category}
                </span>
                <h1 class="product-name">${currentProduct.name}</h1>
                <p class="product-description">${currentProduct.description}</p>
                
                <div class="price-section">
                    <span class="buy-price">${formatPrice(currentProduct.price)}</span>
                    ${isMedicine ? '' : `
                    <span class="rent-price-info">
                        Rent at <strong>${formatPrice(currentProduct.rentPricePerDay)}</strong>/day
                    </span>
                    `}
                </div>

                <div class="purchase-options">
                    <h4>Choose an Option</h4>
                    <div class="option-tabs">
                        <button class="option-tab active" id="buyTab" onclick="selectPurchaseType('buy')">
                            <i class="fa-solid fa-bag-shopping"></i> Buy (COD)
                        </button>
                        ${isMedicine ? '' : `
                        <button class="option-tab" id="rentTab" onclick="selectPurchaseType('rent')">
                            <i class="fa-solid fa-clock-rotate-left"></i> Rent
                        </button>
                        `}
                    </div>

                    ${isMedicine ? '' : `
                    <div class="rent-options hidden" id="rentOptions">
                        <div class="rent-duration-group">
                            <label>Number of Days:</label>
                            <input type="number" id="rentDaysInput" value="1" min="1" max="365" 
                                   onchange="updateRentTotal()" oninput="updateRentTotal()">
                        </div>
                        <div class="rent-total" id="rentTotal">
                            Total Rent: ${formatPrice(currentProduct.rentPricePerDay)}
                        </div>
                    </div>
                    `}
                </div>

                <div class="product-actions">
                    <button class="btn btn-primary btn-lg" onclick="addToCartFromDetail()">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                    <a class="btn btn-lg" style="background:#25D366;color:white;border:none;"
                       href="https://wa.me/919152295170?text=${encodeURIComponent('Hello LRC Medi+ Healthcare! I am interested in: ' + currentProduct.name + '. Please provide more details.')}"
                       target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-whatsapp"></i> WhatsApp Enquiry
                    </a>
                    <button class="btn btn-outline btn-lg" onclick="window.location.href='store.html'">
                        <i class="fa-solid fa-arrow-left"></i> Back to Store
                    </button>
                </div>
            </div>
        </div>`;
}

function selectPurchaseType(type) {
    purchaseType = type;

    const buyTab = document.getElementById('buyTab');
    const rentTab = document.getElementById('rentTab');
    const rentOptions = document.getElementById('rentOptions');

    if (buyTab) {
        buyTab.classList.toggle('active', type === 'buy');
    }
    if (rentTab) {
        rentTab.classList.toggle('active', type === 'rent');
        if (type === 'rent') rentTab.classList.add('rent');
        else rentTab.classList.remove('rent');
    }
    if (rentOptions) {
        rentOptions.classList.toggle('hidden', type !== 'rent');
    }
}

function updateRentTotal() {
    const input = document.getElementById('rentDaysInput');
    const totalEl = document.getElementById('rentTotal');
    if (!input || !totalEl || !currentProduct) return;

    rentDays = Math.max(1, parseInt(input.value) || 1);
    input.value = rentDays;

    const total = currentProduct.rentPricePerDay * rentDays;
    totalEl.innerHTML = `Total Rent: <strong>${formatPrice(total)}</strong> (${rentDays} day${rentDays > 1 ? 's' : ''})`;
}

function addToCartFromDetail() {
    if (!currentProduct) return;

    const user = auth.currentUser;
    if (!user) {
        showToast('warning', 'Login Required', 'Please login to add items to cart');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('lrc-cart') || '[]');

    const price = purchaseType === 'rent'
        ? currentProduct.rentPricePerDay * rentDays
        : currentProduct.price;

    // Check if same product with same type already in cart
    const existingIndex = cart.findIndex(item =>
        item.productId === currentProduct.id && item.type === purchaseType
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
        cart[existingIndex].totalPrice = price * cart[existingIndex].quantity;
    } else {
        cart.push({
            productId: currentProduct.id,
            name: currentProduct.name,
            image: currentProduct.image || getProductImage(currentProduct.imageKey),
            price: purchaseType === 'buy' ? currentProduct.price : currentProduct.rentPricePerDay,
            type: purchaseType,
            rentDays: purchaseType === 'rent' ? rentDays : 0,
            quantity: 1,
            totalPrice: price,
            category: currentProduct.category
        });
    }

    localStorage.setItem('lrc-cart', JSON.stringify(cart));
    updateCartBadge();

    showToast('success', 'Added to Cart!',
        `${currentProduct.name} (${purchaseType === 'rent' ? 'Rent - ' + rentDays + ' days' : 'Buy'}) added to your cart`);
}

// ============================================
// HOMEPAGE INITIALIZATION
// ============================================
async function initHomePage() {
    try {
        // Seed only if Firebase is properly configured
        await seedProducts();
    } catch (e) {
        console.warn('Seed skipped (Firebase not configured):', e.message);
    }
    // Await both so loader stays until all data is rendered
    await Promise.all([
        initTrendingSlider(),
        initCategories()
    ]);
}
