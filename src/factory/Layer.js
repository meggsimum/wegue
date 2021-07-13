import TileLayer from 'ol/layer/Tile';
import TileWmsSource from 'ol/source/TileWMS';
import OsmSource from 'ol/source/OSM';
import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import MvtFormat from 'ol/format/MVT'
import GeoJsonFormat from 'ol/format/GeoJSON'
import TopoJsonFormat from 'ol/format/TopoJSON'
import KmlFormat from 'ol/format/KML'
import GML2Format from 'ol/format/GML2'
import GML3Format from 'ol/format/GML3'
import GML32Format from 'ol/format/GML32'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XyzSource from 'ol/source/XYZ'
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import { OlStyleFactory } from './OlStyle'
import {applyTransform} from 'ol/extent';
import {getTransform} from 'ol/proj';

/**
 * Factory, which creates OpenLayers layer instances according to a given config
 * object.
 */
export const LayerFactory = {

  /**
   * Maps the format literal of the config to the corresponding OL module.
   * @type {Object}
   */
  formatMapping: {
    'MVT': MvtFormat,
    'GeoJSON': GeoJsonFormat,
    'TopoJSON': TopoJsonFormat,
    'KML': KmlFormat,
    'GML2': GML2Format,
    'GML3': GML3Format,
    'GML32': GML32Format
  },

  /**
   * Maps the format literal of the config to the corresponding WFS outputFormat.
   * @type {Object}
   */
  wfsFormatMapping: {
    'GeoJSON': 'application/json',
    'GML2': 'text/xml; subtype=gml/2.1.2',
    'GML3': 'text/xml; subtype=gml/3.1.1',
    'GML32': 'text/xml; subtype=gml/3.2'
  },

  /**
   * Returns an OpenLayers layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @param  {ol/Map} olMap  Optional OL map we work on
   * @return {ol/layer/Base} OL layer instance
   */
  getInstance (lConf, olMap) {
    // apply LID (Layer ID) if not existent
    if (!lConf.lid) {
      // Make a unique layerId from Layer name and URL so contexts
      // like permalinks can be reapplied.
      lConf.lid = btoa(lConf.url + lConf.name).substr(0, 6);
    }

    // create correct layer type
    if (lConf.type === 'WMS') {
      return this.createWmsLayer(lConf);
    } else if (lConf.type === 'WFS') {
      return this.createWfsLayer(lConf, olMap);
    } else if (lConf.type === 'XYZ') {
      return this.createXyzLayer(lConf);
    } else if (lConf.type === 'OSM') {
      return this.createOsmLayer(lConf);
    } else if (lConf.type === 'VECTOR') {
      return this.createVectorLayer(lConf);
    } else if (lConf.type === 'VECTORTILE') {
      return this.createVectorTileLayer(lConf);
    } else {
      return null;
    }
  },

  /**
   * Returns an OpenLayers WMS layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Tile} OL WMS layer instance
   */
  createWmsLayer (lConf) {
    const layer = new TileLayer({
      name: lConf.name,
      lid: lConf.lid,
      isBaseLayer: lConf.isBaseLayer,
      previewImage: lConf.previewImage,
      displayInLayerList: lConf.displayInLayerList,
      extent: lConf.extent,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: new TileWmsSource({
        url: lConf.url,
        params: {
          'LAYERS': lConf.layers,
          'TILED': lConf.tiled
        },
        serverType: lConf.serverType,
        attributions: lConf.attributions,
        tileGrid: lConf.tileGrid,
        projection: lConf.projection,
        crossOrigin: lConf.crossOrigin
      })
    });

    return layer;
  },

  /**
   * Returns an OpenLayers WFS layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @param  {ol/Map} olMap  The OpenLayers map we work on
   * @return {ol.layer.Tile} OL WFS layer instance
   */
  createWfsLayer: function (lConf, olMap) {
    const mapSrs = olMap.getView().getProjection().getCode();
    // set a default projection if not set in config
    if (!lConf.projection) {
      lConf.projection = mapSrs;
    }
    // set a default WFS version if not set in config
    if (!lConf.version) {
      lConf.version = '1.1.0';
    }
    if (!lConf.format) {
      lConf.format = 'GML3';
    }

    // detect the WFS output format
    const outputFormat = this.wfsFormatMapping[lConf.format];

    // overwrite format options, so they fit to the SRS (map vs. data)
    if (mapSrs !== lConf.projection) {
      lConf.formatConfig.dataProjection = lConf.projection;
      lConf.formatConfig.featureProjection = mapSrs;
    }

    const vectorSource = new VectorSource({
      format: new this.formatMapping[lConf.format](lConf.formatConfig),
      loader: (extent) => {
        // assemble WFS GetFeature request
        let wfsRequest = lConf.url + '?service=WFS&' +
        'version=' + lConf.version + '&request=GetFeature&' +
        'typename=' + lConf.typeName + '&' +
        'outputFormat=' + outputFormat + '&srsname=' + lConf.projection;

        // add WFS version dependent feature limitation
        if (Number.isInteger(parseInt(lConf.maxFeatures))) {
          if (lConf.version.startsWith('1.')) {
            wfsRequest += '&maxFeatures=' + lConf.maxFeatures;
          } else {
            wfsRequest += '&count=' + lConf.maxFeatures;
          }
        }
        // add bbox filter
        if (lConf.loadOnlyVisible !== false) {
          if (mapSrs !== lConf.projection) {
            extent = applyTransform(extent, getTransform(mapSrs, lConf.projection));
          }
          wfsRequest += '&bbox=' + extent.join(',') + ',' + lConf.projection + '';
        }

        // load data from WFS, parse and add to vector source
        fetch(wfsRequest).then((response) => {
          return response.text();
        }).then((responseText) => {
          const feats = vectorSource.getFormat().readFeatures(responseText);
          vectorSource.addFeatures(feats);
        });
      },
      strategy: lConf.loadOnlyVisible !== false ? bboxStrategy : undefined,
      attributions: lConf.attributions
    });

    var vector = new VectorLayer({
      name: lConf.name,
      lid: lConf.lid,
      isBaseLayer: lConf.isBaseLayer,
      previewImage: lConf.previewImage,
      displayInLayerList: lConf.displayInLayerList,
      extent: lConf.extent,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: vectorSource,
      style: OlStyleFactory.getInstance(lConf.style),
      columnMapping: lConf.columnMapping,
      hoverable: lConf.hoverable,
      hoverAttribute: lConf.hoverAttribute
    });

    return vector;
  },

  /**
   * Returns an XYZ based tile layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Tile} OL XYZ layer instance
   */
  createXyzLayer (lConf) {
    const xyzLayer = new TileLayer({
      name: lConf.name,
      lid: lConf.lid,
      isBaseLayer: lConf.isBaseLayer,
      previewImage: lConf.previewImage,
      displayInLayerList: lConf.displayInLayerList,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: new XyzSource({
        url: lConf.url,
        attributions: lConf.attributions,
        tileGrid: lConf.tileGrid,
        projection: lConf.projection,
        crossOrigin: lConf.crossOrigin
      })
    });

    return xyzLayer;
  },

  /**
   * Returns an OpenLayers OSM layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Tile} OL OSM layer instance
   */
  createOsmLayer (lConf) {
    const layer = new TileLayer({
      name: lConf.name,
      lid: lConf.lid,
      isBaseLayer: lConf.isBaseLayer,
      previewImage: lConf.previewImage,
      displayInLayerList: lConf.displayInLayerList,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: new OsmSource({
        crossOrigin: lConf.crossOrigin
      })
    });

    return layer;
  },

  /**
   * Returns an OpenLayers vector layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.Vector} OL vector layer instance
   */
  createVectorLayer (lConf) {
    const vectorLayer = new VectorLayer({
      name: lConf.name,
      lid: lConf.lid,
      isBaseLayer: lConf.isBaseLayer,
      previewImage: lConf.previewImage,
      displayInLayerList: lConf.displayInLayerList,
      extent: lConf.extent,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: new VectorSource({
        url: lConf.url,
        format: new this.formatMapping[lConf.format](lConf.formatConfig),
        attributions: lConf.attributions
      }),
      style: OlStyleFactory.getInstance(lConf.style),
      hoverable: lConf.hoverable,
      hoverAttribute: lConf.hoverAttribute,
      columnMapping: lConf.columnMapping
    });

    return vectorLayer;
  },

  /**
   * Returns an OpenLayers vector tile layer instance due to given config.
   *
   * @param  {Object} lConf  Layer config object
   * @return {ol.layer.VectorTile} OL vector tile layer instance
   */
  createVectorTileLayer (lConf) {
    const vtLayer = new VectorTileLayer({
      name: lConf.name,
      lid: lConf.lid,
      isBaseLayer: lConf.isBaseLayer,
      previewImage: lConf.previewImage,
      displayInLayerList: lConf.displayInLayerList,
      visible: lConf.visible,
      opacity: lConf.opacity,
      source: new VectorTileSource({
        url: lConf.url,
        format: new this.formatMapping[lConf.format](),
        attributions: lConf.attributions,
        tileGrid: lConf.tileGrid,
        projection: lConf.projection
      }),
      style: OlStyleFactory.getInstance(lConf.style),
      hoverable: lConf.hoverable,
      hoverAttribute: lConf.hoverAttribute
    });

    return vtLayer;
  }

}
