import React from "react";
import Header from "../components/homePage/Header";
import Footer from "../components/homePage/Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="mb-4">
        <Header />
      </div>

      {/* Main content */}
      <main className="flex-1 mb-4 px-4">{children}</main>

      {/* Footer */}
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
