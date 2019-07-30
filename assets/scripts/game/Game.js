import PF from "pathfinding";
import GameDisplay from "./GameDisplay";
import Stats from "stats.js";
import { moveCharacters } from "./positions";
import { handleCursorEvents } from "./cursors";
import { handleControlEvents } from "./controls";
import { displayMode } from "./utils";

export const Game = {
  loaded: false,

  init(me) {
    // Tools
    this.displayStats();
    this.FPS = 60;
    this.resourcesLoaded = false;

    // Connection
    this.ws = null;

    // Define World
    this.tileSize = 16;
    this.tileScale = displayMode().isMobile ? 1.6 : 2.6;
    this.tileDistance = this.tileSize * this.tileScale;
    this.population = new Map(); // Store the population active on the map

    // Pathfinder
    this.finder = new PF.AStarFinder({
      allowDiagonal: false
    });

    // Display
    this.display = new GameDisplay(me);

    // Event handlers
    handleControlEvents();
    handleCursorEvents();
  },

  setWebsocket(ws) {
    this.ws = ws;

    this.ws.addEventListener("message", event => {
      if (this.resourcesLoaded) {
        const message = JSON.parse(event.data);
        const namespace = message.namespace;

        if (namespace === "position") moveCharacters(message.data);
      }
    });
  },

  disconnect() {
    if (this.display && this.display.app.stage) {
      this.display.app.destroy();
    }
  },

  // Display stats panel in the corner
  displayStats() {
    const stats = new Stats();

    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.dom.style.position = "absolute";
    stats.dom.style.top = "60px";
    stats.dom.style.left = "auto";
    stats.dom.style.right = "10px";

    this.stats = stats;
    document.body.appendChild(this.stats.dom);
  }
};
