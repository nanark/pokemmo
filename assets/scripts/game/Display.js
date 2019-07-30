import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Game } from "./Game";
import Player from "./actors/Player";
import { map } from "@/static/sources/map.js";
import { cursor } from "./cursors";
import { load as loadLevel, defaultSpawningTile } from "./levels";
import { gameloop } from "./loop";
import { viewportDimensions } from "./utils";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class Display extends PIXI.Application {
  constructor(options, me) {
    super(options);

    // Player data
    this.me = me;
    this.player = {};

    // Temp: Setting default position
    if (!this.me.position || !this.me.position.x || !this.me.position.y) {
      this.me.position = defaultSpawningTile;
    }

    // Settings for the renderer
    this.renderer.view.style.position = "absolute";
    this.renderer.view.style.display = "block";

    // Build
    this._createCursors();
    this._createViewports();

    this._resize();
    addEventListener("resize", this._resize.bind(this));

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
      interaction: this.renderer.plugins.interaction // Pixi-viewport
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

    this.stage.addChild(this.viewport);
  }

  // Handle window resizing
  _resize() {
    const { width, height } = viewportDimensions();

    // Resize renderer
    this.renderer.resize(width, height);

    // Resize the viewport (pixi-viewport)
    // And set new size for viewport features (mouseEdges...)
    this.viewport.screenWidth = width;
    this.viewport.screenHeight = height;
    this.viewport.resize(width, height);
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
        this.ticker.maxFPS = Game.FPS;
        this.ticker.add(delta => gameloop(delta));
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
