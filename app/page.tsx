"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState("Initializing application...");
  const [error, setError] = useState<string | null>(null);
  const initializationRef = useRef(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (initializationRef.current) return; // Prevent multiple initializations
      initializationRef.current = true;

      try {
        console.log("Starting initialization process...");
        setStatus("Creating wallets...");
        const walletResponse = await fetch("/api/createWallets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!walletResponse.ok) {
          const errorData = await walletResponse.json();
          throw new Error(errorData.error || "Failed to create wallets");
        }

        const walletData = await walletResponse.json();
        if (walletData.success) {
          localStorage.setItem("walletSetId", walletData.walletSetId);
          localStorage.setItem("adminWallet", JSON.stringify(walletData.adminWallet));
          localStorage.setItem("userWallet", JSON.stringify(walletData.userWallet));
          
          setStatus("Deploying contract to admin wallet...");
          const deployResponse = await fetch("/api/deployContract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              walletId: walletData.adminWallet.id,
              address: walletData.adminWallet.address
            }),
          });

          if (!deployResponse.ok) {
            const errorData = await deployResponse.json();
            throw new Error(errorData.error || "Failed to deploy contract");
          }

          const deployData = await deployResponse.json();
          if (deployData.success) {
            localStorage.setItem("contractAddress", deployData.contractAddress);
            setStatus("Contract deployed successfully to admin wallet. Redirecting to admin page...");
            router.push("/admin");
          } else {
            throw new Error(deployData.error || "Failed to deploy contract");
          }
        } else {
          throw new Error(walletData.error || "Failed to create wallets");
        }
      } catch (error) {
        console.error("Failed to initialize application:", error);
        setError(error.message || "An unexpected error occurred");
      }
    };

    initializeApp();
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#111418] text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Initialization Error
        </h1>
        <p className="text-gray-300">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111418] text-white">
      <h1 className="text-2xl font-bold mb-4">{status}</h1>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
