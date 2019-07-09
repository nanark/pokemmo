import * as PIXI from "pixi.js";
import PF from "pathfinding";
// import axios from "axios";
import GameDisplay from "./GameDisplay";
import Player from "@/assets/scripts/game/actors/Player";
import { moveCharacters } from "@/assets/scripts/game/positions";
import { map } from "@/static/sources/map.js";
import Stats from "stats.js";

export const Game = {
  logs: [],
  loaded: false,
  online: false,
  debugMode: false,
  player: {},
  playerDirection: "down",
  tilesArray: [],
  texturesCache: {},
  spritesCache: {},
  obstacles: [],
  grid: [],
  pathGrid: null,
  path: [],
  population: [],
  ws: null,
  tileSize: 16,
  tileScale: 3,
  // mapUrl: "https://api.zeapps.eu/maps/v1/map/map.json",
  // mapUrl: "https://api.zeapps.eu/maps/v1/map/medhi1.json",

  init(userId) {
    // Display stats
    this.displayStats();

    // Cursor
    const tilePixelSize = Game.tileSize * Game.tileScale;
    this.cursor = new PIXI.Graphics();
    this.cursor.lineStyle(0);
    this.cursor.beginFill(0xffff0b, 0.2);
    this.cursor.drawRect(0, 0, tilePixelSize, tilePixelSize);
    this.cursor.endFill();

    // Pathfinder
    this.finder = new PF.AStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true
    });

    this.display = new GameDisplay();
    this.userId = userId;

    this.globalContainer = new PIXI.Container();

    this.mapContainer = new PIXI.Container();
    this.unitsContainer = new PIXI.Container();
    this.menuContainer = new PIXI.Container();

    this.mapContainer.zIndex = 5;
    this.mapContainer.interactive = true;
    this.unitsContainer.zIndex = 10;
    this.menuContainer.zIndex = 20;

    this.globalContainer.addChild(this.mapContainer);
    this.globalContainer.addChild(this.menuContainer);
    this.globalContainer.addChild(this.unitsContainer);

    Game.display.app.stage.addChild(this.globalContainer);

    this.configEventHandlers();

    this.logIt("Initialize the game.");
  },

  setDebug(mode) {
    const label = mode ? "debug mode" : "production mode";
    Game.logIt(`Set to ${label}`);
    this.debugMode = mode;
  },

  setOnline(mode) {
    const label = mode ? "live" : "offline";
    Game.logIt(`Set to ${label}`);

    // Destroy the other characters
    if (!mode) {
      this.population.forEach(character => {
        Game.display.app.stage.removeChild(character.sprite);
      });
      this.population = [];
    }

    this.online = mode;
  },

  setWebsocket(ws) {
    this.ws = ws;

    if (ws.readyState === 1) {
      this.logIt("Opening Websocket for positions");
    }

    this.ws.addEventListener("message", event => {
      if (this.loaded && this.online) {
        const positions = JSON.parse(event.data);

        moveCharacters(positions);
      }
    });
  },

  logIt(message) {
    this.logs.push({ date: Date.now(), message });
  },

  setup() {
    // axios.get(this.mapUrl).then(response => {
    this.loadLevel(map);
    // });

    Game.player = new Player();
  },

  disconnect() {
    if (Game.display && Game.display.app.stage) {
      Game.display.app.destroy();
    }
  },

  loadLevel(items) {
    for (let item of items) {
      this.loadTiles(item);
    }

    this.pathGrid = new PF.Grid(this.grid);
  },

  loadTiles(item) {
    const container = new PIXI.Container();

    container.position.x = item.x * this.tileScale * this.tileSize;
    container.position.y = item.y * this.tileScale * this.tileSize;
    container.scale.set(this.tileScale);
    container.zIndex = 0;

    let isObstacle = false;

    for (let tile of item.tiles) {
      // Generate a ref key for caching
      const ref = `${tile.x}_${tile.y}_${tile.tileset}`;

      // Add a key in texturesCache if not available
      if (!this.texturesCache[ref]) {
        const resource = PIXI.Loader.shared.resources[tile.tileset].texture;

        this.texturesCache[ref] = new PIXI.Texture(
          resource,
          new PIXI.Rectangle(
            tile.x * this.tileSize,
            tile.y * this.tileSize,
            this.tileSize,
            this.tileSize
          )
        );
      }

      // Create sprite
      const sprite = new PIXI.Sprite(this.texturesCache[ref]);

      sprite.width = this.tileSize;
      sprite.height = this.tileSize;
      sprite.alpha = tile.opacity || 100;
      sprite.x = 0;
      sprite.y = 0;

      // Obstacle
      if (tile.visible === false) {
        // Add the sprite to the obstacles list
        // this.obstacles.push(sprite);
        sprite.alpha = 0;
        isObstacle = true;
      }

      // Add the sprite to the container
      container.addChild(sprite);
    }

    if (!this.grid[item.y]) {
      this.grid[item.y] = [];
    }

    // Obstacle
    if (isObstacle) {
      this.grid[item.y].push(1);
    } else {
      this.grid[item.y].push(0);
    }

    Game.mapContainer.addChild(container);
  },

  configEventHandlers() {
    Game.mapContainer.mousemove = Game.mapContainer.touchmove = event => {
      const mouseX =
        event.data.global.x + Math.abs(Game.globalContainer.position.x);
      const mouseY =
        event.data.global.y + Math.abs(Game.globalContainer.position.y);

      const tileX = Math.ceil(mouseX / this.tileSize / this.tileScale) - 1;
      const tileY = Math.ceil(mouseY / this.tileSize / this.tileScale) - 1;

      Game.globalContainer.removeChild(this.cursor);
      this.cursor.x = tileX * Game.tileSize * Game.tileScale;
      this.cursor.y = tileY * Game.tileSize * Game.tileScale;
      Game.globalContainer.addChild(this.cursor);
    };

    Game.mapContainer.mousedown = Game.mapContainer.touchmove = event => {
      const mouseX =
        event.data.global.x + Math.abs(Game.globalContainer.position.x);
      const mouseY =
        event.data.global.y + Math.abs(Game.globalContainer.position.y);

      const tileX = Math.ceil(mouseX / this.tileSize / this.tileScale) - 1;
      const tileY = Math.ceil(mouseY / this.tileSize / this.tileScale) - 1;

      Game.globalContainer.removeChild(this.cursor);
      this.cursor.x = tileX * Game.tileSize * Game.tileScale;
      this.cursor.y = tileY * Game.tileSize * Game.tileScale;
      Game.globalContainer.addChild(this.cursor);

      // Clone the grid so you can use it later
      // Pathfinding destroys it afer use
      const gridClone = this.pathGrid.clone();

      const path = this.finder.findPath(
        Game.player.position.x,
        Game.player.position.y,
        tileX,
        tileY,
        gridClone
      );

      this.path = path;
    };
  },

  // Display stats panel in the corner
  displayStats() {
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.top = "60px";
    this.stats.dom.style.left = "auto";
    this.stats.dom.style.right = "10px";
    document.body.appendChild(this.stats.dom);
  }
};
