import * as PIXI from "pixi.js";
import { Game } from "./Game";

const _colorYellow = 0xffff0b;
const _colorBlueDenim = 0x1857c3;

export const cursor = mode => {
  const $tilePixelSize = Game.tileDistance;
  const cursor = new PIXI.Graphics();

  switch (mode) {
    case "hover":
      cursor.lineStyle(0);
      cursor.beginFill(_colorYellow, 0.2);
      cursor.drawRoundedRect(0, 0, $tilePixelSize, $tilePixelSize, 15);
      cursor.endFill();
      break;
    case "click":
      cursor.lineStyle(3, _colorBlueDenim, 0.5);
      cursor.drawRoundedRect(0, 0, $tilePixelSize, $tilePixelSize, 15);
      break;
    default:
      break;
  }

  return cursor;
};
