import Character from "./Character";
import { Game } from "../Game";

export default class NPC extends Character {
  constructor(user) {
    super("character", "face-down", user);

    // Add the player to the stage
    Game.display.unitsContainer.addChild(this.container);
  }
}
