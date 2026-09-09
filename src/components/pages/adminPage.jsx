import { BsGift } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { TbUsers } from "react-icons/tb";
import { Link, Route, Routes } from "react-router-dom";
import AdminProductsPage from "./admin/adminProductPage";
import AdminAddProductForm from "./admin/adminAddProdctForm";

export default function AdminPage() {
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
                    <Route path="/" element={<h1>Orders Page</h1>} />
                    <Route path="/products" element={<AdminProductsPage />} />
                    <Route path="/users" element={<h1>Users Page</h1>} />
                    <Route path="/add-product" element={<AdminAddProductForm />} />
                </Routes>
            </div>
        </div>
    )
}