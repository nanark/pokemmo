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
// addToPopulation(): Add a character to a tile population
// countPopulation(): Count population on a tile
//=============================================================================

export let pathfinderMatrix; // Grid built by Pathfinder.js
export let matrix;
export const gatesGrid = []; // Gates available on the grid
export const charactersGrid = []; // Characters available on the grid
export const defaultSpawningTile = { x: 23, y: 19 }; // Temp

export const load = items => {
  const $viewport = Game.display.viewport;

  // Build the matrix for the population and gates
  matrix = _buildMatrix(items);

  // Build the grid for pathfinder.js
  pathfinderMatrix = _buildPathfinder(items);

  for (const item of items) {
    _buildTiles(item, true, Game.display.mapOverlayContainer);
    _buildTiles(item, false, Game.display.mapContainer);
  }

  // Set the dimensions for the viewport scrolling (PIXI-viewport)
  const worldWidth = pathfinderMatrix.width;
  const worldHeight = pathfinderMatrix.height;
  $viewport.worldWidth = tileToPixel(worldWidth);
  $viewport.worldHeight = tileToPixel(worldHeight);
};

// Detect from the pathfinderMatrix if the tile is an obstacle.
export const isObstacle = (x, y) => {
  if (!pathfinderMatrix) return true;

  const nodes = pathfinderMatrix.nodes;

  // Return true if pathfinderMatrix or nodes are missing.
  // It happens when the map is not fully loaded yet.
  if (!nodes) return true;
  if (!nodes[y]) return true;
  if (!nodes[y][x]) return true;

  const isWalkable = nodes[y][x].walkable;

  return !isWalkable;
};

const _buildTiles = (item, overlay, container) => {
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
  if (hasLayer) container.addChildAt(tileObject);
};

// Build the pathfinder
const _buildPathfinder = items => {
  const grid = [];

  for (const item of items) {
    let isObstacle = false;

    const properties = item.properties;
    if (properties) isObstacle = properties.obstacle || false;

    // Initialize row
    if (!grid[item.y]) grid[item.y] = [];

    // Build the grid to init the pathfinder
    if (isObstacle) {
      grid[item.y].push(1);
    } else {
      grid[item.y].push(0);
    }
  }

  return new PF.Grid(grid);
};

// Build the matrix for the population and gates
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
  if (_.isEqual($positionBuffer, $position)) return;

  // Remove the buffer if it exists
  if (!_.isEmpty($positionBuffer)) _removeFromPopulation($positionBuffer);

  // Add to the population
  if (!$population.includes($uuid)) $population.push($uuid);

  // Keep the last standing position
  $positionBuffer = _.cloneDeep($position);
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
