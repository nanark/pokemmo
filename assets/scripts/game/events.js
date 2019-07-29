import { Game } from "./Game";
import { pixelToTile, tileToPixel } from "./utils";
import { detectObstacle } from "./levels";

// Catch the mouse event and convert the position into a tile
// and obstacle bool
const targetTile = event => {
  const _viewportPosition = Game.display.viewport.position;
  const _cursorContainer = Game.display.cursorContainer;
  const _cursor = Game.display.cursor;

  const data = event.data.global;
  const mouseX = data.x - _viewportPosition.x;
  const mouseY = data.y - _viewportPosition.y;

  const tileX = Math.ceil(pixelToTile(mouseX)) - 1;
  const tileY = Math.ceil(pixelToTile(mouseY)) - 1;

  const isObstacle = detectObstacle(tileX, tileY);

  // Handle the cursor
  _cursorContainer.removeChild(_cursor);

  if (!isObstacle) {
    _cursor.x = tileToPixel(tileX) - Game.tileDistance / 2;
    _cursor.y = tileToPixel(tileY) - Game.tileDistance / 2;
    _cursorContainer.addChild(_cursor);
  }

  return { tileX, tileY, isObstacle };
};

export const handlePlayerEvents = () => {
  // Shortcut
  const _map = Game.display.mapContainer;

  //===========================================================================
  // Hover the map:
  //===========================================================================
  _map.mousemove = _map.touchmove = event => {
    targetTile(event);
  };

  //===========================================================================
  // Click the map:
  //===========================================================================
  _map.mousedown = _map.tap = event => {
    const { tileX, tileY, isObstacle } = targetTile(event);
    const _cursorContainer = Game.display.cursorContainer;
    const _cursor = Game.display.cursorClick;
    const _player = Game.display.player;

    // Move the player
    _player.move(tileX, tileY);

    // Handle the cursor
    _cursorContainer.removeChild(_cursor);

    if (!isObstacle) {
      _cursor.x = tileToPixel(tileX) - Game.tileDistance / 2;
      _cursor.y = tileToPixel(tileY) - Game.tileDistance / 2;
      _cursorContainer.addChild(_cursor);
    }
  };
};
