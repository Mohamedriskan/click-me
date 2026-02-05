// Main JavaScript file for Click Me E-commerce Website

// Sample product data
const products = [
    {
        id: 1,
        name: "MacBook Pro 14\"",
        category: "laptops",
        price: 1999.99,
        originalPrice: 2199.99,
        image: "images/products/macbook-pro-14.jpg",
        description: "Powerful laptop with M2 Pro chip, perfect for professionals",
        rating: 4.8,
        reviews: 124,
        inStock: true,
        features: ["M2 Pro Chip", "16GB RAM", "512GB SSD", "14\" Retina Display"]
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        category: "smartphones",
        price: 999.99,
        originalPrice: 1099.99,
        image: "images/products/iphone-15-pro.jpg",
        description: "Latest iPhone with advanced camera system and A17 Pro chip",
        rating: 4.7,
        reviews: 89,
        inStock: true,
        features: ["A17 Pro Chip", "48MP Camera", "128GB Storage", "6.1\" Display"]
    },
    {
        id: 3,
        name: "iPad Air",
        category: "tablets",
        price: 599.99,
        originalPrice: 649.99,
        image: "images/products/ipad-air.jpg",
        description: "Versatile tablet perfect for work and entertainment",
        rating: 4.6,
        reviews: 67,
        inStock: true,
        features: ["M1 Chip", "10.9\" Display", "64GB Storage", "Touch ID"]
    },
    {
        id: 4,
        name: "AirPods Pro",
        category: "accessories",
        price: 249.99,
        originalPrice: 279.99,
        image: "images/products/airpods-pro.jpg",
        description: "Premium wireless earbuds with active noise cancellation",
        rating: 4.5,
        reviews: 203,
        inStock: true,
        features: ["Active Noise Cancellation", "Transparency Mode", "24hr Battery Life", "Spatial Audio"]
    },
    {
        id: 5,
        name: "Samsung Galaxy S24",
        category: "smartphones",
        price: 899.99,
        originalPrice: 999.99,
        image: "images/products/galaxy-s24.jpg",
        description: "Flagship Android phone with advanced AI features",
        rating: 4.6,
        reviews: 156,
        inStock: true,
        features: ["Snapdragon 8 Gen 3", "50MP Camera", "256GB Storage", "6.2\" AMOLED"]
    },
    {
        id: 6,
        name: "Dell XPS 13",
        category: "laptops",
        price: 1299.99,
        originalPrice: 1499.99,
        image: "images/products/dell-xps-13.jpg",
        description: "Ultra-portable laptop with stunning InfinityEdge display",
        rating: 4.4,
        reviews: 98,
        inStock: true,
        features: ["Intel Core i7", "16GB RAM", "512GB SSD", "13.4\" FHD+ Display"]
    },
    {
        id: 7,
        name: "Sony WH-1000XM5",
        category: "accessories",
        price: 399.99,
        originalPrice: 449.99,
        image: "images/products/sony-wh1000xm5.jpg",
        description: "Industry-leading noise canceling wireless headphones",
        rating: 4.7,
        reviews: 187,
        inStock: true,
        features: ["Industry-leading ANC", "30hr Battery", "Hi-Res Audio", "Multipoint Connection"]
    },
    {
        id: 8,
        name: "Microsoft Surface Pro 9",
        category: "tablets",
        price: 999.99,
        originalPrice: 1099.99,
        image: "images/products/surface-pro-9.jpg",
        description: "2-in-1 tablet that replaces your laptop",
        rating: 4.3,
        reviews: 76,
        inStock: true,
        features: ["Intel Core i5", "8GB RAM", "256GB SSD", "13\" Touchscreen"]
    }
];

// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Add to cart function
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} added to cart!`);
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Item removed from cart');
}

// Update cart item quantity
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Create toast container
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star text-warning"></i>';
    }
    
    return starsHTML;
}

// Load featured products on home page
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;

    const featuredProducts = products.slice(0, 4);
    
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <div class="mb-2">
                        ${generateStarRating(product.rating)}
                        <small class="text-muted">(${product.reviews})</small>
                    </div>
                    <p class="card-text flex-grow-1">${product.description}</p>
                    <div class="mb-3">
                        <span class="product-price">${formatPrice(product.price)}</span>
                        <span class="product-original-price ms-2">${formatPrice(product.originalPrice)}</span>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary btn-sm flex-fill" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus me-1"></i>Add to Cart
                        </button>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary btn-sm">
                            <i class="fas fa-eye"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Load featured products if on home page
    if (document.getElementById('featuredProducts')) {
        loadFeaturedProducts();
    }
    
    // Handle newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            showToast(`Successfully subscribed with ${email}!`);
            this.reset();
        });
    }
    
    // Handle cart icon click
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            // You can implement a cart sidebar or redirect to cart page here
            showToast('Cart feature coming soon!');
        });
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
function showLoading(element) {
    element.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading...</p>
        </div>
    `;
}

// Export functions for use in other files
window.ClickMe = {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    updateCartCount,
    showToast,
    formatPrice,
    generateStarRating,
    loadFeaturedProducts
};
