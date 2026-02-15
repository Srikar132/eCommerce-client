/**
 * Structured Data Components for SEO
 * JSON-LD schemas for better search engine understanding
 */

const SITE_URL = "https://nalaarmoire.com";
const SITE_NAME = "Nala Armoire";

// ============================================================================
// ORGANIZATION SCHEMA
// ============================================================================

export function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.webp`,
        description: "Premium customizable fashion brand. Where beauty roars in every stitch.",
        sameAs: [
            "https://www.instagram.com/nalaarmoire",
            "https://www.facebook.com/nalaarmoire",
            // Add more social links as needed
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["English", "Hindi"],
        },
        address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ============================================================================
// WEBSITE SCHEMA
// ============================================================================

export function WebsiteSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/products?searchQuery={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ============================================================================
// PRODUCT SCHEMA
// ============================================================================

interface ProductSchemaProps {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder";
    sku?: string;
    brand?: string;
    url: string;
    reviewCount?: number;
    ratingValue?: number;
}

export function ProductSchema({
    name,
    description,
    image,
    price,
    currency = "INR",
    availability = "InStock",
    sku,
    brand = SITE_NAME,
    url,
    reviewCount,
    ratingValue,
}: ProductSchemaProps) {
    const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        image,
        brand: {
            "@type": "Brand",
            name: brand,
        },
        offers: {
            "@type": "Offer",
            url,
            priceCurrency: currency,
            price,
            availability: `https://schema.org/${availability}`,
            seller: {
                "@type": "Organization",
                name: SITE_NAME,
            },
        },
    };

    if (sku) {
        schema.sku = sku;
    }

    if (reviewCount && ratingValue) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue,
            reviewCount,
        };
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ============================================================================
// BREADCRUMB SCHEMA
// ============================================================================

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ============================================================================
// FAQ SCHEMA
// ============================================================================

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSchemaProps {
    items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ============================================================================
// LOCAL BUSINESS SCHEMA (if you have a physical store)
// ============================================================================

export function LocalBusinessSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ClothingStore",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.webp`,
        image: `${SITE_URL}/images/og-image.jpg`,
        description: "Premium customizable fashion boutique specializing in ethnic and contemporary wear.",
        priceRange: "₹₹",
        address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
        },
        // Uncomment and fill if you have physical location
        // geo: {
        //     "@type": "GeoCoordinates",
        //     latitude: "YOUR_LATITUDE",
        //     longitude: "YOUR_LONGITUDE",
        // },
        // openingHoursSpecification: [
        //     {
        //         "@type": "OpeningHoursSpecification",
        //         dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        //         opens: "10:00",
        //         closes: "20:00",
        //     },
        // ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
