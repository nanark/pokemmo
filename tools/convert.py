import json
import math

jsonMapFile = open(
  "../static/sources/test-map.json",
  "r"
)

content = json.loads(jsonMapFile.read())
tileSize = 16

layers = content['layers']
layersCount = len(layers)
height = content['height']
width = content['width']
tilesets = []
output = []

for tileset in content['tilesets']:
    data = dict()
    data['first_gid'] = tileset['firstgid']
    data['columns'] = tileset['columns']
    data['image'] = tileset['image']
    data['tiles_count'] = tileset['tilecount']
    data['rows'] = math.ceil(tileset['tilecount'] / tileset['columns'])
    tilesets.append(data)

x = 0
y = 0

for tileNumber in range(width * height):
    data = dict()
    data['x'] = x
    data['y'] = y

    x += 1

    data['tiles'] = []
    data['properties'] = dict()

    # Loop layers to parse
    for layer in layers:

        # Fetch the tile Id from the current layer
        tileId = layer['data'][tileNumber]

        # Tiles dictionary
        tiles = dict()

        # Check tile presence
        if (tileId > 0):

            # Append tile properties to layer
            if layer.get('properties', None) is not None:
                for prop in layer['properties']:

                    # Don't append False values for Bool props
                    if ((prop['type'] == 'bool' and prop['value'] is True) or
                            (prop['type'] != 'bool')):
                        data['properties'][prop['name']] = prop['value']

            opacity = layer['opacity']
            visible = layer['visible']

            # Only different from full visibility
            if opacity < 1:
                tiles['opacity'] = layer['opacity']

            # Indicate only different from True
            if visible is False:
                tiles['visible'] = layer['visible']

            # Search for the tileset targeted via the first_gid
            for tileset in tilesets:
                tileIdMax = tileset['first_gid'] + tileset['tiles_count']

                # Apply the filter
                if (tileId >= tileset['first_gid'] and
                        tileId < tileIdMax):

                    tileIdCurrent = tileId - tileset['first_gid']

                    tiles['tileset'] = tileset['image']

                    # Keep here for debug purpose
                    # tiles['name'] = layer['name']

                    # Set position (starts at 1)
                    position = tileIdCurrent + 1

                    # Set Row and Column where to crop the tileset
                    row = math.ceil(position / tileset['columns'])
                    column = position - (
                        math.floor(
                            tileIdCurrent / tileset['columns']
                        ) * tileset['columns']
                    )

                    tiles['x'] = (column - 1)
                    tiles['y'] = (row - 1)

            data['tiles'].append(tiles)

    # Change line
    if (x >= width):
        x = 0
        y += 1

    # If no properties remove the dictionary to minimize the file size
    if bool(data['properties']) is False:
        data.pop('properties', None)

    output.append(data)

f = open("../static/sources/map.js", "w")

jsonContent = json.dumps(output)

f.write("""export const map = JSON.parse(
  `{}`
);
""".format(jsonContent))
f.close()