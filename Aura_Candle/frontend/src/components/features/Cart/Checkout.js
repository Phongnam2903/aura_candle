import React from "react";

export default function CheckoutPage() {
    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-xl font-bold mb-4">Thanh toán</h2>
            <form className="space-y-4">
                <label className="block">
                    <input type="radio" name="pay" className="mr-2" /> Momo
                </label>
                <label className="block">
                    <input type="radio" name="pay" className="mr-2" /> ZaloPay
                </label>
                <label className="block">
                    <input type="radio" name="pay" className="mr-2" /> Chuyển khoản ngân hàng
                </label>
                <button className="bg-black text-white px-6 py-3 rounded mt-4">
                    Xác nhận thanh toán
                </button>
            </form>
        </div>
    );
}
