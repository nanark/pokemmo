import * as PIXI from "pixi.js";
import PF from "pathfinding";
import { Game } from "./Game";
import { tileToPixel } from "./utils";
import { getTexture } from "./textures";

const grid = [];
export const charactersGrid = [];
export let pathGrid = null;

export const load = items => {
  const _viewport = Game.display.viewport;

  for (const item of items) {
    loadTiles(item, true);
    loadTiles(item, false);
    loadObstacle(item);
  }

  pathGrid = new PF.Grid(grid);

  // Set the dimensions for the viewport scrolling (PIXI-viewport)
  const worldWidth = pathGrid.width;
  const worldHeight = pathGrid.height;
  _viewport.worldWidth = tileToPixel(worldWidth);
  _viewport.worldHeight = tileToPixel(worldHeight);
};

const loadObstacle = item => {
  let isObstacle = false;

  const properties = item.properties;
  if (properties) {
    isObstacle = properties.obstacle || false;
  }

  // Initialize row
  if (!grid[item.y]) grid[item.y] = [];

  // Build the grid to init the pathfinder
  if (isObstacle) {
    grid[item.y].push(1);
  } else {
    grid[item.y].push(0);
  }
};

const loadTiles = (item, overlay) => {
  let hasLayer = false;

  const tileObject = new PIXI.Graphics();

  // Define its properties
  tileObject.position.x = tileToPixel(item.x) - Game.tileDistance / 2;
  tileObject.position.y = tileToPixel(item.y) - Game.tileDistance / 2;
  tileObject.scale.set(Game.tileScale);

  for (const tile of item.tiles) {
    // Add a key in texturesCache if not available
    const texture = getTexture(tile);

    const alpha = tile.opacity || 100;

    const isOverlay = tile.overlay || false;

    if (isOverlay === overlay) {
      hasLayer = true;
      tileObject.beginTextureFill(texture, 0xffffff, alpha);
      tileObject.drawRect(0, 0, Game.tileSize, Game.tileSize);
    }
  }

  // Add the tile to the map
  if (hasLayer) {
    if (overlay) {
      Game.display.mapOverlayContainer.addChildAt(tileObject);
    } else {
      Game.display.mapContainer.addChildAt(tileObject);
    }
  }
};

// Detect from the pathGrid if the tile is an obstacle.
// Return true if pathGrid or nodes are missing.
// It happens when the map is not fully loaded yet.
export const detectObstacle = (x, y) => {
  if (!pathGrid) return true;

  const nodes = pathGrid.nodes;

  if (!nodes) return true;

  if (!nodes[y]) return true;
  if (!nodes[y][x]) return true;

  const isWalkable = nodes[y][x].walkable;

  return !isWalkable;
};
