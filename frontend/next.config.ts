import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/api/:path*",
                    destination:
                        "https://yvhgqsmtn8.execute-api.eu-west-2.amazonaws.com/prod/:path*", // your real API endpoint
                },
            ];
        }
        // In production, don't proxy
        return [];
    },
};

export default nextConfig;
