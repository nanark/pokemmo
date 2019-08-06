import * as PIXI from "pixi.js";
import { Game } from "./Game";
import { pixelToTile, tileToPixel } from "./utils";
import { isObstacle } from "./maps";

//=============================================================================
// Handle the cursors and their behavior
//
// cursor(): Create a cursor
// handleCursorEvents(): Cursor behavior management
//=============================================================================

const _colorYellow = 0xffff0b;
const _colorBlueDenim = 0x1857c3;

// Create a cursor
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
    case "go":
      cursor.lineStyle(3, _colorBlueDenim, 0.5);
      cursor.drawRoundedRect(0, 0, $tilePixelSize, $tilePixelSize, 15);
      break;
    default:
      break;
  }

  return cursor;
};

// Handle cursor events
export const handleCursorEvents = () => {
  const $map = Game.display.mapContainer;

  // Hover the map
  $map.mousemove = $map.touchmove = event => _targetTile(event);

  // Click the map
  $map.mousedown = $map.tap = event => {
    const $cursorGo = Game.display.cursorGo;
    const $player = Game.display.player;

    // Set the pathfinded flag to the player
    $player.pathfinded = true;

    const { tileX, tileY, isWalkable } = _targetTile(event);

    if (!isWalkable) return;

    // Move the player
    $player.move(tileX, tileY);

    // Cursor behaviour
    _removeCursor($cursorGo);
    _addCursor($cursorGo, tileX, tileY);
  };

  // Leave the map
  $map.mouseout = () => {
    const $cursorHover = Game.display.cursorHover;

    // Remove the cursor
    _removeCursor($cursorHover);
  };
};

// Add a cursor on the cursorContainer
const _addCursor = (cursor, x, y) => {
  const $cursorContainer = Game.display.cursorContainer;

  const convertPosition = value => tileToPixel(value) - Game.tileDistance / 2;

  cursor.x = convertPosition(x);
  cursor.y = convertPosition(y);

  $cursorContainer.addChild(cursor);
};

// Remove a cursor of the cursorContainer
const _removeCursor = cursor => {
  const $cursorContainer = Game.display.cursorContainer;

  $cursorContainer.removeChild(cursor);
};

// Catch the mouse event and convert the position into a tile
// and obstacle bool
const _targetTile = event => {
  const $viewportPosition = Game.display.viewport.position;
  const $cursorHover = Game.display.cursorHover;

  const data = event.data.global;
  const mouseX = data.x - $viewportPosition.x;
  const mouseY = data.y - $viewportPosition.y;

  const tileX = Math.ceil(pixelToTile(mouseX)) - 1;
  const tileY = Math.ceil(pixelToTile(mouseY)) - 1;

  // Remove the cursor hover
  _removeCursor($cursorHover);

  // Add a cursor hover
  const isWalkable = !isObstacle(tileX, tileY);
  if (isWalkable) _addCursor($cursorHover, tileX, tileY);

  return { tileX, tileY, isWalkable };
};
