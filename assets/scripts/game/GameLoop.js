import Keyboard from "pixi.js-keyboard";
import { isEqual } from "lodash";
import * as PIXI from "pixi.js";
import { Game } from "@/assets/scripts/game/Game";

let tickerTime = 0;
let previousPosition = [0, 0];
let previousPositionDebug = [0, 0];
let isMoving = false;

const displayDebug = delta => {
  const currentPosition = [Game.player.sprite.x, Game.player.sprite.y];
  const differencePosition = [
    Math.abs(~~(currentPosition[0] - previousPositionDebug[0])),
    Math.abs(~~(currentPosition[1] - previousPositionDebug[1]))
  ];

  previousPositionDebug = currentPosition;

  console.log(
    `Delta: ${delta} - Movement: ${differencePosition[0]}x${
      differencePosition[1]
    }px`
  );
};

// Send the player position if he moved
const sendPosition = () => {
  const currentPosition = [Game.player.sprite.x, Game.player.sprite.y];

  if (isEqual(previousPosition, currentPosition)) {
    if (isMoving) {
      sendingPosition();

      isMoving = false;
    }

    return false;
  }

  previousPosition = currentPosition;
  isMoving = true;

  // Sending via websocket
  sendingPosition();
};

const sendingPosition = () => {
  const position = {
    namespace: "position",
    event_type: "movement",
    data: {
      x: ~~Game.player.sprite.x,
      y: ~~Game.player.sprite.y,
      animation: Game.player.animation
    }
  };
  Game.ws.send(JSON.stringify(position));
};

const gameLoop = delta => {
  tickerTime += 1 + delta;

  // Every 1/100s
  if (tickerTime > 1) {
    tickerTime = 0;

    // Send the player position if he moved
    if (Game.online) {
      sendPosition();
    }

    if (Game.debugMode) {
      displayDebug(delta);
    }
  }

  // Moving the player on screen
  movePlayer(delta);
};

const movePlayer = delta => {
  let keyDown = false;
  let vy = 0;
  let vx = 0;

  if (Keyboard.isKeyDown("ArrowUp")) {
    if (!keyDown) {
      Game.player.go("up");
    }
    vy += -4;
    keyDown = true;
  }

  if (Keyboard.isKeyDown("ArrowDown")) {
    if (!keyDown) {
      Game.player.go("down");
    }
    vy += 4;
    keyDown = true;
  }

  if (Keyboard.isKeyDown("ArrowLeft")) {
    if (!keyDown) {
      Game.player.go("left");
    }
    vx += -4;
    keyDown = true;
  }

  if (Keyboard.isKeyDown("ArrowRight")) {
    if (!keyDown) {
      Game.player.go("right");
    }
    vx += 4;
    keyDown = true;
  }

  if (!keyDown || (vx == 0 && vy == 0)) {
    Game.player.stand();
  } else {
    Game.player.sprite.x += addDelta(vx, delta);
    Game.player.sprite.y += addDelta(vy, delta);
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
      Game.logIt("Character loaded.");
    }
  };

  const darkdimension = {
    name: "darkdimension.png",
    url: "images/darkdimension.png",
    onComplete() {
      Game.logIt("Dark loaded.");
    }
  };

  const snow = {
    name: "snow.gif",
    url: "images/snow.gif",
    onComplete() {
      Game.logIt("Snow loaded.");
    }
  };

  const temple = {
    name: "temple.png",
    url: "images/temple.png",
    onComplete() {
      Game.logIt("Temple loaded.");
    }
  };

  // Reset all cache and shared sprites resources
  // Avoid error and warnings during hot reload.
  PIXI.Loader.shared.reset();
  PIXI.utils.clearTextureCache();

  // Loading required assets
  PIXI.Loader.shared
    .add(characters)
    .add(darkdimension)
    .add(snow)
    .add(temple)
    .load(() => {
      Game.logIt("Assets loaded.");
      Game.loaded = true;

      // Setup the game (load player etc.)
      Game.setup();

      // Add a ticker
      Game.display.app.ticker.add(delta => gameLoop(delta));
    });
}
