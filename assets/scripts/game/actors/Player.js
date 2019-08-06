import Character from "./Character";
import { Game } from "../Game";
import { matrix } from "../maps";
import { sendPositionBeacon } from "../db";
import { sendPosition } from "../connection";

export default class Player extends Character {
  controllable = true;

  constructor(user) {
    super("character", "face-down", user);

    const $display = Game.display;
    const $viewport = Game.display.viewport;

    // Add the player to the stage
    $display.unitsContainer.addChild(this.container);

    // Prepare the follow plugin for the viewport.
    // Pause it to enable it only when the character is moving.
    $viewport.follow(this.container, { speed: 40 });

    // Send the position
    sendPosition(this.tilePosition.x, this.tilePosition.y);
  }

  setPositionTile(x, y, cleanPosition = false) {
    super.setPositionTile(x, y, cleanPosition);

    // Send the position beacon for the server
    const payload = { x, y };
    sendPositionBeacon(payload);

    // Is on a gate
    if (!matrix[y][x].gate) return;

    // Try to just stop the character
    this.isWalking = false;
    this.controllable = false;

    // Fetch data for teleport
    let [, gotoX, gotoY, moveX, moveY] = matrix[y][x].gate
      .split(",")
      .map((item, i) => {
        return i > 0 ? parseInt(item) : item;
      });

    // Teleport
    setTimeout(() => {
      this.setPositionTile(gotoX, gotoY, true);
      // Teleport
      setTimeout(() => {
        this.relativeMove(moveX, moveY);
        setTimeout(() => {
          this.controllable = true;
        }, 50);
      }, 500);
    }, 100);
  }
}
