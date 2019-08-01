import Keyboard from "pixi.js-keyboard";
import { Game } from "./Game";
import { pressedControlDirections, isControlKeyPressed } from "./controls";

export const gameloop = delta => {
  Game.stats.begin();

  // Set the time elapsed between frames
  const msBetweenFrames = 1000 / Game.display.ticker.FPS;
  const msElapsed = msBetweenFrames + delta;

  _playerMovement(msElapsed);
  _populationMovement(msElapsed);

  // Necessary for pixi.js-keyboard to avoid keyboard glitches (autorun...)
  Keyboard.update();

  Game.stats.end();
};

const _playerMovement = msElapsed => {
  const $player = Game.display.player;

  // Detect direction key pressure
  if (isControlKeyPressed()) walkWithKeyboard();

  // Move the player if isWalking is true
  _moveloop($player, msElapsed);

  // Stop the animation
  if (!$player.isWalking && !isControlKeyPressed()) $player.stand();
};

const _populationMovement = msElapsed => {
  const $population = Game.population;

  // Moving the population
  if ($population.size > 0) {
    for (let npc of $population.values()) {
      // Move the player if isWalking is true
      _moveloop(npc, msElapsed);
    }
  }
};

// Moving loop for the character.
// Based on time elapsed routine.
const _moveloop = (character, msElapsed) => {
  if (!character.isWalking) return;

  const $display = Game.display;

  // Set the buffer for that frame.
  // The loop will go on until that buffer is empty.
  character.msLeftForFrame = msElapsed;

  while (character.msLeftForFrame > 0) {
    // Move the character until msLeftForFrame or msLeft is empty.
    _moveCharacter(character);

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
        $display.cursorContainer.removeChild($display.cursorClick);

        // Stop the animation if no control is pressed.
        // Use to keep the animation if the character walks against an obstacle.
        if (!isControlKeyPressed()) character.stand();
        break;
      }
    }
  }

  // If path is over and no msLeft, the player has stopped:
  // * Set isWalking to false
  // * Pause the follow mode for the viewport
  if (character.path.length === 0 && character.msLeft === 0) {
    character.isWalking = false;
  }
};

// Moving the player.
const _moveCharacter = character => {
  const $sprite = character.container;

  // Where to head.
  const direction = character.nextDirection();

  // No movement left, exit function and all ms values.
  if (!direction) {
    character.msLeftForFrame = 0;
    character.msLeft = 0;
    return false;
  }

  // Pixels left to travel for that step.
  let distance = 0;

  // The movement requires more time than available for that frame:
  // * substract that time from msLeft
  // * set the distance based on msLeftForFrame
  // * empty msLeftForFrame
  if (character.msLeft >= character.msLeftForFrame) {
    character.msLeft -= character.msLeftForFrame;
    distance = character.msLeftForFrame * character.distanceEachMs;
    character.msLeftForFrame = 0;

    // The movement last less time than available for that frame:
    // * set the distance based on msLeft
    // * substract msLeft from msLeftForFrame
    // * empty msLeft
  } else {
    distance = character.msLeft * character.distanceEachMs;
    character.msLeftForFrame -= character.msLeft;
    character.msLeft = 0;
  }

  // Moving the sprite based on the step direction
  let x = $sprite.x;
  let y = $sprite.y;
  switch (direction) {
    case "up":
      y -= distance;
      character.go("up");
      break;
    case "down":
      y += distance;
      character.go("down");
      break;
    case "left":
      x -= distance;
      character.go("left");
      break;
    case "right":
      x += distance;
      character.go("right");
      break;
    default:
      break;
  }

  character.setPositionPixel(x, y);
};

const walkWithKeyboard = () => {
  const $player = Game.display.player;

  const { x, y, direction } = pressedControlDirections();

  $player.go(direction);
  $player.relativeMove(x, y);
};
