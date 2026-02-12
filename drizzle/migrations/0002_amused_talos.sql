ALTER TYPE "public"."payment_status" ADD VALUE 'REFUND_REQUESTED' BEFORE 'REFUNDED';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "razorpay_refund_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "refunded_at" timestamp;