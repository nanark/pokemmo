import Keyboard from "pixi.js-keyboard";
import * as PIXI from "pixi.js";
import { Game } from "./Game";
import { logIt } from "./utils";

const gameloop = delta => {
  // Dynamic travel
  Game.msBetweenFrames = 1000 / Game.display.app.ticker.FPS;
  const _viewport = Game.display.viewport;
  const _player = Game.display.player;

  Game.stats.begin();

  // Set the time elapsed between frames
  const msElapsed = Game.msBetweenFrames + delta;

  // Move the player if isWalking is true
  if (_player.isWalking) moveloop(_player, msElapsed);

  // If path is over and no msLeft, the player has stopped:
  // * Set isWalking to false
  // * Pause the follow mode for the viewport
  if (_player.path.length === 0 && _player.msLeft === 0) {
    _player.isWalking = false;

    // Stop following the player, activate the free scroll
    _viewport.plugins.pause("follow");
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

  scrollWithKeyboard(delta);

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
        character.stand();
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

const scrollWithKeyboard = delta => {
  const _viewport = Game.display.viewport;

  const scrollSpeed = 10;
  let keyDown = false;
  let vy = 0;
  let vx = 0;

  if (Keyboard.isKeyDown("ArrowUp", "KeyW")) {
    vy += scrollSpeed;
    keyDown = true;
  }

  if (Keyboard.isKeyDown("ArrowDown", "KeyS")) {
    vy -= scrollSpeed;
    keyDown = true;
  }

  if (Keyboard.isKeyDown("ArrowLeft", "KeyA")) {
    vx += scrollSpeed;
    keyDown = true;
  }

  if (Keyboard.isKeyDown("ArrowRight", "KeyD")) {
    vx -= scrollSpeed;
    keyDown = true;
  }

  if (keyDown) {
    const newX = _viewport.position.x + addDelta(vx, delta);
    const newY = _viewport.position.y + addDelta(vy, delta);
    const maxX = ~~(_viewport.width - Math.abs(newX));
    const maxY = ~~(_viewport.height - Math.abs(newY));

    if (newX < 0 && maxX >= window.innerWidth) {
      _viewport.position.x = newX;
    }

    if (newY < 0 && maxY >= window.innerHeight) {
      _viewport.position.y = newY;
    }
  }

  Keyboard.update();
};

const addDelta = (value, delta) => {
  if (value > 0) return value + delta;
  if (value < 0) return value - delta;
  return value;
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
