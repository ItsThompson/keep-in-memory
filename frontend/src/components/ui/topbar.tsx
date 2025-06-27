import { useEffect, useRef, useState } from "react";
import IconButton from "./icon_button";
import { googleLogout } from "@react-oauth/google";
import Description from "./description";
import Link from "next/link";
import { useAuth } from "../authContext";
import SignInModal from "./sign_in_modal";
import { logout } from "@/api/auth";
import { useRouter } from "next/navigation";

interface TopbarProps {
    isSignedIn: boolean;
}

export default function Topbar({ isSignedIn = false }: TopbarProps) {
    const { setToken } = useAuth();
    const router = useRouter();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const infoModalRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown if clicked outside or if escape is pressed
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isDropdownOpen) {
                setIsDropdownOpen(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isDropdownOpen]);

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
                        onClick={() => setIsInfoModalOpen(true)}
                    />
                </div>
                {isSignedIn ? (
                    <div className="flex items-end justify-center">
                        <IconButton
                            src="/profile.svg"
                            alt="profile"
                            description="Profile Icon"
                            width={32}
                            height={32}
                            onClick={toggleDropdown}
                        />
                        <div className="relative" ref={dropdownRef}>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-5 w-48 bg-secondary rounded-lg shadow-lg">
                                    <ul className="py-2">
                                        <li
                                            className="flex items-center px-4 py-2 hover:bg-primary hover:text-secondary cursor-pointer"
                                            onClick={() =>
                                                router.push("/stats")
                                            }
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
                                                googleLogout();
                                                setToken(null);
                                                logout();
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
                            <div className="flex flex-row justify-center items-center space-x-4 mt-2">
                                <Link
                                    className="text-sm text-primary hover:underline"
                                    href="/privacy"
                                >
                                    Privacy Policy
                                </Link>
                                <Link
                                    className="text-sm text-primary hover:underline"
                                    href="/terms"
                                >
                                    Terms of Service
                                </Link>
                            </div>
                            <button
                                className="p-2 rounded-lg text-center hover:scale-110 hover:bg-primary hover:text-secondary transition ease-in-out delay-50 duration-150"
                                onClick={() => setIsInfoModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SignInModal
                open={isSignInModalOpen}
                onClose={() => setIsSignInModalOpen(false)}
            />
        </>
    );
}
