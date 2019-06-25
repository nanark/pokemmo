// import * as PIXI from "pixi.js";
import GameDisplay from "./GameDisplay";

export const Game = {
  logs: [],

  init() {
    this.display = new GameDisplay();
    console.log("WA");
    this.logs.push("WA");
  }
};
