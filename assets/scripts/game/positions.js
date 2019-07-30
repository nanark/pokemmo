import NPC from "./actors/NPC";
import { Game } from "./Game";
import { getUser } from "./db";

export const moveCharacters = async data => {
  const $population = Game.population;
  const $me = Game.display.me;

  const goto = data;
  const x = goto.x;
  const y = goto.y;

  const response = await getUser(data.uuid);

  const user = response.data;

  if ($me.uuid == user.uuid) {
    return false;
  }

  if (!$population.has(user.uuid)) {
    $population.set(user.uuid, new NPC(user));
  }

  // Set the new destination
  $population.get(user.uuid).setPathTo(x, y);
};
