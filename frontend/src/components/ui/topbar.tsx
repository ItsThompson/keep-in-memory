"use client";

import IconButton from "./icon_button";

export default function Topbar() {
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
                <div>
                    <IconButton
                        src="/profile.svg"
                        alt="profile"
                        description="Profile Icon"
                        width={32}
                        height={32}
                        onClick={() => console.log("profile clicked")}
                    />
                </div>
            </div>
        </div>
    );
}
