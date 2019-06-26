import { isEqual } from "lodash";
import * as PIXI from "pixi.js";
import { Game } from "@/assets/scripts/game/Game";

let tickerTime = 0;
let previousPosition = [0, 0];

const sendPosition = () => {
  const currentPosition = [Game.player.sprite.x, Game.player.sprite.y];

  if (!isEqual(previousPosition, currentPosition)) {
    previousPosition = currentPosition;

    Game.ws.send(
      JSON.stringify({
        namespace: "position",
        event_type: "message",
        data: {
          x: Game.player.sprite.x,
          y: Game.player.sprite.y,
          animation: Game.player.animation
        }
      })
    );
  }
};

const gameLoop = () => {
  tickerTime += 1 + Game.display.app.ticker.deltaMS;

  if (tickerTime > 10) {
    tickerTime = 0;
    sendPosition();
  }
  Game.player.sprite.x += Game.player.sprite.vx;
  Game.player.sprite.y += Game.player.sprite.vy;
};

export function loadResources() {
  const characters = {
    name: "character",
    url: "packs/character.json",
    onComplete() {
      Game.logIt("Character loaded.");
    }
  };

  // Reset all cache and shared sprites resources
  // Avoid error and warnings during hot reload.
  PIXI.Loader.shared.reset();
  PIXI.utils.clearTextureCache();

  // Loading required assets
  PIXI.Loader.shared.add(characters).load(() => {
    Game.logIt("Assets loaded.");
    Game.loaded = true;

    Game.setup();

    Game.display.app.ticker.add(() => gameLoop());
  });
}
