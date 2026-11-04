-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "city" TEXT,
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "dietPreference" TEXT,
    "wakeTime" TEXT,
    "bedTime" TEXT,
    "onboardedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrakritiAssessment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "scoringVersion" TEXT NOT NULL,
    "answersJson" TEXT NOT NULL,
    "vataScore" INTEGER NOT NULL,
    "pittaScore" INTEGER NOT NULL,
    "kaphaScore" INTEGER NOT NULL,
    "vataPct" DOUBLE PRECISION NOT NULL,
    "pittaPct" DOUBLE PRECISION NOT NULL,
    "kaphaPct" DOUBLE PRECISION NOT NULL,
    "classification" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrakritiAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VikritiAssessment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "instrumentId" TEXT NOT NULL,
    "scoringVersion" TEXT NOT NULL,
    "answersJson" TEXT NOT NULL,
    "vataCount" INTEGER NOT NULL,
    "pittaCount" INTEGER NOT NULL,
    "kaphaCount" INTEGER NOT NULL,
    "vataPct" DOUBLE PRECISION NOT NULL,
    "pittaPct" DOUBLE PRECISION NOT NULL,
    "kaphaPct" DOUBLE PRECISION NOT NULL,
    "dominant" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VikritiAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CombinedAssessment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "combinedScore" DOUBLE PRECISION NOT NULL,
    "dominantDosha" TEXT NOT NULL,
    "qContribution" DOUBLE PRECISION NOT NULL,
    "wContribution" DOUBLE PRECISION NOT NULL,
    "eContribution" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "breakdownJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CombinedAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthReading" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "provenance" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "city" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "temperatureC" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "condition" TEXT,
    "season" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvironmentSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "scope" TEXT,
    "granted" BOOLEAN NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "payloadJson" TEXT NOT NULL,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthPairingCode" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "deviceLabel" TEXT,

    CONSTRAINT "HealthPairingCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthCompanionDevice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "model" TEXT,
    "osVersion" TEXT,
    "appVersion" TEXT,
    "permissionsJson" TEXT,
    "originsJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncAt" TIMESTAMP(3),
    "lastSyncStatus" TEXT,
    "lastSyncMessage" TEXT,
    "lastSyncCreated" INTEGER,
    "lastSyncTotal" INTEGER,
    "syncRequestedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "HealthCompanionDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "PrakritiAssessment_userId_createdAt_idx" ON "PrakritiAssessment"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "VikritiAssessment_userId_createdAt_idx" ON "VikritiAssessment"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CombinedAssessment_userId_createdAt_idx" ON "CombinedAssessment"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "HealthReading_userId_metric_recordedAt_idx" ON "HealthReading"("userId", "metric", "recordedAt");

-- CreateIndex
CREATE INDEX "EnvironmentSnapshot_userId_recordedAt_idx" ON "EnvironmentSnapshot"("userId", "recordedAt");

-- CreateIndex
CREATE INDEX "RecommendationEvent_userId_createdAt_idx" ON "RecommendationEvent"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "HealthPairingCode_codeHash_key" ON "HealthPairingCode"("codeHash");

-- CreateIndex
CREATE INDEX "HealthPairingCode_userId_createdAt_idx" ON "HealthPairingCode"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "HealthCompanionDevice_tokenHash_key" ON "HealthCompanionDevice"("tokenHash");

-- CreateIndex
CREATE INDEX "HealthCompanionDevice_userId_idx" ON "HealthCompanionDevice"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrakritiAssessment" ADD CONSTRAINT "PrakritiAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VikritiAssessment" ADD CONSTRAINT "VikritiAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CombinedAssessment" ADD CONSTRAINT "CombinedAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthReading" ADD CONSTRAINT "HealthReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentSnapshot" ADD CONSTRAINT "EnvironmentSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationEvent" ADD CONSTRAINT "RecommendationEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthPairingCode" ADD CONSTRAINT "HealthPairingCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthCompanionDevice" ADD CONSTRAINT "HealthCompanionDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
