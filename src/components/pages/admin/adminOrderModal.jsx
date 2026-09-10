import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BiX, BiPackage } from "react-icons/bi";
import api from "../../../utils/api";

const STATUS_COLORS = {
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

export default function AdminOrderModal({ order, isOpen, onClose, onStatusUpdated }) {
    const [selectedStatus, setSelectedStatus] = useState(order?.status || "pending");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (order?.status) {
            setSelectedStatus(order.status);
        }
    }, [order]);

    if (!isOpen || !order) return null;

    async function handleStatusChange(newStatus) {
        if (newStatus === order.status) return;

        setUpdating(true);
        try {
            await api.put(`/orders/${order.orderId}`, { status: newStatus });
            setSelectedStatus(newStatus);
            toast.success(`Order status updated to ${newStatus}`);
            if (onStatusUpdated) {
                onStatusUpdated();
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to update order status";
            toast.error(msg);
        } finally {
            setUpdating(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-secondary border border-white/10 text-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-2.5">
                        <BiPackage className="text-2xl text-accent" />
                        <div>
                            <h2 className="text-lg font-bold text-white">Order Details</h2>
                            <span className="text-xs text-gray-400 font-mono">{order.orderId}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                    >
                        <BiX className="text-2xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    
                    {/* Customer & Delivery Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 text-sm">
                        <div>
                            <span className="text-xs text-gray-400 block mb-0.5">Customer Name</span>
                            <span className="font-medium text-white">{order.name || "N/A"}</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 block mb-0.5">Customer Email</span>
                            <span className="font-medium text-white">{order.email || "N/A"}</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 block mb-0.5">Phone Number</span>
                            <span className="font-medium text-white">{order.phone || "N/A"}</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-400 block mb-0.5">Order Date</span>
                            <span className="font-medium text-gray-300">{formatDate(order.date)}</span>
                        </div>
                        <div className="sm:col-span-2">
                            <span className="text-xs text-gray-400 block mb-0.5">Delivery Address</span>
                            <span className="font-medium text-white">{order.address || "N/A"}</span>
                        </div>
                    </div>

                    {/* Status Management */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                        <div>
                            <span className="text-xs text-gray-400 block mb-1">Manage Order Status</span>
                            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                                Current: {order.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="statusSelect" className="text-xs text-gray-300">Change to:</label>
                            <select
                                id="statusSelect"
                                value={selectedStatus}
                                disabled={updating}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 cursor-pointer"
                            >
                                <option value="pending" className="bg-gray-800 text-white">Pending</option>
                                <option value="completed" className="bg-gray-800 text-white">Completed</option>
                                <option value="cancelled" className="bg-gray-800 text-white">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Itemized Breakdown */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-3">Ordered Items</h3>
                        <div className="space-y-3">
                            {order.orderedItems?.map((item, idx) => {
                                const itemName = Array.isArray(item.name) ? item.name.join(" ") : item.name;
                                const itemImg = Array.isArray(item.image) ? item.image[0] : item.image;
                                const itemPrice = Number(item.price) || 0;
                                const itemQty = Number(item.quantity) || 1;
                                const subtotal = itemPrice * itemQty;

                                return (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                {itemImg ? (
                                                    <img
                                                        src={itemImg}
                                                        alt={itemName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.style.display = "none"; }}
                                                    />
                                                ) : (
                                                    <BiPackage className="text-xl text-gray-400" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{itemName}</p>
                                                <p className="text-xs text-gray-400">
                                                    LKR {itemPrice.toLocaleString()} x {itemQty}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-accent whitespace-nowrap">
                                            LKR {subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Total Amount Summary */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/10 text-base font-bold">
                        <span className="text-gray-300">Total Amount</span>
                        <span className="text-xl text-accent">LKR {(Number(order.totalAmount) || 0).toLocaleString()}</span>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
