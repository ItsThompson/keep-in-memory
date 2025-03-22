import GameOptions from "@/components/ui/game_options";
import Topbar from "@/components/ui/topbar";
import GameArena from "@/components/ui/game_arena";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <Topbar />
      <GameArena />
      <GameOptions />
    </div>
  );
}
