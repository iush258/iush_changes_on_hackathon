-- CreateTable
CREATE TABLE "HackathonPaymentConfig" (
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

-- CreateTable
CREATE TABLE "HackathonConfig" (
    "id" INTEGER PRIMARY KEY,
    "mode" TEXT NOT NULL DEFAULT 'LIVE',
    "problemSelectionStartAt" TIMESTAMPTZ NOT NULL,
    "hackathonEndAt" TIMESTAMPTZ NOT NULL,
    "testingHomepageCountdownTargetAt" TIMESTAMPTZ NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default payment config
INSERT INTO "HackathonPaymentConfig" ("id", "paymentMode", "qrCodeUrl", "earlyBirdLimit", "earlyBirdFee", "regularFee", "totalTeamLimit", "onlineTeamLimit", "adminAddedTeams", "updatedAt")
VALUES (1, 'QR', NULL, 10, 110, 150, 100, 80, 0, NOW())
ON CONFLICT ("id") DO NOTHING;

-- Insert default hackathon config
INSERT INTO "HackathonConfig" ("id", "mode", "problemSelectionStartAt", "hackathonEndAt", "testingHomepageCountdownTargetAt", "updatedAt")
VALUES (1, 'LIVE', '2026-03-09T04:00:00.000Z', '2026-03-09T14:00:00.000Z', '2026-03-09T03:30:00.000Z', NOW())
ON CONFLICT ("id") DO NOTHING;

-- AddTeamColumns
ALTER TABLE "Team" ADD COLUMN IF NOT EXISTS "paymentMode" TEXT DEFAULT 'QR';
ALTER TABLE "Team" ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT DEFAULT 'PENDING';
ALTER TABLE "Team" ADD COLUMN IF NOT EXISTS "transactionId" TEXT;
ALTER TABLE "Team" ADD COLUMN IF NOT EXISTS "feePerMember" INTEGER;
ALTER TABLE "Team" ADD COLUMN IF NOT EXISTS "totalAmount" INTEGER;
ALTER TABLE "Team" ADD COLUMN IF NOT EXISTS "paymentTier" TEXT DEFAULT 'EARLY_BIRD';
ALTER TABLE "Team" ADD COLUMN IF NOT EXISTS "paymentVerifiedAt" TIMESTAMPTZ;

-- FixSponsorUpdatedAt
ALTER TABLE "Sponsor" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
