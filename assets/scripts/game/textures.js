import * as PIXI from "pixi.js";
import { Game } from "./Game";

const texturesCache = [];

const textureRef = tile => {
  return `${tile.x}_${tile.y}_${tile.tileset}`;
};

export const getTexture = tile => {
  const ref = textureRef(tile);

  if (!texturesCache[ref]) {
    const resource = PIXI.Loader.shared.resources[tile.tileset].texture;

    texturesCache[ref] = new PIXI.Texture(
      resource,
      new PIXI.Rectangle(
        tile.x * Game.tileSize,
        tile.y * Game.tileSize,
        Game.tileSize,
        Game.tileSize
      )
    );
  }

  return texturesCache[ref];
};
