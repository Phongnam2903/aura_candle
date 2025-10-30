import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { Bell, ShoppingBag, FileText, CreditCard, Gift, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationList() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, unread, read

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notification");
            setNotifications(res.data.data);
        } catch (err) {
            console.error("Lỗi khi tải thông báo:", err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await api.put(`/notification/${notificationId}/read`);
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === notificationId ? { ...n, isRead: true } : n
                )
            );
        } catch (err) {
            console.error("Lỗi khi đánh dấu đã đọc:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notification/mark-all-read");
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );
        } catch (err) {
            console.error("Lỗi khi đánh dấu tất cả:", err);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
        navigate(`/notification/${notification._id}`);
    };

    const getIcon = (type) => {
        switch (type) {
            case "Order":
                return <ShoppingBag className="w-5 h-5 text-blue-500" />;
            case "Blog":
                return <FileText className="w-5 h-5 text-emerald-500" />;
            case "Payment":
                return <CreditCard className="w-5 h-5 text-purple-500" />;
            case "Promotion":
                return <Gift className="w-5 h-5 text-pink-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "Order":
                return "bg-blue-50 border-blue-200";
            case "Blog":
                return "bg-emerald-50 border-emerald-200";
            case "Payment":
                return "bg-purple-50 border-purple-200";
            case "Promotion":
                return "bg-pink-50 border-pink-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    const filteredNotifications = notifications.filter((n) => {
        if (filter === "unread") return !n.isRead;
        if (filter === "read") return n.isRead;
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Đang tải thông báo...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-6"
        >
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Thông báo
                        </h1>
                        <p className="text-muted-foreground">
                            {notifications.filter((n) => !n.isRead).length} thông báo chưa đọc
                        </p>
                    </div>
                    {notifications.some((n) => !n.isRead) && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 text-sm font-medium text-accent hover:text-accent/80 transition"
                        >
                            Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { key: "all", label: "Tất cả", count: notifications.length },
                        { key: "unread", label: "Chưa đọc", count: notifications.filter((n) => !n.isRead).length },
                        { key: "read", label: "Đã đọc", count: notifications.filter((n) => n.isRead).length },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === tab.key
                                    ? "bg-accent text-accent-foreground shadow-sm"
                                    : "bg-white text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {/* Notifications list */}
                {filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                            {filter === "all"
                                ? "Chưa có thông báo nào"
                                : filter === "unread"
                                    ? "Không có thông báo chưa đọc"
                                    : "Không có thông báo đã đọc"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNotifications.map((notification) => (
                            <motion.div
                                key={notification._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => handleNotificationClick(notification)}
                                className={`bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer transition-all hover:shadow-md ${notification.isRead
                                        ? "border-gray-100 opacity-70"
                                        : `${getTypeColor(notification.type)} border-l-4`
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 mt-1">
                                        {getIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3
                                                className={`text-base font-semibold ${notification.isRead
                                                        ? "text-muted-foreground"
                                                        : "text-foreground"
                                                    }`}
                                            >
                                                {notification.title}
                                            </h3>
                                            {!notification.isRead && (
                                                <span className="flex-shrink-0 w-2 h-2 bg-accent rounded-full mt-2"></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(notification.createdAt).toLocaleDateString("vi-VN")}
                                            </span>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <span className="text-xs text-accent capitalize">
                                                {notification.type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

