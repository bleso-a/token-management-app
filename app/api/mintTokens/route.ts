import { NextRequest, NextResponse } from "next/server";
import { executeMint } from "../../../lib/circle";

export async function POST(req: NextRequest) {
  try {
    const { walletId, contractAddress, amount, address } = await req.json();
    const { transactionId } = await executeMint(
      walletId,
      contractAddress,
      amount,
      address
    );
    return NextResponse.json({ success: true, transactionId });
  } catch (error) {
    console.error("Error in mintTokens API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to mint tokens" },
      { status: 500 }
    );
  }
}
