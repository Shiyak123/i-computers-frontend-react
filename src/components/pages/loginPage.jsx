import { useState } from "react";
import toast from "react-hot-toast";
import { BiKey } from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleLogin() {

        setLoading(true)

        try {
            const res = await api.post("/users/login", {
                email: email,
                password: password
            })

            localStorage.setItem("token", res.data.token)

            if (res.data.isAdmin) {

                //window.location.href = "/admin"

                navigate("/admin")

            } else {

                //window.location.href = "/"

                navigate("/")

            }

        } catch (err) {

            toast.error(err?.response?.data?.message || "Login failed")

        }
        setLoading(false)
    }

    return (
        <div className="w-full h-full bg-[url('/login_pg.jpg')] bg-cover bg-no-repeat flex justify-center items-center">

            <div className="w-[400px] h-[500px] backdrop-blur-md shadow-2xl shadow-white rounded-xl flex flex-col p-4">

                <h1 className="w-full h-[80px] text-center text-3xl font-bold text-white">Login</h1>

                <div className="w-full  ">
                    <label className="text-white text-lg flex items-center  gap-2"><MdEmail /> Email</label>
                    <input className="w-full h-[40px] rounded-md px-2 border border-white" type="email" placeholder="sample@gmail.com"
                        onChange={
                            (e) => {
                                setEmail(e.target.value)
                            }
                        }
                        value={email}
                    />
                </div>

                <div className="w-full  mt-5">
                    <label className="text-white text-lg flex items-center  gap-2"><BiKey /> Password</label>
                    <input
                        onChange={
                            (e) => {
                                setPassword(e.target.value)
                            }
                        }
                        type="password"
                        value={password}
                        className="w-full h-[40px] rounded-md px-2 border border-white" placeholder="•••••••••••" />
                </div>
                <p className="w-full mt-2 text-xs text-gray-400 text-right italic">
                    Forgot your password? Contact administrator for assistance.
                </p>
                <button disabled={loading} className="w-full h-[50px] bg-accent mt-8 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50" onClick={handleLogin}>
                    {
                        loading ? "Loading..." : "Login"
                    }
                </button>
                <p className="w-full mt-4 text-xs text-gray-300 text-right italic">
                    Don't have an account? <Link to="/signup" className="font-bold text-accent hover:underline">Register here</Link>
                </p>
                <button
                    type="button"
                    disabled
                    title="Google sign-in is not configured yet"
                    className="w-full h-[50px] bg-secondary/70 border border-white/20 mt-4 text-gray-400 rounded-lg flex justify-center items-center gap-2 cursor-not-allowed text-sm"
                >
                    <BsGoogle /> Sign In with Google (Coming Soon)
                </button>
            </div>
        </div>
    )
}

//181800 secondary
//f4f4f4 primary
//001a84 accent