import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MaterialForm from "./MaterialForm";
import { createMaterial } from "../../api/material/materialApi";

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
            // ép kiểu Number cho các trường số
            const payload = {
                ...form,
                pricePerUnit: Number(form.pricePerUnit),
                stockQuantity: Number(form.stockQuantity),
            };

            await createMaterial(payload);
            toast.success("Đã thêm nguyên liệu");
            navigate("/seller/materials");
        } catch (err) {
            console.error(err.response?.data || err);
            toast.error(err.response?.data?.message || "Lỗi khi thêm");
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
