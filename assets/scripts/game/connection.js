import { Game } from "./Game";

// Send the player destination
export const sendPosition = (x, y) => {
  const position = {
    namespace: "position",
    event_type: "movement",
    data: { x, y }
  };
  Game.ws.send(JSON.stringify(position));
};
