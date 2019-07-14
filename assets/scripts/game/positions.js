import NPC from "@/assets/scripts/game/actors/NPC";
import { Game } from "@/assets/scripts/game/Game";
import { logIt } from "@/assets/scripts/game/utils";

export const moveCharacters = data => {
  const goto = data;
  const x = goto.x;
  const y = goto.y;
  const user = Game.users.find(i => {
    return i.id == goto.user_id;
  });

  if (Game.user.id == user.id) {
    return false;
  }

  if (!Game.population.has(user.id)) {
    logIt("Generate a new NPC:" + user.username);
    Game.population.set(user.id, new NPC(user));
  }

  // Set the new destination
  Game.population.get(user.id).setPathTo(x, y);
};
