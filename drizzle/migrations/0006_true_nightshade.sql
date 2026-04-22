CREATE TYPE "public"."product_color" AS ENUM('BLACK', 'WHITE', 'RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK', 'BROWN', 'GREY', 'NAVY', 'BEIGE', 'MAROON', 'OLIVE', 'TEAL', 'CREAM', 'MULTICOLOR');--> statement-breakpoint
CREATE TYPE "public"."product_size" AS ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'FREE_SIZE');--> statement-breakpoint
ALTER TABLE "product_variants" RENAME COLUMN "additional_price" TO "price_modifier";--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "size" SET DATA TYPE "public"."product_size" USING "size"::"public"."product_size";--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "color" SET DATA TYPE "public"."product_color" USING "color"::"public"."product_color";--> statement-breakpoint
ALTER TABLE "product_variants" ALTER COLUMN "color_hex" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_variant_product_size_color" ON "product_variants" USING btree ("product_id","size","color");--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "version";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "version";