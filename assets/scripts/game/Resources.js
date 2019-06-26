import * as PIXI from "pixi.js";
import { Game } from "@/assets/scripts/game/Game";

let tickerTime = 0;

const gameLoop = () => {
  tickerTime += 1 + Game.display.app.ticker.deltaMS;

  if (tickerTime > 1000) {
    tickerTime = 0;
    Game.ws.send(
      JSON.stringify({
        namespace: "position",
        event_type: "message",
        data: { x: Game.player.sprite.x, y: Game.player.sprite.y }
      })
    );
  }
  Game.player.sprite.x += Game.player.sprite.vx;
  Game.player.sprite.y += Game.player.sprite.vy;

  // {"namespace": "test","event_type": "message","data": {"message": "😂 Lol c'est super drôle ma gueule !"}}
};

export default function loadResources() {
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

    Game.setup();

    Game.display.app.ticker.add(() => gameLoop());
  });
}
