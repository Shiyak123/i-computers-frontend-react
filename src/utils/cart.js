export function getCart() {
    try {
        const cartData = localStorage.getItem("cart");
        if (!cartData) {
            localStorage.setItem("cart", JSON.stringify([]));
            return [];
        }
        const parsed = JSON.parse(cartData);
        if (!Array.isArray(parsed)) {
            localStorage.setItem("cart", JSON.stringify([]));
            return [];
        }
        return parsed;
    } catch (e) {
        console.error("Failed to parse cart from localStorage:", e);
        localStorage.setItem("cart", JSON.stringify([]));
        return [];
    }
}

export function saveCart(cart) {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {
        console.error("Failed to save cart to localStorage:", e);
    }
}

export function addToCart(product, qty = 1) {
    if (!product || product.isAvailable === false) {
        return false;
    }

    const productId = product.productId || product._id;
    if (!productId) return false;

    const cart = getCart();
    const existingIndex = cart.findIndex(
        (item) => (item.product.productId || item.product._id) === productId
    );

    const availableStock = typeof product.stock === "number" ? product.stock : Infinity;

    if (existingIndex > -1) {
        let newQty = cart[existingIndex].qty + Number(qty);
        if (availableStock > 0 && newQty > availableStock) {
            newQty = availableStock;
        }
        cart[existingIndex].qty = Math.max(1, newQty);
    } else {
        let initialQty = Number(qty);
        if (initialQty < 1) initialQty = 1;
        if (availableStock > 0 && initialQty > availableStock) {
            initialQty = availableStock;
        }

        const cartProduct = {
            productId: productId,
            name: product.name || "",
            image: product.image || [],
            price: Number(product.price) || 0,
            labelPrice: Number(product.labelPrice) || 0,
            isAvailable: product.isAvailable !== false,
            stock: product.stock
        };

        cart.push({
            product: cartProduct,
            qty: initialQty
        });
    }

    saveCart(cart);
    return true;
}

export function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(
        (item) => (item.product.productId || item.product._id) !== productId
    );
    saveCart(cart);
}

export function updateQuantity(productId, qty) {
    let cart = getCart();
    const targetIndex = cart.findIndex(
        (item) => (item.product.productId || item.product._id) === productId
    );

    if (targetIndex > -1) {
        const newQty = Number(qty);
        if (newQty <= 0) {
            cart.splice(targetIndex, 1);
        } else {
            const product = cart[targetIndex].product;
            const availableStock = typeof product.stock === "number" ? product.stock : Infinity;
            
            if (availableStock > 0 && newQty > availableStock) {
                cart[targetIndex].qty = availableStock;
            } else {
                cart[targetIndex].qty = newQty;
            }
        }
        saveCart(cart);
    }
}

export function getTotal(cart) {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => {
        const price = Number(item?.product?.price) || 0;
        const qty = Number(item?.qty) || 0;
        return sum + price * qty;
    }, 0);
}

export function getTotalCount(cart) {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + (Number(item?.qty) || 0), 0);
}

export function clearCart() {
    saveCart([]);
}
