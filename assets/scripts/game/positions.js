import NPC from "./actors/NPC";
import { Game } from "./Game";

export const moveCharacters = data => {
  const goto = data;
  const x = goto.x;
  const y = goto.y;
  const user = Game.users.find(i => {
    return i.id == goto.user_id;
  });

  if (Game.me.id == user.id) {
    return false;
  }

  if (!Game.population.has(user.id)) {
    Game.population.set(user.id, new NPC(user));
  }

  // Set the new destination
  Game.population.get(user.id).setPathTo(x, y);
};
