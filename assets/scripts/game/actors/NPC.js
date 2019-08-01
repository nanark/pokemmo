import Character from "./Character";
import { Game } from "../Game";

export default class NPC extends Character {
  constructor(user) {
    super("character", "face-down", user);

    const $display = Game.display;

    this.setPositionTile(this.tilePosition.x, this.tilePosition.y, true);

    // Add the player to the stage
    $display.unitsContainer.addChild(this.container);
  }
}
