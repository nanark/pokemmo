import { isEqual } from "lodash";
import * as PIXI from "pixi.js";
import { Game } from "@/assets/scripts/game/Game";

let tickerTime = 0;
let previousPosition = [0, 0];

// Send the player position if he moved
const sendPosition = () => {
  const currentPosition = [Game.player.sprite.x, Game.player.sprite.y];

  if (isEqual(previousPosition, currentPosition)) {
    return false;
  }

  previousPosition = currentPosition;

  const position = {
    namespace: "position",
    event_type: "movement",
    data: {
      x: ~~Game.player.sprite.x,
      y: ~~Game.player.sprite.y,
      animation: Game.player.animation
    }
  };

  // Sending via websocket
  Game.ws.send(JSON.stringify(position));
};

const gameLoop = delta => {
  tickerTime += 1 + delta;

  if (Game.debugMode) {
    console.log(`Delta: ${delta}`);
  }

  // Every 1/100s
  if (tickerTime > 10) {
    tickerTime = 0;

    // Send the player position if he moved
    if (Game.online) {
      sendPosition();
    }
  }

  // Moving the player on screen
  const _vx = Game.player.sprite.vx;
  const _vy = Game.player.sprite.vy;
  Game.player.sprite.x += _vx;
  Game.player.sprite.y += _vy;
};

// Loading all resources and add the gameloop in the ticker.
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

    // Setup the game (load player etc.)
    Game.setup();

    // Add a ticker
    Game.display.app.ticker.add(delta => gameLoop(delta));
  });
}
