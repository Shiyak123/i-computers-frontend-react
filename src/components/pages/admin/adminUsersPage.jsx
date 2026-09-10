import { useState, useEffect } from "react";
import api from "../../../utils/api";
import toast from "react-hot-toast";
import { BiRefresh, BiUser, BiShield, BiBlock, BiCheckCircle } from "react-icons/bi";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [actionLoading, setActionLoading] = useState(null);

    // Get current logged-in user email from token to prevent self-actions
    function getCurrentUserEmail() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return "";
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.email || "";
        } catch {
            return "";
        }
    }
    const currentAdminEmail = getCurrentUserEmail();

    useEffect(() => {
        fetchUsers();
    }, [page, limit]);

    async function fetchUsers() {
        setLoading(true);
        try {
            const res = await api.get(`/users?page=${page}&limit=${limit}`);
            if (res.data && res.data.users) {
                setUsers(res.data.users);
                setTotalPages(res.data.totalPages || 1);
                setTotalUsers(res.data.totalUsers || 0);
            } else if (Array.isArray(res.data)) {
                setUsers(res.data);
                setTotalUsers(res.data.length);
                setTotalPages(1);
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to load users";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleBlock(user) {
        if (user.email.toLowerCase() === currentAdminEmail.toLowerCase()) {
            toast.error("You cannot block your own account");
            return;
        }

        setActionLoading(`block-${user.email}`);
        try {
            const res = await api.put(`/users/state/${encodeURIComponent(user.email)}`);
            toast.success(res.data?.message || "User status updated");
            fetchUsers();
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to update user status";
            toast.error(msg);
        } finally {
            setActionLoading(null);
        }
    }

    async function handleToggleRole(user) {
        if (user.email.toLowerCase() === currentAdminEmail.toLowerCase()) {
            toast.error("You cannot change your own administrator role");
            return;
        }

        setActionLoading(`role-${user.email}`);
        try {
            const res = await api.put(`/users/role/${encodeURIComponent(user.email)}`);
            toast.success(res.data?.message || "User role updated");
            fetchUsers();
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to update user role";
            toast.error(msg);
        } finally {
            setActionLoading(null);
        }
    }

    return (
        <div className="w-full min-h-full space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BiUser className="text-accent" />
                        User Management
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        View customer and administrator accounts, manage roles, and control access
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-full font-medium border border-white/10">
                        Total: {totalUsers} {totalUsers === 1 ? "user" : "users"}
                    </span>
                    <button
                        type="button"
                        onClick={fetchUsers}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                    >
                        <BiRefresh className={`text-base ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-secondary/70 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                {loading && users.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 space-y-3">
                        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-sm">Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 space-y-2">
                        <BiUser className="text-4xl mx-auto text-gray-500" />
                        <p className="text-sm font-medium">No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[11px] tracking-wider font-semibold">
                                <tr>
                                    <th className="py-3.5 px-4">Profile</th>
                                    <th className="py-3.5 px-4">Full Name</th>
                                    <th className="py-3.5 px-4">Email</th>
                                    <th className="py-3.5 px-4">Role</th>
                                    <th className="py-3.5 px-4">Account Status</th>
                                    <th className="py-3.5 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-gray-200">
                                {users.map((user) => {
                                    const isSelf = user.email.toLowerCase() === currentAdminEmail.toLowerCase();
                                    const isBlocked = Boolean(user.isBlocked);
                                    const isAdmin = Boolean(user.isAdmin);
                                    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A";
                                    const profileImg = user.Image || user.image || "/default-profile.png";

                                    return (
                                        <tr key={user.email} className="hover:bg-white/[0.03] transition">
                                            {/* Profile Image */}
                                            <td className="py-3.5 px-4">
                                                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
                                                    <img
                                                        src={profileImg}
                                                        alt={fullName}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/default-profile.png";
                                                        }}
                                                    />
                                                </div>
                                            </td>

                                            {/* Name */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-white flex items-center gap-2">
                                                    {fullName}
                                                    {isSelf && (
                                                        <span className="text-[10px] font-bold bg-accent/30 text-accent border border-accent/40 px-1.5 py-0.2 rounded-md">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="py-3.5 px-4 font-mono text-gray-300">
                                                {user.email}
                                            </td>

                                            {/* Role */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                                        isAdmin
                                                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                                            : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                                                    }`}
                                                >
                                                    <BiShield className="text-xs" />
                                                    {isAdmin ? "Admin" : "Customer"}
                                                </span>
                                            </td>

                                            {/* Account Status */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                                        isBlocked
                                                            ? "bg-red-500/20 text-red-300 border border-red-500/40"
                                                            : "bg-green-500/20 text-green-300 border border-green-500/40"
                                                    }`}
                                                >
                                                    {isBlocked ? <BiBlock className="text-xs" /> : <BiCheckCircle className="text-xs" />}
                                                    {isBlocked ? "Blocked" : "Active"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* Toggle Role Button */}
                                                    <button
                                                        type="button"
                                                        disabled={isSelf || actionLoading === `role-${user.email}`}
                                                        onClick={() => handleToggleRole(user)}
                                                        title={isSelf ? "You cannot modify your own role" : `Switch to ${isAdmin ? "Customer" : "Admin"}`}
                                                        className="px-2.5 py-1 text-xs font-semibold rounded-lg transition border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:border-white/30"
                                                    >
                                                        {actionLoading === `role-${user.email}`
                                                            ? "Updating..."
                                                            : isAdmin
                                                            ? "Make Customer"
                                                            : "Make Admin"}
                                                    </button>

                                                    {/* Toggle Block Button */}
                                                    <button
                                                        type="button"
                                                        disabled={isSelf || actionLoading === `block-${user.email}`}
                                                        onClick={() => handleToggleBlock(user)}
                                                        title={isSelf ? "You cannot block yourself" : (isBlocked ? "Unblock Account" : "Block Account")}
                                                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                                            isBlocked
                                                                ? "bg-green-600/20 hover:bg-green-600/30 text-green-300 border-green-500/30"
                                                                : "bg-red-600/20 hover:bg-red-600/30 text-red-300 border-red-500/30"
                                                        }`}
                                                    >
                                                        {actionLoading === `block-${user.email}`
                                                            ? "Updating..."
                                                            : isBlocked
                                                            ? "Unblock"
                                                            : "Block"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                        <span>Users per page:</span>
                        <select
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            className="bg-secondary border border-white/20 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span>
                            Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                disabled={page <= 1 || loading}
                                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 transition cursor-pointer"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={page >= totalPages || loading}
                                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 transition cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
