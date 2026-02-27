import { NextResponse } from "next/server";
import { getPaymentConfig, getPaymentStats } from "@/lib/payment-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/payment/config - Public endpoint to get payment configuration and live stats
export async function GET() {
  try {
    const config = await getPaymentConfig();
    const stats = await getPaymentStats();

    return NextResponse.json({
      // Payment mode settings
      paymentMode: config.paymentMode,
      qrCodeUrl: config.qrCodeUrl,
      paymentEnabled: config.paymentMode === "QR",
      
      // Fee structure
      earlyBirdLimit: config.earlyBirdLimit,
      earlyBirdFee: config.earlyBirdFee,
      regularFee: config.regularFee,
      
      // Team limits
      totalTeamLimit: config.totalTeamLimit,
      onlineTeamLimit: config.onlineTeamLimit,
      adminAddedTeams: config.adminAddedTeams,
      
      // Live stats
      onlineVerifiedCount: stats.onlineVerifiedCount,
      earlyBirdCount: stats.earlyBirdCount,
      regularCount: stats.regularCount,
      adminAddedCount: stats.adminAddedCount,
      earlyBirdSlotsRemaining: stats.earlyBirdSlotsRemaining,
      regularSlotsRemaining: stats.regularSlotsRemaining,
      adminSlotsRemaining: stats.adminSlotsRemaining,
      onlineSpotsRemaining: stats.onlineSpotsRemaining,
      totalSpotsRemaining: stats.totalSpotsRemaining,
      
      // Current tier info for new registrations
      currentTier: stats.currentTier,
      currentFeePerMember: stats.currentFeePerMember,
      
      // Whether online registration is open
      onlineRegistrationOpen: config.paymentMode === "QR" && stats.onlineVerifiedCount < config.onlineTeamLimit,
      
      updatedAt: config.updatedAt.toISOString(),
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching payment config:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment configuration" },
      { status: 500 }
    );
  }
}

