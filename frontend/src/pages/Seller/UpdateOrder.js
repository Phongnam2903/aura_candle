import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdateOrder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await axios.get(`/api/orders/${id}`);
                setStatus(res.data.status);
            } catch (err) {
                console.error("Fetch order error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await axios.put(`/api/orders/${id}`, { status });
            toast.success("Cập nhật đơn hàng thành công!");
            navigate(`/seller/orders/${id}`);
        } catch (err) {
            console.error("Update order error:", err);
            toast.error("Không thể cập nhật đơn hàng");
        }
    }

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Cập nhật Đơn hàng #{id}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    <span className="text-gray-700 font-medium">Trạng thái:</span>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 block w-full border rounded p-3"
                    >
                        <option value="Pending">Chờ xử lý</option>
                        <option value="Processing">Đang xử lý</option>
                        <option value="Shipped">Đã giao cho đơn vị vận chuyển</option>
                        <option value="Completed">Hoàn thành</option>
                        <option value="Cancelled">Đã hủy</option>
                    </select>
                </label>
                <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded font-semibold"
                >
                    Lưu thay đổi
                </button>
            </form>
        </div>
    );
}
