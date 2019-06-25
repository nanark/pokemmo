import * as PIXI from "pixi.js";
import loadResources from "./Resources";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class GameDisplay {
  label = "nothing";

  constructor() {
    this.scale = 1.0;
    this.app = new PIXI.Application({
      width: 250,
      height: 250,
      antialias: false,
      transparent: true,
      powerPreference: "high-performance"
    });

    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.autoResize = true;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    loadResources(this.setup);
  }

  // loadAssets() {
  //   // Reset all cache and shared sprites resources
  //   // Avoid error and warnings during hot reload.
  //   this.app.loader.reset();
  //   PIXI.utils.clearTextureCache();

  //   // Loading required assets
  //   this.app.loader
  //     .add({
  //       name: "character",
  //       url: "character.json",
  //       onComplete: () => {
  //         // Todo loading mentions
  //         console.log("CHARACTER LOADED");
  //       }
  //     })
  //     .load(() => {
  //       this.setup();
  //     });
  // }

  setup() {
    this.label = "hahah";
    const sheet =
      PIXI.Loader.shared.resources.character.spritesheet.animations[
        "walk-left"
      ];

    let cat = new PIXI.AnimatedSprite(sheet);

    // Scale
    cat.width = cat.width * 4;
    cat.height = cat.height * 4;

    console.log(cat.width);
    console.log(cat.height);

    // Place it at the center
    cat.x = this.app.renderer.width / 2 - cat.width / 2;
    cat.y = this.app.renderer.height / 2 - cat.height / 2;
    cat.animationSpeed = 0.14;
    cat.play();

    //Add the cat to the stage
    this.app.stage.addChild(cat);
  }
}
