import PF from "pathfinding";
import GameDisplay from "./GameDisplay";
import Player from "./actors/Player";
import Stats from "stats.js";
import { map } from "@/static/sources/map.js";
import { moveCharacters } from "./positions";
import { load as loadLevel } from "./levels";
import { handlePlayerEvents } from "./events";
import { cursor } from "./cursor";
import { handleControlEvents } from "./controls";
import { displayMode } from "./utils";

export const Game = {
  loaded: false,

  init(me, users) {
    // Tools
    this.displayStats();
    this.logs = [];
    this.FPS = 60;
    this.loaded = true;
    this.resourcesLoaded = false;
    this.online = true;
    this.debugMode = false;

    // Connection
    this.ws = null;

    // Data
    this.me = me;
    this.meId = me.uuid;
    this.users = users;

    // World
    this.tileSize = 16;
    this.tileScale = displayMode().isMobile ? 1.6 : 2.6;
    this.tileDistance = this.tileSize * this.tileScale;
    this.population = new Map();
    this.spawningTile = { x: 30, y: 24 };

    // Cursor
    this.cursor = cursor("hover");
    this.cursorClick = cursor("click");

    // Pathfinder
    this.finder = new PF.AStarFinder({
      allowDiagonal: false
    });

    // Display
    this.display = new GameDisplay();

    // Event handlers
    handlePlayerEvents();
    handleControlEvents();
  },

  setOnline(mode) {
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

    this.ws.addEventListener("message", event => {
      if (this.resourcesLoaded && this.online) {
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

    const player = new Player(this.me);

    // Temp: Set the player in the map
    player.setPositionTile(this.spawningTile.x, this.spawningTile.y, true);
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
