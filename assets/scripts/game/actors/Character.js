import * as PIXI from "pixi.js";
import { Game } from "../Game";
import { tileToPixel } from "../utils";
import { pathGrid } from "../levels";
import { sendPosition } from "../connection";
import { detectObstacle } from "../levels";

export default class Character {
  constructor(type, animation, user) {
    this.type = type;
    this.id = user.id;
    this.username = user.username;
    this.animation = animation;
    this.direction = "down";
    this.position = {};
    this.position.x = 0;
    this.position.y = 0;
    this.layers = {};

    // Movement variables
    this.isWalking = false;
    this.path = [];
    this.msToReachTile = 200;
    this.distanceEachMs = Game.tileDistance / this.msToReachTile;

    // Movement Buffers
    this.msElapsedBuffer = 0;
    this.msLeft = 0;

    // Building the animations
    const sheet = this.buildTextures(this.animation);
    this.container = new PIXI.Container();

    // Text
    this.layers.label = new PIXI.Text(this.username, {
      fontFamily: "Arial",
      fontSize: 14,
      fill: 0xffffff,
      align: "center"
    });

    // Sprite
    this.layers.sprite = new PIXI.AnimatedSprite(sheet);
    this.layers.sprite.animationSpeed = 0.14;
    this.layers.sprite.play();

    this.container.addChild(this.layers.sprite);
    this.container.addChild(this.layers.label);

    // Scale
    this.layers.sprite.width = this.layers.sprite.width * Game.tileScale;
    this.layers.sprite.height = this.layers.sprite.height * Game.tileScale;
    this.layers.sprite.anchor.set(0.5, 0.5); // Corner top-left
    this.layers.sprite.zIndex = 1;

    // Place it at the top left corner
    const x = 0;
    const y = 0;
    this.setPositionTile(x, y);
  }

  buildTextures(animation) {
    const spritesheet = PIXI.Loader.shared.resources[this.type].spritesheet;
    let sheet;

    // If this is an animation or a texture
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
    this.layers.sprite.textures = this.buildTextures(animation);
    this.layers.sprite.gotoAndPlay(1);
  }

  relativeMove(x, y) {
    const tileX = this.position.x + x;
    const tileY = this.position.y + y;

    const isObstacle = detectObstacle(tileX, tileY);

    if (!isObstacle) {
      this.setPathTo(tileX, tileY);
      sendPosition(tileX, tileY);
    }
  }

  move(tileX, tileY) {
    this.setPathTo(tileX, tileY);
    sendPosition(tileX, tileY);
  }

  go(direction) {
    const animation = `walk-${direction}`;
    this.setAnimation(animation);
    this.direction = direction;
  }

  stand() {
    const animation = `face-${this.direction}`;
    this.setAnimation(animation);
  }

  // Place the character on this tile and set position in pixel
  setPositionTile(x, y) {
    this.position.x = x;
    this.position.y = y;

    this.container.position.set(tileToPixel(x), tileToPixel(y));
  }

  // Place the character at this position in pixels
  setPositionPixel(x, y) {
    this.container.position.set(x, y);
  }

  //=========================================================================
  // Moving the player, Pathfinding:
  //=========================================================================
  setPathTo(destinationX, destinationY) {
    // Clone the grid so you can use it later
    // Pathfinding destroys it afer use
    const gridClone = pathGrid.clone();

    // Fetch the next tile if available
    this.path = this.path.slice(0, 1);

    let x, y;

    // The character is moving, start from the next tile
    if (this.path.length > 0) {
      x = this.path[0][0];
      y = this.path[0][1];
      // No path available, start from the character position
    } else {
      x = this.position.x;
      y = this.position.y;
    }

    const path = Game.finder.findPath(
      x,
      y,
      destinationX,
      destinationY,
      gridClone
    );

    // Remove origin from path
    path.shift();

    // Starting the movement needs 3 flags:
    // * isWalking to true
    // * steps in the path
    // * fill msLeft to the default msToReachTile
    // All 3 will be resetted at the destination.
    if (path.length > 0) {
      this.isWalking = true;
      if (this.path) this.path = this.path.concat(path);
      if (this.msLeft === 0) this.msLeft = this.msToReachTile;
    }
  }
}
