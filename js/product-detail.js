// Product detail page JavaScript

let currentProduct = null;
let selectedImageIndex = 0;
let reviews = [];

// Initialize product detail page
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
    setupEventListeners();
});

// Load product details
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        showProductNotFound();
        return;
    }

    currentProduct = ClickMe.products.find(p => p.id === productId);
    
    if (!currentProduct) {
        showProductNotFound();
        return;
    }

    loadProductContent();
    loadRelatedProducts();
    loadReviews();
}

// Show product not found
function showProductNotFound() {
    const container = document.getElementById('productDetailContainer');
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist or has been removed.</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
    }
}

// Load product content
function loadProductContent() {
    const container = document.getElementById('productDetailContainer');
    const breadcrumb = document.getElementById('productNameBreadcrumb');
    
    if (breadcrumb) {
        breadcrumb.textContent = currentProduct.name;
    }

    if (container) {
        container.innerHTML = `
            <div class="col-lg-6 mb-4">
                <div class="product-images">
                    <div class="main-image mb-3">
                        <img src="${currentProduct.image}" alt="${currentProduct.name}" class="img-fluid rounded product-detail-image" id="mainImage">
                    </div>
                    <div class="thumbnail-images d-flex gap-2">
                        ${currentProduct.image ? `<img src="${currentProduct.image}" class="thumbnail active rounded" onclick="changeImage(0)">` : ''}
                        ${generateThumbnails()}
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="product-info">
                    <h1 class="mb-3">${currentProduct.name}</h1>
                    <div class="mb-3">
                        ${ClickMe.generateStarRating(currentProduct.rating)}
                        <span class="text-muted ms-2">(${currentProduct.reviews} reviews)</span>
                        <a href="#reviews" class="text-decoration-none ms-3">Write a review</a>
                    </div>
                    <div class="mb-4">
                        <span class="product-price h3">${ClickMe.formatPrice(currentProduct.price)}</span>
                        <span class="product-original-price h5 ms-3">${ClickMe.formatPrice(currentProduct.originalPrice)}</span>
                        <span class="badge bg-success ms-3">Save ${ClickMe.formatPrice(currentProduct.originalPrice - currentProduct.price)}</span>
                    </div>
                    <div class="mb-4">
                        <span class="badge bg-secondary me-2">${currentProduct.category}</span>
                        ${currentProduct.inStock ? 
                            '<span class="badge bg-success">In Stock</span>' : 
                            '<span class="badge bg-danger">Out of Stock</span>'
                        }
                    </div>
                    <p class="lead mb-4">${currentProduct.description}</p>
                    
                    <div class="mb-4">
                        <h5>Key Features:</h5>
                        <ul class="list-unstyled">
                            ${currentProduct.features.map(feature => `
                                <li class="mb-2"><i class="fas fa-check text-success me-2"></i>${feature}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="mb-4">
                        <label class="form-label">Quantity:</label>
                        <div class="input-group" style="max-width: 200px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(-1)">-</button>
                            <input type="number" class="form-control text-center" id="quantity" value="1" min="1" max="10">
                            <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(1)">+</button>
                        </div>
                    </div>
                    
                    <div class="d-grid gap-2 d-md-flex">
                        <button class="btn btn-primary btn-lg flex-fill" onclick="addToCartWithQuantity()" ${!currentProduct.inStock ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus me-2"></i>Add to Cart
                        </button>
                        <button class="btn btn-outline-danger btn-lg">
                            <i class="fas fa-heart me-2"></i>Add to Wishlist
                        </button>
                    </div>
                    
                    <div class="mt-4">
                        <div class="d-flex align-items-center text-muted small">
                            <i class="fas fa-truck me-2"></i>
                            <span>Free shipping on orders over $50</span>
                        </div>
                        <div class="d-flex align-items-center text-muted small mt-2">
                            <i class="fas fa-shield-alt me-2"></i>
                            <span>30-day return policy</span>
                        </div>
                        <div class="d-flex align-items-center text-muted small mt-2">
                            <i class="fas fa-lock me-2"></i>
                            <span>Secure payment</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Generate thumbnails (placeholder for additional images)
function generateThumbnails() {
    // In a real application, you would have multiple images per product
    // For now, we'll create some placeholder thumbnails
    return '';
}

// Change main image
function changeImage(index) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails[index]) {
        mainImage.src = thumbnails[index].src;
        
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
        
        selectedImageIndex = index;
    }
}

// Change quantity
function changeQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        let newValue = parseInt(quantityInput.value) + change;
        newValue = Math.max(1, Math.min(10, newValue));
        quantityInput.value = newValue;
    }
}

// Add to cart with quantity
function addToCartWithQuantity() {
    const quantityInput = document.getElementById('quantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    if (currentProduct) {
        ClickMe.addToCart(currentProduct.id, quantity);
    }
}

// Load related products
function loadRelatedProducts() {
    const container = document.getElementById('relatedProducts');
    if (!container) return;

    const relatedProducts = ClickMe.products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    if (relatedProducts.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No related products found.</p>';
        return;
    }

    container.innerHTML = relatedProducts.map(product => `
        <div class="col-md-6 col-lg-3 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <div class="mb-2">
                        ${ClickMe.generateStarRating(product.rating)}
                        <small class="text-muted">(${product.reviews})</small>
                    </div>
                    <div class="mb-3">
                        <span class="product-price">${ClickMe.formatPrice(product.price)}</span>
                        <span class="product-original-price ms-2">${ClickMe.formatPrice(product.originalPrice)}</span>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary btn-sm flex-fill" onclick="ClickMe.addToCart(${product.id})">
                            <i class="fas fa-cart-plus me-1"></i>Add
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

// Load reviews
function loadReviews() {
    // Sample reviews data
    reviews = [
        {
            name: "John D.",
            rating: 5,
            date: "2024-01-15",
            text: "Excellent product! Exactly what I was looking for. Great quality and fast shipping."
        },
        {
            name: "Sarah M.",
            rating: 4,
            date: "2024-01-10",
            text: "Good product overall. Works as expected. The only minor issue is the packaging could be better."
        },
        {
            name: "Mike R.",
            rating: 5,
            date: "2024-01-05",
            text: "Amazing quality! Highly recommend this to anyone looking for a reliable product."
        }
    ];

    displayReviews();
}

// Display reviews
function displayReviews() {
    const container = document.getElementById('reviewsList');
    if (!container) return;

    if (reviews.length === 0) {
        container.innerHTML = '<p class="text-muted">No reviews yet. Be the first to write one!</p>';
        return;
    }

    container.innerHTML = `
        <h4 class="mb-4">Customer Reviews</h4>
        ${reviews.map(review => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h6 class="mb-1">${review.name}</h6>
                            <div class="mb-2">
                                ${ClickMe.generateStarRating(review.rating)}
                            </div>
                        </div>
                        <small class="text-muted">${new Date(review.date).toLocaleDateString()}</small>
                    </div>
                    <p class="mb-0">${review.text}</p>
                </div>
            </div>
        `).join('')}
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Review form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }

    // Rating stars
    const ratingStars = document.querySelectorAll('#ratingStars i');
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            setRating(rating);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });

    document.getElementById('ratingStars')?.addEventListener('mouseleave', function() {
        const currentRating = parseInt(document.querySelector('input[name="rating"]')?.value || 0);
        highlightStars(currentRating);
    });
}

// Handle review submit
function handleReviewSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('reviewerName').value;
    const text = document.getElementById('reviewText').value;
    const rating = parseInt(document.querySelector('input[name="rating"]')?.value || 0);
    
    if (rating === 0) {
        ClickMe.showToast('Please select a rating', 'error');
        return;
    }
    
    const newReview = {
        name: name,
        rating: rating,
        date: new Date().toISOString().split('T')[0],
        text: text
    };
    
    reviews.unshift(newReview);
    displayReviews();
    
    // Reset form
    e.target.reset();
    setRating(0);
    
    ClickMe.showToast('Review submitted successfully!');
}

// Set rating
function setRating(rating) {
    let ratingInput = document.querySelector('input[name="rating"]');
    if (!ratingInput) {
        ratingInput = document.createElement('input');
        ratingInput.type = 'hidden';
        ratingInput.name = 'rating';
        document.getElementById('ratingStars').appendChild(ratingInput);
    }
    ratingInput.value = rating;
    highlightStars(rating);
}

// Highlight stars
function highlightStars(rating) {
    const stars = document.querySelectorAll('#ratingStars i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'text-warning');
        } else {
            star.classList.remove('fas', 'text-warning');
            star.classList.add('far');
        }
    });
}
