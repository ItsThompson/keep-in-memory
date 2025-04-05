import Image from "next/image";

interface RemainingTimeProps {
    expiringTime: Date;
}

export default function RemainingTime({ expiringTime }: RemainingTimeProps) {
    let remainingTime = expiringTime.getTime() - Date.now();
    let hours = Math.floor(remainingTime / (60 * 60 * 1000));
    let minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / 60000);
    let seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

    let text = "";
    if (hours > 0) {
        text = `${hours} hours`;
    } else if (minutes > 0) {
        text = `${minutes} minutes`;
    } else if (seconds > 0) {
        text = `${seconds} seconds`;
    }

    return (
        <div className="flex flex-col gap-y-2 items-center rounded-lg bg-primary text-secondary font-bold p-2 m-2">
            <Image
                src="/lock.svg"
                alt="lock symbol"
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
            />
            <div className="flex flex-col items-center">
                <p>unlocks in</p>
                <p>{text}</p>
            </div>
            <button
                className="bg-black text-white"
                onClick={() => {
                    // SKIPS LOCK
                    const time = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    localStorage.setItem("expiryTime", time.toString());
                    window.location.reload()
                }}
            >
                DEV BUTTON
            </button>
        </div>
    );
}
