import * as PIXI from "pixi.js";
import { Game } from "../Game";
import { tileToPixel, random } from "../utils";
import { sendPosition } from "../connection";
import {
  pathfinderMatrix,
  isObstacle,
  addToPopulation,
  countPopulation
} from "../maps";

export default class Character {
  constructor(type, animation, user) {
    this.type = type;
    this.uuid = user.uuid;
    this.username = user.username;
    this.animation = animation;
    this.direction = "down";
    this.tilePosition = {
      x: user.position.x,
      y: user.position.y
    };
    this.tilePositionBuffer = {};
    this.sortableChildren = true;

    // Movement variables
    this.isWalking = false;
    this.hasToStop = false;
    this.path = [];
    this.msToReachTile = 200;
    this.distanceEachMs = Game.tileDistance / this.msToReachTile;

    // Movement Buffers
    this.msLeftForFrame = 0; // Remaining ms to move during the frame
    this.msLeft = 0; // Remaining ms to end the movement (ie: reaching a tile)

    // Building the animations
    const sheet = this._buildTextures(this.animation);
    this.container = new PIXI.Container();

    // Sprite
    this.sprite = new PIXI.AnimatedSprite(sheet);
    this.sprite.animationSpeed = 0.14;
    this.sprite.play();

    // Label
    const label = this._label(this.username);

    this.container.addChild(this.sprite);
    this.container.addChild(label);
    this.container.zIndex = this.tilePosition.y;

    // Scale
    this.sprite.width = this.sprite.width * Game.tileScale + 14;
    this.sprite.height = this.sprite.height * Game.tileScale + 14;
    this.sprite.anchor.set(0.5, 0.77); // Center
    this.sprite.zIndex = 1;

    // Place it at the spawning position
    this.setPositionTile(user.position.x, user.position.y);
  }

  //===========================================================================
  // Visuals
  //===========================================================================
  _buildTextures(animation) {
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

  _label(name) {
    // Create the content
    const text = new PIXI.Text(name.trim(), {
      fontFamily: "Arial",
      fontSize: 14,
      fill: 0xffffff,
      align: "center"
    });
    text.anchor.x = 0.5;

    // Create the visual container
    const labelWidth = text.width;
    const labelHeight = text.height;
    const label = new PIXI.Graphics();
    label.lineStyle(0);
    label.beginFill(0x000000, 0.2);
    label.drawRoundedRect(0, 0, labelWidth + 20, labelHeight + 10, 12);
    label.endFill();
    label.position.x = (label.width / 2) * -1;
    label.position.y = Game.tileDistance / 2 + 3;

    // Center the text in the container
    text.position.x = label.width / 2;
    text.position.y = 4;

    // Add child
    label.addChild(text);

    return label;
  }

  _setAnimation(animation, anchorX = 0.5, anchorY = 0.77) {
    if (animation === this.animation) {
      return false;
    }

    this.animation = animation;
    this.sprite.anchor.set(anchorX, anchorY);
    this.sprite.textures = this._buildTextures(animation);
    this.sprite.gotoAndPlay(1);
  }

  //===========================================================================
  // Movements
  //===========================================================================
  nextDirection = () => {
    const $path = this.path;
    const $position = this.tilePosition;

    // If path is empty, exit
    if ($path.length === 0) return false;

    // Fetch the first step in the path
    const gotoPosition = $path[0];

    // Tiles to go to
    const gotoX = gotoPosition[0];
    const gotoY = gotoPosition[1];

    // Set direction
    let direction;
    if (gotoY > $position.y) direction = "down";
    if (gotoY < $position.y) direction = "up";
    if (gotoX > $position.x) direction = "right";
    if (gotoX < $position.x) direction = "left";

    // No direction defined, exit
    if (!direction) return false;

    // This is a new move, set an initial msLeft
    if (this.msLeft === 0) this.msLeft = this.msToReachTile;

    return direction;
  };

  relativeMove(x, y) {
    const tileX = this.tilePosition.x + x;
    const tileY = this.tilePosition.y + y;

    if (!isObstacle(tileX, tileY)) {
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
    this._setAnimation(animation);
    this.direction = direction;
  }

  stand() {
    const animation = `face-${this.direction}`;

    addToPopulation(this);

    const charactersCountOnTile = countPopulation(this.tilePosition);

    // Shift the characters a bit if they share the same tile
    if (charactersCountOnTile > 1) {
      this._setAnimation(animation, random(0.3, 0.7), 0.5);
    } else {
      this._setAnimation(animation);
    }
  }

  // Place the character on this tile and set position in pixel
  setPositionTile(x, y, cleanPosition = false) {
    this.tilePosition.x = x;
    this.tilePosition.y = y;

    if (cleanPosition) {
      this.setPositionPixel(tileToPixel(x), tileToPixel(y));
    }
  }

  // Place the character at this position in pixels
  setPositionPixel(x, y) {
    this.container.zIndex = parseInt(y);
    Game.display.unitsContainer.sortChildren();
    this.container.position.set(x, y);
  }

  //=========================================================================
  // Pathfinding
  //=========================================================================
  setPathTo(destinationX, destinationY) {
    // Fetch the next tile if available
    this.path = this.path.slice(0, 1);

    let x, y;

    // The character is moving, start from the next tile
    if (this.path.length > 0) {
      x = this.path[0][0];
      y = this.path[0][1];
      // No path available, start from the character position
    } else {
      x = this.tilePosition.x;
      y = this.tilePosition.y;
    }

    // Clone the grid so you can use it later
    // Pathfinding destroys it afer use
    const gridClone = pathfinderMatrix.clone();
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
