import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasSuperAdminAccess } from "@/lib/admin-access";
import { getPaymentConfig, getPaymentStats, updatePaymentConfig, PaymentMode } from "@/lib/payment-config";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/admin/payment-config - Get payment configuration (superadmin only)
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  if (!hasSuperAdminAccess(user)) {
    return NextResponse.json({ error: "Superadmin access required" }, { status: 403 });
  }

  try {
    const config = await getPaymentConfig();
    const stats = await getPaymentStats();

    return NextResponse.json({
      paymentMode: config.paymentMode,
      qrCodeUrl: config.qrCodeUrl,
      earlyBirdLimit: config.earlyBirdLimit,
      earlyBirdFee: config.earlyBirdFee,
      regularFee: config.regularFee,
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
      
      updatedAt: config.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching payment config:", error);
    return NextResponse.json({ error: "Failed to fetch payment config" }, { status: 500 });
  }
}

// PATCH /api/admin/payment-config - Update payment configuration (superadmin only)
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  if (!hasSuperAdminAccess(user)) {
    return NextResponse.json({ error: "Superadmin access required" }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({}));

    const updateData: {
      paymentMode?: PaymentMode;
      qrCodeUrl?: string | null;
      earlyBirdLimit?: number;
      earlyBirdFee?: number;
      regularFee?: number;
      totalTeamLimit?: number;
      onlineTeamLimit?: number;
    } = {};

    // Validate and set payment mode
    if (body.paymentMode !== undefined) {
      if (body.paymentMode === "QR" || body.paymentMode === "DISABLED") {
        updateData.paymentMode = body.paymentMode;
      } else {
        return NextResponse.json({ error: "Invalid payment mode. Must be 'QR' or 'DISABLED'" }, { status: 400 });
      }
    }

    // QR code URL (can be set to null to remove)
    if (body.qrCodeUrl !== undefined) {
      updateData.qrCodeUrl = body.qrCodeUrl;
    }

    // Fee structure
    if (body.earlyBirdLimit !== undefined) {
      const val = Number(body.earlyBirdLimit);
      if (isNaN(val) || val < 0) {
        return NextResponse.json({ error: "Invalid early bird limit" }, { status: 400 });
      }
      updateData.earlyBirdLimit = val;
    }

    if (body.earlyBirdFee !== undefined) {
      const val = Number(body.earlyBirdFee);
      if (isNaN(val) || val < 0) {
        return NextResponse.json({ error: "Invalid early bird fee" }, { status: 400 });
      }
      updateData.earlyBirdFee = val;
    }

    if (body.regularFee !== undefined) {
      const val = Number(body.regularFee);
      if (isNaN(val) || val < 0) {
        return NextResponse.json({ error: "Invalid regular fee" }, { status: 400 });
      }
      updateData.regularFee = val;
    }

    if (body.totalTeamLimit !== undefined) {
      const val = Number(body.totalTeamLimit);
      if (isNaN(val) || val < 0) {
        return NextResponse.json({ error: "Invalid total team limit" }, { status: 400 });
      }
      updateData.totalTeamLimit = val;
    }

    if (body.onlineTeamLimit !== undefined) {
      const val = Number(body.onlineTeamLimit);
      if (isNaN(val) || val < 0) {
        return NextResponse.json({ error: "Invalid online team limit" }, { status: 400 });
      }
      updateData.onlineTeamLimit = val;
    }

    const config = await updatePaymentConfig(updateData);
    const stats = await getPaymentStats();

    return NextResponse.json({
      success: true,
      message: "Payment configuration updated successfully",
      paymentMode: config.paymentMode,
      qrCodeUrl: config.qrCodeUrl,
      earlyBirdLimit: config.earlyBirdLimit,
      earlyBirdFee: config.earlyBirdFee,
      regularFee: config.regularFee,
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
      
      updatedAt: config.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating payment config:", error);
    return NextResponse.json({ error: "Failed to update payment config" }, { status: 500 });
  }
}

// POST /api/admin/payment-config - Upload QR code (superadmin only)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  if (!hasSuperAdminAccess(user)) {
    return NextResponse.json({ error: "Superadmin access required" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("qrCode") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No QR code file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "qr-codes");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "png";
    const filename = `qrcode-${timestamp}.${extension}`;
    const filePath = join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update config with new QR code URL
    const qrCodeUrl = `/uploads/qr-codes/${filename}`;
    const config = await updatePaymentConfig({ qrCodeUrl });

    return NextResponse.json({
      success: true,
      message: "QR code uploaded successfully",
      qrCodeUrl: config.qrCodeUrl,
    });
  } catch (error) {
    console.error("Error uploading QR code:", error);
    return NextResponse.json({ error: "Failed to upload QR code" }, { status: 500 });
  }
}

