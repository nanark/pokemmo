import * as PIXI from "pixi.js";
import { loadResources } from "./GameLoop";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class GameDisplay {
  player = null;

  constructor() {
    this.scale = 1.0;

    // Creating the application
    this.app = new PIXI.Application({
      width: 250,
      height: 250,
      antialias: false,
      transparent: true,
      powerPreference: "high-performance"
    });

    // Styles for fullscreen
    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.autoResize = true;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    // Load resources and start loop
    loadResources();
  }
}
