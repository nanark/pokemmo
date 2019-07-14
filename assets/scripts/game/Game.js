import PF from "pathfinding";
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
  users: [], // Temp
  FPS: 60,
  loaded: false,
  online: true,
  debugMode: false,
  texturesCache: {},
  obstacles: [],
  grid: [],
  pathGrid: null,
  population: new Map(),
  ws: null,
  tileSize: 16,
  tileScale: 3,

  init(user, users) {
    // Display stats
    this.displayStats();

    // Temp
    this.users = users;

    // Movement values
    this.tileDistance = this.tileSize * this.tileScale;

    // Cursor
    this.cursor = cursor("hover");
    this.cursorClick = cursor("click");

    // Pathfinder
    this.finder = new PF.AStarFinder({
      allowDiagonal: false
    });

    this.display = new GameDisplay();
    this.user = user;
    this.userId = user.id;

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
        Game.display.app.stage.removeChild(character.container);
      });
      this.population = new Map();
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
        const message = JSON.parse(event.data);
        const namespace = message.namespace;

        if (namespace === "position") {
          moveCharacters(message.data);
        }
      }
    });
  },

  setup() {
    // axios.get(this.mapUrl).then(response => {
    loadLevel(map);
    // });

    const player = new Player(this.user);

    // Temp: Set the player in the map
    player.setPositionTile(30, 24);
    Game.display.viewport.moveCenter(
      player.container.position.x,
      player.container.position.y
    );
    Game.display.player = player;
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
