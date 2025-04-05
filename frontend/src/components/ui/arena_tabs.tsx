"use client";

import { useState } from "react";

interface GameOptionsProps {
    items: string[];
    defaultSelectedIndex: number;
    className?: string;
    updatedTabIndex?: (index: number) => void;
}

export default function ArenaTabs({
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
            className={`w-full sm:w-3/4 flex flex-wrap items-center justify-around gap-2 m-2 p-2 bg-secondary rounded-lg ${className}`}
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    className={`flex-1 font-bold hover:cursor-pointer p-1
                    ${selectedIndex === index ? "text-black bg-primary rounded" : "text-white"}`}
                    onClick={() => handleSelectedIndex(index)}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}
