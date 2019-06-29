import Character from "./Character";
import { Game } from "@/assets/scripts/game/Game";

export default class NPC extends Character {
  constructor(userId, username) {
    super("character", "face-down");

    this.sprite.width = 15;
    this.sprite.height = 15;

    this.userId = userId;
    this.username = username;

    // Add the player to the stage
    Game.display.app.stage.addChild(this.sprite);
  }
}
