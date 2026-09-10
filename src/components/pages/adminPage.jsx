import { useState, useEffect } from "react";
import { BsGift } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { TbUsers } from "react-icons/tb";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminProductsPage from "./admin/adminProductPage";
import AdminAddProductForm from "./admin/adminAddProdctForm";
import AdminOrdersPage from "./admin/adminOrdersPage";

export default function AdminPage() {
    const navigate = useNavigate();
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

    return (
        <div className="w-full h-full flex bg-primary">

            <div className="w-[300px] h-full bg-white flex flex-col shadow-2xl">
                <div className="w-full h-[100px] py-4 px-2">

                    <img src="/logo.png" className="h-full " />

                </div>

                <Link to="/admin" className="w-full p-4 text-xl text-gray-500  flex items-center gap-4">
                    <FiShoppingCart />
                    <span className="w-full h-full block ">Orders</span>
                </Link>

                <Link to="/admin/products" className="w-full p-4 text-xl text-gray-500  flex items-center gap-4">
                    <BsGift />
                    <span className="w-full h-full block ">Products</span>
                </Link>

                <Link to="/admin/users" className="w-full p-4 text-xl text-gray-500  flex items-center gap-4">
                    <TbUsers />
                    <span className="w-full h-full block ">Users</span>
                </Link>

            </div>

            <div className="w-[calc(100%-300px)] h-full p-4">
                <Routes>
                    <Route path="/" element={<AdminOrdersPage />} />
                    <Route path="/products" element={<AdminProductsPage />} />
                    <Route path="/users" element={<h1>Users Page</h1>} />
                    <Route path="/add-product" element={<AdminAddProductForm />} />
                </Routes>
            </div>
        </div>
    );
}