import Character from "./Character";
import { Game } from "../Game";

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
}
