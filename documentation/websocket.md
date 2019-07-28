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
    "uuid": "xRTEx452h",
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
    "x": 13,
    "y": 1
  }
}
```

### Broadcasted
```json
{
  "namespace": "position",
  "event_type": "movement",
  "data": {
    "uuid": "xRTEx452h",
    "x": 13,
    "y": 1
  }
}

```
