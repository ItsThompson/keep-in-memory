"use client";

import { useState } from "react";

interface GameOptionsProps {
    items: string[];
    defaultSelectedIndex: number;
    className?: string;
    updatedTabIndex?: (index: number) => void;
}

export default function GameOptionTabs({
    items,
    defaultSelectedIndex,
    className = "",
    updatedTabIndex,
}: GameOptionsProps) {
    const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);

    function handleSelectedIndex(index: number) {
        if (selectedIndex === index) return;

        setSelectedIndex(index);
        if (updatedTabIndex !== undefined) {
            updatedTabIndex(index);
        }
    }

    return (
        <div
            className={`flex flex-wrap items-center justify-center gap-8 ${className}`}
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    className={`font-bold hover:cursor-pointer text-sm
                    ${selectedIndex === index ? "text-primary" : "text-white"}`}
                    onClick={() => handleSelectedIndex(index)}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}
