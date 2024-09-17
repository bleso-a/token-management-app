import { NextRequest, NextResponse } from "next/server";
import { deployContract } from "../../../lib/circle";

export async function POST(req: NextRequest) {
  try {
    const { walletId, address } = await req.json();
    if (!walletId || !address) {
      return NextResponse.json(
        { success: false, error: "walletId and address are required" },
        { status: 400 }
      );
    }

    console.log(`Initiating contract deployment for wallet ID: ${walletId}`);
    const contractAddress = await deployContract(walletId, address);
    console.log(`Contract deployed successfully. Address: ${contractAddress}`);
    return NextResponse.json({ success: true, contractAddress });
  } catch (error) {
    console.error("Error in deployContract API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to deploy contract" },
      { status: 500 }
    );
  }
}
