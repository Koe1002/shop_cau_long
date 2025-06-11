// Initialize cart functionality
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartCount();
        this.bindEvents();
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const data = localStorage.getItem("cart");
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error loading cart:", error);
            return [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem("cart", JSON.stringify(this.cart));
        } catch (error) {
            console.error("Error saving cart:", error);
        }
    }

    // Add item to cart
    addToCart(item) {
        const existingItem = this.cart.find((cartItem) => cartItem.name === item.name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1,
                id: Date.now(), // Simple ID generation
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showAddToCartMessage(item.name);
    }

    // Update cart count badge
    updateCartCount() {
        const countElement = document.getElementById("count_cart");
        if (countElement) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            countElement.textContent = totalItems > 0 ? totalItems : "";
            countElement.style.display = totalItems > 0 ? "inline" : "none";
        }
    }

    // Show add to cart message
    showAddToCartMessage(itemName) {
        // Create toast notification
        const toast = document.createElement("div");
        toast.className = "toast-notification";
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle text-success me-2"></i>
                <span>Đã thêm "${itemName}" vào giỏ hàng!</span>
            </div>
        `;

        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #f0f0f0;
            border-left: 4px solid #28a745;
            padding: 10px 15px;
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: fadeInOut 3s ease-in-out;
            font-family: Arial, sans-serif;
        `;

        // Add CSS animation
        if (!document.getElementById("toast-styles")) {
            const style = document.createElement("style");
            style.id = "toast-styles";
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateX(100%); }
                    10% { opacity: 1; transform: translateX(0); }
                    90% { opacity: 1; transform: translateX(0); }
                    100% { opacity: 0; transform: translateX(100%); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }

    // Bind click events to "Add to Cart" buttons
    bindEvents() {
        const buttons = document.querySelectorAll(".product__card-btn");
        buttons.forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                const card = button.closest(".product__card");
                if (!card) return;

                const nameElement = card.querySelector(".product__card-title");
                const priceElement = card.querySelector(".product__card-price");
                const imageElement = card.querySelector("img");

                if (!nameElement || !priceElement || !imageElement) {
                    console.error("Could not find product elements");
                    return;
                }

                const name = nameElement.innerText.trim();
                const priceText = priceElement.innerText;
                // Extract price number from text like "Giá: 529.000 ₫"
                const price = parseInt(priceText.replace(/\D/g, "")) || 0;
                const image = imageElement.src;

                if (name && price > 0 && image) {
                    this.addToCart({ name, price, image });
                } else {
                    console.error("Invalid product data:", { name, price, image });
                }
            });
        });
    }

    // Render cart items in cart page
    renderCart() {
        const cartItemsContainer = document.getElementById("cart-items");
        const cartContent = document.getElementById("cart-content");
        const emptyCart = document.getElementById("empty-cart");

        if (!cartItemsContainer) return;

        // Show/hide empty cart message
        if (this.cart.length === 0) {
            if (cartContent) cartContent.style.display = "none";
            if (emptyCart) emptyCart.style.display = "block";
            return;
        } else {
            if (cartContent) cartContent.style.display = "flex";
            if (emptyCart) emptyCart.style.display = "none";
        }

        // Clear existing items
        cartItemsContainer.innerHTML = "";

        let total = 0;

        this.cart.forEach((item, index) => {
            const itemTotal = item.quantity * item.price;
            total += itemTotal;

            const cartItemDiv = document.createElement("div");
            cartItemDiv.className = "cart-item";
            cartItemDiv.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-2 col-3">
                        <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-4 col-9">
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="text-muted mb-0">Đơn giá: ${item.price.toLocaleString()} ₫</p>
                    </div>
                    <div class="col-md-3 col-6">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="cart.updateQuantity(${index}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="quantity-input" value="${item.quantity}" 
                                   min="1" onchange="cart.updateQuantity(${index}, this.value)">
                            <button class="quantity-btn" onclick="cart.updateQuantity(${index}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 col-4">
                        <p class="fw-bold mb-0">${itemTotal.toLocaleString()} ₫</p>
                    </div>
                    <div class="col-md-1 col-2">
                        <i class="fas fa-trash remove-btn" onclick="cart.removeItem(${index})" 
                           title="Xóa sản phẩm"></i>
                    </div>
                </div>
            `;

            cartItemsContainer.appendChild(cartItemDiv);
        });

        // Update summary
        this.updateSummary(total);
    }

    // Update cart summary
    updateSummary(total) {
        const summaryElements = {
            totalItems: document.getElementById("total-items"),
            subtotal: document.getElementById("subtotal"),
            totalElement: document.getElementById("total"),
        };

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        if (summaryElements.totalItems) {
            summaryElements.totalItems.textContent = totalItems;
        }
        if (summaryElements.subtotal) {
            summaryElements.subtotal.textContent = total.toLocaleString() + " ₫";
        }
        if (summaryElements.totalElement) {
            summaryElements.totalElement.textContent = total.toLocaleString() + " ₫";
        }
    }

    // Update quantity from cart page
    updateQuantity(index, value) {
        const qty = parseInt(value);
        if (qty > 0 && this.cart[index]) {
            this.cart[index].quantity = qty;
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
        } else if (qty <= 0) {
            this.removeItem(index);
        }
    }

    // Remove item from cart
    removeItem(index) {
        if (this.cart[index]) {
            this.cart.splice(index, 1);
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
        }
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
    }
}

// Create global instance
const cart = new ShoppingCart();

// Initialize cart when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // If this is the cart page, render cart immediately
    if (window.location.pathname.includes("cart") || window.location.href.includes("cart.html")) {
        cart.renderCart();
    }
});
