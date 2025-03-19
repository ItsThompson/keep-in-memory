"use client";

import { useEffect, useRef, useState } from "react";
import IconButton from "./icon_button";

export default function Topbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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

    return (
        <div className="flex justify-center mt-5">
            <div className="flex justify-between items-center w-full sm:w-3/4 bg-secondary px-5 py-3 rounded-lg">
                <div className="flex items-center">
                    <IconButton
                        src="/brain.svg"
                        alt="brain logo"
                        description="Website Logo"
                        className="mr-2"
                        width={32}
                        height={32}
                        onClick={() => console.log("brain clicked")}
                    />

                    <span className="font-bold text-primary">keep in mind</span>
                    <IconButton
                        src="/info.svg"
                        alt="info"
                        description="Info Icon"
                        className="ml-2"
                        width={20}
                        height={20}
                        onClick={() => console.log("info clicked")}
                    />
                </div>
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
                                {[
                                    { icon: "/stats.svg", label: "Stats" },
                                    {
                                        icon: "/person_profile.svg",
                                        label: "Profile",
                                    },
                                    { icon: "/gear.svg", label: "Settings" },
                                    { icon: "/signout.svg", label: "Sign Out" },
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center px-4 py-2 hover:bg-primary hover:text-secondary cursor-pointer"
                                        onClick={() =>
                                            console.log(`${item.label} clicked`)
                                        }
                                    >
                                        <img
                                            src={item.icon}
                                            alt={item.label}
                                            className="w-5 h-5 mr-2"
                                        />
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
