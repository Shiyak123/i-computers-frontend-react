import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BiArrowBack, BiPackage } from "react-icons/bi";
import { getCart, getTotal, clearCart } from "../../utils/cart";
import api from "../../utils/api";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Redirect unauthenticated users immediately
    useEffect(() => {
        if (!token) {
            toast.error("Please log in to continue with checkout");
            navigate("/login");
        }
    }, [token, navigate]);

    // Decode name from JWT payload for pre-fill (base64 decode middle segment)
    function getUserNameFromToken() {
        try {
            if (!token) return "";
            const payload = JSON.parse(atob(token.split(".")[1]));
            const firstName = payload.firstName || "";
            const lastName = payload.lastName || "";
            return `${firstName} ${lastName}`.trim();
        } catch {
            return "";
        }
    }

    const [cart] = useState(getCart());
    const [name, setName] = useState(getUserNameFromToken());
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cartTotal = getTotal(cart);

    // If not logged in, render nothing (useEffect handles redirect)
    if (!token) return null;

    // Empty cart guard
    if (cart.length === 0) {
        return (
            <div className="w-full min-h-full py-12 px-4 max-w-3xl mx-auto">
                <div className="bg-secondary/60 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-2xl">
                    <BiPackage className="text-5xl text-gray-500 mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-400 text-sm mb-6">Add products to your cart before checking out.</p>
                    <Link
                        to="/products"
                        className="px-6 py-3 bg-accent hover:opacity-90 text-white font-semibold rounded-xl text-sm transition"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    async function handlePlaceOrder(e) {
        e.preventDefault();

        if (isSubmitting) return;

        if (!name.trim() || !address.trim() || !phone.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        // Build orderedItems sending only productId and quantity (backend handles prices)
        const orderedItems = cart.map((item) => ({
            productId: item.product.productId || item.product._id,
            quantity: Number(item.qty)
        }));

        setIsSubmitting(true);
        try {
            await api.post("/orders", {
                name: name.trim(),
                address: address.trim(),
                phone: phone.trim(),
                orderedItems
            });

            // Success: clear cart and navigate
            clearCart();
            toast.success("Order placed successfully!");
            navigate("/orders");
        } catch (err) {
            // Do NOT clear cart on failure
            const message = err?.response?.data?.message || "Failed to place order. Please try again.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full min-h-full py-8 px-4 max-w-7xl mx-auto">
            {/* Back Navigation */}
            <Link
                to="/cart"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition mb-6 font-medium text-sm"
            >
                <BiArrowBack className="text-lg" /> Back to Cart
            </Link>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <BiPackage className="text-accent" /> Checkout
            </h1>

            <form onSubmit={handlePlaceOrder}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left: Delivery Information */}
                    <div className="bg-secondary/60 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                        <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3">
                            Delivery Information
                        </h2>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-300">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-300">Delivery Address</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full delivery address"
                                required
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition text-sm resize-none"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-300">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your phone number"
                                required
                                className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition text-sm"
                            />
                        </div>
                    </div>

                    {/* Right: Order Summary + Action */}
                    <div className="flex flex-col gap-5">
                        {/* Order Items Summary */}
                        <div className="bg-secondary/60 border border-white/10 rounded-2xl p-6 shadow-xl">
                            <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3 mb-4">
                                Order Summary
                            </h2>

                            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                                {cart.map((item, idx) => {
                                    const product = item.product || {};
                                    const productId = product.productId || product._id;
                                    const displayName = Array.isArray(product.name) ? product.name.join(" ") : product.name;
                                    const imageUrl = Array.isArray(product.image) && product.image.length > 0
                                        ? product.image[0]
                                        : (typeof product.image === "string" ? product.image : "/default-product-1.png");
                                    const price = Number(product.price) || 0;
                                    const qty = Number(item.qty) || 1;
                                    const subtotal = price * qty;

                                    return (
                                        <div key={productId || idx} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                <img
                                                    src={imageUrl}
                                                    alt={displayName}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-product-1.png"; }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white line-clamp-1">{displayName}</p>
                                                <p className="text-xs text-gray-400">LKR {price.toLocaleString()} × {qty}</p>
                                            </div>
                                            <span className="text-sm font-semibold text-white whitespace-nowrap">
                                                LKR {subtotal.toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
                                <span className="text-base font-bold text-white">Estimated Total</span>
                                <span className="text-xl font-extrabold text-accent">LKR {cartTotal.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 italic">
                                Final total is confirmed by the server when order is placed.
                            </p>
                        </div>

                        {/* Place Order Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 px-6 font-bold rounded-xl text-white text-base transition shadow-lg ${
                                isSubmitting
                                    ? "bg-accent/50 cursor-not-allowed"
                                    : "bg-accent hover:opacity-90 cursor-pointer"
                            }`}
                        >
                            {isSubmitting ? "Placing Order..." : "Place Order"}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}
