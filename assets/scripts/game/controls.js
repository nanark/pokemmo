import nipplejs from "nipplejs";
import Keyboard from "pixi.js-keyboard";
import { displayMode } from "./utils";

// nippleJs variables
let _virtualDirectionBuffer;
const _virtualControls = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight"
};

const _controls = {
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

// Control keys pressed
export const pressedControlKeys = [];

// Return a boolean if any control key is pressed
export const isControlKeyPressed = () => !!pressedControlKeys.length;

// Convrol events for Game
export const handleControlEvents = () => {
  _handleVirtualStick();
  _handleKeyboard();
};

// Returns the direction for the loop
export const pressedControlDirections = () => {
  let x = 0;
  let y = 0;
  let direction = "";

  const lastPressed = pressedControlKeys[pressedControlKeys.length - 1];
  const control = _controls[lastPressed];

  x += control.x;
  y += control.y;
  direction = control.direction;

  return { x, y, direction };
};

// Check if key pressed is meant for direction
const _isControlKey = keyCode => {
  return !!_controls[keyCode];
};

// A control key is pressed, add it at the end of pressedControlKeys[]
const _addKey = keyCode => {
  pressedControlKeys.push(keyCode);
};

// A control key is released, remove it from pressedControlKeys[]
const _removeKey = keyCode => {
  for (var i = 0; i < pressedControlKeys.length; i++) {
    if (pressedControlKeys[i] === keyCode) {
      pressedControlKeys.splice(i, 1);
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
let _stick;
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
      const arrowDirection = _virtualControls[direction]; // ArrowUp ArrowDown...

      // Direction is sent, add key to pressedControlKeys[]
      if (_virtualDirectionBuffer !== arrowDirection) {
        _virtualDirectionBuffer = arrowDirection;
        _addKey(arrowDirection);
      }
    }

    // Direction is released, reset pressedControlKeys[]
    // Do not keep control key history as with the keyboard control
    if (evt.type === "end") {
      _virtualDirectionBuffer = "";
      pressedControlKeys.length = 0;
    }
  });
};
