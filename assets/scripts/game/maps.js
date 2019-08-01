import * as _ from "lodash";
import * as PIXI from "pixi.js";
import PF from "pathfinding";
import { Game } from "./Game";
import { tileToPixel } from "./utils";
import { getTexture } from "./textures";

//=============================================================================
// Handle level management for the game
//
// load(): Load a level (tiles, obstacles, grids...)
// isObstacle(): Return a boolean if the tile is an obstacle or not
//=============================================================================

const _grid = []; // Local grid used to build pathfinderGrid

export let pathfinderGrid; // Grid built by Pathfinder.js
export let matrix;
export const gatesGrid = []; // Gates available on the grid
export const charactersGrid = []; // Characters available on the grid
export const defaultSpawningTile = { x: 23, y: 19 }; // Temp

export const load = items => {
  const $viewport = Game.display.viewport;

  matrix = _buildMatrix(items);

  for (const item of items) {
    _loadTiles(item, true);
    _loadTiles(item, false);
    _loadObstacle(item);
  }

  // Build the grid for pathfinder.js
  pathfinderGrid = new PF.Grid(_grid);

  // Set the dimensions for the viewport scrolling (PIXI-viewport)
  const worldWidth = pathfinderGrid.width;
  const worldHeight = pathfinderGrid.height;
  $viewport.worldWidth = tileToPixel(worldWidth);
  $viewport.worldHeight = tileToPixel(worldHeight);
};

const _buildMatrix = items => {
  const { x: cols, y: rows } = _.last(items);

  // Preparing the matrix
  const matrix = [...Array(rows)].map(() => {
    return [...Array(cols)].map(() => {
      return {
        population: [],
        gate: null
      };
    });
  });

  // Creating gates
  for (const item of items) {
    const { x, y, properties } = item;
    if (properties) {
      const goto = properties.goto;
      if (goto) matrix[y][x].gate = goto;
    }
  }

  return matrix;
};

// Detect from the pathfinderGrid if the tile is an obstacle.
export const isObstacle = (x, y) => {
  if (!pathfinderGrid) return true;

  const nodes = pathfinderGrid.nodes;

  // Return true if pathfinderGrid or nodes are missing.
  // It happens when the map is not fully loaded yet.
  if (!nodes) return true;
  if (!nodes[y]) return true;
  if (!nodes[y][x]) return true;

  const isWalkable = nodes[y][x].walkable;

  return !isWalkable;
};

const _loadObstacle = item => {
  let isObstacle = false;

  const properties = item.properties;
  if (properties) isObstacle = properties.obstacle || false;

  // Initialize row
  if (!_grid[item.y]) _grid[item.y] = [];

  // Build the grid to init the pathfinder
  if (isObstacle) {
    _grid[item.y].push(1);
  } else {
    _grid[item.y].push(0);
  }
};

const _loadTiles = (item, overlay) => {
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

//=========================================================================
// Population
//=========================================================================
export const addToPopulation = character => {
  const $uuid = character.uuid;
  const $position = character.tilePosition;
  const { x, y } = $position;
  let $positionBuffer = character.tilePositionBuffer;
  const $population = matrix[y][x].population;

  // The character hasn't moved, quit
  if (!_.isEqual($positionBuffer, $position)) {
    // Remove the buffer if it exists
    if (!_.isEmpty($positionBuffer)) _removeFromPopulation($positionBuffer);

    if (!$population.includes($uuid)) $population.push($uuid);

    // Keep the last standing position
    $positionBuffer = _.cloneDeep($position);
  }
};

export const countPopulation = position => {
  const { x, y } = position;

  return matrix[y][x].population.length;
};

const _removeFromPopulation = character => {
  const $uuid = character.uuid;
  const $position = character.position;
  const { x, y } = $position;

  matrix[y][x].population.filter(uuid => uuid !== $uuid);
};
