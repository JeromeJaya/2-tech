import React from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/admin/AdminSidebar"; // Correct path from pages to components

export function AdminLayout() {
  return (
    <AdminSidebar>
      <Outlet />
    </AdminSidebar>
  );
}