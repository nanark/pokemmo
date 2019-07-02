import * as PIXI from "pixi.js";
import axios from "axios";
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
  tileSize: 16,
  tileScale: 3,

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
    Game.player = new Player();

    axios.get("https://api.zeapps.eu/maps/v1/map/map.json").then(response => {
      this.loadLevel(response.data.item);
    });
  },

  disconnect() {
    if (Game.display && Game.display.app.stage) {
      Game.display.app.destroy();
    }
  },

  loadLevel(items) {
    console.log(items);
    for (let item of items) {
      this.loadTiles(item);
    }
  },

  loadTiles(item) {
    const container = new PIXI.Container();

    container.position.x = item.x * this.tileScale;
    container.position.y = item.y * this.tileScale;
    container.scale.set(this.tileScale);

    for (let tile of item.tiles) {
      const texture = PIXI.Loader.shared.resources[tile.tileset].texture;

      const text = new PIXI.Texture(
        texture,
        new PIXI.Rectangle(tile.x, tile.y, 16, 16)
      );
      const bunny = new PIXI.Sprite(text);
      bunny.x = 0;
      bunny.y = 0;
      bunny.alpha = tile.opacity || 100;
      bunny.width = 16;
      bunny.height = 16;
      container.addChild(bunny);
    }
    Game.display.app.stage.addChild(container);
  }
};
