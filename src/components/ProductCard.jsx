import { Link } from "react-router-dom";

export default function ProductCard(props) {
    const product = props.product || props;

    const {
        productId = "",
        name = "",
        image = [],
        price = 0,
        labelPrice = 0,
        isAvailable = true,
        category = ""
    } = product;

    // Extract primary image URL
    const imageUrl = Array.isArray(image) && image.length > 0 ? image[0] : (typeof image === "string" ? image : "/default-product-1.png");

    // Format display name
    const displayName = Array.isArray(name) ? name.join(" ") : name;

    return (
        <Link
            to={`/products/${productId}`}
            className="group bg-secondary border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-accent transition-all duration-300 flex flex-col justify-between"
        >
            <div className="relative w-full h-48 bg-white/5 flex items-center justify-center overflow-hidden p-4">
                <img
                    src={imageUrl}
                    alt={displayName}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-product-1.png";
                    }}
                />
                <span
                    className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                        isAvailable ? "bg-green-600/90 text-white" : "bg-red-600/90 text-white"
                    }`}
                >
                    {isAvailable ? "In Stock" : "Out of Stock"}
                </span>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                <div>
                    {category && (
                        <span className="text-xs text-accent font-medium uppercase tracking-wider block mb-1">
                            {category}
                        </span>
                    )}
                    <h3 className="text-white font-semibold text-base line-clamp-2 group-hover:text-accent transition-colors">
                        {displayName}
                    </h3>
                </div>

                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-bold text-white">
                        LKR {price.toLocaleString()}
                    </span>
                    {labelPrice > price && (
                        <span className="text-xs text-gray-400 line-through">
                            LKR {labelPrice.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}