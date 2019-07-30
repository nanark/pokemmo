import * as PIXI from "pixi.js";
import { Game } from "./Game";
import { pixelToTile, tileToPixel } from "./utils";
import { isObstacle } from "./levels";

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

export const handleCursorEvents = () => {
  const $map = Game.display.mapContainer;

  // Hover the map:
  $map.mousemove = $map.touchmove = event => {
    _targetTile(event);
  };

  // Click the map:
  $map.mousedown = $map.tap = event => {
    const $cursorContainer = Game.display.cursorContainer;
    const $cursor = Game.display.cursorClick;
    const $player = Game.display.player;

    const { tileX, tileY, isObstacle } = _targetTile(event);

    // Move the player
    $player.move(tileX, tileY);

    // Handle the cursor
    $cursorContainer.removeChild($cursor);

    if (!isObstacle) {
      $cursor.x = tileToPixel(tileX) - Game.tileDistance / 2;
      $cursor.y = tileToPixel(tileY) - Game.tileDistance / 2;
      $cursorContainer.addChild($cursor);
    }
  };
};

// Catch the mouse event and convert the position into a tile
// and obstacle bool
const _targetTile = event => {
  const $viewportPosition = Game.display.viewport.position;
  const $cursorContainer = Game.display.cursorContainer;
  const $cursor = Game.display.cursor;

  const data = event.data.global;
  const mouseX = data.x - $viewportPosition.x;
  const mouseY = data.y - $viewportPosition.y;

  const tileX = Math.ceil(pixelToTile(mouseX)) - 1;
  const tileY = Math.ceil(pixelToTile(mouseY)) - 1;

  // Handle the cursor
  $cursorContainer.removeChild($cursor);

  if (!isObstacle(tileX, tileY)) {
    $cursor.x = tileToPixel(tileX) - Game.tileDistance / 2;
    $cursor.y = tileToPixel(tileY) - Game.tileDistance / 2;
    $cursorContainer.addChild($cursor);
  }

  return { tileX, tileY, isObstacle };
};
