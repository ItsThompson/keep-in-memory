"use client";

import Tabs from "./tabs";

export default function GameOptions() {
    return (
        <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center sm:justify-between w-full sm:w-3/4 bg-secondary rounded-lg px-5 py-2 gap-2 sm:gap-5">
                <Tabs
                    items={["remove one", "recall all"]}
                    defaultSelectedIndex={1}
                    className="ml-8"
                />
                <span className="text-white font-bold">|</span>
                <Tabs
                    items={[
                        "colors & shapes",
                        "locations",
                        "items",
                        "license plate",
                    ]}
                    defaultSelectedIndex={2}
                />
                <span className="text-white font-bold">|</span>
                <Tabs
                    items={["06", "12", "24", "48"]}
                    defaultSelectedIndex={2}
                    className="mr-8"
                />
            </div>
        </div>
    );
}
