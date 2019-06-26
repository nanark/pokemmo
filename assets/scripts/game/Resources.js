import * as PIXI from "pixi.js";
import { Game } from "@/assets/scripts/game/Game";

const gameLoop = () => {
  Game.player.sprite.x += Game.player.sprite.vx;
  Game.player.sprite.y += Game.player.sprite.vy;
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
