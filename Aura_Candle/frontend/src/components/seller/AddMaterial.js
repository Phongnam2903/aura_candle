import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MaterialForm from "./MaterialForm";

export default function AddMaterial() {
    const [form, setForm] = useState({
        name: "",
        sku: "",
        unit: "gram",
        pricePerUnit: 0,
        stockQuantity: 0,
        vendor: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/materials", form);
            toast.success("Đã thêm nguyên liệu");
            navigate("/seller/materials");
        } catch {
            toast.error("Lỗi khi thêm");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Thêm Nguyên liệu</h1>
            <MaterialForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}
