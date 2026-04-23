-- User: lockout fields
ALTER TABLE "User"
ADD COLUMN "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lockedUntil" TIMESTAMP(3);

-- Persistent login attempts
CREATE TABLE "LoginAttempt" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "ip" TEXT NOT NULL DEFAULT '',
  "success" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LoginAttempt_email_createdAt_idx" ON "LoginAttempt"("email", "createdAt");
CREATE INDEX "LoginAttempt_createdAt_idx" ON "LoginAttempt"("createdAt");

-- Admin audit log
CREATE TABLE "AdminAuditLog" (
  "id" TEXT NOT NULL,
  "actorId" TEXT,
  "method" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "statusCode" INTEGER NOT NULL,
  "details" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");
CREATE INDEX "AdminAuditLog_actorId_createdAt_idx" ON "AdminAuditLog"("actorId", "createdAt");
CREATE INDEX "AdminAuditLog_entityType_createdAt_idx" ON "AdminAuditLog"("entityType", "createdAt");

ALTER TABLE "AdminAuditLog"
ADD CONSTRAINT "AdminAuditLog_actorId_fkey"
FOREIGN KEY ("actorId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
