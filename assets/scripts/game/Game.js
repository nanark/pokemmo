// import * as PIXI from "pixi.js";
import GameDisplay from "./GameDisplay";

export const Game = {
  logs: [],
  // loaded: false,

  init() {
    this.display = new GameDisplay();
    this.loaded = false;
    this.logIt("Initialize the game.");

    // Load the player
  },

  logIt(message) {
    this.logs.push({ date: Date.now(), message });
  }
};
