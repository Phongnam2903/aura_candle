// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import InfoForm from "./InfoForm";
import OrdersList from "./OrdersList";
import ChangePassword from "./ChangePassword";
import AddressManager from "./AddressManager";

export default function ProfilePage() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [activeTab, setActiveTab] = useState("info");

    const renderContent = () => {
        switch (activeTab) {
            case "info":
                return <InfoForm />;
            case "orders":
                return <OrdersList />;
            case "password":
                return <ChangePassword />;
            case "address":
                return <AddressManager />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6 items-stretch">
            {/* ===== Bên trái: Menu ===== */}
            <aside className="bg-white shadow rounded-xl p-6 md:w-1/3 flex flex-col">
                <h1 className="text-xl font-bold mb-4">
                    Xin chào, {storedUser.name || "Khách"}
                </h1>
                <ul className="space-y-2">
                    {[
                        { key: "info", label: "Thông tin tài khoản" },
                        { key: "orders", label: "Đơn hàng của bạn" },
                        { key: "password", label: "Đổi mật khẩu" },
                        { key: "address", label: "Địa chỉ (0)" },
                    ].map((item) => (
                        <li key={item.key}>
                            <button
                                onClick={() => setActiveTab(item.key)}
                                className={`w-full text-left px-4 py-2 rounded hover:bg-emerald-100 ${activeTab === item.key ? "bg-emerald-200 font-semibold" : ""
                                    }`}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* ===== Bên phải: Nội dung ===== */}
            <section className="bg-white shadow rounded-xl p-6 md:w-2/3 flex flex-col">
                {renderContent()}
            </section>
        </div>
    );
}
