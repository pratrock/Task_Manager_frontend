// src/layouts/AuthenticatedLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const AuthenticatedLayout = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet /> {/* This renders child routes */}
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
