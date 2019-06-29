import Character from "./Character";
import { Game } from "@/assets/scripts/game/Game";

export default class Player extends Character {
  constructor() {
    super("character", "face-down");

    // Add the player to the stage
    console.log(this.sprite);
    Game.display.app.stage.addChild(this.sprite);
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
