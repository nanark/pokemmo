import * as PIXI from "pixi.js";
import PF from "pathfinding";
import { Game } from "@/assets/scripts/game/Game";
import { tileToPixel } from "@/assets/scripts/game/utils";

export const load = items => {
  for (let item of items) {
    loadTiles(item);
  }

  Game.pathGrid = new PF.Grid(Game.grid);
};

const loadTiles = item => {
  const container = new PIXI.Container();

  container.position.x = tileToPixel(item.x);
  container.position.y = tileToPixel(item.y);
  container.scale.set(Game.tileScale);
  container.zIndex = 0;

  let isObstacle = false;

  for (let tile of item.tiles) {
    // Generate a ref key for caching
    const ref = `${tile.x}_${tile.y}_${tile.tileset}`;

    // Add a key in texturesCache if not available
    if (!Game.texturesCache[ref]) {
      const resource = PIXI.Loader.shared.resources[tile.tileset].texture;

      Game.texturesCache[ref] = new PIXI.Texture(
        resource,
        new PIXI.Rectangle(
          tile.x * Game.tileSize,
          tile.y * Game.tileSize,
          Game.tileSize,
          Game.tileSize
        )
      );
    }

    // Create sprite
    const sprite = new PIXI.Sprite(Game.texturesCache[ref]);

    sprite.width = Game.tileSize;
    sprite.height = Game.tileSize;
    sprite.alpha = tile.opacity || 100;
    sprite.x = 0;
    sprite.y = 0;

    // Obstacle
    if (tile.visible === false) {
      sprite.alpha = 0;
      isObstacle = true;
    }

    // Add the sprite to the container
    container.addChild(sprite);
  }

  // Initialize row
  if (!Game.grid[item.y]) Game.grid[item.y] = [];

  // Build the grid to init the pathfinder
  if (isObstacle) {
    Game.grid[item.y].push(1);
  } else {
    Game.grid[item.y].push(0);
  }

  Game.mapContainer.addChild(container);
};
