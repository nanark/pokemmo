import { Game } from "./Game";
import { pixelToTile, tileToPixel } from "./utils";
import { detectObstacle } from "./levels";

const targetTile = event => {
  // Shortcut
  const viewport = Game.display.viewport;
  const cursorContainer = Game.display.cursorContainer;

  const mouseX = event.data.global.x + Math.abs(viewport.position.x);
  const mouseY = event.data.global.y + Math.abs(viewport.position.y);

  const tileX = Math.ceil(pixelToTile(mouseX)) - 1;
  const tileY = Math.ceil(pixelToTile(mouseY)) - 1;

  const isObstacle = detectObstacle(tileX, tileY);

  cursorContainer.removeChild(Game.cursor);

  if (!isObstacle) {
    Game.cursor.x = tileToPixel(tileX);
    Game.cursor.y = tileToPixel(tileY);
    cursorContainer.addChild(Game.cursor);
  }

  return { tileX, tileY, isObstacle };
};

export const setPlayerEventsHandler = () => {
  // Shortcut
  const mapContainer = Game.display.mapContainer;

  //===========================================================================
  // Hover the map:
  //===========================================================================
  mapContainer.mousemove = mapContainer.touchmove = event => {
    targetTile(event);
  };

  //===========================================================================
  // Click the map:
  //===========================================================================
  mapContainer.mousedown = mapContainer.touchmove = event => {
    const { tileX, tileY, isObstacle } = targetTile(event);
    const cursorContainer = Game.display.cursorContainer;
    const _player = Game.display.player;

    // Construct the path
    _player.setPathTo(tileX, tileY);

    // Placing the cursor
    cursorContainer.removeChild(Game.cursorClick);

    if (!isObstacle) {
      Game.cursorClick.x = tileToPixel(tileX);
      Game.cursorClick.y = tileToPixel(tileY);
      cursorContainer.addChild(Game.cursorClick);

      // Follow the player while moving
      Game.display.viewport.plugins.resume("follow");
    }
  };
};
