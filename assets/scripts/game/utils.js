import { Game } from "./Game";
import isMobileLib from "ismobilejs";

export const pixelToTile = value => {
  return value / Game.tileScale / Game.tileSize;
};

export const tileToPixel = value => {
  return value * Game.tileScale * Game.tileSize;
};

export const displayMode = () => {
  const userAgent = navigator.userAgent;
  const isMobile = isMobileLib(userAgent).any;
  const isLandscape = window.height > window.width ? true : false;

  return { isMobile, isLandscape };
};
