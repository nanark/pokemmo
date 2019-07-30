import nipplejs from "nipplejs";
import Keyboard from "pixi.js-keyboard";
import { displayMode } from "./utils";

//=============================================================================
// Handle all controls for the game
//
// isControlKeyPressed(): Returns boolean if any control key is pressed
// pressedControlDirections(): Returns a direction object with x, y, and
//   direction
// handleControlEvents(): Activate the control events for the game.
//   Both virtual stick (nipple) and keyboard.
//=============================================================================

let _stick; // Virtual stick object
let _stickDirectionBuffer; // Virtual stick direction pressed
const _pressedControlKeysBuffer = []; // Control keys pressed with history

// Direction mapping for stick and keyboard
const _stickControls = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight"
};
const _keyboardControls = {
  ArrowUp: {
    x: 0,
    y: -1,
    direction: "up"
  },
  ArrowDown: {
    x: 0,
    y: 1,
    direction: "down"
  },
  ArrowLeft: {
    x: -1,
    y: 0,
    direction: "left"
  },
  ArrowRight: {
    x: 1,
    y: 0,
    direction: "right"
  }
};

// Return a boolean if any control key is pressed
export const isControlKeyPressed = () => !!_pressedControlKeysBuffer.length;

// Returns the direction for the loop
export const pressedControlDirections = () => {
  let x = 0;
  let y = 0;
  let direction = "";

  const lastPressed =
    _pressedControlKeysBuffer[_pressedControlKeysBuffer.length - 1];
  const control = _keyboardControls[lastPressed];

  x += control.x;
  y += control.y;
  direction = control.direction;

  return { x, y, direction };
};

// Control events for Game
export const handleControlEvents = () => {
  _handleVirtualStick();
  _handleKeyboard();
};

// Check if key pressed is meant for direction
const _isControlKey = keyCode => {
  return !!_keyboardControls[keyCode];
};

// A control key is pressed, add it at the end of _pressedControlKeysBuffer[]
const _addKey = keyCode => {
  _pressedControlKeysBuffer.push(keyCode);
};

// A control key is released, remove it from _pressedControlKeysBuffer[]
const _removeKey = keyCode => {
  for (var i = 0; i < _pressedControlKeysBuffer.length; i++) {
    if (_pressedControlKeysBuffer[i] === keyCode) {
      _pressedControlKeysBuffer.splice(i, 1);
    }
  }
};

//=============================================================================
// Keyboard
//=============================================================================
const _handleKeyboard = () => {
  Keyboard.events.on("pressed", null, keyCode => {
    if (_isControlKey(keyCode)) _addKey(keyCode);
  });

  Keyboard.events.on("released", null, keyCode => {
    if (_isControlKey(keyCode)) {
      _removeKey(keyCode);
    }
  });
};

//=============================================================================
// Virtual joystick (nipple.js)
//=============================================================================
const _handleVirtualStick = () => {
  const { isMobile } = displayMode();

  // Display only for mobile devices
  if (isMobile) {
    _buildStick();

    // When the device change orientation (portrait/landscape)
    // rebuild the stick
    window.addEventListener("orientationchange", () => {
      _buildStick();
    });
  }
};

const _buildStick = () => {
  // Destroy previous instance
  if (_stick) _stick.destroy();

  // Change position depending on orientation
  const { isLandscape } = displayMode();
  const position = isLandscape
    ? { right: "80px", bottom: "80px" }
    : { right: "50%", bottom: "60px" };

  // Create the stick
  const options = {
    zone: document.getElementById("zone_joystick"),
    mode: "static",
    position
  };
  _stick = nipplejs.create(options);

  // Events for nippleJs: https://github.com/yoannmoinet/nipplejs#events
  // dir: detect direction (4 directions with 45˚ angles)
  // end: detect end of direction
  _stick.on("dir end", (evt, data) => {
    if (evt.type === "dir") {
      const direction = data.direction.angle; // up down left right
      const arrowDirection = _stickControls[direction]; // ArrowUp ArrowDown...

      // Direction is sent, add key to _pressedControlKeysBuffer[]
      if (_stickDirectionBuffer !== arrowDirection) {
        _stickDirectionBuffer = arrowDirection;
        _addKey(arrowDirection);
      }
    }

    // Direction is released, reset _pressedControlKeysBuffer[]
    // Do not keep control key history as with the keyboard control
    if (evt.type === "end") {
      _stickDirectionBuffer = "";
      _pressedControlKeysBuffer.length = 0;
    }
  });
};
