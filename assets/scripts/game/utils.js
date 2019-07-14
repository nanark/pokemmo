import { Game } from "./Game";

let previousPositionDebug = [0, 0];

export const pixelToTile = value => {
  return value / Game.tileScale / Game.tileSize;
};

export const tileToPixel = value => {
  return value * Game.tileScale * Game.tileSize;
};

export const displayDebug = delta => {
  const _sprite = Game.display.player.container;
  const currentPosition = [_sprite.x, _sprite.y];
  const differencePosition = [
    Math.abs(~~(currentPosition[0] - previousPositionDebug[0])),
    Math.abs(~~(currentPosition[1] - previousPositionDebug[1]))
  ];

  previousPositionDebug = currentPosition;

  console.log(
    `Delta: ${delta} - Movement: ${differencePosition[0]}x${
      differencePosition[1]
    }px`
  );
};

export const logIt = message => {
  Game.logs.push({ date: Date.now(), message });
};
