# modules

JSON configuration objects for Wegue modules.

## General

The `modules` object contains sub-objects, whereas the key is the identifier for the module and the value is the dedicated module configuration. For example:

```json
  "wgu-layerlist": {
    "target": "menu",
    "win": "floating",
    "draggable": false
  }
```

The following properties can be applied to all map module types:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| **target**         | Where should the button to enable/disable the module be rendered. Valid options are `menu` or `toolbar` | `"target": "menu"` |
| **win**            | Value to mark if the module has a window as sub component and where to show the module UI elements. Valid options are `floating` and `sidebar`. If the value is omitted, then the module is not associated with a window.  | `"win": "floating"` |
| title              | Override the default module title. | `"title": "my module title"` |
| icon               | Provide a customized icon for the module. | `"icon": "info"` |
| minimizable        | Indicates whether the module window can be minimized. Only applies if a module window is present as indicated by the `win` parameter. | `"minimizable": true` |
| backgroundImage    | Optional background image for the window header. Only applies if a module window is present as indicated by the `win` parameter. | `"backgroundImage": "static/icon/myImage.png"}` |
| darkLayout         | Boolean value to ensure that your module element (mostly a button) is rendered bright since your basic theme color is dark.  | `"darkLayout": true` |
| visible            | Configures the initial visiblity of a module window on application start. Only applies if a module window is present as indicated by the `win` parameter.  | `"visible": true` |

The following positioning and sizing properties can be assigned to all module types, which are associated with a floating window - This is when the `win` parameter is set to `floating`:

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| draggable          | Boolean value to enable a window module be draggable over the viewport. **CAUTION: This feature is experimental and not recommended for production usage.** | `"draggable": false` |
| initPos            | The initial position for the module window in absolute viewport coordinates. | `"initPos": {"left": 8, "top": 74}` |
| height            | The height of the module window in viewport coordinates. | `"height": 500` |
| width            | The width of the module window in viewport coordinates. | `"width": 500` |
| maxHeight            | The maximum height of the module window in viewport coordinates. | `"maxHeight": 500` |
| maxWidth            | The maximum width of the module window in viewport coordinates. | `"maxWidth": 500` |
| minHeight            | The minimum height of the module window in viewport coordinates. | `"minHeight": 500` |
| minWidth            | The minimum width of the module window in viewport coordinates. | `"minWidth": 500` |


## GeoCoder

Module identifier: `wgu-geocoder`

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| rounded            | Adds a border radius to the input. | `"rounded": true` |
| autofocus          | Enables autofocus  | `"autofocus": true` |
| clearable          | Add input clear functionality.  | `"clearable": true` |
| persistentHint     | Forces hint to always be visible.  | `"persistentHint": true` |
| minChars           | Minimum number of characters which has to be entered so the query is triggered  | `"minChars": 2` |
| queryDelay         | Delay in MS before a query is triggered | `"queryDelay": 200` |
| selectZoom         | Zoom level which is set when a result entry is selected | `"selectZoom": 16` |
| debug              | Boolean value to enable debug logs | `"debug": false` |
| placeHolder        | Place holder text for the textfield | `"placeHolder": "Search address"` |
| provider           | Key defining which geocoder provider should be used. Could be `osm`, `photon` or `opencage` | `"provider": "osm"` |
| providerOptions    | Optional options which are passed to the geocoder provider | `"providerOptions": {"lang": "en-US", "countrycodes": "", "limit": 6}` |

## GeoLocator

Module identifier: `wgu-geolocator`

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| zoomAnimation             | Use a zoom animation. | `"zoomAnimation": true` |
| zoomAnimationDuration     | Duration of the zoom animation. | `"zoomAnimationDuration": 2400` |
| maxZoom                   | Max zoom level for the zoom animation. | `"maxZoom": 15` |
| markerColor               | Fill color of the geolocation marker. | `"markerColor": blue` |
| markerText                | Style of the geolocation marker. | `"markerText": "person_pin_circle"` |

## HelpWindow

Module identifier: `wgu-helpwin`

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| textTitle          |  The title over the text of the window         |   "About Wegue"      |
| htmlContent        |   The text content of the window. HTML can be used.        |   "<b>WebGIS with OpenLayers and Vue.js</b> Template and re-usable components for webmapping applications with OpenLayers and Vue.js"      |
| infoLinkText       |  The name of the link        |   "More Info"       |
| infoLinkUrl        |  The URL of the link         |   "http://wegue.org/"       |

## InfoClick

Module identifier: `wgu-infoclick`

| Property             | Meaning   | Example |
|----------------------|:---------:|---------|
| showMedia            |  Flag to steer if media (image) based feature information is rendered (default is "false" which forces the standard behavior showing the feature properties as table) | false      |
| mediaInfoLinkText    |  Text shown in the link offering more information   |  "More Info ..."       |
| mediaInfoLinkUrlProp |  Name of the feature attribute having the URL for more information         | "more_info"         |
| imageProp            |  Name of the feature attribute having the image URL         |   "image"       |
| imageDescriptionProp |  Name of the feature attribute having the image description text        |   "desc"       |

## LayerList

Module identifier: `wgu-layerlist`

No additional config options besides the general ones.

## MeasureTool

Module identifier: `wgu-measuretool`

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| strokeColor                    | Stroke color of the measured geometry (finished sketch). Takes a CSS3 compliant color value. | `"strokeColor": "#c62828"` |
| fillColor                      | Fill color of the measured geometry (finished sketch). Takes a CSS3 compliant color value. | `"fillColor": "rgba(198,40,40,0.2)"`. |
| sketchStrokeColor              | Stroke color of the measurement sketch geometry (while measuring). Takes a CSS3 compliant color value. | `"sketchStrokeColor": "rgba(198,40,40,0.8)"`. |
| sketchFillColor                | Fill color of the measurement sketch geometry (while measuring). Takes a CSS3 compliant color value. | `"sketchFillColor": "rgba(198,40,40,0.1)"`. |
| sketchVertexStrokeColor        | Stroke color of the vertex of the sketch geometry (while measuring). Takes a CSS3 compliant color value. | `"sketchVertexStrokeColor": "#c62828"`. |
| sketchVertexFillColor          | Fill color of the vertex of the sketch geometry (while measuring). Takes a CSS3 compliant color value | `"sketchVertexFillColor": "rgba(198,40,40,0.2)"`. |

## ZoomToMaxExtent

Module identifier: `wgu-zoomtomaxextent`

No additional config options besides the general ones.

## AttributeTable

The attribute table displays features of vector layers. It is possible to specify human-readable column names by adding the `columnMapping` property to the layer (see [Vector](map-layer-configuration?id=vector) or [WFS](map-layer-configuration?id=wfs)).

Module identifier: `wgu-attributetable`

| Property           | Meaning   | Example |
|--------------------|:---------:|---------|
| selectorLabel      | Override the placeholder text for the layer selection combo box.  | `"selectorLabel": "Choose a layer"` |
| syncTableMapSelection | Clicking on a row zooms to the respective feature. If the layer is `selectable` the feature will also be selected. Selecting a feature on the map selects the corresponsing row in the table. | `"syncTableMapSelection": true` |

## MapRecorder

Module identifier: `wgu-maprecorder`

No additional config options besides the general ones.

**Important:**
For [WMS](map-layer-configuration?id=wms), [XYZ](map-layer-configuration?id=xyz) and [OSM](map-layer-configuration?id=xyz) layers requested from cross origin sources you have to enable CORS via the layers `crossOrigin` attribute, in order to grant the required capturing privileges to the map recorders canvas.