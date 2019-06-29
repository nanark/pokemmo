// import * as PIXI from "pixi.js";
import GameDisplay from "./GameDisplay";
import Player from "@/assets/scripts/game/actors/Player";
import { moveCharacters } from "@/assets/scripts/game/positions";
import { keyboard } from "@/assets/scripts/game/keyboard";

export const Game = {
  logs: [],
  loaded: false,
  player: {},
  playerDirection: "down",
  population: [],
  ws: null,

  init(userId) {
    this.display = new GameDisplay();
    this.userId = userId;
    this.logIt("Initialize the game.");
  },

  setWebsocket(ws) {
    this.ws = ws;

    if (ws.readyState === 1) {
      this.logIt("Opening Websocket for positions");
    }

    this.ws.onmessage = event => {
      if (this.loaded) {
        const positions = JSON.parse(event.data);

        moveCharacters(positions);
      }
    };
  },

  logIt(message) {
    this.logs.push({ date: Date.now(), message });
  },

  setup() {
    Game.player = new Player();

    const sprite = Game.player.sprite;

    // Capture the keyboard arrow keys
    let left = keyboard("ArrowLeft"),
      up = keyboard("ArrowUp"),
      right = keyboard("ArrowRight"),
      down = keyboard("ArrowDown");

    // Create the `cat` sprite
    sprite.vx = 0;
    sprite.vy = 0;

    //Left arrow key `press` method
    left.press = () => {
      //Change the cat's velocity when the key is pressed
      Game.player.go("left");
      sprite.vx = -5;
      sprite.vy = 0;
    };

    //Left arrow key `release` method
    left.release = () => {
      //If the left arrow has been released, and the right arrow isn't down,
      //and the cat isn't moving vertically:
      //Stop the cat
      Game.player.stand();
      if (!right.isDown && sprite.vy === 0) {
        sprite.vx = 0;
      }
    };

    //Up
    up.press = () => {
      sprite.vy = -5;
      sprite.vx = 0;
      Game.player.go("up");
    };
    up.release = () => {
      Game.player.stand();
      if (!down.isDown && sprite.vx === 0) {
        sprite.vy = 0;
      }
    };

    //Right
    right.press = () => {
      sprite.vx = 5;
      sprite.vy = 0;
      Game.player.go("right");
    };
    right.release = () => {
      Game.player.stand();
      if (!left.isDown && sprite.vy === 0) {
        sprite.vx = 0;
      }
    };

    //Down
    down.press = () => {
      sprite.vy = 5;
      sprite.vx = 0;
      Game.player.go("down");
    };
    down.release = () => {
      Game.player.stand();
      if (!up.isDown && sprite.vx === 0) {
        sprite.vy = 0;
      }
    };
  }
};
