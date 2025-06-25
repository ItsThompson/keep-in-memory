"use client";

import { useAuth } from "@/components/authContext";
import FullScreenLoading from "@/components/ui/full_screen_loading";
import { redirect } from "next/navigation";

export default function StatsPage() {
    const { token, loading } = useAuth();

    if (loading) {
        return <FullScreenLoading text="Loading Statistics..." />;
    }

    if (!token) {
        redirect("/sign-in");
    }

    console.log(token);
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <main className="rounded-lg mx-auto max-w-lg bg-secondary text-primary shadow-xl w-full p-6">
                <div className="flex justify-between items-center border-b border-primary/20 pb-3 mb-4">
                    <h3 className="text-xl font-bold">Game Statistics</h3>
                </div>
                <p className="text-primary">
                    Statistics will be displayed here.
                </p>
            </main>
        </div>
    );
}
