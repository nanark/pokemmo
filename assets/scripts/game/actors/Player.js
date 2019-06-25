import * as PIXI from "pixi.js";
import Character from "./Character";
import { Game } from "@/assets/scripts/game/Game";

export default class Player extends Character {
  constructor() {
    super();

    const sheet =
      PIXI.Loader.shared.resources.character.spritesheet.animations[
        "walk-down"
      ];

    let cat = new PIXI.AnimatedSprite(sheet);

    // Scale
    cat.width = cat.width * 4;
    cat.height = cat.height * 4;

    // Place it at the center
    cat.x = Game.display.app.renderer.width / 2 - cat.width / 2;
    cat.y = Game.display.app.renderer.height / 2 - cat.height / 2;
    cat.animationSpeed = 0.14;
    cat.play();

    // Add the cat to the stage
    Game.display.app.stage.addChild(cat);
  }
}
