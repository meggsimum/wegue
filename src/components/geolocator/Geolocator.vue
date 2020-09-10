<template>
<span>
   <v-btn @click="geolocateUserAndShowMarkerOnMap" icon dark>
      <v-icon v-if='this.isSearchingForGeolocation'>update</v-icon>
      <v-icon v-else-if='this.isGeolocationAPIAvailable && (!this.isGeolocationFound)'>location_searching</v-icon>
      <v-icon v-else-if='this.isGeolocationAPIAvailable && this.isGeolocationFound'>gps_fixed</v-icon>
      <v-icon v-else>location_disabled</v-icon>
    </v-btn>
</span>
</template>

<script>
import {fromLonLat} from 'ol/proj'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature';
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import { Fill, Style, Text } from 'ol/style';

import { WguEventBus } from '../../WguEventBus'

// definition for the geolocation marker of the device on the map
const geolocationMarker = new Style({
  text: new Text({
    text: 'person_pin_circle',
    font: 'normal 30px Material Icons',
    fill: new Fill({
      color: 'blue'
    })
  })
});

function createAndRemoveExistingLayer (layers, layerId) {
  // if the geolocationLayer is already included it has to be removed
  layers.remove(layers.getArray().filter(layer => layerId === (layer.get('lid')))[0]);
  // create new layer
  let layer = new VectorLayer({
    source: new VectorSource(),
    style: geolocationMarker});
  layer.setProperties({lid: layerId, name: 'actual gps-position'});
  return layer;
};

function addPointtoLayer (point, layer) {
  layer.getSource().addFeature(new Feature({geometry: point}));
};

export default {
  name: 'geolocator',
  data: function () {
    return {
      isGeolocationAPIAvailable: null,
      isGeolocationFound: false,
      isSearchingForGeolocation: false
    }
  },
  created () {
    var me = this;
    WguEventBus.$on('ol-map-mounted', olMap => {
      me.map = olMap;
    });
    if (!navigator.geolocation) {
      me.isGeolocationAPIAvailable = false;
    } else {
      me.isGeolocationAPIAvailable = true;
    }
  },
  methods: {
    geolocateUserAndShowMarkerOnMap () {
      var me = this;
      if (me.isGeolocationAPIAvailable) {
        me.isSearchingForGeolocation = true;
        setTimeout(function () {
          navigator.geolocation.getCurrentPosition(position => {
            var currentPosition = new Point(fromLonLat([position.coords.longitude, position.coords.latitude]));
            if (typeof me.map !== 'undefined') {
              me.isGeolocationFound = true;
              me.isSearchingForGeolocation = false;
              // get a Layer to put the currentPosition on
              var geolocationLayer = createAndRemoveExistingLayer(me.map.getLayers(), 'userPosition');
              addPointtoLayer(currentPosition, geolocationLayer);
              me.map.addLayer(geolocationLayer);
              me.map.getView().fit(currentPosition, {minResolution: 3, duration: 3200, padding: [50, 50, 50, 50]});
            } else {
              console.error('the map is not defined in the getCurrentPosition callback');
            }
          },
          function errorHandler (error) {
            // Log the error without displaying it, simply allows debugging
            console.error('Geolocation error : code ' + error.code + ' - ' + error.message);
            // Display user friendly error message
            alert('Geolocation error : code ' + error.code + ' - ' + error.message);
            me.isGeolocationAPIAvailable = false;
            me.isSearchingForGeolocation = false;
          },
          {enableHighAccuracy: true, maximumAge: 60000, timeout: 27000})
        }, 1600);
      } else {
        me.isGeolocationAPIAvailable = false;
      }
    }
  }
}
</script>

<style scoped>

</style>