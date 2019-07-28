import * as _ from "lodash";
import * as PIXI from "pixi.js";
import { Game } from "../Game";
import { tileToPixel, random } from "../utils";
import { sendPosition } from "../connection";
import { pathGrid, charactersGrid, detectObstacle } from "../levels";

export default class Character {
  constructor(type, animation, user) {
    this.type = type;
    this.uuid = user.uuid;
    this.username = user.username;
    this.animation = animation;
    this.direction = "down";
    this.position = {};
    this.position.x = user.position.x;
    this.position.y = user.position.y;
    this.positionBuffer = {};
    this.layers = {};
    this.sortableChildren = true;

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

    // Sprite
    this.layers.sprite = new PIXI.AnimatedSprite(sheet);
    this.layers.sprite.animationSpeed = 0.14;
    this.layers.sprite.play();

    // Label
    const label = this.label(this.username);

    this.container.addChild(this.layers.sprite);
    this.container.addChild(label);
    this.container.zIndex = this.position.y;

    // Scale
    this.layers.sprite.width = this.layers.sprite.width * Game.tileScale + 14;
    this.layers.sprite.height = this.layers.sprite.height * Game.tileScale + 14;
    this.layers.sprite.anchor.set(0.5, 0.77); // Center
    this.layers.sprite.zIndex = 1;

    // Place it at the spawning position
    this.setPositionTile(user.position.x, user.position.y);
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

  label(name) {
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

  setAnimation(animation, anchorX = 0.5, anchorY = 0.77) {
    if (animation === this.animation) {
      return false;
    }

    this.animation = animation;
    this.layers.sprite.anchor.set(anchorX, anchorY);
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
    this._setCharacterOnGrid();

    const charactersCountOnTile = this._countCharactersOnTile();

    // Shift the characters a bit if they share the same tile
    if (charactersCountOnTile > 1) {
      this.setAnimation(animation, random(0.3, 0.7), 0.5);
    } else {
      this.setAnimation(animation);
    }
  }

  _setCharacterOnGrid() {
    // The character hasn't moved, quit
    if (_.isEqual(this.positionBuffer, [this.position.x, this.position.y])) {
      return;
    }

    // Remove the buffer if it exists
    if (this.positionBuffer.length > 0) {
      this._removeFromCharacterGridCell(
        this.positionBuffer[0],
        this.positionBuffer[1]
      );
    }

    this._addFromCharacterGridCell(this.position.x, this.position.y);

    // Keep the last standing position
    this.positionBuffer = [this.position.x, this.position.y];
  }

  _createCharacterGridCell(x, y) {
    if (!charactersGrid[x]) charactersGrid[x] = [];
    if (!charactersGrid[x][y]) charactersGrid[x][y] = [];
  }

  _countCharactersOnTile() {
    const x = this.position.x;
    const y = this.position.y;

    this._createCharacterGridCell(x, y);

    return charactersGrid[x][y].length;
  }

  _addFromCharacterGridCell(x, y) {
    this._createCharacterGridCell(x, y);

    if (!charactersGrid[x][y].includes(this.uuid)) {
      charactersGrid[x][y].push(this.uuid);
    }
  }

  _removeFromCharacterGridCell(x, y) {
    this._createCharacterGridCell(x, y);

    if (charactersGrid[x][y].includes(this.uuid)) {
      const userIds = charactersGrid[x][y];

      charactersGrid[x][y] = userIds.filter(userId => {
        return userId !== this.uuid;
      });
    }
  }

  // Place the character on this tile and set position in pixel
  setPositionTile(x, y, cleanPosition = false) {
    this.position.x = x;
    this.position.y = y;

    if (cleanPosition) {
      this.setPositionPixel(tileToPixel(x), tileToPixel(y));
    }
  }

  // Place the character at this position in pixels
  setPositionPixel(x, y) {
    this.container.zIndex = parseInt(y);
    Game.display.unitsContainer.sortChildren();
    console.log(this.container.zIndex);
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
