interface DescriptionProps {
    includeHeading?: boolean;
    children?: React.ReactNode;
}

export default function Description({
    includeHeading = true,
    children,
}: DescriptionProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            {includeHeading && (
                <h1 className="text-primary text-3xl font-bold mb-4">
                    kim: keep in memory
                </h1>
            )}
            <p className="text-lg text-center font-semibold max-w-2xl mb-6">
                kim is a game that challenges your short-term memory through
                observation and recall. You will be shown a number of items, and
                your task is to remember as many as possible.
            </p>
            <p className="text-lg text-center font-semibold max-w-2xl">
                The game is designed to improve your memory skills while
                providing a fun and engaging experience. Are you ready to test
                your memory?
            </p>
            {children && (
                <div className="mt-6">
                    {children}
                </div>
            )}
        </div>
    );
}
