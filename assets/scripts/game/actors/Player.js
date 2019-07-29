import Character from "./Character";
import { Game } from "../Game";
import { gates } from "../levels";
import { sendPositionBeacon } from "../db";

export default class Player extends Character {
  constructor(user) {
    super("character", "face-down", user);

    const _display = Game.display;
    const _viewport = Game.display.viewport;

    // Add the player to the stage
    _display.unitsContainer.addChild(this.container);

    // Prepare the follow plugin for the viewport.
    // Pause it to enable it only when the character is moving.
    _viewport.follow(this.container, { speed: 40 });
  }

  setPositionTile(x, y, cleanPosition = false) {
    super.setPositionTile(x, y, cleanPosition);

    // Send the position beacon for the server
    const payload = { x, y };
    sendPositionBeacon(payload);

    // Is on a gate
    if (gates[y][x]) {
      // Fetch data for teleport
      let [, gotoX, gotoY, moveX, moveY] = gates[y][x]
        .split(",")
        .map((item, i) => {
          return i > 0 ? parseInt(item) : item;
        });

      this.setPositionTile(gotoX, gotoY, true);
      // Teleport
      setTimeout(() => {
        setTimeout(() => {
          this.relativeMove(moveX, moveY);
        }, 300);
      }, 100);
    }
  }
}
