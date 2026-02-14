CREATE TABLE "landing_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image_url" text NOT NULL,
	"link_url" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landing_testimonials" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"customer_role" text DEFAULT 'Verified Customer',
	"review_text" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"is_verified_purchase" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "showcase_products" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"image_url" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slider_images" (
	"id" text PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"alt_text" text DEFAULT 'Fashion image',
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_landing_cat_order" ON "landing_categories" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_landing_cat_active" ON "landing_categories" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_testimonial_order" ON "landing_testimonials" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_testimonial_active" ON "landing_testimonials" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_showcase_order" ON "showcase_products" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_showcase_active" ON "showcase_products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_slider_order" ON "slider_images" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_slider_active" ON "slider_images" USING btree ("is_active");