import { useState } from "react";
import { CiTrash } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function ProductDeleteButton({ productId, productName, refresh }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        try {
            await api.delete(`/products/${productId}`);
            toast.success(`Product ${productId} deleted successfully`);
            setIsModalVisible(false);
            if (typeof refresh === "function") {
                refresh();
            }
        } catch (err) {
            const errorMsg = err?.response?.data?.message || "Failed to delete product";
            toast.error(errorMsg);
        } finally {
            setIsDeleting(false);
        }
    }

    const displayName = Array.isArray(productName) ? productName.join(" ") : (productName || productId);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalVisible(true)}
                title="Delete Product"
                className="p-1.5 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer border border-transparent hover:border-red-500/20"
            >
                <CiTrash className="text-xl" />
            </button>

            {isModalVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
                    <div className="w-full max-w-md bg-secondary border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="px-5 py-3.5 bg-white/5 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-white text-base font-bold flex items-center gap-2">
                                <CiTrash className="text-red-500 text-lg" />
                                Confirm Deletion
                            </h3>
                            <button
                                type="button"
                                onClick={() => !isDeleting && setIsModalVisible(false)}
                                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                            >
                                <IoClose className="text-xl" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 text-center space-y-3">
                            <p className="text-gray-300 text-sm">
                                Are you sure you want to permanently delete this product?
                            </p>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left">
                                <div className="text-xs text-gray-400">Product ID: <span className="font-mono text-accent font-semibold">{productId}</span></div>
                                <div className="text-sm font-semibold text-white truncate mt-1">{displayName}</div>
                            </div>
                            <p className="text-xs text-red-400/90 font-medium">
                                This action is a permanent hard delete and cannot be undone.
                            </p>
                        </div>

                        {/* Footer / Actions */}
                        <div className="px-5 py-3.5 bg-white/5 border-t border-white/10 flex justify-end items-center gap-3">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setIsModalVisible(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDelete}
                                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition cursor-pointer disabled:opacity-50 shadow-md shadow-red-900/30"
                            >
                                {isDeleting ? "Deleting..." : "Delete Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
