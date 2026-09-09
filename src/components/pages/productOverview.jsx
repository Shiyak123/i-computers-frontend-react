import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { addToCart } from "../../utils/cart";
import { BiArrowBack } from "react-icons/bi";

export default function ProductOverview() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        async function fetchProductDetails() {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/products/${productId}`);
                const data = res.data;
                setProduct(data);

                // Set initial main image
                if (data && data.image) {
                    const primaryImg = Array.isArray(data.image) && data.image.length > 0
                        ? data.image[0]
                        : (typeof data.image === "string" ? data.image : "/default-product-1.png");
                    setSelectedImage(primaryImg);
                }
            } catch (err) {
                setError(err?.response?.data?.message || err.message || "Failed to load product details");
            } finally {
                setLoading(false);
            }
        }

        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center py-20 text-gray-300">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-medium">Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-8 rounded-2xl text-center max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
                    <p className="text-sm opacity-90 mb-6">{error || "The requested product does not exist."}</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:opacity-90 text-white font-semibold rounded-lg text-sm transition"
                    >
                        <BiArrowBack /> Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const {
        name = "",
        price = 0,
        labelPrice = 0,
        description = "",
        isAvailable = true,
        category = "",
        stock = 0,
        brand = "",
        model = ""
    } = product;

    const displayName = Array.isArray(name) ? name.join(" ") : name;
    const imagesList = Array.isArray(product.image) && product.image.length > 0
        ? product.image
        : (typeof product.image === "string" ? [product.image] : ["/default-product-1.png"]);

    return (
        <div className="w-full min-h-full py-8 px-4 max-w-7xl mx-auto">
            {/* Back Navigation Link */}
            <Link
                to="/products"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition mb-6 font-medium text-sm"
            >
                <BiArrowBack className="text-lg" /> Back to Products
            </Link>

            <div className="bg-secondary/60 border border-white/10 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-2xl">
                
                {/* Left Column: Image Gallery */}
                <div className="flex flex-col gap-4">
                    {/* Main Selected Image */}
                    <div className="w-full h-80 sm:h-96 bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-center overflow-hidden">
                        <img
                            src={selectedImage || imagesList[0]}
                            alt={displayName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/default-product-1.png";
                            }}
                        />
                    </div>

                    {/* Image Thumbnails */}
                    {imagesList.length > 1 && (
                        <div className="flex items-center gap-3 overflow-x-auto pb-2">
                            {imagesList.map((imgUrl, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(imgUrl)}
                                    className={`w-16 h-16 rounded-lg bg-white/5 border p-1 transition overflow-hidden flex-shrink-0 cursor-pointer ${
                                        selectedImage === imgUrl ? "border-accent ring-2 ring-accent/50" : "border-white/10 opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Product Details */}
                <div className="flex flex-col justify-between gap-6">
                    <div>
                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-3">
                            {category && (
                                <span className="text-xs font-semibold px-2.5 py-1 bg-accent/20 border border-accent/40 text-accent rounded-md uppercase tracking-wider">
                                    {category}
                                </span>
                            )}
                            <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                                    isAvailable ? "bg-green-600/20 border border-green-500/40 text-green-400" : "bg-red-600/20 border border-red-500/40 text-red-400"
                                }`}
                            >
                                {isAvailable ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                            {displayName}
                        </h1>

                        {/* Brand & Model */}
                        {(brand || model) && (
                            <p className="text-sm text-gray-400 mb-4">
                                {brand && <span>Brand: <strong className="text-gray-200">{brand}</strong></span>}
                                {brand && model && <span className="mx-2">•</span>}
                                {model && <span>Model: <strong className="text-gray-200">{model}</strong></span>}
                            </p>
                        )}

                        {/* Pricing */}
                        <div className="flex items-baseline gap-3 my-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                            <span className="text-3xl font-extrabold text-white">
                                LKR {price.toLocaleString()}
                            </span>
                            {labelPrice > price && (
                                <span className="text-base text-gray-400 line-through">
                                    LKR {labelPrice.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Stock quantity if available */}
                        {isAvailable && stock > 0 && (
                            <p className="text-xs text-gray-400 mb-4">
                                Available Inventory: <span className="text-green-400 font-semibold">{stock} units</span>
                            </p>
                        )}

                        {/* Description */}
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
                                Product Description
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-black/20 p-4 rounded-xl border border-white/5">
                                {description || "No description provided for this product."}
                            </p>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <button
                            onClick={() => {
                                if (isAvailable && (typeof stock !== "number" || stock > 0)) {
                                    addToCart(product, 1);
                                    toast.success("Product added to cart");
                                } else {
                                    toast.error("Product is currently unavailable");
                                }
                            }}
                            disabled={!isAvailable || (typeof stock === "number" && stock <= 0)}
                            className={`w-full py-3.5 px-6 font-semibold rounded-xl text-center transition ${
                                isAvailable && (typeof stock !== "number" || stock > 0)
                                    ? "bg-accent hover:opacity-90 text-white cursor-pointer shadow-lg hover:shadow-accent/20"
                                    : "bg-gray-700/50 text-gray-400 cursor-not-allowed border border-white/10"
                            }`}
                        >
                            {isAvailable && (typeof stock !== "number" || stock > 0) ? "Add to Cart" : "Out of Stock"}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
