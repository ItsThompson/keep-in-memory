"use client";

import { useEffect, useRef, useState } from "react";
import IconButton from "./icon_button";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import Description from "./description";
import { addTokenToLocalStorage } from "@/api/token";

interface TopbarProps {
    onSignIn: () => void;
    onSignOut: () => void;
    isSignedIn: boolean;
}

export default function Topbar({
    onSignIn,
    onSignOut,
    isSignedIn = false,
}: TopbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [retrievingToken, setRetrievingToken] = useState(false);

    const retrievingTokenRef = useRef<boolean>(false);


    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const signInModalRef = useRef<HTMLDivElement | null>(null);
    const infoModalRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        retrievingTokenRef.current = retrievingToken;
    }, [retrievingToken]);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close sign in modal if clicked outside
    useEffect(() => {
        const handleClickOutsideSignInModal = (event: MouseEvent) => {
            if (
                isSignInModalOpen &&
                signInModalRef.current &&
                !signInModalRef.current.contains(event.target as Node) &&
                !retrievingTokenRef.current
            ) {
                setIsSignInModalOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideSignInModal);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutsideSignInModal,
            );
    }, [isSignInModalOpen]);

    // Close info modal if clicked outside
    useEffect(() => {
        const handleClickOutsideInfoModal = (event: MouseEvent) => {
            if (
                isInfoModalOpen &&
                infoModalRef.current &&
                !infoModalRef.current.contains(event.target as Node)
            ) {
                setIsInfoModalOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideInfoModal);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutsideInfoModal,
            );
    }, [isInfoModalOpen]);

    return (
        <>
            <div className="flex justify-between items-center w-full sm:w-3/4 bg-secondary mt-2 px-5 py-3 rounded-lg">
                <div className="flex items-center">
                    <IconButton
                        src="/brain.svg"
                        alt="brain logo"
                        description="Website Logo"
                        buttonText="keep in mind"
                        width={32}
                        height={32}
                        onClick={() => console.log("brain clicked")}
                    />
                    <IconButton
                        src="/info.svg"
                        alt="info"
                        description="Info Icon"
                        className="ml-2"
                        width={20}
                        height={20}
                        onClick={() => {
                            setIsInfoModalOpen(true);
                        }}
                    />
                </div>
                {isSignedIn ? (
                    <div className="relative" ref={dropdownRef}>
                        <IconButton
                            src="/profile.svg"
                            alt="profile"
                            description="Profile Icon"
                            width={32}
                            height={32}
                            onClick={() => toggleDropdown()}
                        />
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-5 w-48 bg-secondary rounded-lg shadow-lg">
                                <ul className="py-2">
                                    <li
                                        className="flex items-center px-4 py-2 hover:bg-primary hover:text-secondary cursor-pointer"
                                        onClick={() => {
                                            console.log("Stats clicked");
                                        }}
                                    >
                                        <img
                                            src="/stats.svg"
                                            alt="Stats"
                                            className="w-5 h-5 mr-2"
                                        />
                                        Stats
                                    </li>
                                    <li
                                        className="flex items-center px-4 py-2 hover:bg-primary hover:text-secondary cursor-pointer"
                                        onClick={() => {
                                            console.log("Profile clicked");
                                        }}
                                    >
                                        <img
                                            src="/person_profile.svg"
                                            alt="Profile"
                                            className="w-5 h-5 mr-2"
                                        />
                                        Profile
                                    </li>
                                    <li
                                        className="flex items-center px-4 py-2 hover:bg-primary hover:text-secondary cursor-pointer"
                                        onClick={() => {
                                            console.log("Settings clicked");
                                        }}
                                    >
                                        <img
                                            src="/gear.svg"
                                            alt="Settings"
                                            className="w-5 h-5 mr-2"
                                        />
                                        Settings
                                    </li>

                                    <li
                                        className="flex items-center px-4 py-2 hover:bg-primary hover:text-secondary cursor-pointer"
                                        onClick={() => {
                                            googleLogout();
                                            onSignOut();
                                            // TODO: Handle sign out logic
                                        }}
                                    >
                                        <img
                                            src="/signout.svg"
                                            alt="Sign Out"
                                            className="w-5 h-5 mr-2"
                                        />
                                        Sign Out
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        className="font-bold bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-secondary hover:text-primary transition-colors duration-200"
                        onClick={() => setIsSignInModalOpen(true)}
                    >
                        Sign In
                    </button>
                )}
            </div>

            {isInfoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div
                        ref={infoModalRef}
                        className="bg-secondary rounded-2xl shadow-xl w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl p-4 sm:p-6 md:p-8 relative"
                    >
                        <div className="flex justify-between items-center border-b border-primary/20 pb-3 mb-4">
                            <h3 className="text-xl text-primary font-bold">
                                kim: keep in memory
                            </h3>
                        </div>

                        <div className="flex flex-col items-center space-y-4 text-sm">
                            <Description includeHeading={false} />
                            <button
                                className="text-sm text-primary hover:underline mt-5"
                                onClick={() => setIsInfoModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isSignInModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div
                        ref={signInModalRef}
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
                                        onSuccess={async (
                                            credentialResponse,
                                        ) => {
                                            setRetrievingToken(true);

                                            const googleJWT =
                                                credentialResponse.credential;
                                            if (!googleJWT) {
                                                console.error(
                                                    "No JWT received",
                                                );
                                                return;
                                            }

                                            let success =
                                                await addTokenToLocalStorage(
                                                    googleJWT,
                                                );

                                            setRetrievingToken(false);

                                            if (!success) {
                                                console.error(
                                                    "Failed to add token to local storage",
                                                );
                                                return;
                                            }

                                            setIsSignInModalOpen(false);
                                            onSignIn();
                                        }}
                                        onError={() => {}}
                                        auto_select={true}
                                    />
                                    <button
                                        className="text-sm text-primary hover:underline mt-5"
                                        onClick={() =>
                                            setIsSignInModalOpen(false)
                                        }
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
