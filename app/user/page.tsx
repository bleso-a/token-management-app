"use client";

import { useState, useEffect } from "react";
import UserDashboard from "../../components/UserDashboard";

export default function UserPage() {
  const [userWallet, setUserWallet] = useState(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem("userWallet");
    if (storedWallet) {
      setUserWallet(JSON.parse(storedWallet));
    }
  }, []);

  if (!userWallet) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#111418] text-white">
        Loading user wallet...
      </div>
    );
  }

  return <UserDashboard wallet={userWallet} />;
}
