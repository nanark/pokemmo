// import * as PIXI from "pixi.js";
import GameDisplay from "./GameDisplay";

export const Game = {
  logs: [],

  init() {
    this.display = new GameDisplay();
    this.logIt("Initialize the game.");
  },

  logIt(message) {
    this.logs.push({ date: Date.now(), message });
  }
};
