import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BiArrowBack, BiPackage, BiRefresh } from "react-icons/bi";
import api from "../../utils/api";

const STATUS_STYLES = {
    pending: "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300",
    completed: "bg-green-500/20 border border-green-500/40 text-green-300",
    cancelled: "bg-red-500/20 border border-red-500/40 text-red-300"
};

function formatDate(dateString) {
    try {
        return new Date(dateString).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return dateString;
    }
}

export default function OrdersPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            toast.error("Please log in to view your orders");
            navigate("/login");
            return;
        }
        fetchOrders();
    }, [token, navigate]);

    async function fetchOrders() {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/orders");
            setOrders(res.data || []);
        } catch (err) {
            const message = err?.response?.data?.message || "Failed to load orders";
            setError(message);
            if (err?.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    }

    if (!token) return null;

    return (
        <div className="w-full min-h-full py-8 px-4 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition font-medium text-sm"
                >
                    <BiArrowBack className="text-lg" /> Home
                </Link>
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                    <BiRefresh className={loading ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <BiPackage className="text-accent" /> My Orders
            </h1>

            {/* Loading */}
            {loading && (
                <div className="w-full min-h-[40vh] flex flex-col items-center justify-center text-gray-300">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p>Loading orders...</p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-6 rounded-2xl text-center">
                    <p className="font-semibold mb-3">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="px-5 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && orders.length === 0 && (
                <div className="bg-secondary/60 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8 shadow-2xl">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 text-accent text-4xl border border-white/10">
                        <BiPackage />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No Orders Yet</h2>
                    <p className="text-gray-400 text-sm mb-6">You haven't placed any orders yet.</p>
                    <Link
                        to="/products"
                        className="px-6 py-3 bg-accent hover:opacity-90 text-white font-semibold rounded-xl text-sm transition shadow-lg"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}

            {/* Orders List */}
            {!loading && !error && orders.length > 0 && (
                <div className="flex flex-col gap-6">
                    {orders.map((order) => {
                        const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;

                        return (
                            <div
                                key={order.orderId || order._id}
                                className="bg-secondary/60 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
                                    <div>
                                        <span className="text-xs text-gray-400 block mb-0.5">Order ID</span>
                                        <span className="text-sm font-bold text-white font-mono">{order.orderId}</span>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <span className="text-xs text-gray-400 block mb-0.5">Placed on</span>
                                        <span className="text-sm text-gray-300">{formatDate(order.date)}</span>
                                    </div>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full self-start sm:self-center ${statusStyle}`}>
                                        {(order.status || "pending").charAt(0).toUpperCase() + (order.status || "pending").slice(1)}
                                    </span>
                                </div>

                                {/* Ordered Items */}
                                <div className="flex flex-col gap-2.5 mb-4">
                                    {(order.orderedItems || []).map((item, idx) => {
                                        const itemImg = Array.isArray(item.image) && item.image.length > 0
                                            ? item.image[0]
                                            : (typeof item.image === "string" ? item.image : "/default-product-1.png");
                                        const itemName = Array.isArray(item.name) ? item.name.join(" ") : (item.name || "Product");
                                        const itemPrice = Number(item.price) || 0;
                                        const itemQty = Number(item.quantity) || 1;

                                        return (
                                            <div key={item.productId || idx} className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={itemImg}
                                                        alt={itemName}
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "/default-product-1.png"; }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white line-clamp-1">{itemName}</p>
                                                    <p className="text-xs text-gray-400">
                                                        LKR {itemPrice.toLocaleString()} × {itemQty}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-semibold text-white whitespace-nowrap">
                                                    LKR {(itemPrice * itemQty).toLocaleString()}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Order Total */}
                                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                    <span className="text-sm font-bold text-gray-300">Order Total</span>
                                    <span className="text-lg font-extrabold text-accent">
                                        LKR {Number(order.totalAmount || 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
