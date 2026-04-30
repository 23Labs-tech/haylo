-- Ensure all required columns exist on the profiles table for the Haylo AI receptionist settings flow
-- This migration is idempotent (safe to run multiple times)

-- Core settings columns
ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "vapi_assistant_id" text;

ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "clinic_name" text;

ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "settings_json" jsonb;

-- Phone number columns
ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "vapi_phone_number" text;

ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "vapi_phone_id" text;

-- Twilio credential columns
ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "twilio_account_sid" text;

ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "twilio_auth_token" text;

-- Add comments for documentation
COMMENT ON COLUMN "public"."profiles"."vapi_assistant_id" IS 'The VAPI assistant ID created when user saves their AI receptionist settings';
COMMENT ON COLUMN "public"."profiles"."clinic_name" IS 'The clinic name for the AI receptionist';
COMMENT ON COLUMN "public"."profiles"."settings_json" IS 'JSON blob storing all AI receptionist settings (botName, hours, greeting, etc.)';
COMMENT ON COLUMN "public"."profiles"."vapi_phone_number" IS 'The imported/provisioned phone number (e.g. +61XXXXXXXXX)';
COMMENT ON COLUMN "public"."profiles"."vapi_phone_id" IS 'The VAPI phone number resource ID for managing the phone via VAPI API';
COMMENT ON COLUMN "public"."profiles"."twilio_account_sid" IS 'Twilio Account SID used to import phone numbers into VAPI';
COMMENT ON COLUMN "public"."profiles"."twilio_auth_token" IS 'Twilio Auth Token used to import phone numbers into VAPI';
