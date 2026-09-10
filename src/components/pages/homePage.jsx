
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FiArrowRight,
    FiCpu,
    FiHardDrive,
    FiShield,
    FiTruck,
    FiHeadphones,
    FiZap
} from "react-icons/fi";
import { BsGpuCard, BsLaptop, BsMemory } from "react-icons/bs";
import api from "../../utils/api";
import ProductCard from "../ProductCard";

const CATEGORIES = [
    { name: "Laptops", icon: BsLaptop, query: "laptop", desc: "Performance & Gaming" },
    { name: "Graphics Cards", icon: BsGpuCard, query: "gpu", desc: "NVIDIA RTX & AMD RX" },
    { name: "Processors", icon: FiCpu, query: "cpu", desc: "Intel Core & AMD Ryzen" },
    { name: "Memory (RAM)", icon: BsMemory, query: "ram", desc: "DDR4 & DDR5 Modules" },
    { name: "Storage & SSDs", icon: FiHardDrive, query: "ssd", desc: "Fast NVMe & SATA" },
    { name: "Peripherals", icon: FiHeadphones, query: "peripheral", desc: "Keyboards, Mice & Headsets" }
];

const VALUE_PROPOSITIONS = [
    {
        icon: FiShield,
        title: "100% Genuine Hardware",
        desc: "All components backed by authorized manufacturer warranty"
    },
    {
        icon: FiTruck,
        title: "Island-wide Fast Delivery",
        desc: "Secure insured shipping with door-to-door tracking"
    },
    {
        icon: FiZap,
        title: "Competitive Pricing",
        desc: "Best retail and wholesale prices on the latest hardware"
    }
];

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadFeatured() {
            try {
                const res = await api.get("/products");
                if (isMounted && Array.isArray(res.data)) {
                    setFeaturedProducts(res.data.slice(0, 4));
                }
            } catch {
                // Silently fallback if API error
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadFeatured();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="w-full flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-secondary to-primary py-20 px-4 border-b border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <span className="px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-blue-300 text-xs font-semibold tracking-wider uppercase mb-6 animate-pulse">
                        Your Trusted PC Hardware Specialist
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-tight">
                        Power Your Setup with <span className="text-accent">I-COMPUTERS</span>
                    </h1>
                    <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
                        Discover top-tier gaming rigs, workstation components, and cutting-edge computer hardware engineered for high performance and reliability.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/products"
                            className="px-8 py-3.5 bg-accent hover:bg-accent/80 text-white font-semibold rounded-xl shadow-xl flex items-center gap-2 transition duration-200"
                        >
                            Explore Catalogue <FiArrowRight />
                        </Link>
                        <Link
                            to="/orders"
                            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold rounded-xl transition duration-200"
                        >
                            Track My Orders
                        </Link>
                    </div>
                </div>
            </section>

            {/* Value Propositions / Badges */}
            <section className="bg-secondary/60 border-b border-white/10 py-10 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {VALUE_PROPOSITIONS.map((prop, idx) => {
                        const Icon = prop.icon;
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5"
                            >
                                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent text-2xl flex-shrink-0">
                                    <Icon />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm sm:text-base">{prop.title}</h3>
                                    <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{prop.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Shop by Category Quick-Cards */}
            <section className="max-w-7xl mx-auto w-full py-16 px-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Browse by Category</h2>
                        <p className="text-gray-400 text-sm mt-1">Quickly find the specific hardware components for your build</p>
                    </div>
                    <Link
                        to="/products"
                        className="text-accent hover:underline text-sm font-semibold flex items-center gap-1 self-start sm:self-auto"
                    >
                        View All Categories <FiArrowRight className="text-xs" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {CATEGORIES.map((cat, idx) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={idx}
                                to={`/products?search=${encodeURIComponent(cat.query)}`}
                                className="group p-5 bg-secondary border border-white/10 rounded-2xl flex flex-col items-center text-center hover:border-accent hover:shadow-xl transition-all duration-200"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-accent/20 flex items-center justify-center text-gray-300 group-hover:text-white text-2xl mb-3 transition">
                                    <Icon />
                                </div>
                                <span className="text-white font-semibold text-sm group-hover:text-accent transition">
                                    {cat.name}
                                </span>
                                <span className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                                    {cat.desc}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Featured Hardware Showcase */}
            <section className="bg-secondary/40 border-t border-white/10 py-16 px-4">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Featured Hardware</h2>
                            <p className="text-gray-400 text-sm mt-1">Selected high-demand hardware components ready for dispatch</p>
                        </div>
                        <Link
                            to="/products"
                            className="text-accent hover:underline text-sm font-semibold flex items-center gap-1 self-start sm:self-auto"
                        >
                            See All Products <FiArrowRight className="text-xs" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-secondary rounded-2xl border border-white/10">
                            <p className="text-gray-400 text-sm">Products are loading or available in the catalog.</p>
                            <Link to="/products" className="mt-3 inline-block text-accent font-semibold text-sm">
                                View Full Catalogue &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}