import React, { useState, useEffect } from "react";
import Link from "next/link";

interface AdminDashboardProps {
  wallet: {
    id: string;
    address: string;
  };
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ wallet }) => {
  const [mintAmount, setMintAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [mintStatus, setMintStatus] = useState("");
  const [transferStatus, setTransferStatus] = useState("");
  const [userWallet, setUserWallet] = useState<any>(null);

  useEffect(() => {
    const storedContractAddress = localStorage.getItem("contractAddress");
    const storedUserWallet = localStorage.getItem("userWallet");
    if (storedContractAddress) {
      setContractAddress(storedContractAddress);
    }
    if (storedUserWallet) {
      setUserWallet(JSON.parse(storedUserWallet));
    }
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch(
        `/api/getBalance?walletId=${wallet.id}&contractAddress=${contractAddress}`
      );
      const data = await response.json();
      if (data.success) {
        setBalance(data.balance);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `/api/getTransactions?walletId=${wallet.id}`
      );
      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const handleMint = async () => {
    try {
      setMintStatus("INITIATED");
      const response = await fetch("/api/mintTokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletId: wallet.id,
          contractAddress: contractAddress,
          amount: mintAmount,
          address: wallet.address, // Include the wallet address
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMintStatus("PROCESSING");
        await checkTransactionStatus(data.transactionId, setMintStatus);
        fetchBalance();
        fetchTransactions();
        setMintAmount("");
      } else {
        throw new Error(data.error || "Failed to mint tokens");
      }
    } catch (error) {
      console.error("Failed to mint tokens:", error);
      setMintStatus("FAILED");
    }
  };

  const handleTransfer = async () => {
    try {
      setTransferStatus("INITIATED");
      const response = await fetch("/api/transferTokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromWalletId: wallet.id,
          toWalletAddress: transferTo,
          contractAddress: contractAddress,
          amount: transferAmount,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTransferStatus("PROCESSING");
        await checkTransactionStatus(data.transactionId, setTransferStatus);
        fetchBalance();
        fetchTransactions();
        setTransferTo("");
        setTransferAmount("");
      } else {
        throw new Error(data.error || "Failed to transfer tokens");
      }
    } catch (error) {
      console.error("Failed to transfer tokens:", error);
      setTransferStatus("FAILED");
    }
  };

  const checkTransactionStatus = async (
    transactionId: string,
    setStatus: React.Dispatch<React.SetStateAction<string>>
  ) => {
    let attempts = 0;
    const maxAttempts = 30;
    const interval = 5000; // 5 seconds

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(
          `/api/getTransactionStatus?transactionId=${transactionId}`
        );
        const data = await response.json();
        if (data.success) {
          setStatus(data.status);
          if (data.status === "COMPLETE") {
            return;
          }
        }
      } catch (error) {
        console.error("Failed to check transaction status:", error);
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    setStatus("TIMEOUT");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#111418]">
      <header className="flex items-center bg-[#111418] p-4 pb-2 justify-between">
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">
          Admin
        </h2>
        <div className="flex w-12 items-center justify-end">
          <button className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66l-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-grow p-4">
        <div className="flex gap-4 flex-col items-start mb-6">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32"
            style={{
              backgroundImage:
                'url("https://cdn.usegalileo.ai/stability/8fbaa85c-e824-4ad8-8b0c-d33f394eb0e8.png")',
            }}
          />
          <div className="flex flex-col justify-center">
            <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
              Welcome, Alex
            </p>
            <p className="text-[#9caaba] text-base font-normal leading-normal">
              You are an admin of this organization
            </p>
            <p className="text-[#9caaba] text-base font-normal leading-normal">
              Wallet Address: {wallet.address}
            </p>
          </div>
        </div>

        <h1 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
          Mint Tokens
        </h1>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">
              Amount
            </p>
            <input
              placeholder="Enter amount"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-14 placeholder:text-[#9caaba] p-4 text-base font-normal leading-normal"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-1 gap-3 flex-wrap py-3 max-w-[480px] justify-center">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b6fda] text-white text-sm font-bold leading-normal tracking-[0.015em] grow"
              onClick={handleMint}
            >
              <span className="truncate">Mint</span>
            </button>
          </div>
        </div>
        {mintStatus && (
          <p className="text-white text-center mt-2">
            Mint Status: {mintStatus}
          </p>
        )}

        <h1 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
          Transfer Tokens
        </h1>
        {userWallet && (
          <div className="mb-4">
            <p className="text-white">User Wallet Address: {userWallet.address}</p>
            <button
              className="mt-2 px-4 py-2 bg-[#283039] text-white rounded"
              onClick={() => setTransferTo(userWallet.address)}
            >
              Copy Address to Transfer
            </button>
          </div>
        )}
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">
              To
            </p>
            <input
              placeholder="Enter wallet address"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-14 placeholder:text-[#9caaba] p-4 text-base font-normal leading-normal"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-white text-base font-medium leading-normal pb-2">
              Amount
            </p>
            <input
              placeholder="Enter amount"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-14 placeholder:text-[#9caaba] p-4 text-base font-normal leading-normal"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-1 gap-3 flex-wrap py-3 max-w-[480px] justify-center">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b6fda] text-white text-sm font-bold leading-normal tracking-[0.015em] grow"
              onClick={handleTransfer}
            >
              <span className="truncate">Transfer</span>
            </button>
          </div>
        </div>
        {transferStatus && (
          <p className="text-white text-center mt-2">
            Transfer Status: {transferStatus}
          </p>
        )}

        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
          Your Token Balance
        </h2>
        <div className="flex items-center gap-4 bg-[#111418] min-h-[72px] py-2">
          <div className="flex flex-col justify-center">
            <p className="text-white text-base font-medium leading-normal line-clamp-1">
              Token balance
            </p>
            <p className="text-[#9caaba] text-sm font-normal leading-normal line-clamp-2">
              {balance} Tokens
            </p>
          </div>
        </div>

        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
          Transaction History
        </h2>
        {transactions.map((tx, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-[#111418] min-h-[72px] py-2"
          >
            <div className="flex flex-col justify-center">
              <p className="text-white text-base font-medium leading-normal line-clamp-1">
                {tx.type}
              </p>
              <p className="text-[#9caaba] text-sm font-normal leading-normal line-clamp-2">
                {tx.amount} Tokens
              </p>
            </div>
          </div>
        ))}
      </main>

      <footer className="mt-auto">
        <div className="flex gap-2 border-t border-[#283039] bg-[#1b2127] px-4 pb-3 pt-2">
          <Link
            href="#"
            className="flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-white"
          >
            <div className="text-white flex h-8 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
              </svg>
            </div>
            <p className="text-white text-xs font-medium leading-normal tracking-[0.015em]">
              Admin
            </p>
          </Link>
          <Link
            href="/user"
            className="flex flex-1 flex-col items-center justify-end gap-1 text-[#9caaba]"
          >
            <div className="text-[#9caaba] flex h-8 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z" />
              </svg>
            </div>
            <p className="text-[#9caaba] text-xs font-medium leading-normal tracking-[0.015em]">
              User A
            </p>
          </Link>
          <Link
            href="#"
            className="flex flex-1 flex-col items-center justify-end gap-1 text-[#9caaba]"
          >
            <div className="text-[#9caaba] flex h-8 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
              </svg>
            </div>
            <p className="text-[#9caaba] text-xs font-medium leading-normal tracking-[0.015em]">
              Status
            </p>
          </Link>
          <Link
            href="#"
            className="flex flex-1 flex-col items-center justify-end gap-1 text-[#9caaba]"
          >
            <div className="text-[#9caaba] flex h-8 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66l-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z" />
              </svg>
            </div>
            <p className="text-[#9caaba] text-xs font-medium leading-normal tracking-[0.015em]">
              Log Out
            </p>
          </Link>
        </div>
        <div className="h-5 bg-[#1b2127]"></div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
