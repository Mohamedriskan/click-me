// Products page JavaScript

let currentPage = 1;
const itemsPerPage = 6;
let filteredProducts = [...ClickMe.products];

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    // Price filters
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    if (minPrice) minPrice.addEventListener('input', debounce(applyFilters, 500));
    if (maxPrice) maxPrice.addEventListener('input', debounce(applyFilters, 500));

    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }

    // Filter buttons
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', applyFilters);
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearFilters);

    // View toggle buttons
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    if (gridView) gridView.addEventListener('click', () => setViewMode('grid'));
    if (listView) listView.addEventListener('click', () => setViewMode('list'));
}

// Load products
function loadProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;

    showLoading(container);

    setTimeout(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);

        container.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
        updateProductCount();
        updatePagination();
    }, 300);
}

// Create product card HTML
function createProductCard(product) {
    const isListView = document.getElementById('listView')?.classList.contains('active');
    
    if (isListView) {
        return `
            <div class="col-12 mb-3">
                <div class="card product-card">
                    <div class="row g-0">
                        <div class="col-md-3">
                            <img src="${product.image}" class="img-fluid rounded-start product-image" alt="${product.name}">
                        </div>
                        <div class="col-md-9">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-8">
                                        <h5 class="card-title">${product.name}</h5>
                                        <div class="mb-2">
                                            ${ClickMe.generateStarRating(product.rating)}
                                            <small class="text-muted">(${product.reviews} reviews)</small>
                                        </div>
                                        <p class="card-text">${product.description}</p>
                                        <div class="mb-3">
                                            <span class="badge bg-secondary me-2">${product.category}</span>
                                            ${product.inStock ? 
                                                '<span class="badge bg-success">In Stock</span>' : 
                                                '<span class="badge bg-danger">Out of Stock</span>'
                                            }
                                        </div>
                                    </div>
                                    <div class="col-md-4 text-md-end">
                                        <div class="mb-3">
                                            <div class="product-price h4">${ClickMe.formatPrice(product.price)}</div>
                                            <div class="product-original-price">${ClickMe.formatPrice(product.originalPrice)}</div>
                                        </div>
                                        <div class="d-grid gap-2">
                                            <button class="btn btn-primary" onclick="ClickMe.addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                                                <i class="fas fa-cart-plus me-1"></i>Add to Cart
                                            </button>
                                            <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary">
                                                <i class="fas fa-eye me-1"></i>View Details
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card product-card h-100">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <div class="mb-2">
                            ${ClickMe.generateStarRating(product.rating)}
                            <small class="text-muted">(${product.reviews})</small>
                        </div>
                        <p class="card-text flex-grow-1">${product.description}</p>
                        <div class="mb-2">
                            <span class="badge bg-secondary me-2">${product.category}</span>
                            ${product.inStock ? 
                                '<span class="badge bg-success">In Stock</span>' : 
                                '<span class="badge bg-danger">Out of Stock</span>'
                            }
                        </div>
                        <div class="mb-3">
                            <span class="product-price">${ClickMe.formatPrice(product.price)}</span>
                            <span class="product-original-price ms-2">${ClickMe.formatPrice(product.originalPrice)}</span>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary btn-sm flex-fill" onclick="ClickMe.addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''}>
                                <i class="fas fa-cart-plus me-1"></i>Add to Cart
                            </button>
                            <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary btn-sm">
                                <i class="fas fa-eye"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Handle search
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    applyFilters();
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const sortBy = document.getElementById('sortFilter').value;

    // Filter products
    filteredProducts = ClickMe.products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        
        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch(sortBy) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
    }

    currentPage = 1;
    loadProducts();
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortFilter').value = 'name';
    
    filteredProducts = [...ClickMe.products];
    currentPage = 1;
    loadProducts();
}

// Set view mode
function setViewMode(mode) {
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    
    if (mode === 'grid') {
        gridView.classList.add('active');
        listView.classList.remove('active');
    } else {
        gridView.classList.remove('active');
        listView.classList.add('active');
    }
    
    loadProducts();
}

// Update product count
function updateProductCount() {
    const countElement = document.getElementById('productCount');
    if (countElement) {
        countElement.textContent = filteredProducts.length;
    }
}

// Update pagination
function updatePagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Previous</a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `
                <li class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
            `;
        }
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Next</a>
        </li>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    loadProducts();
    
    // Scroll to top of products
    document.getElementById('productsGrid').scrollIntoView({ behavior: 'smooth' });
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show loading
function showLoading(element) {
    element.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading products...</p>
        </div>
    `;
}
