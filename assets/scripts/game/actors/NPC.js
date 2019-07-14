import Character from "./Character";
import { Game } from "../Game";

export default class NPC extends Character {
  constructor(userId, username) {
    super("character", "face-down");

    this.userId = userId;
    this.username = username;

    // Add the player to the stage
    Game.display.unitsContainer.addChild(this.sprite);
  }
}
