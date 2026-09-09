import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { BsCart, BsSearch, BsPersonCircle } from "react-icons/bs";
import logo from "../assets/logo.png";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, [location]);

    function handleLogout() {
        localStorage.removeItem("token");
        setToken(null);
        toast.success("Logged out successfully");
        navigate("/login");
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/products");
        }
    }

    return (
        <header className="w-full bg-secondary text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                
                {/* Logo / Brand */}
                <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-wide">
                    <img src={logo} alt="I Computers Logo" className="h-10 w-auto object-contain" />
                    <span className="hidden sm:inline text-accent font-extrabold">I-COMPUTERS</span>
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-4 pr-10 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent transition text-sm"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
                    >
                        <BsSearch className="text-lg" />
                    </button>
                </form>

                {/* Navigation Links & User Actions */}
                <nav className="flex items-center gap-6">
                    <Link to="/" className="hover:text-accent font-medium transition text-sm sm:text-base">
                        Home
                    </Link>
                    <Link to="/products" className="hover:text-accent font-medium transition text-sm sm:text-base">
                        Products
                    </Link>

                    {/* Cart Icon */}
                    <Link to="/cart" aria-label="Shopping Cart" className="relative p-1 hover:text-accent transition">
                        <BsCart className="text-2xl" />
                    </Link>

                    {/* Authentication Section */}
                    {token ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-sm text-gray-200">
                                <BsPersonCircle className="text-xl text-accent" />
                                <span className="hidden md:inline font-medium">Account</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="bg-accent hover:opacity-90 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="border border-white/30 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
