"use client";

import { getNonSensitiveUserInfo } from "@/api/user_info";
import { getUserStats } from "@/api/user_stats";
import { useAuth } from "@/components/authContext";
import FullScreenLoading from "@/components/ui/full_screen_loading";
import { NonSensitiveUserInfo, UserStats } from "@/constants/interfaces";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StatsPage() {
    const { token, loading, setToken } = useAuth();
    const [imageError, setImageError] = useState(false);
    const [userInfo, setUserInfo] = useState<NonSensitiveUserInfo | null>(null);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getNonSensitiveUserInfo(token, setToken);
            const stats = await getUserStats(token, setToken);

            if (!userData || userData === null) {
                router.push("/sign-in");
                return;
            }

            if (!stats || stats === null) {
                router.push("/sign-in");
                return;
            }

            setUserInfo(userData);
            setUserStats(stats);
            setLoadingData(false);
        };

        if (!loading && token) {
            fetchData();
        }
    }, [loading, token, setToken, router]);

    return loading || loadingData ? (
        <FullScreenLoading text="Loading Statistics" />
    ) : (
        <div className="relative min-h-screen flex items-center justify-center bg-background">
            <button
                onClick={() => router.push("/")}
                className="absolute top-4 left-4 text-primary hover:text-primary/80 font-semibold"
                aria-label="Go back to home"
            >
                ← Back
            </button>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-center rounded-lg bg-secondary text-primary shadow-xl w-full max-w-4xl p-6">
                <div className="m-2 flex items-center space-x-3">
                    <Image
                        src={
                            imageError || !userInfo?.picture
                                ? "/profile.svg"
                                : userInfo.picture
                        }
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        onError={() => {
                            setImageError(true);
                        }}
                    />
                    <h3 className="text-xl font-bold">{userInfo!.name}</h3>
                </div>
                <div className="hidden md:block w-1 bg-primary/20 h-12 mx-4 rounded"></div>
                <div className="block md:hidden h-1 bg-primary/20 w-full my-4 rounded"></div>

                <div className="flex flex-col items-start m-2">
                    <p className="text-sm">test completed</p>
                    <p className="text-xl font-bold">
                        {userStats!.totalGamesPlayed}
                    </p>
                </div>
                <div className="flex flex-col items-start m-2">
                    <p className="text-sm">avg. accuracy</p>
                    <p className="text-xl font-bold">
                        {userStats!.averageAccuracy * 100}%
                    </p>
                </div>
                <div className="flex flex-col items-start m-2">
                    <p className="text-sm">avg. precision</p>
                    <p className="text-xl font-bold">
                        {userStats!.averagePrecision * 100}%
                    </p>
                </div>
                <div className="flex flex-col items-start m-2">
                    <p className="text-sm">avg. recall</p>
                    <p className="text-xl font-bold">
                        {userStats!.averageRecall * 100}%
                    </p>
                </div>
            </div>
        </div>
    );
}
