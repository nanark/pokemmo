import { Game } from "@/assets/scripts/game/Game";
import { pixelToTile, tileToPixel } from "@/assets/scripts/game/utils";

const targetTile = event => {
  // Shortcut
  const globalContainer = Game.globalContainer;

  const mouseX = event.data.global.x + Math.abs(globalContainer.position.x);
  const mouseY = event.data.global.y + Math.abs(globalContainer.position.y);

  const tileX = Math.ceil(pixelToTile(mouseX)) - 1;
  const tileY = Math.ceil(pixelToTile(mouseY)) - 1;

  globalContainer.removeChild(Game.cursor);
  Game.cursor.x = tileToPixel(tileX);
  Game.cursor.y = tileToPixel(tileY);
  globalContainer.addChild(Game.cursor);

  return { tileX, tileY };
};

export const setPlayerEventsHandler = () => {
  // Shortcut
  const mapContainer = Game.mapContainer;

  // Actions when the cursor hover the map
  mapContainer.mousemove = mapContainer.touchmove = event => {
    targetTile(event);
  };

  // Actions when the cursor click on a tile
  mapContainer.mousedown = mapContainer.touchmove = event => {
    const { tileX, tileY } = targetTile(event);

    // Moving the player, Pathfinding:

    // Clone the grid so you can use it later
    // Pathfinding destroys it afer use
    const gridClone = Game.pathGrid.clone();

    const path = Game.finder.findPath(
      Game.player.position.x,
      Game.player.position.y,
      tileX,
      tileY,
      gridClone
    );

    // To avoid the invalid array (missing first line)
    // we regenerate a new array and remove the starting point
    const pathClean = [];
    for (let step of path) {
      pathClean.push(step);
    }
    pathClean.shift();

    // Feed the path for the loop
    Game.path = pathClean;
  };
};
