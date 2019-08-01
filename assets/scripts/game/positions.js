import NPC from "./actors/NPC";
import { Game } from "./Game";
import { getUser } from "./db";

export const moveCharacters = async data => {
  const $population = Game.population;
  const $me = Game.display.me;

  const goto = data;
  const x = goto.x;
  const y = goto.y;

  // If the user is me, break
  if ($me.uuid == data.uuid) return;

  // Fetch data only once
  let user = $population.get(data.uuid);
  if (!user) {
    const response = await getUser(data.uuid);
    $population.set(data.uuid, new NPC(response.data));
  }

  // Set the new destination
  $population.get(data.uuid).setPathTo(x, y);
};
