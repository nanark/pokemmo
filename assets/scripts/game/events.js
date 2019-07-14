import { Game } from "./Game";
import { pixelToTile, tileToPixel } from "./utils";
import { pace } from "./loop";
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

    //=========================================================================
    // Moving the player, Pathfinding:
    //=========================================================================
    // Clone the grid so you can use it later
    // Pathfinding destroys it afer use
    const gridClone = Game.pathGrid.clone();

    // Fetch the next tile if available
    Game.display.player.path = Game.display.player.path.slice(0, 1);

    let x, y;
    // The character is moving, start from the next tile
    if (Game.display.player.path.length > 0) {
      x = Game.display.player.path[0][0];
      y = Game.display.player.path[0][1];
      // No path available, start from the character position
    } else {
      x = Game.display.player.position.x;
      y = Game.display.player.position.y;
    }

    const path = Game.finder.findPath(x, y, tileX, tileY, gridClone);

    // Remove origin from path
    path.shift();

    // Starting the movement needs 3 flags:
    // * isWalking to true
    // * steps in the path
    // * fill msLeft to the default msToReachTile
    // All 3 will be resetted at the destination.
    if (path.length > 0) {
      Game.display.player.isWalking = true;
      if (Game.display.player.path)
        Game.display.player.path = Game.display.player.path.concat(path);
      if (pace.msLeft === 0) pace.msLeft = pace.msToReachTile;
    }

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
