import Character from "./Character";
import { Game } from "@/assets/scripts/game/Game";

export default class Player extends Character {
  isWalking = false;
  path = [];

  constructor() {
    super("character", "face-down");

    // Add the player to the stage
    Game.unitsContainer.addChild(this.sprite);
  }

  go(direction) {
    const animation = `walk-${direction}`;
    this.setAnimation(animation);
    Game.playerDirection = direction;
  }

  stand() {
    const animation = `face-${Game.playerDirection}`;
    this.setAnimation(animation);
  }
}
