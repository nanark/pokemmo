import * as PIXI from "pixi.js";
import { Game } from "@/assets/scripts/game/Game";
import { tileToPixel } from "@/assets/scripts/game/utils";

export default class Character {
  constructor(type, animation) {
    this.type = type;
    this.animation = animation;
    this.position = {};
    this.position.x = 0;
    this.position.y = 0;
    this.msBetweenTiles = 150;

    const sheet = this.buildTextures(this.animation);

    this.sprite = new PIXI.AnimatedSprite(sheet);

    // Scale
    this.sprite.width = this.sprite.width * Game.tileScale;
    this.sprite.height = this.sprite.height * Game.tileScale;
    this.sprite.anchor.set(0, 0);
    this.sprite.zIndex = 1;

    // Place it at the center
    const x = 0;
    const y = 0;
    this.setPositionTile(x, y);

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

  setPositionTile(x, y) {
    this.position.x = x;
    this.position.y = y;

    this.sprite.position.set(tileToPixel(x), tileToPixel(y));
  }

  setPositionPixel(x, y) {
    this.sprite.position.set(x, y);
  }
}
