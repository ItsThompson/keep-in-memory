import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { getTokenWithGoogle } from "@/api/auth";
import { useAuth } from "../authContext";

interface SignInModalProps {
    open: boolean;
    onClose: () => void;
}

export default function SignInModal({
    open,
    onClose,
}: SignInModalProps) {
    const [retrievingToken, setRetrievingToken] = useState(false);
    const retrievingTokenRef = useRef<boolean>(false);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const { setToken } = useAuth();

    useEffect(() => {
        retrievingTokenRef.current = retrievingToken;
    }, [retrievingToken]);

    // Close modal if clicked outside and not retrieving token
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                open &&
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                !retrievingTokenRef.current
            ) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                ref={modalRef}
                className="bg-secondary text-primary rounded-2xl shadow-xl max-w-md w-full p-6 relative"
            >
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
                            <p>Welcome! Please sign in to continue.</p>
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
                                    onClose();
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

                            <button
                                className="text-sm text-primary hover:underline mt-5"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
