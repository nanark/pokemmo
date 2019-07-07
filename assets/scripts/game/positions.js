import { Game } from "@/assets/scripts/game/Game";
import NPC from "@/assets/scripts/game/actors/NPC";

// let oldX = 0;
// let oldY = 0;
let oldNow = 0;

export const moveCharacters = positions => {
  positions.data.forEach(position => {
    const now = Date.now();
    const diff = now - oldNow;
    if (diff > 40) {
      console.log(now - oldNow);
    }
    oldNow = now;

    const x = position.x;
    const y = position.y;
    const userId = position.user.id;
    const username = position.user.username;
    const animation = position.animation || "walk-down";

    if (Game.userId == userId) {
      return false;
    }

    // if (Math.abs(oldX - x) > 7) {
    //   console.log(`Hey issue X ${Math.abs(oldX - x)}`);
    // }

    // if (Math.abs(oldY - y) > 7) {
    //   console.log(`Hey issue Y ${Math.abs(oldY - y)}`);
    // }

    // oldX = x;
    // oldY = y;

    if (!Game.population[userId]) {
      Game.logIt("Generate a new NPC:" + username);
      Game.population[userId] = new NPC(userId, username);
    }

    Game.population[userId].setPosition(x, y);
    Game.population[userId].setAnimation(animation);
  });
};
