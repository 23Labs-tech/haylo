-- Update Call Log table to match UI requirements
ALTER TABLE "public"."Call Log"
ADD COLUMN IF NOT EXISTS "status" text,
ADD COLUMN IF NOT EXISTS "type" text,
ADD COLUMN IF NOT EXISTS "startedAt" timestamp with time zone,
ADD COLUMN IF NOT EXISTS "endedAt" timestamp with time zone,
ADD COLUMN IF NOT EXISTS "duration" integer,
ADD COLUMN IF NOT EXISTS "customer" text,
ADD COLUMN IF NOT EXISTS "transcript" text,
ADD COLUMN IF NOT EXISTS "endedReason" text;

-- Set created_at as the default for startedAt if not provided
-- (We can backfill with created_at if there are existing records)
UPDATE "public"."Call Log"
SET "startedAt" = "created_at"
WHERE "startedAt" IS NULL;

-- Make sure assistant_id is indexed for quick filtering
CREATE INDEX IF NOT EXISTS "idx_call_log_assistant_id" ON "public"."Call Log"("assistant_id");

-- Create index on startedAt for sorting
CREATE INDEX IF NOT EXISTS "idx_call_log_started_at" ON "public"."Call Log"("startedAt" DESC);
