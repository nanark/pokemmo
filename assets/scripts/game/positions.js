import NPC from "./actors/NPC";
import { Game } from "./Game";

export const moveCharacters = data => {
  const goto = data;
  const x = goto.x;
  const y = goto.y;

  // const user = Game.users.find(i => {
  //   return i.uuid == goto.user_id;
  // });

  const user = {
    uuid: data.uuid,
    username: "test",
    position: {
      x,
      y
    }
  };

  if (Game.me.uuid == user.uuid) {
    return false;
  }

  console.log(user);

  if (!Game.population.has(user.uuid)) {
    Game.population.set(user.uuid, new NPC(user));
  }

  // Set the new destination
  Game.population.get(user.uuid).setPathTo(x, y);
};
