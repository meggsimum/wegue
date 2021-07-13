# mapLayers

JSON configuration objects for Wegue map layers

## General

The following properties can be applied to all map layer types

| Property           | Meaning | Example |
|--------------------|:---------:|---------|
| **type**           |  Indicator which layer type is configured |  |
| **lid**            |  Unique identifier for the layer | `"lid": "my-super-wms-layer"`  |
| **name**           |  Human readable name for the layer, used e.g. in the LayerList | `"name": "My super WMS"` |
| projection         |  The projection of the layer. Has to be defined in `projectionDefs` if not `EPSG:4326` or `EPSG:3857`. if not set the projection of the map is used | `"projection": "EPSG:3857"` |
| isBaseLayer        | Boolean value, whether the layer should be a background layer or not. Background layers will be available from the background layer selection button on the map. | `"isBaseLayer": false` |
| visible            | Boolean value, whether the layer should be initially visible | `"visible": false` |
| displayInLayerList | Boolean value, whether the layer should appear in the LayerList. Ignored if the layer is a background layer - see option `isBaseLayer`  | `"displayInLayerList": true` |
| attributions       | Text or HTML string to be displayed as source attribution in the map  | `"attributions": "<a href='https://www.pdok.nl' target='_blank'>PDOK</a> by Dutch Kadaster",` |
| previewImage       | URL to a preview image for layers to be displayed in the background layer selection control. This option has no effect if the layer is not a background layer - see option `isBaseLayer`  | `"previewImage": "static/icon/my-layer-preview.png"`  |



## OSM

| Property           | Meaning | Example |
|--------------------|:---------:|---------|
| **type**           | Indicator that the layer is a OpenStreetMap tile server layer, always `OSM` here  | `"type": "OSM"` |
| crossOrigin        | Provides support for CORS, defining how the layers source handles crossorigin requests. For more information and the supported values see [HTML attribute: crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)  | `"crossOrigin": "anonymous"` |

## VECTOR

| Property            | Meaning | Example |
|---------------------|:---------:|---------|
| **type**            | Indicator that the layer is a vector layer, always `VECTOR` here  | `"type": "VECTOR"` |
| **url**             | The URL to the vector data resource (file) | `"url": "./static/data/2012_Earthquakes_Mag5.kml"` |
| **format**          | The format of the data linked in `url` (either `KML` or `GeoJSON` ) | `"format": "KML"` |
| selectable          | Boolean value, whether the features of the layer can be selected by click in order to display the attributes in a window | `"selectable": true` |
| hoverable           | Boolean value, whether the features of the layer can be hovered in order to display an attribute (see `hoverAttribute`) in a tooltip  | `"hoverable": true` |
| hoverAttribute      | Attribute to be shown if a feature of the layer is hovered. Only has an effect if `hoverable` is set to `true`  | `"hoverAttribute": "name"` |
| style               | Object to define a rendering style for the features of the layer  | see [style](map-layer-configuration?id=style-for-vectorlayers) |
| selectStyle         | The style for a selected feature | see [style](map-layer-configuration?id=style-for-vectorlayers) |
| doAppendSelectStyle | If the selectStyle should be appended to the original style, defaults to `false` | `"doAppendSelectStyle": true` |
| columnMapping       | Maps the property names to human-readable text. Can be used by `AttributeTable`. | `"columnMapping": {"name": "Name", "email": "Email"}`

## WFS

| Property            |  Meaning  | Example |
|---------------------|:---------:|---------|
| **type**            | Indicator that the layer is a WFS-based vector layer, always `WFS` here  | `"type": "WFS"` |
| **url**             | The URL to the Web Feature Service (WFS) | `"url": "https://ows.terrestris.de/geoserver/osm/wfs"` |
| **typeName**        | The name of the FeatureType | `"typeName": "osm:osm-fuel"`|
| style               | Object to define a rendering style for the features of the layer  | see [style](map-layer-configuration?id=style-for-vectorlayers) |
| version             | The version of the WFS, defaults to `1.1.0` | `"version": "2.0.0"`|
| maxFeatures         | Limits the amount of features that are queried and displayed | `"maxFeatures": 50`|
| format              | The format that should be used. Possible values are `GeoJSON`, `GML2`, `GML3` and `GML32`. Defaults to `GML3` |  `"format": "GeoJSON"`|
| selectable          | Boolean value, whether the features of the layer can be selected by click in order to display the attributes in a window | `"selectable": true` |
| selectStyle         | The style for a selected feature | see [style](map-layer-configuration?id=style-for-vectorlayers) |
| doAppendSelectStyle | If the selectStyle should be appended to the original style, defaults to `false` | `"doAppendSelectStyle": true` |
| columnMapping       | Maps the property names to human-readable text. Can be used by `AttributeTable`. | `"columnMapping": {"name": "Name", "email": "Email"}`
| hoverable           | Boolean value, whether the features of the layer can be hovered in order to display an attribute (see `hoverAttribute`) in a tooltip  | `"hoverable": true` |
| hoverAttribute      | Attribute to be shown if a feature of the layer is hovered. Only has an effect if `hoverable` is set to `true`  | `"hoverAttribute": "name"` |


## VECTORTILE

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **type**           | Indicator that the layer is a vector layer, always `VECTORTILE` here  | `"type": "VECTORTILE"` |
| **url**            | The URL to the vector tile service | `"url": "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf"` |
| **format**         | The format of the data linked in `url` (either `MVT`, `TopoJSON` or `GeoJSON` ) | `"format": "MVT"` |
| style              | Object to define a rendering style for the features of the layer  | see [style](map-layer-configuration?id=style-for-vectorlayers) |
| hoverable          | Boolean value, whether the features of the layer can be hovered in order to display an attribute (see `hoverAttribute`) in a tooltip  | `"hoverable": true` |
| hoverAttribute     | Attribute to be shown if a feature of the layer is hovered. Only has an effect if `hoverable` is set to `true`  | `"hoverAttribute": "name"` |

## WMS

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **type**           | Indicator that the layer is a WMS, always `WMS` here  | `"type": "WMS"` |
| **layers**         | The WMS `LAYERS` parameter | `"layers": "topp:states"` |
| **url**            | The GetMap URL of the WMS | `"url": "https://ahocevar.com/geoserver/wms"` |
| format             | Image format for the WMS (has to be supported by the WMS) | `"format": "image/png"` |
| transparent        | Boolean value, whether the WMS layer should be queried with a transparent background  | `"transparent": true` |
| singleTile         | Boolean value, whether the WMS layer should be queried in single tile mode | `"singleTile": false` |
| tileGridRef        | Identifier of the tile grid to use for this layer (has to be defined in `tileGridDefs` | `"tileGridRef": "dutch_rd"` |
| crossOrigin        | Provides support for CORS, defining how the layers source handles crossorigin requests. For more information and the supported values see [HTML attribute: crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)  | `"crossOrigin": "anonymous"` |

## XYZ

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **type**           | Indicator that the layer is a XYZ tiled image layer, always `XYZ` here  | `"type": "XYZ"` |
| **url**            | The URL of the service providing the image tiles | `"url": "https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart/EPSG:28992/{z}/{x}/{y}.png"` |
| tileGridRef        | Identifier of the tile grid to use for this layer (has to be defined in `tileGridDefs` | `"tileGridRef": "dutch_rd"` |
| crossOrigin        | Provides support for CORS, defining how the layers source handles crossorigin requests. For more information and the supported values see [HTML attribute: crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)  | `"crossOrigin": "anonymous"` |

## Style for Vectorlayers

Mandatory properties:
- Points require **`radius`** and/or **`iconUrl`** and/or **`textIcon`**.
- Polygons require **`fillColor`**.
- Lines require **`strokeColor`** or **`strokeWidth`**.

| Property           | Meaning | Example |
|--------------------|:-------:|---------|
| strokeColor        | see [color](https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke-Stroke.html) | `"strokeColor": "purple"` |
| strokeWidth        | see [width](https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke-Stroke.html) | `"strokeWidth": 2` |
| fillColor          | Point and Polygon, see [color](https://openlayers.org/en/latest/apidoc/module-ol_style_Fill-Fill.html) | `"fillColor": "rgba(155,153,51,0.5)"` |
| label              | see [label](map-layer-configuration?id=label) | see [label](map-layer-configuration?id=label) |
| radius             | see [radius](https://openlayers.org/en/latest/apidoc/module-ol_style_Circle-CircleStyle.html) | `"radius": 4` |
| scale              | Point only, see [scale](https://openlayers.org/en/latest/apidoc/module-ol_style_Icon-Icon.html) | `"scale": 4` |
| iconUrl            | Point only, see [src](https://openlayers.org/en/latest/apidoc/module-ol_style_Icon-Icon.html) | `"iconUrl": "./static/icon/circle.svg"` |
| iconAnchor         | Point only, see [anchor](https://openlayers.org/en/latest/apidoc/module-ol_style_Icon-Icon.html) | `"anchor": [0.5, 37]` |
| iconAnchorXUnits   | Point only, see [anchorXUnits](https://openlayers.org/en/latest/apidoc/module-ol_style_Icon-Icon.html) | `"anchorXUnits": "fraction"` |
| iconAnchorYUnits   | Point only, see [anchorYUnits](https://openlayers.org/en/latest/apidoc/module-ol_style_Icon-Icon.html) | `"anchorYUnits": "pixels"` |
| textIcon           | Point only, see [text](https://openlayers.org/en/latest/apidoc/module-ol_style_Text-Text.html). Icons for font `normal 30px Material Icons` can be found [here](https://fonts.google.com/icons?selected=Material+Icons) | `"textIcon": "local_gas_station"` |
| font               | Point only, see [font](https://openlayers.org/en/latest/apidoc/module-ol_style_Text-Text.html) | `"font": "normal 30px Material Icons"` |

#### Label

| Property           |  Meaning | Example |
|--------------------|:---------:|---------|
| **attribute**      | the attribute of the layer to display | `"attribute": "name"` |
| minResolution      | the minimal map resolution to show the label | `"minResolution": 4.0` |
| maxResolution      | the maximal map resolution to show the label | `"maxResolution": 100.0` |
| outlineColor       | see [color](https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke-Stroke.html) | `"outlineColor": "white"` |
| outlineWidth       | see [width](https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke-Stroke.html) | `"outlineWidth": 2` |
| fillColor          | see [color](https://openlayers.org/en/latest/apidoc/module-ol_style_Fill-Fill.html) | `"fillColor": "black"` |

Additionally every configuration property of [`ol/style/Text`](https://openlayers.org/en/latest/apidoc/module-ol_style_Text-Text.html) can be used.

#### Example

```json
{
  "type": "VECTOR",
  "lid": "Shops",
  "name": "Shops DaSchau",
  "url": "./static/data/shops-dannstadt.geojson",
  "formatConfig": {
  },
  "format": "GeoJSON",
  "visible": true,
  "selectable": true,
  "style": {
    "radius": 4,
    "strokeColor": "purple",
    "strokeWidth": 2,
    "fillColor": "rgba(155,153,51,0.5)",
    "label": {
      "attribute": "name",
      "minResolution": 4.0,
      "outlineColor": "white",
      "outlineWidth": 2,
      "fillColor": "black",
      "offsetX": 0,
      "offsetY": 15,
      "align": "center"
    }
  }
}

```
