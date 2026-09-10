import { useState, useEffect } from "react";
import { BsGift } from "react-icons/bs";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { TbUsers } from "react-icons/tb";
import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import AdminProductsPage from "./admin/adminProductPage";
import AdminAddProductForm from "./admin/adminAddProdctForm";
import AdminEditProductForm from "./admin/adminEditProductForm";
import AdminOrdersPage from "./admin/adminOrdersPage";
import logo from "../../assets/logo.png";

export default function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please log in as an administrator to access this area");
            navigate("/login");
            return;
        }

        try {
            const payloadBase64 = token.split(".")[1];
            if (!payloadBase64) throw new Error("Invalid token format");
            const payload = JSON.parse(atob(payloadBase64));
            if (!payload.isAdmin) {
                toast.error("Access denied. Administrator privileges required.");
                navigate("/");
                return;
            }
            setIsAdminAuthorized(true);
        } catch {
            toast.error("Invalid session. Please log in again.");
            navigate("/login");
        }
    }, [navigate]);

    if (!isAdminAuthorized) {
        return null;
    }

    const currentPath = location.pathname;
    const isOrdersActive = currentPath === "/admin" || currentPath === "/admin/";
    const isProductsActive = currentPath.startsWith("/admin/products") || currentPath.startsWith("/admin/add-product") || currentPath.startsWith("/admin/edit-product");
    const isUsersActive = currentPath.startsWith("/admin/users");

    return (
        <div className="w-full h-full flex bg-primary min-h-[calc(100vh-64px)]">

            {/* Admin Sidebar */}
            <div className="w-[260px] sm:w-[280px] bg-secondary border-r border-white/10 flex flex-col justify-between shadow-2xl flex-shrink-0">
                <div>
                    {/* Brand Banner */}
                    <div className="w-full py-5 px-6 border-b border-white/10 flex items-center gap-3">
                        <img src={logo} alt="I Computers" className="h-9 w-auto object-contain" />
                        <div>
                            <span className="text-sm font-extrabold text-white tracking-wider block">ADMIN PANEL</span>
                            <span className="text-[10px] text-accent uppercase font-semibold">Management Console</span>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="p-3 space-y-1.5">
                        <Link
                            to="/admin"
                            className={`w-full px-4 py-3 text-sm font-medium rounded-xl flex items-center gap-3 transition ${
                                isOrdersActive
                                    ? "bg-accent text-white shadow-lg font-semibold"
                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <FiShoppingCart className="text-lg" />
                            <span>Orders</span>
                        </Link>

                        <Link
                            to="/admin/products"
                            className={`w-full px-4 py-3 text-sm font-medium rounded-xl flex items-center gap-3 transition ${
                                isProductsActive
                                    ? "bg-accent text-white shadow-lg font-semibold"
                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <BsGift className="text-lg" />
                            <span>Products</span>
                        </Link>

                        <Link
                            to="/admin/users"
                            className={`w-full px-4 py-3 text-sm font-medium rounded-xl flex items-center gap-3 transition ${
                                isUsersActive
                                    ? "bg-accent text-white shadow-lg font-semibold"
                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <TbUsers className="text-lg" />
                            <span>Users</span>
                        </Link>
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-white/10">
                    <Link
                        to="/"
                        className="w-full px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 transition border border-white/10"
                    >
                        <FiArrowLeft className="text-sm" />
                        Back to Store
                    </Link>
                </div>
            </div>

            {/* Admin Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<AdminOrdersPage />} />
                    <Route path="/products" element={<AdminProductsPage />} />
                    <Route path="/users" element={<h1>Users Page</h1>} />
                    <Route path="/add-product" element={<AdminAddProductForm />} />
                    <Route path="/edit-product" element={<AdminEditProductForm />} />
                </Routes>
            </div>
        </div>
    );
}