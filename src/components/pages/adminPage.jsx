import { Link, Route, Routes } from "react-router-dom";

export default function AdminPage() {
    return (
        <div className="w-full h-full flex  bg-purple-400">

            {/* Sidebar */}
            <div className="w-[300px] h-full bg-white flex flex-col">
                <h1 className="w-full h-[50px] bg-gray-400 text-center text-xl font-bold">Using Anchor Tag</h1>
                <a className="w-[100px] h-[50px] bg-blue-500 my-3" href="/admin/">Orders</a>
                <a className="w-[100px] h-[50px] bg-blue-500 my-3" href="/admin/products">Products Page</a>
                <a className="w-[100px] h-[50px] bg-blue-500 my-3" href="/admin/users">Users Page</a>

                <h1 className="w-full h-[50px] bg-gray-400 text-center text-xl font-bold">Using Link Components</h1>
                <Link className="w-[100px] h-[50px] bg-blue-500 my-3" to="/admin/">Orders</Link>
                <Link className="w-[100px] h-[50px] bg-blue-500 my-3" to="/admin/products">Products Page</Link>
                <Link className="w-[100px] h-[50px] bg-blue-500 my-3" to="/admin/users">Users Page</Link>
            </div>

            {/* Content */}
            <div className="w-[calc(100%-300px)] h-full bg-amber-200">
                <Routes>
                    <Route path="/" element={<h1>Orders Page</h1>} />
                    <Route path="/products" element={<h1>Products Page</h1>} />
                    <Route path="/users" element={<h1>Users Page</h1>} />
                </Routes>
            </div>



        </div>
    );
}
