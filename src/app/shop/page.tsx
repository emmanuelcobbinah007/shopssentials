import React from "react";
import Header from "../components/ui/landing/Header";
import Sidebar from "../components/ui/landing/Sidebar";
import Footer from "../components/ui/landing/Footer";

const page = () => {
  return (
    <div>
      <div className="h-16"></div>
      <main className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1>Shop Page</h1>
          {/* Add your shop content here */}
        </div>
      </main>
    </div>
  );
};

export default page;
