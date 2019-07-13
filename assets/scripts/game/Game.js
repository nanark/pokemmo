import * as PIXI from "pixi.js";
import PF from "pathfinding";
// import axios from "axios";
import GameDisplay from "./GameDisplay";
import Player from "@/assets/scripts/game/actors/Player";
import Stats from "stats.js";
import { map } from "@/static/sources/map.js";
import { logIt } from "@/assets/scripts/game/utils";
import { moveCharacters } from "@/assets/scripts/game/positions";
import { load as loadLevel } from "./levels";
import { setPlayerEventsHandler } from "./events";
import { cursor } from "./cursor";

export const Game = {
  logs: [],
  FPS: 60,
  loaded: false,
  online: false,
  debugMode: false,
  player: {},
  playerDirection: "down",
  texturesCache: {},
  obstacles: [],
  grid: [],
  pathGrid: null,
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
    this.cursor = cursor("hover");
    this.cursorClick = cursor("click");

    // Pathfinder
    this.finder = new PF.AStarFinder({
      allowDiagonal: false
    });

    this.display = new GameDisplay();
    this.userId = userId;

    this.globalContainer = new PIXI.Container();

    this.mapContainer = new PIXI.Container();
    this.cursorContainer = new PIXI.Container();
    this.unitsContainer = new PIXI.Container();
    this.menuContainer = new PIXI.Container();

    this.mapContainer.zIndex = 5;
    this.mapContainer.interactive = true;
    this.unitsContainer.zIndex = 10;
    this.menuContainer.zIndex = 20;

    this.globalContainer.addChild(this.mapContainer);
    this.globalContainer.addChild(this.menuContainer);
    this.globalContainer.addChild(this.cursorContainer);
    this.globalContainer.addChild(this.unitsContainer);

    Game.display.app.stage.addChild(this.globalContainer);

    setPlayerEventsHandler();

    logIt("Initialize the game.");
  },

  setDebug(mode) {
    const label = mode ? "debug mode" : "production mode";
    logIt(`Set to ${label}`);
    this.debugMode = mode;
  },

  setOnline(mode) {
    const label = mode ? "live" : "offline";
    logIt(`Set to ${label}`);

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
      logIt("Opening Websocket for positions");
    }

    this.ws.addEventListener("message", event => {
      if (this.loaded && this.online) {
        const positions = JSON.parse(event.data);

        moveCharacters(positions);
      }
    });
  },

  setup() {
    // axios.get(this.mapUrl).then(response => {
    loadLevel(map);
    // });

    Game.player = new Player();
  },

  disconnect() {
    if (Game.display && Game.display.app.stage) {
      Game.display.app.destroy();
    }
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
