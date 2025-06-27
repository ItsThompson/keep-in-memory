"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
    initialValue?: number;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
}

export default function Counter({
    initialValue = 1,
    min = 0,
    max = 100,
    step = 1,
    onChange,
}: CounterProps) {
    const [count, setCount] = useState<number>(initialValue);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>(count.toString());
    const firstRender = useRef(true);

    useEffect(() => {
        if (initialValue < min || initialValue > max) {
            setCount(Math.min(Math.max(initialValue, min), max));
        }
        if (step <= 0) {
            console.warn("Step must be greater than 0. Defaulting to 1.");
            step = 1; // Ensure step is always positive
        }
    }, [initialValue, min, max, step]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (onChange) {
            onChange(count);
        }
    }, [count]);

    const handleIncrement = (): void => {
        setCount((prev) => {
            const newValue = Math.min(prev + step, max);
            return newValue;
        });
    };

    const handleDecrement = (): void => {
        setCount((prev) => {
            const newValue = Math.max(prev - step, min);
            return newValue;
        });
    };

    const handleNumberClick = (): void => {
        setIsEditing(true);
        setInputValue(count.toString());
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
    ): void => {
        if (e.key === "Enter") {
            handleInputSubmit();
        } else if (e.key === "Escape") {
            handleInputCancel();
        }
    };

    const handleInputBlur = (): void => {
        handleInputSubmit();
    };

    const handleInputSubmit = (): void => {
        const newValue = parseInt(inputValue, 10);

        // Check if the input is a valid number and within range
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            setCount(newValue);
        } else {
            // Reset to previous value if invalid
            setInputValue(count.toString());
        }

        setIsEditing(false);
    };

    const handleInputCancel = (): void => {
        setInputValue(count.toString());
        setIsEditing(false);
    };

    const counterClass =
        "w-8 h-8 bg-primary text-secondary text-lg font-semibold rounded-xl";

    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <p className="text-primary font-bold mr-0 sm:mr-4">items</p>
            <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleDecrement}
                        disabled={count <= min}
                        className="w-4 h-4 flex items-center justify-center text-primary text-2xl font-normal hover:text-secondary disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        −
                    </button>

                    {/* Counter Display */}
                    <div className="relative">
                        {isEditing ? (
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                onBlur={handleInputBlur}
                                className={`${counterClass} text-center border-none outline-none shadow-lg`}
                                autoFocus
                            />
                        ) : (
                            <button
                                onClick={handleNumberClick}
                                className={`${counterClass} hover:text-primary hover:bg-secondary shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-secondary`}
                            >
                                {count}
                            </button>
                        )}
                    </div>

                    {/* Increment Button */}
                    <button
                        onClick={handleIncrement}
                        disabled={count >= max}
                        className="w-4 h-4 flex items-center justify-center text-primary text-2xl font-normal hover:text-secondary disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}
