import Character from "./Character";
import { Game } from "../Game";

export default class Player extends Character {
  isWalking = false;
  path = [];

  constructor() {
    super("character", "face-down");

    // Add the player to the stage
    Game.display.unitsContainer.addChild(this.sprite);

    // Prepare the follow plugin for the viewport.
    // Pause it to enable it only when the character is moving.
    Game.display.viewport.follow(this.sprite, { speed: 40 });
    Game.display.viewport.plugins.pause("follow");
  }

  go(direction) {
    const animation = `walk-${direction}`;
    this.setAnimation(animation);
    Game.display.playerDirection = direction;
  }

  stand() {
    const animation = `face-${Game.display.playerDirection}`;
    this.setAnimation(animation);
  }
}
