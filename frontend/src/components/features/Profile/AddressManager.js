import React, { useState, useEffect } from "react";
import AddAddressModal from "./AddressModal";
import {
  createAddress,
  deleteAddress,
  getAddressesByUser,
  updateAddress,
} from "../../../api/address/addressApi";
import { toast } from "react-toastify"; // ✅ Thêm thư viện toast
import { Home, MapPin, Trash2, Star } from "lucide-react";

export default function AddressList() {
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const data = await getAddressesByUser(userId);
        setAddresses(data);
      } catch (error) {
        console.error("Lỗi khi load địa chỉ:", error);
        toast.error("Không thể tải danh sách địa chỉ!");
      }
    };

    fetchData();
  }, [userId]);

  //  Thêm địa chỉ
  const handleAddAddress = async (newAddress) => {
    try {
      const res = await createAddress({ ...newAddress, user: userId });
      setAddresses((prev) => [...prev, res]);
      setShowModal(false);
      toast.success("Đã thêm địa chỉ mới 🎉");
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      toast.error("Không thể thêm địa chỉ!");
    }
  };

  //  Xóa địa chỉ
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?")) return;
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      toast.success("Đã xóa địa chỉ thành công 🗑️");
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      toast.error("Không thể xóa địa chỉ!");
    }
  };

  //  Đặt mặc định
  const handleSetDefault = async (id) => {
    try {
      const updated = await updateAddress(id, { isDefault: true });
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a._id === updated._id }))
      );
      toast.info("Đã đặt địa chỉ mặc định 💚");
    } catch (error) {
      console.error("Lỗi khi đặt mặc định:", error);
      toast.error("Không thể đặt mặc định!");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md transition-all duration-300 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Home className="w-6 h-6 text-emerald-500" />
            Địa chỉ của bạn
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý các địa chỉ giao hàng yêu thích của bạn 🌿
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-md hover:shadow-emerald-200 transition-all"
        >
          + Thêm địa chỉ
        </button>
      </div>
      {addresses.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
          <p>Bạn chưa có địa chỉ nào. Thêm địa chỉ mới để bắt đầu nhé!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {addresses.map((a) => (
            <li
              key={a._id}
              className={`border p-4 rounded-xl shadow-sm flex justify-between items-start hover:shadow-md transition-all ${a.isDefault ? "border-emerald-500" : "border-gray-200"
                }`}
            >
              <div>
                <p className="font-medium text-gray-800">{a.specificAddress}</p>
                {a.isDefault && (
                  <span className="inline-flex items-center gap-1 mt-2 text-emerald-600 font-medium text-sm">
                    <Star className="w-4 h-4 fill-emerald-400" />
                    Địa chỉ mặc định
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {!a.isDefault && (
                  <button
                    onClick={() => handleSetDefault(a._id)}
                    className="px-3 py-1 text-sm border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all"
                  >
                    Đặt mặc định
                  </button>
                )}
                <button
                  onClick={() => handleDelete(a._id)}
                  className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <AddAddressModal
          onClose={() => setShowModal(false)}
          onSave={handleAddAddress}
        />
      )}
    </div>
  );
}
