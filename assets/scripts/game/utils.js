import { Game } from "./Game";
import { isMobile } from "ismobilejs";

export const pixelToTile = value => {
  return value / Game.tileScale / Game.tileSize;
};

export const tileToPixel = value => {
  return value * Game.tileScale * Game.tileSize;
};

export const displayMode = () => {
  const userAgent = navigator.userAgent;
  const isLandscape = [0, 180].includes(window.orientation) ? false : true;

  return { isMobile: isMobile(userAgent).any, isLandscape };
};

export const random = (min, max) => {
  return Math.random() * (+max - +min) + +min;
};
