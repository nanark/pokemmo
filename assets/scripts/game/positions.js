import NPC from "./actors/NPC";
import { Game } from "./Game";
import { getUser } from "./db";

export const moveCharacters = async data => {
  const goto = data;
  const x = goto.x;
  const y = goto.y;

  const response = await getUser(data.uuid);

  const user = response.data;

  if (Game.me.uuid == user.uuid) {
    return false;
  }

  if (!Game.population.has(user.uuid)) {
    Game.population.set(user.uuid, new NPC(user));
  }

  // Set the new destination
  Game.population.get(user.uuid).setPathTo(x, y);
};
