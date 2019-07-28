import Character from "./Character";
import { Game } from "../Game";

export default class NPC extends Character {
  constructor(user) {
    super("character", "face-down", user);

    const _display = Game.display;

    this.setPositionTile(this.position.x, this.position.y, true);

    // Add the player to the stage
    _display.unitsContainer.addChild(this.container);
  }
}
