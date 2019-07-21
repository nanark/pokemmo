import Keyboard from "pixi.js-keyboard";
import * as PIXI from "pixi.js";
import { Game } from "./Game";
import { logIt } from "./utils";

const gameloop = delta => {
  const _player = Game.display.player;

  Game.stats.begin();

  // Set the time elapsed between frames
  const msBetweenFrames = 1000 / Game.display.app.ticker.FPS;
  const msElapsed = msBetweenFrames + delta;

  // Move the player if isWalking is true
  if (_player.isWalking) moveloop(_player, msElapsed);

  // If path is over and no msLeft, the player has stopped:
  // * Set isWalking to false
  // * Pause the follow mode for the viewport
  if (_player.path.length === 0 && _player.msLeft === 0) {
    _player.isWalking = false;
  }

  if (!hasKeyDirectionDown() && !_player.isWalking) {
    _player.stand();
  }

  // Moving the population
  if (Game.population.size > 0) {
    for (let npc of Game.population.values()) {
      // Move the player if isWalking is true
      if (npc.isWalking) moveloop(npc, msElapsed);

      // If path is over and no msLeft, the player has stopped:
      // * Set isWalking to false
      // * Pause the follow mode for the viewport
      if (npc.path.length === 0 && npc.msLeft === 0) {
        npc.isWalking = false;
      }
    }
  }

  if (hasKeyDirectionDown()) {
    walkWithKeyboard();
  }

  Game.stats.end();
};

// Moving loop for the character.
// Based on time elapsed routine.
const moveloop = (character, msElapsed) => {
  const _display = Game.display;

  // Set the buffer for that frame.
  // The loop will go on until that buffer is empty.
  character.msElapsedBuffer = msElapsed;

  while (character.msElapsedBuffer > 0) {
    // Move the character until msElapsedBuffer or msLeft is empty.
    moving(character);

    // The current step is done, set the position based on tile
    // to avoid position with decimals.
    // Fetch the new step if available. If not, stop the animation
    // and break the loop.
    if (character.msLeft === 0) {
      // Set the position with integers.
      const currentTile = character.path[0];
      character.setPositionTile(currentTile[0], currentTile[1]);

      // Step is done, remove from path.
      character.path.shift();

      // No more step available.
      if (character.path.length === 0) {
        _display.cursorContainer.removeChild(Game.cursorClick);
        if (!hasKeyDirectionDown()) {
          character.stand();
        }
        break;
      }
    }
  }
};

// Moving the player.
const moving = character => {
  const _sprite = character.container;

  // Where to head.
  const direction = whichDirection(character);

  // No movement left, exit function and all ms values.
  if (!direction) {
    character.msElapsedBuffer = 0;
    character.msLeft = 0;
    return false;
  }

  // Pixels left to travel for that step.
  let distance = 0;

  // The movement requires more time than available for that frame:
  // * substract that time from msLeft
  // * set the distance based on msElapsedBuffer
  // * empty msElapsedBuffer
  if (character.msLeft >= character.msElapsedBuffer) {
    character.msLeft -= character.msElapsedBuffer;
    distance = character.msElapsedBuffer * character.distanceEachMs;
    character.msElapsedBuffer = 0;

    // The movement last less time than available for that frame:
    // * set the distance based on msLeft
    // * substract msLeft from msElapsedBuffer
    // * empty msLeft
  } else {
    distance = character.msLeft * character.distanceEachMs;
    character.msElapsedBuffer -= character.msLeft;
    character.msLeft = 0;
  }

  // Moving the sprite based on the step direction
  switch (direction) {
    case "up":
      _sprite.y -= distance;
      character.go("up");
      break;
    case "down":
      _sprite.y += distance;
      character.go("down");
      break;
    case "left":
      _sprite.x -= distance;
      character.go("left");
      break;
    case "right":
      _sprite.x += distance;
      character.go("right");
      break;
    default:
      break;
  }
};

const whichDirection = character => {
  const _path = character.path;

  // If path is empty, exit
  if (_path.length === 0) return false;

  // Fetch the first step in the path
  const gotoPosition = _path[0];

  // Tiles to go to
  const gotoX = gotoPosition[0];
  const gotoY = gotoPosition[1];

  // Set direction
  let direction;
  if (gotoY > character.position.y) direction = "down";
  if (gotoY < character.position.y) direction = "up";
  if (gotoX > character.position.x) direction = "right";
  if (gotoX < character.position.x) direction = "left";

  // No direction defined, exit
  if (!direction) return false;

  // This is a new move, set an initial msLeft
  if (character.msLeft === 0) character.msLeft = character.msToReachTile;

  return direction;
};

const hasKeyDirectionDown = () => {
  if (Keyboard.isKeyDown("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight")) {
    return true;
  }
  return false;
};

const arrows = ["up", "down", "left", "right"];

const walkWithKeyboard = () => {
  const _player = Game.display.player;

  if (_player.isWalking && _player.msLeft) {
    return;
  }

  let keyDown = false;
  let vx = 0;
  let vy = 0;

  const keyboard = {
    up: {
      key: "ArrowUp",
      x: 0,
      y: -1,
      direction: "up"
    },
    down: {
      key: "ArrowDown",
      x: 0,
      y: 1,
      direction: "down"
    },
    left: {
      key: "ArrowLeft",
      x: -1,
      y: 0,
      direction: "left"
    },
    right: {
      key: "ArrowRight",
      x: 1,
      y: 0,
      direction: "right"
    }
  };

  for (const [index, arrow] of arrows.slice(0).entries()) {
    const key = keyboard[arrow].key;
    const direction = keyboard[arrow].direction;
    const x = keyboard[arrow].x;
    const y = keyboard[arrow].y;

    if (Keyboard.isKeyDown(key)) {
      _player.go(direction);
      vx += x;
      vy += y;
      keyDown = true;

      arrows.push(arrows.splice(index, 1)[0]);
      break;
    }
  }

  if (keyDown) {
    _player.relativeMove(vx, vy);
  }

  Keyboard.update();
};

// Loading all resources and add the gameloop in the ticker.
export function loadResources() {
  const characters = {
    name: "character",
    url: "packs/character.json",
    onComplete() {
      logIt("Character loaded.");
    }
  };

  const magiscarf = {
    name: "magiscarf.png",
    url: "images/magiscarf.png",
    onComplete() {
      logIt("magiscarf loaded.");
    }
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
      logIt("Assets loaded.");
      Game.loaded = true;

      // Setup the game (load player etc.)
      Game.setup();

      // Add a tickerTime
      Game.display.app.ticker.maxFPS = Game.FPS;
      Game.display.app.ticker.add(delta => gameloop(delta));
    });
}
