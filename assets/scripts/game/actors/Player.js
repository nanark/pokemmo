import * as PIXI from "pixi.js";
import Character from "./Character";
import { Game } from "@/assets/scripts/game/Game";

export default class Player extends Character {
  sprite = {};
  type = "character";

  constructor() {
    super();

    const sheet = this.buildTextures("face-down");

    this.sprite = new PIXI.AnimatedSprite(sheet);

    // Scale
    this.sprite.width = this.sprite.width * 4;
    this.sprite.height = this.sprite.height * 4;

    // Place it at the center
    this.sprite.x = Game.display.app.renderer.width / 2 - this.sprite.width / 2;
    this.sprite.y =
      Game.display.app.renderer.height / 2 - this.sprite.height / 2;
    this.sprite.animationSpeed = 0.14;
    this.sprite.play();

    // Add the player to the stage
    Game.display.app.stage.addChild(this.sprite);
  }

  go(direction) {
    this.sprite._textures = this.buildTextures(`walk-${direction}`);
  }

  stand(direction) {
    this.sprite._textures = this.buildTextures(`face-${direction}`);
  }
}
