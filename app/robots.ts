import { MetadataRoute } from "next";

const SITE_URL = "https://nalaarmoire.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/admin/",
                    "/account/",
                    "/cart/",
                    "/checkout/",
                    "/orders/",
                    "/wishlist/",
                    "/login/",
                    "/_next/",
                    "/private/",
                ],
            },
            {
                userAgent: "Googlebot",
                allow: "/",
                disallow: [
                    "/api/",
                    "/admin/",
                    "/account/",
                    "/cart/",
                    "/checkout/",
                    "/orders/",
                    "/wishlist/",
                    "/login/",
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
