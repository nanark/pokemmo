import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Game } from "./Game";
import Player from "./actors/Player";
import { map } from "@/static/sources/map.js";
import { cursor } from "./cursors";
import { load as loadLevel, defaultSpawningTile } from "./levels";
import { gameloop } from "./loop";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class GameDisplay {
  constructor(me) {
    this.me = me;
    this.player = {};
    this.width = 0;
    this.heigth = 0;

    // Temp: Setting default position
    if (!this.me.position || !this.me.position.x || !this.me.position.y) {
      this.me.position = defaultSpawningTile;
    }

    this._setDimensions();

    // Creating the Application and Renderer
    this.app = new PIXI.Application({
      antialias: false,
      autoDensity: true,
      height: this.height,
      resolution: window.devicePixelRatio,
      transparent: false,
      width: this.width
    });

    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.autoResize = true;

    addEventListener("resize", this._resize.bind(this));

    // Build
    this._createCursors();
    this._createViewports();

    // Load resources and start loop
    this._loadResources();
  }

  // Handle viewport and subcontainers
  _createCursors() {
    this.cursorHover = cursor("hover");
    this.cursorGo = cursor("go");
  }

  // Handle viewport and subcontainers
  _createViewports() {
    this.viewport = new Viewport({
      screenHeight: this.height,
      screenWidth: this.width,
      interaction: this.app.renderer.plugins.interaction // Pixi-viewport
    }).clamp({ direction: "all" });

    // We use different containers as Z-layers
    this.mapContainer = new PIXI.Container();
    this.cursorContainer = new PIXI.Container();
    this.unitsContainer = new PIXI.Container();
    this.mapOverlayContainer = new PIXI.Container();
    this.menuContainer = new PIXI.Container();

    this.mapContainer.zIndex = 5;
    this.mapOverlayContainer.zIndex = 15;
    this.mapContainer.interactive = true;
    this.unitsContainer.zIndex = 10;
    this.menuContainer.zIndex = 20;

    this.viewport.addChild(this.mapContainer);
    this.viewport.addChild(this.cursorContainer);
    this.viewport.addChild(this.unitsContainer);
    this.viewport.addChild(this.mapOverlayContainer);
    this.viewport.addChild(this.menuContainer);

    this.app.stage.addChild(this.viewport);
  }

  // Handle window resizing
  _resize() {
    this._setDimensions();
    this.app.renderer.resize(this.width, this.height);

    // Resize the viewport params too and place the player at the center
    this.viewport.screenWidth = this.width;
    this.viewport.screenHeight = this.height;

    // Set the player at the center
    this.viewport.moveCenter(this.player.container.x, this.player.container.y);

    // Set new size for viewport features (mouseEdges...)
    this.viewport._resize(this.width, this.height);
  }

  // Set viewport dimensions
  _setDimensions() {
    this.width = document.getElementById("viewport").offsetWidth;
    this.height = document.getElementById("viewport").offsetHeight;
  }

  // Loading all resources and add the gameloop in the ticker.
  _loadResources() {
    const characters = {
      name: "character",
      url: "packs/character.json"
    };

    const magiscarf = {
      name: "magiscarf.png",
      url: "images/magiscarf.png"
    };

    // Reset all cache and shared sprites resources
    // Avoid error and warnings during hot reload.
    PIXI.Loader.shared.reset();
    PIXI.utils.clearTextureCache();

    // Loading required assets
    PIXI.Loader.shared
      .add(characters)
      .add(magiscarf)
      .load(() => {
        Game.resourcesLoaded = true;

        // Setup the game (load player etc.)
        this._setup();

        // Add a tickerTime
        this.app.ticker.maxFPS = Game.FPS;
        this.app.ticker.add(delta => gameloop(delta));
      });
  }

  // Setup the game:
  // * Load the map
  // * Load the player
  // * Place the camera
  _setup() {
    // Load the map // Todo: make it dynamic
    loadLevel(map);

    // Create the player and place it
    const player = new Player(this.me);
    player.setPositionTile(this.me.position.x, this.me.position.y, true);
    this.player = player;

    // Aim the player with the viewport
    const playerPosition = player.container.position;
    this.viewport.moveCenter(playerPosition.x, playerPosition.y);
  }
}
