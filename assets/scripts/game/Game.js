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
  mapUrl: "https://api.zeapps.eu/maps/v1/map/map.json",

  init(userId) {
    this.display = new GameDisplay();
    this.userId = userId;

    this.mapContainer = new PIXI.Container();
    this.unitsContainer = new PIXI.Container();
    this.menuContainer = new PIXI.Container();

    this.mapContainer.zIndex = 5;
    this.unitsContainer.zIndex = 10;
    this.menuContainer.zIndex = 20;

    Game.display.app.stage.addChild(this.mapContainer);
    Game.display.app.stage.addChild(this.menuContainer);
    Game.display.app.stage.addChild(this.unitsContainer);

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
    axios.get(this.mapUrl).then(response => {
      this.loadLevel(response.data.item);
    });

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
  },

  loadTiles(item) {
    const container = new PIXI.Container();

    container.position.x = item.x * this.tileScale;
    container.position.y = item.y * this.tileScale;
    container.scale.set(this.tileScale);
    container.zIndex = 0;

    for (let tile of item.tiles) {
      const resource = PIXI.Loader.shared.resources[tile.tileset].texture;

      const texture = new PIXI.Texture(
        resource,
        new PIXI.Rectangle(tile.x, tile.y, this.tileSize, this.tileSize)
      );

      const sprite = new PIXI.Sprite(texture);
      sprite.x = 0;
      sprite.y = 0;
      sprite.alpha = tile.opacity || 100;
      sprite.width = this.tileSize;
      sprite.height = this.tileSize;

      container.addChild(sprite);
    }

    Game.mapContainer.addChild(container);
  }
};
