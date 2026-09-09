import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import ProductCard from "../ProductCard";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get("/products");
                setProducts(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setError(err?.response?.data?.message || err.message || "Failed to load products");
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase().trim();

        const nameStr = Array.isArray(product.name) ? product.name.join(" ") : (product.name || "");
        const categoryStr = product.category || "";
        const brandStr = product.brand || "";
        const altNamesStr = Array.isArray(product.alternativeName)
            ? product.alternativeName.join(" ")
            : (product.alternativeName || "");

        return (
            nameStr.toLowerCase().includes(query) ||
            categoryStr.toLowerCase().includes(query) ||
            brandStr.toLowerCase().includes(query) ||
            altNamesStr.toLowerCase().includes(query)
        );
    });

    return (
        <div className="w-full min-h-full py-8 px-4 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {searchQuery ? `Search Results for "${searchQuery}"` : "Product Catalogue"}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Explore our wide range of computer components and hardware.
                    </p>
                </div>
                {!loading && (
                    <span className="text-xs font-semibold px-3 py-1 bg-accent/20 border border-accent/40 text-white rounded-full self-start sm:self-auto">
                        {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"} Found
                    </span>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium">Loading products...</p>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-6 rounded-xl text-center max-w-lg mx-auto my-12">
                    <p className="font-semibold text-lg mb-2">Error Loading Products</p>
                    <p className="text-sm opacity-90 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-secondary/50 border border-white/10 rounded-2xl p-8 max-w-md mx-auto my-8">
                    <div className="text-5xl mb-4">💻</div>
                    <h2 className="text-xl font-bold text-white mb-2">No Products Found</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        {searchQuery
                            ? `We couldn't find any products matching "${searchQuery}".`
                            : "There are currently no products available in the catalogue."}
                    </p>
                </div>
            )}

            {/* Product Grid */}
            {!loading && !error && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.productId || product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
