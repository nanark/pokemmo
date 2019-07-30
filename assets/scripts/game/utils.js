import { Game } from "./Game";
import { isMobile } from "ismobilejs";

// Convert pixel to tile size
export const pixelToTile = pixelsCount => {
  return pixelsCount / Game.tileScale / Game.tileSize;
};

// Convert tile to pixel size
export const tileToPixel = tilesCount => {
  return tilesCount * Game.tileScale * Game.tileSize;
};

// Return display object:
// * isMobile: boolean
// * isLandscape: boolean
export const displayMode = () => {
  const userAgent = navigator.userAgent;
  const isLandscape = [0, 180].includes(window.orientation) ? false : true;

  return { isMobile: isMobile(userAgent).any, isLandscape };
};

// Random number with min and max
export const random = (min, max) => {
  return Math.random() * (+max - +min) + +min;
};
