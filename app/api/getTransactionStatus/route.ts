import { NextRequest, NextResponse } from "next/server";
import { checkTransactionStatus } from "../../../lib/circle";

export async function GET(req: NextRequest) {
  const transactionId = req.nextUrl.searchParams.get("transactionId");

  if (!transactionId) {
    return NextResponse.json(
      { success: false, error: "Transaction ID is required" },
      { status: 400 }
    );
  }

  try {
    const { isComplete, lastResponse } = await checkTransactionStatus(
      transactionId
    );
    const status = lastResponse?.data.transaction.state || "UNKNOWN";
    return NextResponse.json({ success: true, isComplete, status });
  } catch (error) {
    console.error("Error in getTransactionStatus API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to get transaction status",
      },
      { status: 500 }
    );
  }
}
