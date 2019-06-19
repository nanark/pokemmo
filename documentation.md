# Specs

## Namespaces
Each message must declare a namespace attribute and a data object.
```json
{
  "namespace": "player",
  "data": {
    "health": 75
  }
}
```

## Message sent from the player
```json
{
  "namespace": "chat",
  "event_type": "message",
  "data": {
    "message": "😂 Lol c'est super drôle ma gueule !"
  }
}
```

## Message broadcasted
```json
{
  "namespace": "chat",
  "event_type": "message",
  "data": {
    "user": {
      "id": "xRTEx452h",
      "username": "Graouh"
    },
    "message": "😂 Lol c'est super drôle ma gueule !"
  }
}

```
