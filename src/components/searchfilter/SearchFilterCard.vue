<template>
  <v-card
    class='card--flex-toolbar'
    width='350px'
    style='position: relative; overflow: hidden;'
  >
    <v-toolbar card prominent transparent>
      <v-toolbar-title>Search and filter</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template slot='activator'>
          <v-btn icon @click='resetSearch' rotate='180'>
            <v-icon>settings_backup_restore</v-icon>
          </v-btn>
        </template>
        <span>Reset Search</span>
      </v-tooltip>
    </v-toolbar>
    <v-divider></v-divider>

    <v-content>
      <multiselect
        v-model='selectedItems'
        :options='arrangeItemAttributesForMultiselectView'
        :multiple='true'
        :preserve-search='true'
        :closeOnSelect='true'
        openDirection='below'
        label='name'
        track-by='name'
        @select='addItemAndFitMaptoNewExtend'
        @remove='removeItemAndFitMaptoNewExtend'
      >
      </multiselect>
    </v-content>
  </v-card>
</template>

<script>

import searchFilterDataset from '../../../app/static/data/shops-dannstadt.json';

import { WguEventBus } from '../../WguEventBus.js';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Fill, Stroke, Style, Circle as CircleStyle } from 'ol/style';

import Multiselect from 'vue-multiselect';

let featureStyles = {
  'Point': new Style({
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({
        color: 'rgba(255, 255, 0, 0.5)'
      }),
      stroke: new Stroke({ color: 'red', width: 2 })
    })
  }),
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(173, 0, 139, 0.5)'
    })
  })
};

let styleFunction = function (feature) {
  return featureStyles[feature.getGeometry().getType()];
};

function getLayerByLid (layers, layerId) {
  return layers.getArray().filter(layer => layerId === (layer.get('lid')))[0];
}

/** function to remove the item from the openLayers Layer, depends on the used data */
function removeItemFromMapLayer (item, mapLayer) {
  mapLayer.getSource().forEachFeature(feature => {
    if (
      item.feature.properties['@id'] ===
      feature.values_['@id']
    ) {
      mapLayer.getSource().removeFeature(feature);
    }
  });
}

function fitViewofMaptoExtend (extend, map) {
  map.getView().fit(extend, {
    duration: 1600,
    padding: [500, 500, 500, 500],
    maxZoom: 16
  });
}

function emitSelectedItemEvent (itemsToEmit, vue) {
  vue.$emit('searchFilterItemsChanged', itemsToEmit);
}

function hasNoFeaturesPresent (layer) {
  return layer.getSource().getFeatures().length === 0;
}

function showAllItemsAndFitExtend (layerId, map) {
  let layerDisplayingAllItems = getLayerByLid(map.getLayers(), layerId);
  layerDisplayingAllItems.setVisible(true);
  fitViewofMaptoExtend(layerDisplayingAllItems.getSource().getExtent(), map);
}

function prepareSelectedItemsForOpenLayers (item, otherItems) {
  let resultFeatures = [];
  resultFeatures.push(
    new GeoJSON().readFeature(item.feature, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    })
  );
  otherItems.forEach(object => {
    resultFeatures.push(
      new GeoJSON().readFeature(object.feature, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326'
      })
    );
  });
  resultFeatures.forEach(item =>
    item.getGeometry().transform('EPSG:4326', 'EPSG:3857')
  );
  return resultFeatures;
}

export default {
  name: 'wgu-searchfiltercard',
  components: {
    multiselect: Multiselect
  },
  data () {
    return {
      searchFilterItems: searchFilterDataset.features,
      selectedItems: [],
      selectedItemsLayerID: 'selectedFeatures',
      allItemsLayerID: 'Shops'
    };
  },
  created () {
    var me = this;
    WguEventBus.$on('ol-map-mounted', olMap => {
      me.map = olMap;
    });
  },
  computed: {
    arrangeItemAttributesForMultiselectView () {
      // defines a function that is specific for the dataset, use your own function
      return this.searchFilterItems.map(object => {
        return {
          name: `${object.properties.shop} - ${object.properties.name}`,
          type: object.type,
          feature: object
        };
      });
    }
  },
  methods: {
    addItemAndFitMaptoNewExtend (actualChoosenItem, id) {
      let me = this;
      // set the layer showing every element to invisible - the lid is dependent on the used dataset
      let layerDisplayingAllItems = getLayerByLid(me.map.getLayers(), me.allItemsLayerID);
      layerDisplayingAllItems.setVisible(false);

      let layerDisplayingSelectedItems = getLayerByLid(me.map.getLayers(), me.selectedItemsLayerID);
      // first time this method is called
      if (typeof layerDisplayingSelectedItems === 'undefined') {
        layerDisplayingSelectedItems = new VectorLayer({ source: new VectorSource() });
        layerDisplayingSelectedItems.setProperties({
          lid: me.selectedItemsLayerID,
          name: 'selected shops',
          hoverable: true,
          hoverAttribute: 'name'
        });
        me.map.addLayer(layerDisplayingSelectedItems);
      } else {
        layerDisplayingSelectedItems.getSource().clear();
      }
      // add the selected feature to the layer
      let olpreparedSelectedItems = prepareSelectedItemsForOpenLayers(actualChoosenItem, me.selectedItems);
      layerDisplayingSelectedItems.getSource().addFeatures(olpreparedSelectedItems);
      layerDisplayingSelectedItems.setStyle(styleFunction);

      fitViewofMaptoExtend(layerDisplayingSelectedItems.getSource().getExtent(), me.map);
      emitSelectedItemEvent(olpreparedSelectedItems, me);
    },
    removeItemAndFitMaptoNewExtend (actualChoosenItem, id) {
      let me = this;
      let layerDisplayingSelectedItems = getLayerByLid(me.map.getLayers(), me.selectedItemsLayerID);
      removeItemFromMapLayer(actualChoosenItem, layerDisplayingSelectedItems);

      if (hasNoFeaturesPresent(layerDisplayingSelectedItems)) {
        // no features in the Vector Source - remove the layer
        me.map.getLayers().remove(getLayerByLid(me.map.getLayers(), me.selectedItemsLayerID));
        // use the extend from the source with all features displayed
        showAllItemsAndFitExtend(me.allItemsLayerID, me.map);
      } else {
        fitViewofMaptoExtend(layerDisplayingSelectedItems.getSource().getExtent(), me.map);
      }
      // tell all other vue components of this change and give them all resulting items
      emitSelectedItemEvent(me.selectedItems.filter(
        element => element !== actualChoosenItem
      ), me);
    },
    resetSearch () {
      let me = this;
      let layerDisplayingSelectedItems = getLayerByLid(me.map.getLayers(), me.selectedItemsLayerID);
      // till now no elements have been seleceted
      if (typeof layerDisplayingSelectedItems === 'undefined') {
        return;
      }
      layerDisplayingSelectedItems.getSource().clear();
      me.selectedItems = [];
      me.map.getLayers().remove(getLayerByLid(me.map.getLayers(), me.selectedItemsLayerID));
      showAllItemsAndFitExtend(me.allItemsLayerID, me.map);
      emitSelectedItemEvent(me.selectedItems, me);
    }
  }
};
</script>

<style src='vue-multiselect/dist/vue-multiselect.min.css'></style>

<style>
.v-content {
  padding: 0 !important;
}

.multiselect__content-wrapper {
  display: contents;
  overflow: scroll;
}

.multiselect__content {
  height: 50vh;
  overflow: scroll;
  padding: 0;
}
</style>
