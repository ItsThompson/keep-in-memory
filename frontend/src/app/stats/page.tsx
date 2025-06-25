"use client";

import { useAuth } from "@/components/authContext";
import FullScreenLoading from "@/components/ui/full_screen_loading";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

// TODO: create API endpoint that fetches non-sensitive user info
// and statistics, then use that data here

export default function StatsPage() {
    const { token, loading } = useAuth();
    const [imageError, setImageError] = useState(false);
    const router = useRouter();

    if (loading) {
        return <FullScreenLoading text="Loading Statistics" />;
    }

    if (!token) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <div className="p-4">
                <button
                    onClick={() => router.push("/")}
                    className="text-primary hover:text-primary/80 font-semibold"
                    aria-label="Go back to home"
                >
                    ← Back
                </button>
            </div>

            <main className="mx-auto flex flex-grow items-center justify-center">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-center rounded-lg bg-secondary text-primary shadow-xl w-full p-6">
                    <div className="m-2 flex items-center space-x-3">
                        <Image
                            src={
                                imageError
                                    ? "/profile.svg"
                                    : "https://lh3.googleusercontent.com/a/ACg8ocJTiRq7-fj5iZdKt0VNz8C5zY-LnqRRbO7ZoS54BZ9bINYVv0U=s96-c"
                            }
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                            onError={() => {
                                setImageError(true);
                            }}
                        />
                        <h3 className="text-xl font-bold">name</h3>
                    </div>
                    <div className="hidden md:block w-1 bg-primary/20 h-12 mx-4 rounded"></div>
                    <div className="block md:hidden h-1 bg-primary/20 w-full my-4 rounded"></div>

                    <div className="flex flex-col items-start m-2">
                        <p className="text-sm">test completed</p>
                        <p className="text-xl font-bold">0</p>
                    </div>
                    <div className="flex flex-col items-start m-2">
                        <p className="text-sm">avg. accuracy</p>
                        <p className="text-xl font-bold">0</p>
                    </div>
                    <div className="flex flex-col items-start m-2">
                        <p className="text-sm">avg. precision</p>
                        <p className="text-xl font-bold">0</p>
                    </div>
                    <div className="flex flex-col items-start m-2">
                        <p className="text-sm">avg. recall</p>
                        <p className="text-xl font-bold">0</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
