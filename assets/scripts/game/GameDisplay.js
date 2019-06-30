import * as PIXI from "pixi.js";
import { loadResources } from "./GameLoop";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class GameDisplay {
  player = null;

  constructor() {
    this.scale = 1.0;

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // Creating the application
    this.app = new PIXI.Application({
      antialias: false,
      autoDensity: true,
      height: windowHeight,
      powerPreference: "high-performance",
      // resolution: window.devicePixelRatio,
      transparent: true,
      // backgroundColor: 0x061639,
      width: windowWidth
    });

    const resize = () => {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      this.app.renderer.resize(windowWidth, windowHeight);
    };

    addEventListener("resize", resize);

    // Styles for fullscreen
    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.autoResize = true;

    // Load resources and start loop
    loadResources();
  }
}
