"use client";

import { useState, useEffect } from "react";
import AdminDashboard from "../../components/AdminDashboard";

export default function Admin() {
  const [adminWallet, setAdminWallet] = useState<{
    id: string;
    address: string;
  } | null>(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem("adminWallet");
    if (storedWallet) {
      setAdminWallet(JSON.parse(storedWallet));
    }
  }, []);

  if (!adminWallet) {
    return <div>Loading admin wallet...</div>;
  }

  return <AdminDashboard wallet={adminWallet} />;
}
