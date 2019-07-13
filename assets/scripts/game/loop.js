// import Keyboard from "pixi.js-keyboard";
import * as PIXI from "pixi.js";
import { Game } from "@/assets/scripts/game/Game";
import { logIt } from "@/assets/scripts/game/utils";

// Send the player position if he moved
// const sendPosition = () => {
//   // const currentPosition = [Game.player.sprite.x, Game.player.sprite.y];
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
//       x: ~~Game.player.sprite.x,
//       y: ~~Game.player.sprite.y,
//       animation: Game.player.animation
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
  Game.stats.begin();

  // Set metrics for calculations
  pace.msToReachTile = Game.player.msBetweenTiles;
  pace.msBetweenFrames = 1000 / Game.FPS;
  pace.distanceBetweenTiles = Game.tileSize * Game.tileScale;
  pace.distanceEachMs = pace.distanceBetweenTiles / pace.msToReachTile;

  // Set the time elapsed between frames
  const msElapsed = pace.msBetweenFrames + delta;

  // Move the player if isWalking is true
  if (Game.player.isWalking) moveloop(msElapsed);

  // If path is over and no msLeft, the player has stopped.
  // Set isWalking to false
  if (Game.player.path.length === 0 && pace.msLeft === 0) {
    Game.player.isWalking = false;
  }

  Game.stats.end();
};

// Moving loop for the character.
// Based on time elapsed routine.
const moveloop = msElapsed => {
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
      const currentTile = Game.player.path[0];
      Game.player.setPositionTile(currentTile[0], currentTile[1]);

      // Step is done, remove from path.
      Game.player.path.shift();

      // No more step available.
      if (Game.player.path.length === 0) {
        Game.cursorContainer.removeChild(Game.cursorClick);
        Game.player.stand();
        break;
      }
    }
  }
};

// Moving the player.
const moving = () => {
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
      Game.player.sprite.y -= distance;
      Game.player.go("up");
      break;
    case "down":
      Game.player.sprite.y += distance;
      Game.player.go("down");
      break;
    case "left":
      Game.player.sprite.x -= distance;
      Game.player.go("left");
      break;
    case "right":
      Game.player.sprite.x += distance;
      Game.player.go("right");
      break;
    default:
      break;
  }

  scrollWithCharacter(direction, distance);
};

const whichDirection = () => {
  const path = Game.player.path;

  // If path is empty, exit
  if (path.length === 0) return false;

  // Fetch the first step in the path
  const gotoPosition = path[0];

  // Tiles to go to
  const gotoX = gotoPosition[0];
  const gotoY = gotoPosition[1];

  // Set direction
  let direction;
  if (gotoY > Game.player.position.y) direction = "down";
  if (gotoY < Game.player.position.y) direction = "up";
  if (gotoX > Game.player.position.x) direction = "right";
  if (gotoX < Game.player.position.x) direction = "left";

  // No direction defined, exit
  if (!direction) return false;

  // This is a new move, set an initial msLeft
  if (pace.msLeft === 0) pace.msLeft = pace.msToReachTile;

  return direction;
};

const scrollWithCharacter = (direction, distance) => {
  const container = Game.globalContainer;
  const spritePosition = Game.player.sprite.position;
  const display = Game.display;

  const halfCharacter = (Game.tileScale * Game.tileSize) / 2;

  const spriteScreenPositionX =
    spritePosition.x - container.position.x + halfCharacter;

  const spriteScreenPositionY =
    spritePosition.y - container.position.y + halfCharacter;

  const boundRight = spritePosition.x + halfCharacter + display.width / 2;
  const boundBottom = spritePosition.y + halfCharacter + display.height / 2;

  if (spriteScreenPositionX > display.width / 2 || container.position.x < 0) {
    if (boundRight < container.width) {
      switch (direction) {
        case "left":
          container.x += distance;
          break;
        case "right":
          container.x -= distance;
          break;
        default:
          break;
      }
    }

    if (container.x > 0) container.x = 0;
  }
  if (spriteScreenPositionY > display.height / 2 || container.position.y < 0) {
    if (boundBottom < container.height) {
      switch (direction) {
        case "up":
          container.y += distance;
          break;
        case "down":
          container.y -= distance;
          break;
        default:
          break;
      }
    }

    if (container.y > 0) container.y = 0;
  }
};

// const scrollWithKeyboard = delta => {
//   const toto = true;
//   if (toto) {
//     return false;
//   }
//   let keyDown = false;
//   let vy = 0;
//   let vx = 0;

//   if (Keyboard.isKeyDown("KeyW")) {
//     vy += 4;
//     keyDown = true;
//   }

//   if (Keyboard.isKeyDown("KeyS")) {
//     vy += -4;
//     keyDown = true;
//   }

//   if (Keyboard.isKeyDown("KeyA")) {
//     vx += 4;
//     keyDown = true;
//   }

//   if (Keyboard.isKeyDown("KeyD")) {
//     vx += -4;
//     keyDown = true;
//   }

//   if (keyDown) {
//     const newX = Game.globalContainer.position.x + addDelta(vx, delta);
//     const newY = Game.globalContainer.position.y + addDelta(vy, delta);
//     const maxX = ~~(Game.globalContainer.width - Math.abs(newX));
//     const maxY = ~~(Game.globalContainer.height - Math.abs(newY));

//     if (newX < 0 && maxX >= window.innerWidth) {
//       Game.globalContainer.position.x = newX;
//     }

//     if (newY < 0 && maxY >= window.innerHeight) {
//       Game.globalContainer.position.y = newY;
//     }
//   }

//   Keyboard.update();
// };

// const addDelta = (value, delta) => {
//   if (value > 0) {
//     return value + delta;
//   }

//   if (value < 0) {
//     return value - delta;
//   }

//   return value;
// };

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
