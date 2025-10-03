// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import InfoForm from "./InfoForm";
import OrdersList from "./OrdersList";
import ChangePassword from "./ChangePassword";
import AddressManager from "./AddressManager";
import { getAddressesByUser } from "../../../api/address/addressApi";

export default function ProfilePage() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [activeTab, setActiveTab] = useState("info");
    const [addressCount, setAddressCount] = useState(0);

    useEffect(() => {
        const userId = storedUser?._id;
        if (!userId) return;

        const fetchAddressCount = async () => {
            try {
                const data = await getAddressesByUser(userId);
                setAddressCount(Array.isArray(data) ? data.length : 0);
            } catch (error) {
                console.error("Lỗi khi lấy số lượng địa chỉ:", error);
            }
        };

        fetchAddressCount();
    }, [storedUser]);

    const renderContent = () => {
        switch (activeTab) {
            case "info":
                return <InfoForm />;
            case "orders":
                return <OrdersList />;
            case "password":
                return <ChangePassword />;
            case "address":
                return <AddressManager onCountChange={setAddressCount} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
            {/* ===== Menu bên trái ===== */}
            <aside className="md:w-1/3 bg-white rounded-xl shadow p-6 flex flex-col">
                <div className="mb-6 text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Xin chào, {storedUser.name || "Khách"} 
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Quản lý thông tin và đơn hàng của bạn
                    </p>
                </div>

                <ul className="flex md:flex-col justify-between md:justify-start gap-2 md:gap-2">
                    {[
                        { key: "info", label: "Thông tin tài khoản" },
                        { key: "orders", label: "Đơn hàng của bạn" },
                        { key: "password", label: "Đổi mật khẩu" },
                        { key: "address", label: `Địa chỉ (${addressCount})` },
                    ].map((item) => (
                        <li key={item.key}>
                            <button
                                onClick={() => setActiveTab(item.key)}
                                className={`w-full px-4 py-3 rounded-lg transition-colors duration-200 text-left flex items-center gap-2
                  ${activeTab === item.key
                                        ? "bg-emerald-600 text-white font-semibold shadow"
                                        : "hover:bg-emerald-100 text-gray-700"
                                    }`}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* ===== Nội dung bên phải ===== */}
            <section className="md:w-2/3 bg-white rounded-xl shadow p-6 flex flex-col min-h-[500px]">
                {renderContent()}
            </section>
        </div>
    );
}
