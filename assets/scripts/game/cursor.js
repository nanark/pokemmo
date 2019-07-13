import * as PIXI from "pixi.js";
import { Game } from "@/assets/scripts/game/Game";

const colorYellow = 0xffff0b;
const colorBlueDenim = 0x1857c3;

export const cursor = mode => {
  const tilePixelSize = Game.tileSize * Game.tileScale;

  const cursor = new PIXI.Graphics();

  switch (mode) {
    case "hover":
      cursor.lineStyle(0);
      cursor.beginFill(colorYellow, 0.2);
      cursor.drawRoundedRect(0, 0, tilePixelSize, tilePixelSize, 15);
      cursor.endFill();
      break;
    case "click":
      cursor.lineStyle(3, colorBlueDenim, 0.5);
      cursor.drawRoundedRect(0, 0, tilePixelSize, tilePixelSize, 15);
      cursor.endFill();
      break;
    default:
      break;
  }

  return cursor;
};
