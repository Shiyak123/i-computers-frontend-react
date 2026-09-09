import { useState } from "react";
import toast from "react-hot-toast";
import { BiKey, BiUser } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleRegister(e) {
        if (e) e.preventDefault();

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/users", {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password: password
            });

            if (res.data.message === "User created successfully") {
                toast.success("User created successfully");
                navigate("/login");
            } else {
                toast.error(res.data.message || "Registration failed");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-full bg-[url('/login_pg.jpg')] bg-cover bg-no-repeat flex justify-center items-center py-6">
            <div className="w-[420px] backdrop-blur-md shadow-2xl shadow-white rounded-xl flex flex-col p-6">
                <h1 className="w-full text-center text-3xl font-bold text-white mb-4">Register</h1>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div>
                        <label className="text-white text-lg flex items-center gap-2 mb-1">
                            <BiUser /> First Name
                        </label>
                        <input
                            className="w-full h-[40px] rounded-md px-2 border border-white text-white bg-black/20 focus:outline-none focus:ring-2 focus:ring-accent"
                            type="text"
                            placeholder="John"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                        />
                    </div>

                    <div>
                        <label className="text-white text-lg flex items-center gap-2 mb-1">
                            <BiUser /> Last Name
                        </label>
                        <input
                            className="w-full h-[40px] rounded-md px-2 border border-white text-white bg-black/20 focus:outline-none focus:ring-2 focus:ring-accent"
                            type="text"
                            placeholder="Doe"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                        />
                    </div>

                    <div>
                        <label className="text-white text-lg flex items-center gap-2 mb-1">
                            <MdEmail /> Email
                        </label>
                        <input
                            className="w-full h-[40px] rounded-md px-2 border border-white text-white bg-black/20 focus:outline-none focus:ring-2 focus:ring-accent"
                            type="email"
                            placeholder="sample@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>

                    <div>
                        <label className="text-white text-lg flex items-center gap-2 mb-1">
                            <BiKey /> Password
                        </label>
                        <input
                            className="w-full h-[40px] rounded-md px-2 border border-white text-white bg-black/20 focus:outline-none focus:ring-2 focus:ring-accent"
                            type="password"
                            placeholder="•••••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[50px] bg-accent mt-4 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    <p className="w-full text-white text-right italic text-sm mt-2">
                        Already have an account? click{" "}
                        <Link to="/login" className="font-bold text-accent underline">
                            Here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}