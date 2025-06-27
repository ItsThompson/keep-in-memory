"use client";

import { useState } from "react";

interface GameOptionsProps {
    items: string[];
    disabled_items?: string[];
    defaultSelectedIndex: number;
    className?: string;
    updatedTabIndex?: (index: number) => void;
}

export default function GameOptionTabs({
    items,
    disabled_items = [],
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
                    className={`
        font-bold text-sm
        ${disabled_items.includes(item) ? "text-gray-500 line-through cursor-not-allowed" : selectedIndex === index ? "text-primary" : "text-white"}
        ${disabled_items.includes(item) ? "" : "hover:cursor-pointer"}
    `}
                    disabled={disabled_items.includes(item)}
                    onClick={() => handleSelectedIndex(index)}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}
