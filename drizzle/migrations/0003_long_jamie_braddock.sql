CREATE TABLE "store_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text DEFAULT 'support@armoire.com' NOT NULL,
	"phone" text DEFAULT '+91 9876543210' NOT NULL,
	"address" text DEFAULT '123, Fashion Street' NOT NULL,
	"city" text DEFAULT 'Mumbai' NOT NULL,
	"state" text DEFAULT 'Maharashtra' NOT NULL,
	"pincode" text DEFAULT '400001' NOT NULL,
	"country" text DEFAULT 'India' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
