import { Game } from "@/assets/scripts/game/Game";
import * as PIXI from "pixi.js";

export default class Character {
  constructor(type, animation) {
    this.type = type;
    this.animation = animation;

    const sheet = this.buildTextures(this.animation);

    this.sprite = new PIXI.AnimatedSprite(sheet);

    // Scale
    this.sprite.width = this.sprite.width * 4;
    this.sprite.height = this.sprite.height * 4;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.zIndex = 1;

    // Place it at the center
    const x = Game.display.app.renderer.width / 2;
    const y = Game.display.app.renderer.height / 2;
    this.setPosition(x, y);

    // Animation
    this.sprite.animationSpeed = 0.14;
    this.sprite.play();
  }

  buildTextures(animation) {
    const spritesheet = PIXI.Loader.shared.resources[this.type].spritesheet;
    let sheet;

    if (spritesheet.animations[animation]) {
      sheet = spritesheet.animations[animation];
    } else {
      sheet = [spritesheet.textures[animation]];
    }

    return sheet;
  }

  setAnimation(animation) {
    if (animation === this.animation) {
      return false;
    }

    this.animation = animation;
    this.sprite.textures = this.buildTextures(animation);
    this.sprite.gotoAndPlay(1);
  }

  setPosition(x, y) {
    this.sprite.position.set(x, y);
  }
}
