import Keyboard from "pixi.js-keyboard";
import * as PIXI from "pixi.js";
import { Game } from "./Game";
import { logIt } from "./utils";

// Send the player position if he moved
// const sendPosition = () => {
//   // const currentPosition = [Game.display.player.sprite.x, Game.display.player.sprite.y];
//   // if (isEqual(previousPosition, currentPosition)) {
//   //   if (isMoving) {
//   //     sendingPosition();
//   //     isMoving = false;
//   //   }
//   //   return false;
//   // }
//   // previousPosition = currentPosition;
//   // isMoving = true;
//   // // Sending via websocket
//   // sendingPosition();
// };

// const sendingPosition = () => {
//   const position = {
//     namespace: "position",
//     event_type: "movement",
//     data: {
//       x: ~~Game.display.player.sprite.x,
//       y: ~~Game.display.player.sprite.y,
//       animation: Game.display.player.animation
//     }
//   };
//   Game.ws.send(JSON.stringify(position));
// };

const gameloop = delta => {
  const _viewport = Game.display.viewport;
  const _player = Game.display.player;

  Game.stats.begin();

  // Set the time elapsed between frames
  const msElapsed = Game.msBetweenFrames + delta;

  // Move the player if isWalking is true
  if (_player.isWalking) moveloop(msElapsed);

  // If path is over and no msLeft, the player has stopped.
  // Set isWalking to false
  if (_player.path.length === 0 && _player.msLeft === 0) {
    _player.isWalking = false;

    _viewport.plugins.pause("follow");
  }

  scrollWithKeyboard(delta);

  Game.stats.end();
};

// Moving loop for the character.
// Based on time elapsed routine.
const moveloop = msElapsed => {
  const _display = Game.display;
  const _player = Game.display.player;

  // Set the buffer for that frame.
  // The loop will go on until that buffer is empty.
  _player.msElapsedBuffer = msElapsed;

  while (_player.msElapsedBuffer > 0) {
    // Move the character until msElapsedBuffer or msLeft is empty.
    moving();

    // The current step is done, set the position based on tile
    // to avoid position with decimals.
    // Fetch the new step if available. If not, stop the animation
    // and break the loop.
    if (_player.msLeft === 0) {
      // Set the position with integers.
      const currentTile = _player.path[0];
      _player.setPositionTile(currentTile[0], currentTile[1]);

      // Step is done, remove from path.
      _player.path.shift();

      // No more step available.
      if (_player.path.length === 0) {
        _display.cursorContainer.removeChild(Game.cursorClick);
        _player.stand();
        break;
      }
    }
  }
};

// Moving the player.
const moving = () => {
  const _player = Game.display.player;

  // Where to head.
  const direction = whichDirection();

  // No movement left, exit function and all ms values.
  if (!direction) {
    _player.msElapsedBuffer = 0;
    _player.msLeft = 0;
    return false;
  }

  // Pixels left to travel for that step.
  let distance = 0;

  // The movement requires more time than available for that frame:
  // * substract that time from msLeft
  // * set the distance based on msElapsedBuffer
  // * empty msElapsedBuffer
  if (_player.msLeft >= _player.msElapsedBuffer) {
    _player.msLeft -= _player.msElapsedBuffer;
    distance = _player.msElapsedBuffer * _player.distanceEachMs;
    _player.msElapsedBuffer = 0;

    // The movement last less time than available for that frame:
    // * set the distance based on msLeft
    // * substract msLeft from msElapsedBuffer
    // * empty msLeft
  } else {
    distance = _player.msLeft * _player.distanceEachMs;
    _player.msElapsedBuffer -= _player.msLeft;
    _player.msLeft = 0;
  }

  // Moving the sprite based on the step direction
  switch (direction) {
    case "up":
      _player.sprite.y -= distance;
      _player.go("up");
      break;
    case "down":
      _player.sprite.y += distance;
      _player.go("down");
      break;
    case "left":
      _player.sprite.x -= distance;
      _player.go("left");
      break;
    case "right":
      _player.sprite.x += distance;
      _player.go("right");
      break;
    default:
      break;
  }
};

const whichDirection = () => {
  const _player = Game.display.player;
  const _path = _player.path;

  // If path is empty, exit
  if (_path.length === 0) return false;

  // Fetch the first step in the path
  const gotoPosition = _path[0];

  // Tiles to go to
  const gotoX = gotoPosition[0];
  const gotoY = gotoPosition[1];

  // Set direction
  let direction;
  if (gotoY > _player.position.y) direction = "down";
  if (gotoY < _player.position.y) direction = "up";
  if (gotoX > _player.position.x) direction = "right";
  if (gotoX < _player.position.x) direction = "left";

  // No direction defined, exit
  if (!direction) return false;

  // This is a new move, set an initial msLeft
  if (_player.msLeft === 0) _player.msLeft = _player.msToReachTile;

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
