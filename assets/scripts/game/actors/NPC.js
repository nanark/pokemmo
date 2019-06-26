import * as PIXI from "pixi.js";
import Character from "./Character";
import { Game } from "@/assets/scripts/game/Game";

export default class NPC extends Character {
  sprite = {};
  type = "character";

  constructor() {
    super();

    const sheet = this.buildTextures("face-down");

    this.sprite = new PIXI.AnimatedSprite(sheet);

    // Scale
    this.sprite.width = this.sprite.width * 3;
    this.sprite.height = this.sprite.height * 3;
    this.sprite.animationSpeed = 0.14;
    this.sprite.play();

    // Add the player to the stage
    Game.display.app.stage.addChild(this.sprite);
  }
}
