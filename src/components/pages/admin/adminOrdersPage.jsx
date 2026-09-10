import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BiPackage, BiRefresh, BiShow, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import api from "../../../utils/api";
import AdminOrderModal from "./adminOrderModal";

const STATUS_BADGES = {
    pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
    completed: "bg-green-500/20 text-green-300 border border-green-500/40",
    cancelled: "bg-red-500/20 text-red-300 border border-red-500/40"
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
        return dateString || "N/A";
    }
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [page, limit]);

    async function fetchOrders() {
        setLoading(true);
        try {
            const res = await api.get(`/orders?page=${page}&limit=${limit}`);
            if (res.data && res.data.orders) {
                setOrders(res.data.orders);
                setTotalPages(res.data.totalPages || 1);
                setTotalOrders(res.data.totalOrders || 0);
            } else if (Array.isArray(res.data)) {
                setOrders(res.data);
                setTotalOrders(res.data.length);
                setTotalPages(1);
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to load orders";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    function handleOpenModal(order) {
        setSelectedOrder(order);
        setIsModalOpen(true);
    }

    return (
        <div className="w-full min-h-full space-y-6">
            
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BiPackage className="text-accent" />
                        Customer Orders
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        View and manage all customer order records and statuses
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-full font-medium border border-white/10">
                        Total: {totalOrders} {totalOrders === 1 ? "order" : "orders"}
                    </span>
                    <button
                        onClick={fetchOrders}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                    >
                        <BiRefresh className={`text-base ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Orders Table Card */}
            <div className="bg-secondary/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                {loading && orders.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 space-y-3">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-sm">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 space-y-2">
                        <BiPackage className="text-4xl mx-auto text-gray-500" />
                        <p className="text-sm font-medium">No customer orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[11px] tracking-wider font-semibold">
                                <tr>
                                    <th className="py-3.5 px-4">Order ID</th>
                                    <th className="py-3.5 px-4">Customer</th>
                                    <th className="py-3.5 px-4">Contact</th>
                                    <th className="py-3.5 px-4">Date</th>
                                    <th className="py-3.5 px-4">Total</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-white/[0.03] transition">
                                        <td className="py-3.5 px-4 font-mono font-medium text-accent">
                                            {order.orderId}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="font-medium text-white">{order.name || "N/A"}</div>
                                            <div className="text-[11px] text-gray-400 truncate max-w-[180px]">{order.email}</div>
                                        </td>
                                        <td className="py-3.5 px-4 text-gray-300">
                                            <div>{order.phone || "N/A"}</div>
                                            <div className="text-[11px] text-gray-400 truncate max-w-[160px]">{order.address}</div>
                                        </td>
                                        <td className="py-3.5 px-4 text-gray-300 whitespace-nowrap">
                                            {formatDate(order.date)}
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                                            LKR {(Number(order.totalAmount) || 0).toLocaleString()}
                                        </td>
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_BADGES[order.status] || STATUS_BADGES.pending}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => handleOpenModal(order)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg text-xs font-semibold transition cursor-pointer border border-accent/30"
                                                title="View & Edit Order"
                                            >
                                                <BiShow className="text-base" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                        <span>Items per page:</span>
                        <select
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            className="bg-secondary border border-white/20 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span>
                            Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                disabled={page <= 1 || loading}
                                className="p-1.5 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 transition cursor-pointer"
                                title="Previous Page"
                            >
                                <BiChevronLeft className="text-lg" />
                            </button>
                            <button
                                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={page >= totalPages || loading}
                                className="p-1.5 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 transition cursor-pointer"
                                title="Next Page"
                            >
                                <BiChevronRight className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AdminOrderModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStatusUpdated={fetchOrders}
            />
        </div>
    );
}
