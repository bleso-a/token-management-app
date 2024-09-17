import { NextResponse } from "next/server";
import { createWalletSet, createWallets } from "../../../lib/circle";

let walletSetId: string | null = null;

export async function POST() {
  try {
    if (!walletSetId) {
      walletSetId = await createWalletSet("Initial Wallet Set");
      console.log("New Wallet Set created:", walletSetId);
    } else {
      console.log("Using existing Wallet Set:", walletSetId);
    }

    const { adminWallet, userWallet } = await createWallets(walletSetId);

    console.log("Admin Wallet created:", adminWallet.id);
    console.log("User Wallet created:", userWallet.id);

    return NextResponse.json({
      success: true,
      walletSetId,
      adminWallet,
      userWallet,
    });
  } catch (error) {
    console.error("Error in createWallets API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create wallets" },
      { status: 500 }
    );
  }
}
