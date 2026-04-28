-- Add Twilio credential columns to profiles table
-- These store the user's Twilio Account SID and Auth Token for phone number management
ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "twilio_account_sid" text;

ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "twilio_auth_token" text;

COMMENT ON COLUMN "public"."profiles"."twilio_account_sid" IS 'Twilio Account SID used to import phone numbers into VAPI';
COMMENT ON COLUMN "public"."profiles"."twilio_auth_token" IS 'Twilio Auth Token used to import phone numbers into VAPI';
