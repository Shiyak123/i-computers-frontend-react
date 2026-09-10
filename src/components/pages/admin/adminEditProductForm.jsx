import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import uploadMedia from "../../../utils/mediaUpload";
import toast from "react-hot-toast";
import api from "../../../utils/api";
import { BiArrowBack } from "react-icons/bi";

export default function AdminEditProductForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state;

    // Guard against direct URL access without navigation state
    if (!product) {
        return (
            <div className="w-full min-h-full py-12 px-4 max-w-xl mx-auto text-center">
                <div className="bg-secondary/70 border border-white/10 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-2">No Product Selected</h2>
                    <p className="text-gray-400 text-sm mb-6">Please select a product from the inventory list to edit.</p>
                    <Link
                        to="/admin/products"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:opacity-90 text-white font-semibold rounded-xl text-xs transition"
                    >
                        <BiArrowBack /> Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const initialName = Array.isArray(product.name) ? product.name.join(" ") : (product.name || "");
    const initialAltNames = Array.isArray(product.alternativeName)
        ? product.alternativeName.join(", ")
        : (typeof product.alternativeName === "string" ? product.alternativeName : "");
    const initialPrice = product.price ?? "";
    const initialLabelPrice = product.labelPrice ?? product.labelledPrice ?? "";
    const initialDescription = product.description || "";
    const initialCategory = product.category || "graphic card";
    const initialBrand = product.brand || "";
    const initialModel = product.model || "";
    const initialStock = product.stock ?? 0;
    const initialIsAvailable = product.isAvailable !== false;
    const initialImages = Array.isArray(product.image)
        ? product.image
        : (typeof product.image === "string" && product.image ? [product.image] : []);

    const [name, setName] = useState(initialName);
    const [altNames, setAltNames] = useState(initialAltNames);
    const [description, setDescription] = useState(initialDescription);
    const [price, setPrice] = useState(initialPrice);
    const [labelPrice, setLabelPrice] = useState(initialLabelPrice);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [isAvailable, setIsAvailable] = useState(initialIsAvailable);
    const [category, setCategory] = useState(initialCategory);
    const [stock, setStock] = useState(initialStock);
    const [brand, setBrand] = useState(initialBrand);
    const [model, setModel] = useState(initialModel);
    const [isLoading, setIsLoading] = useState(false);

    async function handleEditProduct(e) {
        if (e) e.preventDefault();

        if (!name.toString().trim()) {
            toast.error("Product name is required");
            return;
        }
        if (price === "" || isNaN(Number(price))) {
            toast.error("Valid product price is required");
            return;
        }

        setIsLoading(true);
        try {
            let finalImageUrls = [...initialImages];

            // If admin selected new files, upload via Supabase
            if (newImageFiles && newImageFiles.length > 0) {
                const uploadPromises = [];
                for (let i = 0; i < newImageFiles.length; i++) {
                    uploadPromises.push(uploadMedia(newImageFiles[i]));
                }
                const uploaded = await Promise.all(uploadPromises);
                if (uploaded.length > 0) {
                    finalImageUrls = uploaded;
                }
            }

            // Convert comma-separated alternative names into trimmed array
            const altNamesArray = altNames
                ? altNames.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
                : [];

            const requestBody = {
                name: name.toString().trim(),
                alternativeName: altNamesArray,
                description: description.trim(),
                price: Number(price),
                labelPrice: Number(labelPrice) || Number(price),
                image: finalImageUrls,
                isAvailable: Boolean(isAvailable === true || isAvailable === "true"),
                category: category,
                stock: Number(stock) || 0,
                brand: brand,
                model: model
            };

            await api.put(`/products/${product.productId}`, requestBody);

            toast.success("Product updated successfully");
            navigate("/admin/products");
        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to update product";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full min-h-full space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            to="/admin/products"
                            className="text-gray-400 hover:text-white transition text-xs inline-flex items-center gap-1"
                        >
                            <BiArrowBack /> Back to Products
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Edit Product</h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        Editing record for ID: <span className="font-mono text-accent font-semibold">{product.productId}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/products"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition"
                    >
                        Cancel
                    </Link>
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleEditProduct}
                        className="px-5 py-2 bg-accent hover:opacity-90 text-white rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50 shadow-md"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Form Fields Card */}
            <div className="bg-secondary/70 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {/* Product ID (Disabled) */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-300 font-semibold">Product ID (Permanent)</label>
                        <input
                            type="text"
                            disabled
                            value={product.productId}
                            className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-mono cursor-not-allowed text-xs"
                        />
                    </div>

                    {/* Product Name */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-gray-300 font-semibold">Product Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition text-xs"
                            placeholder="e.g. NVIDIA GeForce RTX 4070 Ti Super"
                        />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-300 font-semibold">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-secondary border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-accent transition text-xs cursor-pointer"
                        >
                            <option value="graphic card">Graphics Card</option>
                            <option value="motherboard">Motherboard</option>
                            <option value="cpu">CPU</option>
                            <option value="ram">RAM</option>
                            <option value="storage">Storage</option>
                            <option value="power supply">Power Supply</option>
                            <option value="case">Case</option>
                            <option value="cooling">Cooling</option>
                            <option value="peripherals">Peripherals</option>
                            <option value="keyboards">Keyboards</option>
                            <option value="mouse">Mouse</option>
                            <option value="laptops">Laptops</option>
                            <option value="others">Others</option>
                        </select>
                    </div>

                    {/* Alternative Names */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-gray-300 font-semibold">
                            Alternative Names <span className="text-gray-500 font-normal">(comma-separated)</span>
                        </label>
                        <input
                            type="text"
                            value={altNames}
                            onChange={(e) => setAltNames(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition text-xs"
                            placeholder="VGA, GPU, Graphics Board"
                        />
                    </div>

                    {/* Brand */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-300 font-semibold">Brand</label>
                        <select
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-secondary border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-accent transition text-xs cursor-pointer"
                        >
                            <option value="">No brand</option>
                            <option value="nvidia">NVIDIA</option>
                            <option value="amd">AMD</option>
                            <option value="intel">Intel</option>
                            <option value="asus">ASUS</option>
                            <option value="msi">MSI</option>
                            <option value="gigabyte">Gigabyte</option>
                            <option value="corsair">Corsair</option>
                            <option value="cooler master">Cooler Master</option>
                            <option value="logitech">Logitech</option>
                            <option value="razer">Razer</option>
                            <option value="dell">Dell</option>
                            <option value="hp">HP</option>
                            <option value="lenovo">Lenovo</option>
                            <option value="apple">Apple</option>
                            <option value="red dragon">Red Dragon</option>
                            <option value="samsung">Samsung</option>
                        </select>
                    </div>

                    {/* Model */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-300 font-semibold">Model</label>
                        <input
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition text-xs"
                            placeholder="e.g. RTX 4070 Ti"
                        />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-300 font-semibold">Selling Price (LKR) *</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition text-xs"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Label Price */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-300 font-semibold">Labelled Price (LKR)</label>
                        <input
                            type="number"
                            value={labelPrice}
                            onChange={(e) => setLabelPrice(e.target.value)}
                            className="h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition text-xs"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Stock */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-300 font-semibold">Inventory Stock *</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                            className="h-10 px-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition text-xs"
                            placeholder="0"
                        />
                    </div>

                    {/* Availability */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-300 font-semibold">Availability Status</label>
                        <select
                            value={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.value === "true" || e.target.value === true)}
                            className="h-10 px-3 rounded-xl bg-secondary border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-accent transition text-xs cursor-pointer"
                        >
                            <option value={true}>Available</option>
                            <option value={false}>Out of Stock / Unavailable</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-4">
                        <label className="text-gray-300 font-semibold">Product Description</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="p-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent transition text-xs resize-none"
                            placeholder="Enter detailed technical specifications and features..."
                        />
                    </div>

                    {/* Images Section */}
                    <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-4 pt-2 border-t border-white/10">
                        <label className="text-gray-300 font-semibold">
                            Product Images <span className="text-gray-500 font-normal">(Select files to replace existing images)</span>
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => setNewImageFiles(e.target.files)}
                            className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition cursor-pointer"
                        />

                        {/* Existing Images Preview */}
                        {initialImages.length > 0 && (
                            <div className="mt-2">
                                <span className="text-[11px] text-gray-400 block mb-1.5">Current Saved Images:</span>
                                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                                    {initialImages.map((imgUrl, idx) => (
                                        <div key={idx} className="w-16 h-16 bg-white/5 border border-white/10 rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                                            <img src={imgUrl} alt="Saved product" className="w-full h-full object-contain" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
