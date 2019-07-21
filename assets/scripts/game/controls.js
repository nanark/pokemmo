import Keyboard from "pixi.js-keyboard";

const controls = {
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
export const isControlKeyPressed = () => {
  return !!pressedControlKeys.length;
};

const isControlKey = keyCode => {
  return !!controls[keyCode];
};

// A control key is pressed, add it at the end of pressedControlKeys[]
const addPressedControlKey = keyCode => {
  pressedControlKeys.push(keyCode);
};

// A control key is released, remove it from pressedControlKeys[]
const removePressedControlKey = keyCode => {
  for (var i = 0; i < pressedControlKeys.length; i++) {
    if (pressedControlKeys[i] === keyCode) {
      pressedControlKeys.splice(i, 1);
    }
  }
};

// Events for Game
export const handleKeyboardEvents = () => {
  Keyboard.events.on("pressed", null, keyCode => {
    if (isControlKey(keyCode)) addPressedControlKey(keyCode);
  });

  Keyboard.events.on("released", null, keyCode => {
    if (isControlKey(keyCode)) removePressedControlKey(keyCode);
  });
};

// Returns the direction for the loop
export const pressedControlDirections = () => {
  let x = 0;
  let y = 0;
  let direction = "";

  for (const key of pressedControlKeys) {
    const control = controls[key];
    x += control.x;
    y += control.y;
    direction = control.direction;
  }
  return { x, y, direction };
};
