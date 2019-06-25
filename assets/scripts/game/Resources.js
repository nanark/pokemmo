import * as PIXI from "pixi.js";

export default function loadResources(callback) {
  const characters = {
    name: "character",
    url: "character.json"
  };

  // Reset all cache and shared sprites resources
  // Avoid error and warnings during hot reload.
  PIXI.Loader.shared.reset();
  PIXI.utils.clearTextureCache();

  // Loading required assets
  PIXI.Loader.shared.add(characters).load(() => {
    callback();
  });
}
