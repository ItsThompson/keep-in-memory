import GameOptions from "@/components/ui/game_options";
import Topbar from "@/components/ui/topbar";

export default function Home() {
  return (
    <div>
      <Topbar />
      <p className="text-primary">Home</p>
      <GameOptions />
    </div>
  );
}
