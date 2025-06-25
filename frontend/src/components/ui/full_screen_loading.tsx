import Loading from "./loading_component";

interface FullScreenLoadingProps {
    text?: string;
}

export default function FullScreenLoading({
    text = "Loading",
}: FullScreenLoadingProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-primary">
            <Loading text={text} />
        </div>
    );
}
