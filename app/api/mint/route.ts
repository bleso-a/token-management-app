import { NextRequest, NextResponse } from "next/server";
import { executeMint, checkTransactionStatus } from "../../../lib/circle";

export async function POST(req: NextRequest) {
  try {
    const { walletId, contractAddress, amount, address } = await req.json();
    if (!walletId || !contractAddress || !amount || !address) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    console.log(`Initiating mint for wallet ID: ${walletId}`);
    const { transactionId } = await executeMint(walletId, contractAddress, amount, address);
    
    console.log(`Mint transaction submitted. Transaction ID: ${transactionId}`);
    
    const transactionResult = await checkTransactionStatus(transactionId);
    if (!transactionResult.isComplete) {
      throw new Error("Mint transaction failed or timed out.");
    }

    console.log("Mint transaction completed successfully");
    return NextResponse.json({ success: true, message: "Tokens minted successfully" });
  } catch (error) {
    console.error("Error in mint API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to mint tokens" },
      { status: 500 }
    );
  }
}