import React, { useState } from "react";
import AddAddressModal from "./AddressModal";

export default function AddressList() {
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);

  function handleAddAddress(newAddress) {
    setAddresses((prev) => [...prev, newAddress]);
    setShowModal(false);
  }

  function handleDelete(idx) {
    setAddresses((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSetDefault(idx) {
    setAddresses((prev) =>
      prev.map((a, i) => ({ ...a, isDefault: i === idx }))
    );
  }

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
          {addresses.map((a, idx) => (
            <li
              key={idx}
              className="border p-4 rounded shadow-sm flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{a.fullName}</p>
                <p>{a.phone}</p>
                <p>
                  {a.address}, {a.ward}, {a.district}, {a.province}
                </p>
                <p>
                  {a.country} - {a.zip}
                </p>
                {a.isDefault && (
                  <span className="text-emerald-600 font-medium">Mặc định</span>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {!a.isDefault && (
                  <button
                    onClick={() => handleSetDefault(idx)}
                    className="px-3 py-1 text-sm border rounded hover:bg-emerald-50"
                  >
                    Đặt mặc định
                  </button>
                )}
                <button
                  onClick={() => handleDelete(idx)}
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
