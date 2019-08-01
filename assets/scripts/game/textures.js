import * as PIXI from "pixi.js";
import { Game } from "./Game";

const _texturesCache = [];

// Return a PIXI.Texture for a tile.
// Create a new one or use cache for similar.
export const getTexture = tile => {
  const $tileSize = Game.tileSize;
  const ref = _textureRef(tile);

  if (!_texturesCache[ref]) {
    const resource = PIXI.Loader.shared.resources[tile.tileset].texture;
    const texture = new PIXI.Texture(
      resource,
      new PIXI.Rectangle(
        tile.x * $tileSize,
        tile.y * $tileSize,
        $tileSize,
        $tileSize
      )
    );

    _texturesCache[ref] = texture;
  }

  return _texturesCache[ref];
};

const _textureRef = tile => `${tile.x}_${tile.y}_${tile.tileset}`;
