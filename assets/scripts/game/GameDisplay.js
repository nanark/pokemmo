import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { loadResources } from "./loop";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class GameDisplay {
  player = {};
  width = 0;
  heigth = 0;

  constructor() {
    this.scale = 1.0;

    this.setDimensions();

    //=========================================================================
    // Creating the Application
    //=========================================================================
    this.app = new PIXI.Application({
      antialias: false,
      autoDensity: true,
      height: this.height,
      transparent: false,
      width: this.width
    });

    //=========================================================================
    // Handle viewport and subcontainers
    //=========================================================================
    this.viewport = new Viewport({
      screenWidth: this.width,
      screenHeight: this.height,
      interaction: this.app.renderer.plugins.interaction // Pixi-viewport
    }).clamp({ direction: "all" });

    // We use different containers as Z-layers
    this.mapContainer = new PIXI.Container();
    this.cursorContainer = new PIXI.Container();
    this.unitsContainer = new PIXI.Container();
    this.menuContainer = new PIXI.Container();

    this.mapContainer.zIndex = 5;
    this.mapContainer.interactive = true;
    this.unitsContainer.zIndex = 10;
    this.menuContainer.zIndex = 20;

    this.viewport.addChild(this.mapContainer);
    this.viewport.addChild(this.menuContainer);
    this.viewport.addChild(this.cursorContainer);
    this.viewport.addChild(this.unitsContainer);

    this.app.stage.addChild(this.viewport);

    const resize = () => {
      this.setDimensions();
      this.app.renderer.resize(this.width, this.height);

      // Resize the viewport params too and place the player at the center
      this.viewport.screenWidth = this.width;
      this.viewport.screenHeight = this.height;

      // Set the player at the center
      this.viewport.moveCenter(
        this.player.container.x,
        this.player.container.y
      );

      // Set new size for viewport features (mouseEdges...)
      this.viewport.resize(this.width, this.height);
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
