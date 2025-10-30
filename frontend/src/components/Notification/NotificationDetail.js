import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance"; // bạn đã có axiosInstance
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { cancelOrder } from "../../api/order/orderApi";

export default function NotificationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const res = await api.get(`/notification/${id}`);
                setNotification(res.data.data);
            } catch (err) {
                console.error(err);
                setError("Không thể tải thông báo");
            } finally {
                setLoading(false);
            }
        };

        fetchNotification();
    }, [id]);

    const handleCancelOrder = async () => {
        if (!notification.relatedOrder) return;

        try {
            const orderId = notification.relatedOrder._id; // <-- lấy ID từ relatedOrder
            const res = await cancelOrder(orderId);
            toast.success(res.message);

            // Cập nhật trạng thái trong UI ngay lập tức
            setNotification((prev) => ({
                ...prev,
                relatedOrder: {
                    ...prev.relatedOrder,
                    status: "Cancelled",
                    items: prev.relatedOrder.items.map((item) => ({
                        ...item,
                        status: "Cancelled",
                    })),
                },
            }));
        } catch (err) {
            toast.error(err.response?.data?.message || "Hủy đơn thất bại");
        }
    };

    if (loading) return <p className="p-4 text-center">Đang tải...</p>;
    if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
    if (!notification) return <p className="p-4 text-center">Không có thông báo</p>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-4 text-[#A0785D] hover:underline"
            >
                <FaArrowLeft /> Quay lại
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-[#2C2420]">{notification.title}</h2>
                <p className="text-gray-600 mt-2">{notification.message}</p>
                <p className="text-gray-400 text-xs mt-1">
                    Ngày tạo: {new Date(notification.createdAt).toLocaleString("vi-VN")}
                </p>

                {notification.relatedOrder && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <h3 className="font-medium text-[#2C2420] mb-2">Chi tiết đơn hàng</h3>
                        <p className="text-sm text-gray-500 mb-2">
                            Trạng thái: {notification.relatedOrder.status}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                            Tổng tiền: {notification.relatedOrder.totalAmount.toLocaleString("vi-VN")} đ
                        </p>
                        <div className="space-y-3 mb-4">
                            {notification.relatedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <img
                                        src={
                                            item.product.images && item.product.images.length > 0
                                                ? item.product.images[0]
                                                : "/placeholder.svg"
                                        }
                                        alt={item.product.name}
                                        className="w-12 h-12 rounded-md object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-[#2C2420]">{item.product.name}</p>
                                        <p className="text-sm text-[#A0785D]">
                                            {item.product.price.toLocaleString("vi-VN")} đ × {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Nút hủy đơn - chỉ cho phép hủy khi trạng thái là Pending */}
                        {notification.relatedOrder.status === "Pending" && (
                            <button
                                onClick={handleCancelOrder}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Hủy đơn
                            </button>
                        )}
                    </div>
                )}

                {/* Hiển thị Blog nếu có */}
                {notification.relatedBlog && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <h3 className="font-medium text-[#2C2420] mb-3">Bài viết mới</h3>
                        
                        {notification.relatedBlog.images && notification.relatedBlog.images.length > 0 && (
                            <img
                                src={notification.relatedBlog.images[0]}
                                alt={notification.relatedBlog.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                        )}
                        
                        <h4 className="text-lg font-semibold text-[#2C2420] mb-2">
                            {notification.relatedBlog.title}
                        </h4>
                        
                        {notification.relatedBlog.description && (
                            <p className="text-sm text-gray-600 mb-3">
                                {notification.relatedBlog.description}
                            </p>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                            <span>Tác giả: {notification.relatedBlog.author?.name || "Unknown"}</span>
                            <span>•</span>
                            <span>{new Date(notification.relatedBlog.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                        
                        <button
                            onClick={() => navigate(`/blog/${notification.relatedBlog._id}`)}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                        >
                            Đọc bài viết
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
