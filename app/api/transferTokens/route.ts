import { NextRequest, NextResponse } from "next/server";
import { executeTransfer } from "../../../lib/circle";

export async function POST(req: NextRequest) {
  try {
    const { fromWalletId, toWalletAddress, contractAddress, amount } =
      await req.json();
    const { transactionId } = await executeTransfer(
      fromWalletId,
      toWalletAddress,
      contractAddress,
      amount
    );
    return NextResponse.json({ success: true, transactionId });
  } catch (error) {
    console.error("Error in transferTokens API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to transfer tokens" },
      { status: 500 }
    );
  }
}
