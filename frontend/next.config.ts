import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/a/**",
            },
            {
                protocol: "https",
                hostname: "lh4.googleusercontent.com",
                pathname: "/a/**",
            },
            {
                protocol: "https",
                hostname: "lh5.googleusercontent.com",
                pathname: "/a/**",
            },
            {
                protocol: "https",
                hostname: "lh6.googleusercontent.com",
                pathname: "/a/**",
            },
        ],
    },
    async rewrites() {
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/api/:path*",
                    destination:
                        "https://yvhgqsmtn8.execute-api.eu-west-2.amazonaws.com/dev/:path*", // your real API endpoint
                },
            ];
        }
        // In production, don't proxy
        return [];
    },
};

export default nextConfig;
