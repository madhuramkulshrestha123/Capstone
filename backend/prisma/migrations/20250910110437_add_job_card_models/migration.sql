-- CreateTable
CREATE TABLE "job_cards" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jobCardNumber" VARCHAR(100) NOT NULL,
    "familyId" VARCHAR(50) NOT NULL,
    "headOfHouseholdName" VARCHAR(100) NOT NULL,
    "fatherHusbandName" VARCHAR(100) NOT NULL,
    "category" VARCHAR(10) NOT NULL,
    "dateOfRegistration" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "village" VARCHAR(100) NOT NULL,
    "panchayat" VARCHAR(100) NOT NULL,
    "block" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100) NOT NULL,
    "isBPL" BOOLEAN NOT NULL DEFAULT false,
    "epicNo" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "job_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_card_applicants" (
    "id" SERIAL NOT NULL,
    "jobCardId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "age" INTEGER NOT NULL,
    "bankDetails" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "job_card_applicants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_cards_jobCardNumber_key" ON "job_cards"("jobCardNumber");

-- CreateIndex
CREATE INDEX "job_cards_jobCardNumber_idx" ON "job_cards"("jobCardNumber");

-- CreateIndex
CREATE INDEX "job_cards_userId_idx" ON "job_cards"("userId");

-- CreateIndex
CREATE INDEX "job_card_applicants_jobCardId_idx" ON "job_card_applicants"("jobCardId");

-- AddForeignKey
ALTER TABLE "job_cards" ADD CONSTRAINT "job_cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_card_applicants" ADD CONSTRAINT "job_card_applicants_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "job_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
