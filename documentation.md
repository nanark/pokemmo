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

## Messages

### Sent from the player
```json
{
  "namespace": "chat",
  "event_type": "message",
  "data": {
    "message": "😂 Lol c'est super drôle ma gueule !"
  }
}
```

### Broadcasted
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

## Positions

### Sent from the player
```json
{
  "namespace": "position",
  "event_type": "movement",
  "data": {
    "x": 143,
    "y": 120,
  }
}
```

### Broadcasted
```json
{
  "namespace": "position",
  "event_type": "movement",
  "data": [
    {
      "user": {
        "id": "xRTEx452h",
        "username": "Graouh"
      },
      "x": 143,
      "y": 120,
    }
  ]
}

```
