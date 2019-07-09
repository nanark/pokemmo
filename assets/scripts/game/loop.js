import Keyboard from "pixi.js-keyboard";
import { isEqual } from "lodash";
import * as PIXI from "pixi.js";
import { Game } from "@/assets/scripts/game/Game";
import { displayDebug, logIt } from "@/assets/scripts/game/utils";
import { Bump } from "@/assets/scripts/libs/Bump";

let tickerTime = 0;
let previousPosition = [0, 0];
// let isMoving = false;

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

const stepsBetweenTiles = 8; // Number of ticks between 2 tiles
let gotoPosition = {}; // Destination
let stepsToDestination = 0;

const gameloop = delta => {
  Game.stats.begin();

  tickerTime += 1 + delta;

  // if (tickerTime > 10) {
  let b = new Bump();
  b.hit(Game.player.sprite, Game.obstacles, true, true, true);
  // }

  // Every 1/100s
  if (tickerTime > 1) {
    tickerTime = 0;

    // Send the player position if he moved
    // if (Game.online) {
    //   sendPosition();
    // }

    if (Game.debugMode) {
      displayDebug(delta);
    }
  }

  // Moving the player on screen
  scrollWithKeyboard(delta);

  movePlayer(delta);

  const currentPosition = [Game.player.sprite.x, Game.player.sprite.y];

  if (isEqual(previousPosition, currentPosition)) {
    Game.player.stand();
  }
  previousPosition = currentPosition;

  Game.stats.end();
};

const movePlayer = delta => {
  // Load a new path step if the speedTicker is at 0 (== animation done)
  if (Game.path.length > 0 && stepsToDestination === 0) {
    // Init the steps to arrive to destination (== speed)
    stepsToDestination = stepsBetweenTiles;

    // Fetch the next tile to go to
    const newPosition = Game.path.shift();

    // New destination for that step
    gotoPosition = { x: newPosition[0], y: newPosition[1] };
  }

  // Set velocity
  let vx = 0;
  let vy = 0;

  // Number of pixels to travel between 2 steps
  const pixelsByStep = (Game.tileSize * Game.tileScale) / stepsBetweenTiles;

  // If steps are still necessary and gotoPosition is available
  if (
    stepsToDestination > 0 &&
    gotoPosition.x !== undefined &&
    gotoPosition.y !== undefined
  ) {
    // Tiles to go to
    const gotoX = gotoPosition.x;
    const gotoY = gotoPosition.y;

    // Set velocity based on difference between actual position and destination
    if (gotoX > Game.player.position.x) {
      vx += pixelsByStep + delta;
    }
    if (gotoY > Game.player.position.y) {
      vy += pixelsByStep + delta;
    }
    if (gotoX < Game.player.position.x) {
      vx -= pixelsByStep - delta;
    }
    if (gotoY < Game.player.position.y) {
      vy -= pixelsByStep - delta;
    }

    // Set animation
    if (vy < 0) {
      Game.player.go("up");
    } else if (vy > 0) {
      Game.player.go("down");
    } else if (vx > 0) {
      Game.player.go("right");
    } else if (vx < 0) {
      Game.player.go("left");
    }

    // Move the sprite
    Game.player.setPositionPixel(
      Game.player.sprite.position.x + vx,
      Game.player.sprite.position.y + vy
    );

    // One less step
    stepsToDestination--;

    // Set the player at the precise position to avoid gap due to decimal
    if (stepsToDestination === 0) {
      Game.player.setPositionTile(gotoPosition.x, gotoPosition.y);
    }
  }
};

const scrollWithKeyboard = delta => {
  let keyDown = false;
  let vy = 0;
  let vx = 0;

  if (Keyboard.isKeyDown("KeyW")) {
    vy += 4;
    keyDown = true;
  }

  if (Keyboard.isKeyDown("KeyS")) {
    vy += -4;
    keyDown = true;
  }

  if (Keyboard.isKeyDown("KeyA")) {
    vx += 4;
    keyDown = true;
  }

  if (Keyboard.isKeyDown("KeyD")) {
    vx += -4;
    keyDown = true;
  }

  if (keyDown) {
    const newX = Game.globalContainer.position.x + addDelta(vx, delta);
    const newY = Game.globalContainer.position.y + addDelta(vy, delta);
    const maxX = ~~(Game.globalContainer.width - Math.abs(newX));
    const maxY = ~~(Game.globalContainer.height - Math.abs(newY));

    if (newX < 0 && maxX >= window.innerWidth) {
      Game.globalContainer.position.x = newX;
    }

    if (newY < 0 && maxY >= window.innerHeight) {
      Game.globalContainer.position.y = newY;
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

      // Add a ticker
      Game.display.app.ticker.add(delta => gameloop(delta));
    });
}
