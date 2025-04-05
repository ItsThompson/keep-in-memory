import { useEffect, useReducer, useRef, useState } from "react";
import Image from "next/image";

interface RecallListProps {
    onSubmitItems: (items: string[]) => void;
}

const reducer = (state: string[], newItem: string) => {
    return [...state, newItem];
};

export default function RecallList({ onSubmitItems }: RecallListProps) {
    const [items, dispatch] = useReducer(reducer, []);
    const inputRef = useRef<HTMLInputElement>(null);
    const [itemText, setItemText] = useState("");

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // TODO: Any additional input validation
        e.preventDefault();
        let text = itemText.trim();
        let itemSet = new Set(items);

        if (!text || itemSet.has(text)) {
            // TODO; animation on input element (maybe like a shake or smth)
            return;
        }

        dispatch(itemText);
        setItemText("");
        inputRef.current?.focus();
    };
    return (
        <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col">
                <div className="m-2 p-2 rounded bg-primary text-secondary font-bold">
                    <p>List the items you remember!</p>
                </div>
                <form
                    className="my-2 mx-4 flex items-center gap-2 bg-white text-black p-3 rounded"
                    onSubmit={handleSubmit}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={itemText}
                        onChange={(e) => setItemText(e.target.value)}
                        placeholder="Enter an item..."
                        className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        className="p-2 rounded-md hover:opacity-80"
                        type="submit"
                    >
                        <Image
                            src="/reset.svg"
                            alt="Add Item Button"
                            width={32}
                            height={32}
                        />
                    </button>
                </form>
                <div className="max-h-[70vh] overflow-auto">
                    {items.length > 0 && (
                        <ul className="my-2 mx-6 flex flex-col space-y-2">
                            {items.map((item, index) => (
                                <li
                                    key={index}
                                    className="p-2 rounded bg-white text-black"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="my-2 flex items-center justify-center">
                <button
                    className="bg-primary text-secondary p-2 font-bold rounded-lg"
                    onClick={() => onSubmitItems(items)}
                >
                    Done
                </button>
            </div>
        </div>
    );
}
