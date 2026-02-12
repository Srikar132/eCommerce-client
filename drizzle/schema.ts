// Step 3: Configure Drizzle schema
import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    pgEnum,
    numeric,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "@auth/core/adapters"
import { randomUUID } from "crypto"

// Enums
export const roleEnum = pgEnum('role', ['ADMIN', 'USER']);


export const orderStatusEnum = pgEnum('order_status', [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'RETURN_REQUESTED',
    'RETURNED',
    'REFUNDED'
]);


export const paymentStatusEnum = pgEnum('payment_status', [
    'PENDING',
    'PROCESSING',
    'PAID',
    'FAILED',
    'REFUND_REQUESTED',
    'REFUNDED',
    'PARTIALLY_REFUNDED'
]);


export const addressTypeEnum = pgEnum('address_type', ['HOME', 'OFFICE', 'OTHER']);
export const productionStatusEnum = pgEnum('production_status', ['PENDING', 'IN_PROGRESS', 'COMPLETED']);

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    // Required by NextAuth DrizzleAdapter (even if not used)
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    // Your actual auth fields
    phone: text("phone").notNull().unique(),
    phoneVerified: boolean("phoneVerified").default(false).notNull(),
    acceptTerms: boolean("acceptTerms").default(false).notNull(),
    role: roleEnum("role").default('USER').notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});


export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => [
        {
            compositePK: primaryKey({
                columns: [authenticator.userId, authenticator.credentialID],
            }),
        },
    ]
)

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [verificationToken.identifier, verificationToken.token],
            }),
        },
    ]
)

// ==================== ECOMMERCE TABLES ====================

// Categories Table
export const categories = pgTable(
    "categories",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        name: text("name").notNull(),
        slug: text("slug").notNull().unique(),
        description: text("description"),
        imageUrl: text("image_url"),
        isActive: boolean("is_active").default(true).notNull(),
        displayOrder: integer("display_order").default(0).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedBy: text("updated_by"),
    },
    (table) => [
        index("idx_category_slug").on(table.slug),
        index("idx_category_active").on(table.isActive),
        index("idx_category_display_order").on(table.displayOrder),
        index("idx_category_active_order").on(table.isActive, table.displayOrder),
    ]
);

// Products Table
export const products = pgTable(
    "products",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        categoryId: text("category_id").references(() => categories.id),
        name: text("name").notNull(),
        slug: text("slug").notNull().unique(),
        description: text("description"),
        basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
        sku: text("sku").notNull().unique(),
        material: text("material"),
        careInstructions: text("care_instructions"),
        isActive: boolean("is_active").default(true).notNull(),
        isDraft: boolean("is_draft").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex("idx_product_slug").on(table.slug),
        index("idx_product_category_active").on(table.categoryId, table.isActive),
        index("idx_product_active_draft").on(table.isActive, table.isDraft),
    ]
);

// Product Images Table
export const productImages = pgTable(
    "product_images",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        productId: text("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        imageUrl: text("image_url").notNull(),
        altText: text("alt_text"),
        displayOrder: integer("display_order").default(0).notNull(),
        isPrimary: boolean("is_primary").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("idx_product_images_product").on(table.productId),
        index("idx_product_images_primary").on(table.productId, table.isPrimary),
    ]
);

// Product Variants Table
export const productVariants = pgTable(
    "product_variants",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        productId: text("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        size: text("size").notNull(),
        color: text("color").notNull(),
        colorHex: text("color_hex"),
        stockQuantity: integer("stock_quantity").default(0).notNull(),
        additionalPrice: numeric("additional_price", { precision: 10, scale: 2 }).default("0").notNull(),
        sku: text("sku").notNull().unique(),
        isActive: boolean("is_active").default(true).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        version: integer("version").default(0).notNull(),
    },
    (table) => [
        index("idx_variant_product_color").on(table.productId, table.color),
        uniqueIndex("idx_variant_sku").on(table.sku),
        index("idx_variant_active").on(table.productId, table.isActive),
    ]
);

// Addresses Table
export const addresses = pgTable(
    "addresses",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        addressType: addressTypeEnum("address_type"),
        streetAddress: text("street_address"),
        city: text("city").notNull(),
        state: text("state").notNull(),
        country: text("country").notNull(),
        postalCode: text("postal_code").notNull(),
        isDefault: boolean("is_default").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("idx_address_user").on(table.userId),
        index("idx_address_user_default").on(table.userId, table.isDefault),
        index("idx_address_default").on(table.isDefault),
    ]
);

// Carts Table
export const carts = pgTable(
    "carts",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
        sessionId: text("session_id").unique(),
        subtotal: numeric("subtotal", { precision: 10, scale: 2 }).default("0").notNull(),
        discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0").notNull(),
        taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).default("0").notNull(),
        shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).default("0").notNull(),
        total: numeric("total", { precision: 10, scale: 2 }).default("0").notNull(),
        isActive: boolean("is_active").default(true).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
        expiresAt: timestamp("expires_at"),
    },
    (table) => [
        index("idx_cart_user").on(table.userId),
        index("idx_cart_session").on(table.sessionId),
        index("idx_cart_created_at").on(table.createdAt),
        index("idx_cart_updated_at").on(table.updatedAt),
        index("idx_cart_expires_at").on(table.expiresAt),
    ]
);

// Cart Items Table
export const cartItems = pgTable(
    "cart_items",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        cartId: text("cart_id")
            .notNull()
            .references(() => carts.id, { onDelete: "cascade" }),
        productId: text("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        productVariantId: text("product_variant_id").references(() => productVariants.id),
        quantity: integer("quantity").default(1).notNull(),
        unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).default("0").notNull(),
        itemTotal: numeric("item_total", { precision: 10, scale: 2 }).default("0").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => [
        index("idx_cart_item_cart").on(table.cartId),
        index("idx_cart_item_product").on(table.productId),
        index("idx_cart_item_variant").on(table.productVariantId),
        index("idx_cart_item_created_at").on(table.createdAt),
    ]
);

// Orders Table
export const orders = pgTable(
    "orders",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        orderNumber: text("order_number").notNull().unique(),
        status: orderStatusEnum("status").default('PENDING').notNull(),
        paymentStatus: paymentStatusEnum("payment_status").default('PENDING').notNull(),
        razorpayOrderId: text("razorpay_order_id"),
        razorpayPaymentId: text("razorpay_payment_id"),
        razorpaySignature: text("razorpay_signature"),
        razorpayRefundId: text("razorpay_refund_id"),
        refundedAt: timestamp("refunded_at"),
        paymentMethod: text("payment_method"),
        subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
        taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).default("0").notNull(),
        shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).default("0").notNull(),
        discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0").notNull(),
        totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
        shippingAddressId: text("shipping_address_id").references(() => addresses.id),
        billingAddressId: text("billing_address_id").references(() => addresses.id),
        trackingNumber: text("tracking_number"),
        carrier: text("carrier"),
        estimatedDeliveryDate: timestamp("estimated_delivery_date"),
        deliveredAt: timestamp("delivered_at"),
        cancelledAt: timestamp("cancelled_at"),
        cancellationReason: text("cancellation_reason"),
        returnRequestedAt: timestamp("return_requested_at"),
        returnReason: text("return_reason"),
        notes: text("notes"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
        version: integer("version").default(0).notNull(),
    },
    (table) => [
        index("idx_order_user").on(table.userId),
        index("idx_order_number").on(table.orderNumber),
        index("idx_order_status").on(table.status),
        index("idx_order_payment_status").on(table.paymentStatus),
        index("idx_order_razorpay_order_id").on(table.razorpayOrderId),
        index("idx_order_created_at").on(table.createdAt),
        index("idx_order_user_status").on(table.userId, table.status),
        index("idx_order_user_created").on(table.userId, table.createdAt),
    ]
);

// Order Items Table
export const orderItems = pgTable(
    "order_items",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        orderId: text("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        productVariantId: text("product_variant_id")
            .notNull()
            .references(() => productVariants.id),
        quantity: integer("quantity").notNull(),
        unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
        totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
        productionStatus: productionStatusEnum("production_status").default('PENDING'),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("idx_order_item_order").on(table.orderId),
        index("idx_order_item_variant").on(table.productVariantId),
        index("idx_order_item_production_status").on(table.productionStatus),
        index("idx_order_item_created_at").on(table.createdAt),
    ]
);

// Reviews Table
export const reviews = pgTable(
    "reviews",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        productId: text("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        orderItemId: text("order_item_id").references(() => orderItems.id),
        rating: integer("rating").notNull(),
        title: text("title"),
        comment: text("comment"),
        isVerifiedPurchase: boolean("is_verified_purchase").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("idx_review_user").on(table.userId),
        index("idx_review_product").on(table.productId),
        index("idx_review_order_item").on(table.orderItemId),
        index("idx_review_rating").on(table.rating),
        index("idx_review_verified").on(table.isVerifiedPurchase),
        index("idx_review_created_at").on(table.createdAt),
        index("idx_review_product_rating").on(table.productId, table.rating),
        index("idx_review_product_created").on(table.productId, table.createdAt),
    ]
);

// Wishlists Table
export const wishlists = pgTable(
    "wishlists",
    {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => randomUUID()),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        productId: text("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("idx_user_wishlist").on(table.userId),
        index("idx_product_wishlist").on(table.productId),
        uniqueIndex("uk_user_product").on(table.userId, table.productId),
    ]
);