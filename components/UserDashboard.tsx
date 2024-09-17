import React from "react";
import Link from "next/link";

interface UserDashboardProps {
  wallet: any;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ wallet }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#111418]">
      <header className="flex items-center bg-[#111418] p-4 pb-2 justify-between">
        <div className="text-white flex size-12 shrink-0 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          User A
        </h2>
      </header>

      <main className="flex-grow p-4">
        <div className="flex gap-4 flex-col items-start mb-6">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32"
            style={{
              backgroundImage:
                'url("https://cdn.usegalileo.ai/stability/2af626b6-d6ae-4948-8293-a12a0ce33c40.png")',
            }}
          />
          <div className="flex flex-col justify-center">
            <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
              Jenny Lee
            </p>
            <p className="text-[#9caaba] text-base font-normal leading-normal">
              $1,293.56
            </p>
            <p className="text-[#9caaba] text-base font-normal leading-normal">
              0x8F9eC7dA3b9aDc4a3fC0E4B4Fe9E6d5A4d74dF2d
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-[480px] gap-3 @[480px]:w-auto mb-6">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#283039] text-white text-sm font-bold leading-normal tracking-[0.015em] flex-1 @[480px]:flex-auto">
            <span className="truncate">Send</span>
          </button>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0b6fda] text-white text-sm font-bold leading-normal tracking-[0.015em] flex-1 @[480px]:flex-auto">
            <span className="truncate">Receive</span>
          </button>
        </div>

        <div className="flex items-center gap-4 bg-[#111418] min-h-[72px] py-2">
          <div className="flex flex-col justify-center">
            <p className="text-white text-base font-medium leading-normal line-clamp-1">
              Amount
            </p>
            <p className="text-[#9caaba] text-sm font-normal leading-normal line-clamp-2">
              20 USDT
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-[#111418] min-h-[72px] py-2">
          <div className="flex flex-col justify-center">
            <p className="text-white text-base font-medium leading-normal line-clamp-1">
              Type
            </p>
            <p className="text-[#9caaba] text-sm font-normal leading-normal line-clamp-2">
              USDT
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-[#111418] min-h-[72px] py-2">
          <div className="flex flex-col justify-center">
            <p className="text-white text-base font-medium leading-normal line-clamp-1">
              Status
            </p>
            <p className="text-[#9caaba] text-sm font-normal leading-normal line-clamp-2">
              In progress
            </p>
          </div>
        </div>
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
                <path d="M172,120a44,44,0,1,1-44-44A44.05,44.05,0,0,1,172,120Zm60,8A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88.09,88.09,0,0,0-91.47-87.93C77.43,41.89,39.87,81.12,40,128.25a87.65,87.65,0,0,0,22.24,58.16A79.71,79.71,0,0,1,84,165.1a4,4,0,0,1,4.83.32,59.83,59.83,0,0,0,78.28,0,4,4,0,0,1,4.83-.32,79.71,79.71,0,0,1,21.79,21.31A87.62,87.62,0,0,0,216,128Z" />
              </svg>
            </div>
            <p className="text-white text-xs font-medium leading-normal tracking-[0.015em]">
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
                <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm0,16V88H32V64Zm0,128H32V104H224v88Zm-16-24a8,8,0,0,1-8,8H168a8,8,0,0,1,0-16h32A8,8,0,0,1,208,168Zm-64,0a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h16A8,8,0,0,1,144,168Z" />
              </svg>
            </div>
            <p className="text-[#9caaba] text-xs font-medium leading-normal tracking-[0.015em]">
              Transaction Status
            </p>
          </Link>
        </div>
        <div className="h-5 bg-[#1b2127]"></div>
      </footer>
    </div>
  );
};

export default UserDashboard;
