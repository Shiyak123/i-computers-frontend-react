import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiTrash, BiArrowBack, BiShoppingBag } from "react-icons/bi";
import { getCart, updateQuantity, removeFromCart, clearCart, getTotal, getTotalCount } from "../../utils/cart";

export default function CartPage() {
    const [cart, setCart] = useState(getCart());

    useEffect(() => {
        function syncCart() {
            setCart(getCart());
        }

        window.addEventListener("cartUpdated", syncCart);
        return () => window.removeEventListener("cartUpdated", syncCart);
    }, []);

    function handleIncrease(productId, currentQty, maxStock) {
        const availableStock = typeof maxStock === "number" ? maxStock : Infinity;
        if (availableStock > 0 && currentQty >= availableStock) {
            return;
        }
        updateQuantity(productId, currentQty + 1);
        setCart(getCart());
    }

    function handleDecrease(productId, currentQty) {
        updateQuantity(productId, currentQty - 1);
        setCart(getCart());
    }

    function handleRemove(productId) {
        removeFromCart(productId);
        setCart(getCart());
    }

    function handleClearCart() {
        clearCart();
        setCart(getCart());
    }

    const totalItems = getTotalCount(cart);
    const cartTotal = getTotal(cart);

    return (
        <div className="w-full min-h-full py-8 px-4 max-w-7xl mx-auto">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition font-medium text-sm"
                >
                    <BiArrowBack className="text-lg" /> Back to Products
                </Link>
                {cart.length > 0 && (
                    <button
                        onClick={handleClearCart}
                        className="text-xs text-red-400 hover:text-red-300 transition flex items-center gap-1 cursor-pointer bg-red-950/40 border border-red-800/40 px-3 py-1.5 rounded-lg"
                    >
                        <BiTrash /> Clear Cart
                    </button>
                )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <BiShoppingBag className="text-accent" /> Shopping Cart
            </h1>

            {cart.length === 0 ? (
                /* Empty Cart State */
                <div className="bg-secondary/60 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-12 shadow-2xl">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 text-accent text-4xl border border-white/10">
                        <BiShoppingBag />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Looks like you haven't added any products to your shopping cart yet.
                    </p>
                    <Link
                        to="/products"
                        className="px-6 py-3 bg-accent hover:opacity-90 text-white font-semibold rounded-xl text-sm transition shadow-lg"
                    >
                        Explore Catalogue
                    </Link>
                </div>
            ) : (
                /* Cart Items Grid / Summary */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {cart.map((item) => {
                            const product = item.product || {};
                            const productId = product.productId || product._id;
                            const displayName = Array.isArray(product.name) ? product.name.join(" ") : product.name;
                            const imageUrl = Array.isArray(product.image) && product.image.length > 0
                                ? product.image[0]
                                : (typeof product.image === "string" ? product.image : "/default-product-1.png");
                            const price = Number(product.price) || 0;
                            const labelPrice = Number(product.labelPrice) || 0;
                            const qty = Number(item.qty) || 1;
                            const subtotal = price * qty;
                            const stock = typeof product.stock === "number" ? product.stock : Infinity;
                            const isMaxReached = stock > 0 && qty >= stock;

                            return (
                                <div
                                    key={productId}
                                    className="bg-secondary/60 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
                                >
                                    {/* Thumbnail & Product Details */}
                                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <img
                                                src={imageUrl}
                                                alt={displayName}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/default-product-1.png";
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                to={`/products/${productId}`}
                                                className="text-white font-semibold text-base hover:text-accent transition line-clamp-2"
                                            >
                                                {displayName}
                                            </Link>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-sm font-bold text-accent">
                                                    LKR {price.toLocaleString()}
                                                </span>
                                                {labelPrice > price && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        LKR {labelPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity Controls & Subtotal */}
                                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                                        {/* Quantity Stepper */}
                                        <div className="flex items-center border border-white/20 rounded-lg overflow-hidden bg-black/20">
                                            <button
                                                onClick={() => handleDecrease(productId, qty)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer font-bold text-base"
                                                aria-label="Decrease quantity"
                                            >
                                                -
                                            </button>
                                            <span className="w-10 text-center text-sm font-semibold text-white">
                                                {qty}
                                            </span>
                                            <button
                                                onClick={() => handleIncrease(productId, qty, stock)}
                                                disabled={isMaxReached}
                                                className={`w-8 h-8 flex items-center justify-center transition font-bold text-base ${
                                                    isMaxReached
                                                        ? "text-gray-600 cursor-not-allowed"
                                                        : "text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                                                }`}
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Item Subtotal */}
                                        <div className="text-right min-w-[100px]">
                                            <span className="text-xs text-gray-400 block">Subtotal</span>
                                            <span className="text-sm font-bold text-white">
                                                LKR {subtotal.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemove(productId)}
                                            className="text-gray-400 hover:text-red-400 p-2 transition cursor-pointer"
                                            title="Remove item"
                                        >
                                            <BiTrash className="text-lg" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-secondary/60 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
                        <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3">
                            Order Summary
                        </h2>

                        <div className="flex items-center justify-between text-sm text-gray-300">
                            <span>Total Items</span>
                            <span className="font-semibold text-white">{totalItems}</span>
                        </div>

                        <div className="flex items-center justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                            <span>Total Amount</span>
                            <span className="text-xl text-accent">LKR {cartTotal.toLocaleString()}</span>
                        </div>

                        {/* Checkout Disabled Placeholder */}
                        <div className="mt-4 pt-2">
                            <button
                                disabled
                                className="w-full py-3.5 px-6 bg-accent/40 text-white/60 font-semibold rounded-xl text-center cursor-not-allowed border border-accent/20"
                            >
                                Checkout (Coming Soon)
                            </button>
                            <p className="text-xs text-gray-400 text-center mt-2 italic">
                                Checkout functionality will be enabled in a future phase.
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
