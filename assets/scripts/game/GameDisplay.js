import * as PIXI from "pixi.js";
import { loadResources } from "./GameLoop";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class GameDisplay {
  player = null;

  constructor() {
    this.scale = 1.0;

    // Creating the application
    this.app = new PIXI.Application({
      antialias: false,
      autoDensity: true,
      height: 250,
      powerPreference: "high-performance",
      resolution: window.devicePixelRatio,
      transparent: true,
      // backgroundColor: 0x061639,
      width: 250
    });

    const resize = () => {
      const _w = window.innerWidth;
      const _h = window.innerHeight;
      this.app.renderer.resize(_w, _h);
    };

    addEventListener("resize", resize);

    // Styles for fullscreen
    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.autoResize = true;
    resize();

    // Load resources and start loop
    loadResources();
  }
}
