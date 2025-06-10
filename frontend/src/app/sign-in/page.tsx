"use client";

import { useAuth } from "@/components/authContext";
import { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { getTokenWithGoogle } from "@/api/auth";

export default function SignInPage() {
    const { setToken } = useAuth();

    const [retrievingToken, setRetrievingToken] = useState(false);
    const retrievingTokenRef = useRef<boolean>(false);

    useEffect(() => {
        retrievingTokenRef.current = retrievingToken;
    }, [retrievingToken]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <main className="rounded-lg mx-auto max-w-lg bg-secondary text-primary shadow-xl w-full p-6">
                <div className="flex justify-between items-center border-b border-primary/20 pb-3 mb-4">
                    <h3 className="text-xl font-bold">Sign In</h3>
                </div>

                <div className="flex flex-col items-center space-y-4 text-sm">
                    {retrievingToken ? (
                        <p className="text-primary">
                            Signing you in, please wait...
                        </p>
                    ) : (
                        <>
                            <p>Please sign in to access the game features.</p>
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    setRetrievingToken(true);

                                    const googleJWT =
                                        credentialResponse.credential;
                                    if (!googleJWT) {
                                        console.error("No JWT received");
                                        setRetrievingToken(false);
                                        return;
                                    }

                                    const token =
                                        await getTokenWithGoogle(googleJWT);

                                    setRetrievingToken(false);

                                    if (!token) {
                                        console.error(
                                            "Failed to retrieve token",
                                        );
                                        return;
                                    }

                                    console.log("Token retrieved successfully");

                                    setToken(token);
                                    redirect("/");
                                }}
                                onError={() => {
                                    console.error(
                                        "Login Failed, please try again.",
                                    );
                                }}
                                auto_select={true}
                            />
                            <p className="text-center mx-8">
                                By signing in, you agree to kim&apos;s terms of
                                service and privacy policy.
                            </p>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
