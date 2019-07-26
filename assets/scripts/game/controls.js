import nipplejs from "nipplejs";
import Keyboard from "pixi.js-keyboard";

let virtualControlDirection;
const virtualControls = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight"
};

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
export const handleControlEvents = () => {
  //===========================================================================
  // Virtual joystick (nipple.js)
  //===========================================================================
  const options = {
    zone: document.getElementById("zone_joystick"),
    mode: "static",
    position: { right: "50%", bottom: "60px" }
  };

  const stick = nipplejs.create(options);

  stick.on("dir end", (evt, data) => {
    if (evt.type === "dir") {
      const virtualDirection = data.direction.angle;
      const arrowDirection = virtualControls[virtualDirection];

      if (virtualControlDirection !== arrowDirection) {
        virtualControlDirection = arrowDirection;
        addPressedControlKey(virtualControlDirection);
      }
    }
    if (evt.type === "end") {
      virtualControlDirection = "";
      pressedControlKeys.length = 0;
    }
  });

  //===========================================================================
  // Keyboard
  //===========================================================================
  Keyboard.events.on("pressed", null, keyCode => {
    if (isControlKey(keyCode)) addPressedControlKey(keyCode);
  });

  Keyboard.events.on("released", null, keyCode => {
    if (isControlKey(keyCode)) removePressedControlKey(keyCode);
  });
};

//=============================================================================
// Returns the direction for the loop
//=============================================================================
export const pressedControlDirections = () => {
  let x = 0;
  let y = 0;
  let direction = "";

  const lastPressed = pressedControlKeys[pressedControlKeys.length - 1];

  const control = controls[lastPressed];
  x += control.x;
  y += control.y;
  direction = control.direction;

  return { x, y, direction };
};
