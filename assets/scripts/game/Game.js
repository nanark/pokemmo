import GameDisplay from "./GameDisplay";
import Player from "@/assets/scripts/game/actors/Player";
import { moveCharacters } from "@/assets/scripts/game/positions";

export const Game = {
  logs: [],
  loaded: false,
  online: false,
  debugMode: false,
  player: {},
  playerDirection: "down",
  population: [],
  ws: null,

  init(userId) {
    this.display = new GameDisplay();
    this.userId = userId;
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

    this.ws.onmessage = event => {
      if (this.loaded) {
        const positions = JSON.parse(event.data);

        moveCharacters(positions);
      }
    };
  },

  logIt(message) {
    this.logs.push({ date: Date.now(), message });
  },

  setup() {
    Game.player = new Player();
  },

  disconnect() {
    Game.display.app.destroy();
  }
};
