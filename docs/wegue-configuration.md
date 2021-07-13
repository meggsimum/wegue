# Wegue configuration

This describes the Wegue application configuration, which is modelled as JSON document. The **bold properties** are mandatory.

## Properties

### General

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| title              | Title shown in the top toolbar of the application | `"title": "A Wegue WebGIS App"` |
| browserTitle       | HTML document title that is shown in the browser title bar or a browser page tab | `"browserTitle": "Wegue Demo App"` |
| baseColor          | Main colour of the UI elements | `"baseColor": "red darken-3"` or `"baseColor": "#ff3388"` |
| logo               | URL to an image shown as application logo | ` "logo": "https://dummyimage.com/100x100/aaa/fff&text=Wegue"`
| logoWidth          | Width of the application logo defined in `logo` | `"logoWidth": "200"`|
| logoHeight         | Height of the application logo defined in `logo` | `"logoWidth": "100"` |
| logoSize           | Squared size of the application logo defined in `logo`. Only has an effect if `logoWidth` and `logoHeight` are **not** set. Otherwise these will overwrite the `logoSize` setting. | `"logoSize": "100"` |
| footerTextLeft     | Text or HTML string to be displayed in the left side of the toolbar | `"footerTextLeft": "Powered by <a href='https://meggsimum.de/wegue/' target='_blank'>Wegue WebGIS</a>"` |
| footerTextRight    | Text or HTML string to be displayed in the right side of the toolbar | `"footerTextRight": "meggsimum"` |
| showCopyrightYear  | Boolean value, whether the copyright year should be shown on the right side of the toolbar | `"showCopyrightYear": true` or `"showCopyrightYear": false` |
| **mapZoom**        | Initial zoom level of the map | `"mapZoom": 2` |
| **mapCenter**      | Initial center of the map in map projection | `"mapCenter": [0, 0]` |
| mapProjection      | Configuration object for CRS / projection used for the map | see [mapProjection](wegue-configuration?id=mapprojection) |
| mapGeodataDragDop  | Configuration object for geodata file drag/drop functionality on the map. Only by setting the config this function will be enabled. | see [mapGeodataDragDop](wegue-configuration?id=mapGeodataDragDop) |
| **modules**        | Array of module configuration objects | See [modules](module-configuration) |
| **mapLayers**      | Array of map layer configuration objects | See [mapLayers](map-layer-configuration) |
| projectionDefs     | Array of CRS / projection definition objects compatible to proj4js | See [projectionDefs](wegue-configuration?id=projectiondefs) |
| tileGridDefs       | Array of tile grid definition objects | See [tileGridDefs](wegue-configuration?id=tilegriddefs) |

### projectionDefs

The property `projectionDefs` is a nested array holding several [proj4js](https://proj4js.org) compatible projection definitions. For each array element the first item is the projection code and the second item is the [proj4](https://proj4.org) definition string. For example:

```json
[
    "EPSG:28992",
    "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs"
]
```
Projection definitions can be found at [epsg.io](http://epsg.io). The definition in the example above would therefore be available at http://epsg.io/28992.

### mapProjection

The property `mapProjection` defines the CRS, which is used by the map in your Wegue application. The `mapProjection` object has the following properties:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **code**           | The code of the SRS to be used for the map. In case it is not `EPSG:4326` or `EPSG:3857` it has to be defined in the [projectionDefs](wegue-configuration?id=projectiondefs) | `"code": "EPSG:28992"` |
| **units**          | The unit of the SRS | `"units": "m"` |
| **extent**         | The validity extent for the SRS | `"extent": [-285401.920, 22598.080, 595401.920, 903401.920]` |

### tileGridDefs

By default Wegue (OpenLayers) assumes the "OSM/Google" Web Mercator tilegrid. Different tilegrids can be defined once and then referenced in Layer configurations.
Below is an example for the Dutch Standard Tilegrid:

```json
"tileGridDefs": {
    "dutch_rd": {
      "extent": [-285401.920, 22598.080, 595401.920, 903401.920],
      "resolutions": [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210],
      "tileSize": [256, 256]
    }
  }
 ```
 One or more tilegrids can be defined. The tilegrid's name is arbitrary, above `dutch_rd`, and can be used as a key when refered in in a Layer configuration.
 Each tilegrid definition has the following properties:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **extent**         | The extent of the tilegrid as a bounding box using the SRS of the Map| `"extent": [-285401.920, 22598.080, 595401.920, 903401.920]` |
| **resolutions**    | The resolutions for the tilegrid (related to zoomlevels) as an array | `"resolutions": [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520]` |
| **tileSize**       | The tilesize in width/height pixels | `"tileSize": [512, 512]` |

In a Layer configuration a specific tilegrid can be refered to as follows, using the `tileGridRef` property:

```
    {
      "type": "XYZ",
      "lid": "brtachtergrondkaart",
      "name": "WMTS - Topo Basemap - PDOK",
      "url": "https://geodata.nationaalgeoregister.nl/tiles/service/wmts/brtachtergrondkaart/EPSG:28992/{z}/{x}/{y}.png",
      "projection": "EPSG:28992",
      "tileGridRef": "dutch_rd",
      "visible": true
    }
```

## mapGeodataDragDop

Setting the property `mapGeodataDragDop` in the main Wegue configuration will enable geodata file drag/drop functionality on the map.

The following configurations can be set:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| formats            | Allowed geodata formats, which can be  dropped to the map. Supported formats are `"GeoJSON"`, `"KML"`, `"GPX"`, `"IGC"` and `"TopoJSON"` | `"formats": ["GeoJSON", "KML"]`
| zoomToData         | Enable automatic zoom to the extent of the uploaded / dropped geodata. Defaults to `false` | `"zoomToData": true` |
| replaceData        | Default behaviour is that a newly dropped data set will replace an existing one. By setting this property to `true` a separate layer will be created for each dropped geodata file | `"replaceData": true` |
| displayInLayerList | List the layer(s) showing dropped data in the LayerList UI. Defaults to `true`  | `"displayInLayerList": false` |
| layerName          | Name for the layer(s) showing dropped data. Will be visible in the LayerList UI. Defaults to `"Drag/Drop Data"`  | `"layerName": "My uploaded geodata"` |
Below is an example for such a configuration object:

```
    {
      "formats": ["GeoJSON", "KML"],
      "zoomToData": true,
      "replaceData": true,
      "displayInLayerList": true,
      "layerName": "Uploaded Data"
    }
```

## Example configuration

Example configurations can be found in the `app-starter/static` directory. Below an example as used in the Demo:

```json
{

  "title": "Vue.js / OpenLayers WebGIS",
  "browserTitle": "Wegue Demo App",

  "baseColor": "red darken-3",

  "logo": "https://dummyimage.com/100x100/aaa/fff&text=Wegue",
  "logoWidth": "100",
  "logoHeight": "100",

  "footerTextLeft": "Powered by <a href='https://meggsimum.de/wegue/' target='_blank'>Wegue WebGIS</a>",
  "footerTextRight": "meggsimum",
  "showCopyrightYear": true,

  "mapZoom": 2,
  "mapCenter": [0, 0],
  "mapGeodataDragDop": {
    "formats": ["GeoJSON", "KML"],
    "zoomToData": true,
    "replaceData": true,
    "displayInLayerList": true,
    "layerName": "Uploaded Data"
  },

  "permalink": {
    "location": "hash",
    "layers": true,
    "extent": false,
    "projection": "EPSG:4326",
    "paramPrefix": "",
    "history": true
  },

  "mapLayers": [

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
      },
      "columnMapping": {
        "name": "Name",
        "email": "Email",
        "website": "Website"
      },
      "selectStyle": {
        "radius": 10,
        "strokeColor": "gray",
        "strokeWidth": 5,
        "fillColor": "rgb(255, 255, 0, 0.2)"
      },
      "doAppendSelectStyle": true
    },
    {
      "type": "WFS",
      "lid": "gas-wfs",
      "name": "Gas Stations WFS",
      "url": "https://ows-demo.terrestris.de/geoserver/osm/wfs",
      "typeName": "osm:osm-fuel",
      "version": "2.0.0",
      "maxFeatures": 50,
      "formatConfig": {
      },
      "format": "GML3",
      "loadOnlyVisible": true,
      "visible": false,
      "selectable": true,
      "style": {
        "textIcon": "local_gas_station",
        "font": "normal 30px Material Icons",
        "fillColor": "blue"
      },
      "attributions": "© <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors.",
      "columnMapping": {
        "name": "Name"
      },
      "selectStyle": {
        "textIcon": "star",
        "font": "normal 30px Material Icons",
        "fillColor": "black"
      },
      "doAppendSelectStyle": false
    },

    {
      "type": "VECTOR",
      "lid": "earthquakes",
      "name": "Earthquakes 2012 (Mag 5)",
      "url": "./static/data/2012_Earthquakes_Mag5.kml",
      "formatConfig": {
        "extractStyles": false
      },
      "format": "KML",
      "visible": true,
      "attributions": "U.S. Geological Survey",
      "selectable": true,
      "hoverable": true,
      "hoverAttribute": "name",
      "style": {
        "iconUrl": "./static/icon/circle.svg",
        "scale": 4,
        "anchor": [0.5, 37],
        "anchorXUnits": "fraction",
        "anchorYUnits": "pixels"
      },
      "selectStyle": {
        "radius": 10,
        "strokeColor": "gray",
        "strokeWidth": 5,
        "fillColor": "rgb(255, 255, 0, 0.2)"
      }
    },
    {
      "type": "WMS",
      "lid": "ahocevar-wms",
      "name": "WMS (ahocevar)",
      "format": "image/png",
      "layers": "topp:states",
      "url": "https://ahocevar.com/geoserver/wms",
      "transparent": true,
      "singleTile": false,
      "projection": "EPSG:3857",
      "attribution": "",
      "isBaseLayer": false,
      "visible": false,
      "displayInLayerList": true
    },

    {
      "type": "VECTORTILE",
      "name": "Vector Tile Layer",
      "url": "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf",
      "format": "MVT",
      "visible": false,
      "style": {
        "strokeColor": "gray",
        "strokeWidth": 1,
        "fillColor": "rgba(20,20,20,0.1)"
      }
    },

    {
      "type": "XYZ",
      "name": "OpenTopoMap",
      "url": "https://tile.opentopomap.org/{z}/{x}/{y}.png",
      "attributions": "Map data: <a href=\"https://openstreetmap.org/copyright\">©OpenStreetMap</a>-contributors, SRTM | Map representation (Kartendarstellung): © <a href=\"http://opentopomap.org/\">OpenTopoMap</a> (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)",
      "lid": "opentopomap",
      "isBaseLayer": true,
      "visible": false,
      "crossOrigin": "anonymous"
    },

    {
      "type": "OSM",
      "lid": "osm-bg",
      "name": "OSM",
      "isBaseLayer": true,
      "visible": true,
      "crossOrigin": "anonymous"
    }

  ],

  "modules": {
    "wgu-layerlist": {
      "target": "menu",
      "win": "floating",
      "icon": "layers",
      "darkLayout": true,
      "draggable": false
    },
    "wgu-measuretool": {
      "target": "menu",
      "win": "floating",
      "icon": "photo_size_select_small",
      "darkLayout": true,
      "draggable": false,
      "strokeColor": "#c62828",
      "fillColor": "rgba(198,40,40,0.2)",
      "sketchStrokeColor": "rgba(198,40,40,0.8)",
      "sketchFillColor": "rgba(198,40,40,0.1)",
      "sketchVertexStrokeColor": "#c62828",
      "sketchVertexFillColor": "rgba(198,40,40,0.2)"
    },
    "wgu-infoclick": {
      "target": "menu",
      "win": "floating",
      "icon": "info",
      "darkLayout": true,
      "draggable": false,
      "initPos": {
        "left": 8,
        "top": 74
      }
    },
    "wgu-geocoder": {
      "target": "toolbar",
      "darkLayout": true,
      "minChars": 2,
      "queryDelay": 200,
      "selectZoom": 16,
      "debug": false,
      "placeHolder": "Search address",
      "provider": "osm",
      "providerOptions": {
        "lang": "en-US",
        "countrycodes": "",
        "limit": 6
      }
    },
    "wgu-zoomtomaxextent": {
      "target": "toolbar",
      "darkLayout": true
    },
    "wgu-maprecorder": {
      "target": "toolbar",
      "win": "floating",
      "icon": "mdi-video",
      "darkLayout": true,
      "draggable": false,
      "initPos": {
        "left": 8,
        "top": 230
      }
    },
    "wgu-helpwin": {
      "target": "toolbar",
      "win": "floating",
      "icon": "help",
      "darkLayout": true,
      "title": "About",
      "textTitle": "About Wegue",
      "htmlContent": "<b>WebGIS with OpenLayers and Vue.js</b> Template and re-usable components for webmapping applications with OpenLayers and Vue.js",
      "infoLinkText": "More Info",
      "infoLinkUrl": "http://wegue.org/"
    },
    "wgu-geolocator": {
      "target": "toolbar",
      "darkLayout": true
    },
    "wgu-attributetable": {
      "target": "menu",
      "win": "floating",
      "icon": "table_chart",
      "darkLayout": true,
      "syncTableMapSelection": true
    }
  }
}
```

More elaborate examples can be found in the app-starter directory.
* [app-conf-projected.json](https://github.com/meggsimum/wegue/blob/master/app-starter/static/app-conf-projected.json) demonstrates custom Projections and Tilegrids.
* [app-conf-minimal.json](https://github.com/meggsimum/wegue/blob/master/app-starter/static/app-conf-minimal.json) is a minimal setup for a Wegue application.
* [app-conf-sidebar.json](https://github.com/meggsimum/wegue/blob/master/app-starter/static/app-conf-sidebar.json) is an example for displaying module content inside a sidebar.
