import React, { useState, useEffect } from "react";
import AddAddressModal from "./AddressModal";
import { createAddress, deleteAddress, getAddressesByUser, updateAddress } from "../../../api/address/addressApi";


export default function AddressList() {
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);

  //  Lấy userId từ login (ví dụ đã lưu trong localStorage)
  const userId = JSON.parse(localStorage.getItem("user") || "{}")?._id;

  useEffect(() => {
    if (!userId) return;
    console.log("userId:", userId);
    const fetchData = async () => {
      try {

        const data = await getAddressesByUser(userId);
        setAddresses(data);
      } catch (error) {
        console.error("Lỗi khi load địa chỉ:", error);
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
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
    }
  };

  //  Xóa địa chỉ
  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
    }
  };

  //  Đặt mặc định
  const handleSetDefault = async (id) => {
    try {
      const updated = await updateAddress(id, { isDefault: true });
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a._id === updated._id }))
      );
    } catch (error) {
      console.error("Lỗi khi đặt mặc định:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Địa Chỉ</h2>

      <button
        onClick={() => setShowModal(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg mb-4"
      >
        + Thêm địa chỉ
      </button>

      {addresses.length === 0 ? (
        <p className="text-gray-600">Chưa có địa chỉ nào.</p>
      ) : (
        <ul className="space-y-3">
          {addresses.map((a) => (
            <li
              key={a._id}
              className="border p-4 rounded shadow-sm flex justify-between items-start"
            >
              <div>
                <p>{a.specificAddress}</p>
                {a.isDefault && (
                  <span className="text-emerald-600 font-medium">Mặc định</span>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {!a.isDefault && (
                  <button
                    onClick={() => handleSetDefault(a._id)}
                    className="px-3 py-1 text-sm border rounded hover:bg-emerald-50"
                  >
                    Đặt mặc định
                  </button>
                )}
                <button
                  onClick={() => handleDelete(a._id)}
                  className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50"
                >
                  Xóa
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
