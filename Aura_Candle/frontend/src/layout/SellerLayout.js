import React from "react";
import { Outlet } from "react-router-dom";
import SellerSidebar from "../components/seller/SellerSidebar";

export default function SellerLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SellerSidebar />

      {/* Nội dung chính */}
      <main className="flex-1 p-6">
        <Outlet /> {/* nơi các page con hiển thị */}
      </main>
    </div>
  );
}
