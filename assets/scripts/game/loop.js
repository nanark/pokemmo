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

export const pace = {
  // Set in gameloop.
  distanceBetweenTiles: 0,
  distanceEachMs: 0,
  msBetweenFrames: 0,
  msToReachTile: 0,

  // Buffers
  msElapsedBuffer: 0,
  msLeft: 0
};

const gameloop = delta => {
  const viewport = Game.display.viewport;
  const player = Game.display.player;

  Game.stats.begin();

  // Set metrics for calculations
  pace.msToReachTile = player.msBetweenTiles;
  pace.msBetweenFrames = 1000 / Game.FPS;
  pace.distanceBetweenTiles = Game.tileSize * Game.tileScale;
  pace.distanceEachMs = pace.distanceBetweenTiles / pace.msToReachTile;

  // Set the time elapsed between frames
  const msElapsed = pace.msBetweenFrames + delta;

  // Move the player if isWalking is true
  if (player.isWalking) moveloop(msElapsed);

  // If path is over and no msLeft, the player has stopped.
  // Set isWalking to false
  if (player.path.length === 0 && pace.msLeft === 0) {
    player.isWalking = false;

    viewport.plugins.pause("follow");
  }

  scrollWithKeyboard(delta);

  Game.stats.end();
};

// Moving loop for the character.
// Based on time elapsed routine.
const moveloop = msElapsed => {
  const display = Game.display;
  const player = Game.display.player;

  // Set the buffer for that frame.
  // The loop will go on until that buffer is empty.
  pace.msElapsedBuffer = msElapsed;

  while (pace.msElapsedBuffer > 0) {
    // Move the character until msElapsedBuffer or msLeft is empty.
    moving();

    // The current step is done, set the position based on tile
    // to avoid position with decimals.
    // Fetch the new step if available. If not, stop the animation
    // and break the loop.
    if (pace.msLeft === 0) {
      // Set the position with integers.
      const currentTile = player.path[0];
      player.setPositionTile(currentTile[0], currentTile[1]);

      // Step is done, remove from path.
      player.path.shift();

      // No more step available.
      if (player.path.length === 0) {
        display.cursorContainer.removeChild(Game.cursorClick);
        player.stand();
        break;
      }
    }
  }
};

// Moving the player.
const moving = () => {
  const player = Game.display.player;

  // Where to head.
  const direction = whichDirection();

  // No movement left, exit function and all ms values.
  if (!direction) {
    pace.msElapsedBuffer = 0;
    pace.msLeft = 0;
    return false;
  }

  // Pixels left to travel for that step.
  let distance = 0;

  // The movement requires more time than available for that frame:
  // * substract that time from msLeft
  // * set the distance based on msElapsedBuffer
  // * empty msElapsedBuffer
  if (pace.msLeft >= pace.msElapsedBuffer) {
    pace.msLeft -= pace.msElapsedBuffer;
    distance = pace.msElapsedBuffer * pace.distanceEachMs;
    pace.msElapsedBuffer = 0;

    // The movement last less time than available for that frame:
    // * set the distance based on msLeft
    // * substract msLeft from msElapsedBuffer
    // * empty msLeft
  } else {
    distance = pace.msLeft * pace.distanceEachMs;
    pace.msElapsedBuffer -= pace.msLeft;
    pace.msLeft = 0;
  }

  // Moving the sprite based on the step direction
  switch (direction) {
    case "up":
      player.sprite.y -= distance;
      player.go("up");
      break;
    case "down":
      player.sprite.y += distance;
      player.go("down");
      break;
    case "left":
      player.sprite.x -= distance;
      player.go("left");
      break;
    case "right":
      player.sprite.x += distance;
      player.go("right");
      break;
    default:
      break;
  }
};

const whichDirection = () => {
  const player = Game.display.player;
  const path = player.path;

  // If path is empty, exit
  if (path.length === 0) return false;

  // Fetch the first step in the path
  const gotoPosition = path[0];

  // Tiles to go to
  const gotoX = gotoPosition[0];
  const gotoY = gotoPosition[1];

  // Set direction
  let direction;
  if (gotoY > player.position.y) direction = "down";
  if (gotoY < player.position.y) direction = "up";
  if (gotoX > player.position.x) direction = "right";
  if (gotoX < player.position.x) direction = "left";

  // No direction defined, exit
  if (!direction) return false;

  // This is a new move, set an initial msLeft
  if (pace.msLeft === 0) pace.msLeft = pace.msToReachTile;

  return direction;
};

const scrollWithKeyboard = delta => {
  const viewport = Game.display.viewport;

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
    const newX = viewport.position.x + addDelta(vx, delta);
    const newY = viewport.position.y + addDelta(vy, delta);
    const maxX = ~~(viewport.width - Math.abs(newX));
    const maxY = ~~(viewport.height - Math.abs(newY));

    if (newX < 0 && maxX >= window.innerWidth) {
      viewport.position.x = newX;
    }

    if (newY < 0 && maxY >= window.innerHeight) {
      viewport.position.y = newY;
    }
  }

  Keyboard.update();
};

const addDelta = (value, delta) => {
  if (value > 0) {
    return value + delta;
  }

  if (value < 0) {
    return value - delta;
  }

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
