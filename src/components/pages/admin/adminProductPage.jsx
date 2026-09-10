import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiPackage, BiRefresh, BiEdit, BiPlus } from "react-icons/bi";
import api from "../../../utils/api";
import toast from "react-hot-toast";
import ProductDeleteButton from "../../productDeleteButton";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchFilter, setSearchFilter] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/products", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to load product inventory";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    const filtered = products.filter((p) => {
        if (!searchFilter.trim()) return true;
        const q = searchFilter.toLowerCase();
        const nameStr = Array.isArray(p.name) ? p.name.join(" ") : (p.name || "");
        const idStr = p.productId || "";
        const catStr = p.category || "";
        const brandStr = p.brand || "";
        return (
            nameStr.toLowerCase().includes(q) ||
            idStr.toLowerCase().includes(q) ||
            catStr.toLowerCase().includes(q) ||
            brandStr.toLowerCase().includes(q)
        );
    });

    return (
        <div className="w-full min-h-full space-y-6 relative pb-20">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BiPackage className="text-accent" />
                        Product Inventory
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        Manage store products, stock levels, pricing, and availability
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-full font-medium border border-white/10">
                        Total: {products.length} {products.length === 1 ? "product" : "products"}
                    </span>
                    <button
                        type="button"
                        onClick={fetchProducts}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                    >
                        <BiRefresh className={`text-base ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <Link
                        to="/admin/add-product"
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent hover:opacity-90 text-white rounded-lg text-xs font-semibold transition shadow-md"
                    >
                        <BiPlus className="text-base" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Search Filter Bar */}
            <div className="flex items-center justify-between gap-4">
                <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by ID, name, brand, or category..."
                    className="w-full sm:max-w-md h-10 px-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-2 focus:ring-accent transition"
                />
                {searchFilter && (
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        Showing {filtered.length} of {products.length}
                    </span>
                )}
            </div>

            {/* Product Table Card */}
            <div className="bg-secondary/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                {loading && products.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 space-y-3">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-sm">Loading product catalog...</p>
                    </div>
                ) : error ? (
                    <div className="py-16 text-center text-red-300 space-y-3 p-4">
                        <p className="text-sm font-semibold">{error}</p>
                        <button
                            type="button"
                            onClick={fetchProducts}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                            Retry
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 space-y-3 p-4">
                        <BiPackage className="text-4xl mx-auto text-gray-500" />
                        <p className="text-sm font-medium">
                            {searchFilter ? "No products matching your search filter" : "No products found in inventory"}
                        </p>
                        <Link
                            to="/admin/add-product"
                            className="inline-flex items-center gap-1 px-4 py-2 bg-accent hover:opacity-90 text-white rounded-xl text-xs font-semibold transition"
                        >
                            <BiPlus className="text-base" /> Create First Product
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[11px] tracking-wider font-semibold">
                                <tr>
                                    <th className="py-3.5 px-4">Thumbnail</th>
                                    <th className="py-3.5 px-4">Product ID</th>
                                    <th className="py-3.5 px-4">Name</th>
                                    <th className="py-3.5 px-4">Selling Price</th>
                                    <th className="py-3.5 px-4">Label Price</th>
                                    <th className="py-3.5 px-4">Brand / Model</th>
                                    <th className="py-3.5 px-4">Category</th>
                                    <th className="py-3.5 px-4">Availability</th>
                                    <th className="py-3.5 px-4 text-center">Stock</th>
                                    <th className="py-3.5 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-gray-200">
                                {filtered.map((product) => {
                                    const imgList = Array.isArray(product.image) ? product.image : (typeof product.image === "string" ? [product.image] : []);
                                    const thumbnail = imgList.length > 0 ? imgList[0] : null;
                                    const displayName = Array.isArray(product.name) ? product.name.join(" ") : (product.name || "N/A");
                                    const price = Number(product.price) || 0;
                                    const labelPrice = Number(product.labelPrice ?? product.labelledPrice) || price;
                                    const isAvail = product.isAvailable !== false;

                                    return (
                                        <tr key={product.productId} className="hover:bg-white/[0.03] transition">
                                            {/* Thumbnail */}
                                            <td className="py-3 px-4">
                                                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center p-1">
                                                    {thumbnail ? (
                                                        <img
                                                            src={thumbnail}
                                                            alt={displayName}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.style.display = "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <BiPackage className="text-xl text-gray-500" />
                                                    )}
                                                </div>
                                            </td>

                                            {/* Product ID */}
                                            <td className="py-3.5 px-4 font-mono font-medium text-accent whitespace-nowrap">
                                                {product.productId}
                                            </td>

                                            {/* Product Name */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-medium text-white max-w-xs truncate" title={displayName}>
                                                    {displayName}
                                                </div>
                                                {product.alternativeName && Array.isArray(product.alternativeName) && product.alternativeName.length > 0 && (
                                                    <div className="text-[11px] text-gray-400 truncate max-w-xs">
                                                        {product.alternativeName.join(", ")}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Price */}
                                            <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                                                LKR {price.toLocaleString()}
                                            </td>

                                            {/* Label Price */}
                                            <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                                                {labelPrice > price ? (
                                                    <span className="line-through text-xs">LKR {labelPrice.toLocaleString()}</span>
                                                ) : (
                                                    <span className="text-xs text-gray-500">-</span>
                                                )}
                                            </td>

                                            {/* Brand / Model */}
                                            <td className="py-3.5 px-4 text-gray-300 whitespace-nowrap">
                                                <div>{product.brand || "-"}</div>
                                                <div className="text-[11px] text-gray-500">{product.model || ""}</div>
                                            </td>

                                            {/* Category */}
                                            <td className="py-3.5 px-4 text-gray-300 capitalize whitespace-nowrap">
                                                <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs">
                                                    {product.category || "General"}
                                                </span>
                                            </td>

                                            {/* Availability */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                                        isAvail
                                                            ? "bg-green-500/20 text-green-300 border border-green-500/40"
                                                            : "bg-red-500/20 text-red-300 border border-red-500/40"
                                                    }`}
                                                >
                                                    {isAvail ? "Available" : "Out of Stock"}
                                                </span>
                                            </td>

                                            {/* Stock */}
                                            <td className="py-3.5 px-4 text-center font-bold text-white whitespace-nowrap">
                                                <span className={product.stock <= 5 ? "text-red-400" : "text-green-400"}>
                                                    {product.stock ?? 0}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Link
                                                        to="/admin/edit-product"
                                                        state={product}
                                                        title="Edit Product"
                                                        className="p-1.5 text-accent hover:text-white hover:bg-accent/20 rounded-lg transition cursor-pointer border border-transparent hover:border-accent/30"
                                                    >
                                                        <BiEdit className="text-lg" />
                                                    </Link>
                                                    <ProductDeleteButton
                                                        productId={product.productId}
                                                        productName={product.name}
                                                        refresh={fetchProducts}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Floating Quick-Add Action Button */}
            <Link
                to="/admin/add-product"
                title="Add New Product"
                className="fixed bottom-6 right-6 w-14 h-14 bg-accent hover:opacity-90 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl transition hover:scale-105 z-30 border-2 border-white/20"
            >
                <BiPlus />
            </Link>
        </div>
    );
}
