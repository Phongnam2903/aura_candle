import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MaterialForm from "./MaterialForm";
import { getMaterialById, updateMaterial } from "../../api/material/materialApi";

export default function EditMaterial() {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const material = await getMaterialById(id);
                setForm(material);
            } catch {
                toast.error("Không tải được nguyên liệu");
            }
        })();
    }, [id]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log("Submitting", id, form);
            await updateMaterial(id, form);
            toast.success("Cập nhật thành công");
            navigate("/seller/materials");
        } catch {
            toast.error("Lỗi khi cập nhật");
        } finally {
            setLoading(false);
        }
    };

    if (!form) return <p>Đang tải...</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Sửa Nguyên liệu</h1>
            <MaterialForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
}
