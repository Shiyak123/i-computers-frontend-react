import { BiKey } from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);

            const res = await axios.post(
                "http://localhost:3000/user/login",
                {
                    email,
                    password,
                }
            );

            console.log(res.data);
            toast.success("Login successful!");
        } catch (error) {
            console.error(error.response?.data || error.message);

            toast.error(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[url('/login_pg.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
            <div className="w-[400px] h-[600px] backdrop-blur-md shadow-2xl shadow-white rounded-xl flex flex-col items-center justify-center gap-10">
                <h1 className="w-full text-center text-3xl font-bold text-white">
                    Login
                </h1>

                <div className="w-full px-10 flex flex-col gap-5">
                    <label
                        htmlFor="email"
                        className="text-white flex items-center justify-center gap-2"
                    >
                        <MdEmail />
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        placeholder="sample@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-black border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <label
                        htmlFor="password"
                        className="text-white flex items-center justify-center gap-2"
                    >
                        <BiKey />
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        placeholder="**********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-black border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <p className="text-center text-white">
                        Forgot your password?{" "}
                        <Link
                            to="/forgot-password"
                            className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                            Click here
                        </Link>
                    </p>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-white">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                            Register Here
                        </Link>
                    </p>

                    <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center gap-2">
                        <BsGoogle />
                        Login with Google
                    </button>
                </div>
            </div>
        </div>
    );
}