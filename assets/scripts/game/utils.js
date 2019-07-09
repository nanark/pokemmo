import { Game } from "@/assets/scripts/game/Game";

export const pixelToTile = value => {
  return value / Game.tileScale / Game.tileSize;
};

export const tileToPixel = value => {
  return value * Game.tileScale * Game.tileSize;
};
