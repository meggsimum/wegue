<template>
  <v-app id="wgu-app" data-app :class="{ 'wgu-app': true, 'wgu-app-embedded': isEmbedded }">

    <slot name="wgu-app-begin" />

    <wgu-app-header :color="baseColor">
      <!-- forward the slots of AppHeader -->
      <slot name="wgu-tb-start" slot="wgu-tb-start" />
      <slot name="wgu-tb-after-title" slot="wgu-tb-after-title" />
      <slot name="wgu-tb-before-auto-buttons" slot="wgu-tb-before-auto-buttons" />
      <slot name="wgu-tb-after-auto-buttons" slot="wgu-tb-after-auto-buttons" />
      <slot name="wgu-tb-end" slot="wgu-tb-end" />
    </wgu-app-header>

    <slot name="wgu-after-header" />

    <wgu-app-sidebar v-if="sidebarWins.length">
        <template v-for="(moduleWin, index) in sidebarWins">
          <component
            :is="moduleWin.type" :key="index" :color="baseColor"
            v-bind="moduleWin"
          />
      </template>
    </wgu-app-sidebar>      

    <slot name="wgu-before-content" />
    <v-content app>
      <v-container id="ol-map-container" fluid fill-height class="pa-0">
         <wgu-map :color="baseColor" />
         <!-- layer loading indicator -->
         <wgu-maploading-status :color="baseColor" />
        <slot name="wgu-after-map"> 
        </slot>
        <!-- Portal to overlay the map content from an application module -->
        <portal-target name="map-overlay" />
        <wgu-app-logo />
        <wgu-bglayerswitcher :color="baseColor"/>
      </v-container>
    </v-content>

    <template v-for="(moduleWin, index) in floatingWins">
      <component
        :is="moduleWin.type" :key="index" :color="baseColor"
        v-bind="moduleWin"
      />
    </template>

    <slot name="wgu-before-footer" />

    <wgu-app-footer
      :color="baseColor"
      :footerTextLeft="footerTextLeft"
      :footerTextRight="footerTextRight"
      :showCopyrightYear="showCopyrightYear"
    />

    <slot name="wgu-after-footer" />

    <slot name="wgu-app-end" />

  </v-app>
</template>

<script>
  import Vue from 'vue'
  import { WguEventBus } from '../src/WguEventBus'
  import OlMap from '../src/components/ol/Map'
  import AppHeader from './components/AppHeader'
  import AppFooter from './components/AppFooter'
  import AppSidebar from './components/AppSidebar'
  import AppLogo from '../src/components/AppLogo'
  import BgLayerSwitcher from '../src/components/bglayerswitcher/BgLayerSwitcher.vue'
  import MeasureWin from '../src/components/measuretool/MeasureWin'
  import LayerListWin from '../src/components/layerlist/LayerListWin'
  import HelpWin from '../src/components/helpwin/HelpWin'
  import InfoClickWin from '../src/components/infoclick/InfoClickWin'
  import MapLoadingStatus from '../src/components/progress/MapLoadingStatus'
  import AttributeTableWin from '../src/components/attributeTable/AttributeTableWin.vue'
  import MapRecorderWin from '../src/components/maprecorder/MapRecorderWin'

  export default {
    name: 'wgu-app-tpl',
    components: {
      'wgu-map': OlMap,
      'wgu-app-header': AppHeader,
      'wgu-app-footer': AppFooter,
      'wgu-app-sidebar': AppSidebar,
      'wgu-app-logo': AppLogo,
      'wgu-bglayerswitcher': BgLayerSwitcher,
      'wgu-measuretool-win': MeasureWin,
      'wgu-layerlist-win': LayerListWin,
      'wgu-helpwin-win': HelpWin,
      'wgu-infoclick-win': InfoClickWin,
      'wgu-maploading-status': MapLoadingStatus,
      'wgu-attributetable-win': AttributeTableWin,
      'wgu-maprecorder-win': MapRecorderWin
    },
    data () {
      return {
        isEmbedded: false,
        floatingWins: this.getModuleWinData('floating'),
        sidebarWins: this.getModuleWinData('sidebar'),
        footerTextLeft: Vue.prototype.$appConfig.footerTextLeft,
        footerTextRight: Vue.prototype.$appConfig.footerTextRight,
        showCopyrightYear: Vue.prototype.$appConfig.showCopyrightYear,
        baseColor: Vue.prototype.$appConfig.baseColor
      }
    },
    created () {
      // set document title (e.g. shown in browser tab) from app config
      document.title = Vue.prototype.$appConfig.browserTitle || document.title;
    },
    mounted () {
      // apply the isEmbedded state to the member var
      this.isEmbedded = this.$isEmbedded;

      // make the refs (floating module window, which are not connected to their
      // related components, e.g. buttons to toggle them)
      const refs = this.$refs;
      let cmpLookup = {};
      for (const key of Object.keys(refs)) {
        cmpLookup[key] = refs[key][0];
      }
      Vue.prototype.cmpLookup = cmpLookup;
      // inform registered cmps that the app is mounted and the dynamic
      // components are available
      WguEventBus.$emit('app-mounted');
    },
    methods: {
      /**
       * Determines the module window configuration objects from app-config:
       *     moduleWins: [
       *       {type: 'wgu-layerlist-win'},
       *       {type: 'wgu-measuretool-win'}
       *     ]
       * @param  {String} target Either 'floating' or 'sidebar'
       * @return {Array} module window configuration objects
       */
      getModuleWinData (target) {
        const appConfig = Vue.prototype.$appConfig || {};
        const modulesConfs = appConfig.modules || {};
        let moduleWins = [];
        for (const key of Object.keys(modulesConfs)) {
          const moduleOpts = appConfig.modules[key];
          if (moduleOpts.win === target) {
            moduleWins.push({
              type: key + '-win',
              ...moduleOpts
            });
          }
        }
        return moduleWins;
      }
    }
  }
</script>
