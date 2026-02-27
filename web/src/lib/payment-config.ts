import { prisma } from "@/lib/prisma";

export type PaymentMode = "QR" | "DISABLED";
export type PaymentTier = "EARLY_BIRD" | "REGULAR";

export type PaymentConfig = {
  id: number;
  paymentMode: PaymentMode;
  qrCodeUrl: string | null;
  earlyBirdLimit: number;
  earlyBirdFee: number;
  regularFee: number;
  totalTeamLimit: number;
  onlineTeamLimit: number;
  adminAddedTeams: number;
  updatedAt: Date;
};

export type PaymentStats = {
  onlineVerifiedCount: number;
  earlyBirdCount: number;
  regularCount: number;
  adminAddedCount: number;
  earlyBirdSlotsRemaining: number;
  regularSlotsRemaining: number;
  adminSlotsRemaining: number;
  onlineSpotsRemaining: number;
  totalSpotsRemaining: number;
  currentTier: PaymentTier | null;
  currentFeePerMember: number | null;
};

const DEFAULT_PAYMENT_CONFIG: Omit<PaymentConfig, "id" | "updatedAt"> = {
  paymentMode: "QR",
  qrCodeUrl: null,
  earlyBirdLimit: 10,
  earlyBirdFee: 110,
  regularFee: 150,
  totalTeamLimit: 100,
  onlineTeamLimit: 80,
  adminAddedTeams: 0,
};

let isPaymentConfigInitialized = false;

async function ensurePaymentConfigTable() {
  if (isPaymentConfigInitialized) return;

  // Create the HackathonPaymentConfig table if it doesn't exist
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "HackathonPaymentConfig" (
      "id" INTEGER PRIMARY KEY DEFAULT 1,
      "paymentMode" TEXT NOT NULL DEFAULT 'QR',
      "qrCodeUrl" TEXT,
      "earlyBirdLimit" INTEGER NOT NULL DEFAULT 10,
      "earlyBirdFee" INTEGER NOT NULL DEFAULT 110,
      "regularFee" INTEGER NOT NULL DEFAULT 150,
      "totalTeamLimit" INTEGER NOT NULL DEFAULT 100,
      "onlineTeamLimit" INTEGER NOT NULL DEFAULT 80,
      "adminAddedTeams" INTEGER NOT NULL DEFAULT 0,
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Also ensure HackathonConfig exists (for compatibility)
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "HackathonConfig" (
      "id" INTEGER PRIMARY KEY,
      "mode" TEXT NOT NULL DEFAULT 'LIVE',
      "problemSelectionStartAt" TIMESTAMPTZ NOT NULL,
      "hackathonEndAt" TIMESTAMPTZ NOT NULL,
      "testingHomepageCountdownTargetAt" TIMESTAMPTZ NOT NULL,
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Insert default payment config if not exists
  await prisma.$executeRawUnsafe(`
    INSERT INTO "HackathonPaymentConfig" ("id", "paymentMode", "qrCodeUrl", "earlyBirdLimit", "earlyBirdFee", "regularFee", "totalTeamLimit", "onlineTeamLimit", "adminAddedTeams", "updatedAt")
    VALUES (1, 'QR', NULL, 10, 110, 150, 100, 80, 0, NOW())
    ON CONFLICT ("id") DO NOTHING;
  `);

  // Insert default hackathon config if not exists
  const existingConfig = await prisma.$queryRawUnsafe<Array<{ id: number }>>(
    `SELECT "id" FROM "HackathonConfig" WHERE "id" = 1 LIMIT 1;`
  );
  
  if (existingConfig.length === 0) {
    await prisma.$executeRawUnsafe(`
      INSERT INTO "HackathonConfig" ("id", "mode", "problemSelectionStartAt", "hackathonEndAt", "testingHomepageCountdownTargetAt", "updatedAt")
      VALUES (1, 'LIVE', '2026-03-09T04:00:00.000Z', '2026-03-09T14:00:00.000Z', '2026-03-09T03:30:00.000Z', NOW())
    `);
  }

  isPaymentConfigInitialized = true;
}

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  return new Date(String(value));
}

export async function getPaymentConfig(): Promise<PaymentConfig> {
  await ensurePaymentConfigTable();

  const rows = await prisma.$queryRawUnsafe<
    Array<{
      id: number;
      paymentMode: string;
      qrCodeUrl: string | null;
      earlyBirdLimit: number;
      earlyBirdFee: number;
      regularFee: number;
      totalTeamLimit: number;
      onlineTeamLimit: number;
      adminAddedTeams: number;
      updatedAt: Date | string;
    }>
  >(
    `SELECT * FROM "HackathonPaymentConfig" WHERE "id" = 1 LIMIT 1;`
  );

  const row = rows[0];
  if (!row) {
    // Return default if somehow no row exists
    return {
      ...DEFAULT_PAYMENT_CONFIG,
      id: 1,
      updatedAt: new Date(),
    };
  }

  return {
    id: row.id,
    paymentMode: row.paymentMode as PaymentMode,
    qrCodeUrl: row.qrCodeUrl,
    earlyBirdLimit: row.earlyBirdLimit,
    earlyBirdFee: row.earlyBirdFee,
    regularFee: row.regularFee,
    totalTeamLimit: row.totalTeamLimit,
    onlineTeamLimit: row.onlineTeamLimit,
    adminAddedTeams: row.adminAddedTeams,
    updatedAt: toDate(row.updatedAt),
  };
}

export async function updatePaymentConfig(input: {
  paymentMode?: PaymentMode;
  qrCodeUrl?: string | null;
  earlyBirdLimit?: number;
  earlyBirdFee?: number;
  regularFee?: number;
  totalTeamLimit?: number;
  onlineTeamLimit?: number;
  adminAddedTeams?: number;
}): Promise<PaymentConfig> {
  const existing = await getPaymentConfig();
  
  const paymentMode = input.paymentMode ?? existing.paymentMode;
  const qrCodeUrl = input.qrCodeUrl !== undefined ? input.qrCodeUrl : existing.qrCodeUrl;
  const earlyBirdLimit = input.earlyBirdLimit ?? existing.earlyBirdLimit;
  const earlyBirdFee = input.earlyBirdFee ?? existing.earlyBirdFee;
  const regularFee = input.regularFee ?? existing.regularFee;
  const totalTeamLimit = input.totalTeamLimit ?? existing.totalTeamLimit;
  const onlineTeamLimit = input.onlineTeamLimit ?? existing.onlineTeamLimit;
  const adminAddedTeams = input.adminAddedTeams ?? existing.adminAddedTeams;

  await prisma.$executeRawUnsafe(
    `UPDATE "HackathonPaymentConfig" SET "paymentMode" = $1, "qrCodeUrl" = $2, "earlyBirdLimit" = $3, "earlyBirdFee" = $4, "regularFee" = $5, "totalTeamLimit" = $6, "onlineTeamLimit" = $7, "adminAddedTeams" = $8, "updatedAt" = NOW() WHERE "id" = 1;`,
    paymentMode,
    qrCodeUrl,
    earlyBirdLimit,
    earlyBirdFee,
    regularFee,
    totalTeamLimit,
    onlineTeamLimit,
    adminAddedTeams
  );

  return getPaymentConfig();
}

export async function getPaymentStats(): Promise<PaymentStats> {
  const config = await getPaymentConfig();

  // Get counts from database
  const [totalTeams, onlineTeams, verifiedOnlineTeams, adminTeams] = await Promise.all([
    prisma.team.count(),
    prisma.team.count({ where: { registrationMode: "ONLINE" } }),
    // use the boolean flag rather than the string status so that
    // toggling `paymentVerified` anywhere (UI, manual updates) is
    // immediately reflected in the stats. previous code counted
    // against `paymentStatus`, which was left unchanged when admins
    // flipped the boolean. this is the root cause of the counter not
    // moving.
    prisma.team.count({ 
      where: { 
        registrationMode: "ONLINE",
        paymentVerified: true,
      } 
    }),
    prisma.team.count({ where: { registrationMode: "SUPERADMIN" } }),
  ]);

  // Calculate tier distribution
  const earlyBirdCount = Math.min(verifiedOnlineTeams, config.earlyBirdLimit);
  const regularCount = verifiedOnlineTeams - earlyBirdCount;

  const earlyBirdSlotsRemaining = Math.max(0, config.earlyBirdLimit - earlyBirdCount);
  const regularSlotsRemaining = Math.max(0, config.onlineTeamLimit - config.earlyBirdLimit - regularCount);
  const adminSlotsRemaining = Math.max(0, config.totalTeamLimit - config.onlineTeamLimit - adminTeams);
  
  const onlineSpotsRemaining = Math.max(0, config.onlineTeamLimit - onlineTeams);
  const totalSpotsRemaining = Math.max(0, config.totalTeamLimit - totalTeams);

  // Determine current tier and fee
  let currentTier: PaymentTier | null = null;
  let currentFeePerMember: number | null = null;

  if (config.paymentMode === "QR" && verifiedOnlineTeams < config.onlineTeamLimit) {
    currentTier = verifiedOnlineTeams < config.earlyBirdLimit ? "EARLY_BIRD" : "REGULAR";
    currentFeePerMember = currentTier === "EARLY_BIRD" ? config.earlyBirdFee : config.regularFee;
  }

  return {
    onlineVerifiedCount: verifiedOnlineTeams,
    earlyBirdCount,
    regularCount,
    adminAddedCount: adminTeams,
    earlyBirdSlotsRemaining,
    regularSlotsRemaining,
    adminSlotsRemaining,
    onlineSpotsRemaining,
    totalSpotsRemaining,
    currentTier,
    currentFeePerMember,
  };
}

export function calculateFee(memberCount: number, tier: PaymentTier | null, config: PaymentConfig): {
  feePerMember: number;
  totalAmount: number;
  paymentTier: PaymentTier;
} {
  if (tier === null || config.paymentMode === "DISABLED") {
    return {
      feePerMember: 0,
      totalAmount: 0,
      paymentTier: "EARLY_BIRD",
    };
  }

  const feePerMember = tier === "EARLY_BIRD" ? config.earlyBirdFee : config.regularFee;
  return {
    feePerMember,
    totalAmount: feePerMember * memberCount,
    paymentTier: tier,
  };
}

