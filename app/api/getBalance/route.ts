import { NextRequest, NextResponse } from "next/server";
import { getTokenBalance } from "../../../lib/circle";

export async function POST(req: NextRequest) {
  try {
    const { walletId, contractAddress } = await req.json();
    if (!walletId || !contractAddress) {
      return NextResponse.json(
        { success: false, error: "walletId and contractAddress are required" },
        { status: 400 }
      );
    }

    console.log(`Fetching balance for wallet ID: ${walletId}`);
    const balance = await getTokenBalance(walletId, contractAddress);
    console.log(`Balance fetched successfully: ${balance}`);
    return NextResponse.json({ success: true, balance });
  } catch (error) {
    console.error("Error in getBalance API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch balance" },
      { status: 500 }
    );
  }
}