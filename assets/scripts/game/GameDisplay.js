import * as PIXI from "pixi.js";
import { loadResources } from "./loop";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class GameDisplay {
  player = null;
  width = 0;
  heigth = 0;

  constructor() {
    this.scale = 1.0;

    this.setDimensions();

    // Creating the application
    this.app = new PIXI.Application({
      antialias: false,
      autoDensity: true,
      height: this.height,
      powerPreference: "high-performance",
      // resolution: window.devicePixelRatio,
      transparent: true,
      // backgroundColor: 0x061639,
      width: this.width
    });

    const resize = () => {
      this.setDimensions();
      this.app.renderer.resize(this.width, this.height);
    };

    addEventListener("resize", resize);

    // Styles for fullscreen
    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.autoResize = true;

    // Load resources and start loop
    loadResources();
  }

  setDimensions() {
    this.width = document.getElementById("viewport").offsetWidth;
    this.height = document.getElementById("viewport").offsetHeight;
  }
}
