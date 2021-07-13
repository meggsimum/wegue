import MapRecorderWin from '@/components/maprecorder/MapRecorderWin'
import { shallowMount } from '@vue/test-utils';
import OlMap from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

describe('maprecorder/MapRecorderWin.vue', () => {
  it('is defined', () => {
    expect(MapRecorderWin).to.not.be.an('undefined');
  });

  describe('props', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(MapRecorderWin);
      vm = comp.vm
    });

    it('has correct default props', () => {
      expect(vm.icon).to.equal('mdi-video');
      expect(vm.title).to.equal('Map recorder');
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('data', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(MapRecorderWin);
      vm = comp.vm
    });

    it('has correct default data', () => {
      expect(vm.moduleName).to.equal('wgu-maprecorder');
      expect(vm.mapCanvas).to.be.null;
      expect(vm.mapContext).to.be.null;
      expect(vm.recorder).to.be.null;
      expect(vm.recording).to.equal(false);
      expect(vm.filename).to.be.undefined;
      expect(vm.frameRate).to.equal(25);
      expect(vm.videoMBitsPerSecond).to.equal(2.5);
      expect(vm.timerHandle).to.be.null;
      expect(vm.error).to.equal(false);
      // Supported codecs under chrome.
      expect(vm.mimeType).to.equal('video/webm');
      expect(vm.mimeTypes.length).to.equal(2);
    });

    afterEach(() => {
      comp.destroy();
    });
  });

  describe('methods', () => {
    let comp;
    let vm;
    beforeEach(() => {
      comp = shallowMount(MapRecorderWin);
      vm = comp.vm
    });

    it('correct supported mime types under chrome', () => {
      const mimeTypes = vm.getSupportedMimeTypes();
      expect(mimeTypes.length).to.equal(2);
      expect(mimeTypes[0]).to.equal('video/webm');
      expect(mimeTypes[1]).to.equal('video/x-matroska');
    });

    it('start / stop recording sets correct states', () => {
      const layer = new VectorLayer({
        visible: true,
        source: new VectorSource()
      });
      const map = new OlMap({
        layers: [layer]
      });
      map.setSize([1024, 768]);
      vm.map = map;

      vm.startRecording();
      expect(vm.mapCanvas).not.to.be.null;
      expect(vm.mapCanvas.width).to.equal(1024);
      expect(vm.mapCanvas.height).to.equal(768);
      expect(vm.mapContext).not.to.be.null;
      expect(vm.recorder).not.to.be.null;
      expect(vm.recording).to.equal(true);
      expect(vm.timerHandle).not.to.be.null;
      expect(vm.error).to.equal(false);

      vm.stopRecording();
      expect(vm.mapCanvas).to.be.null;
      expect(vm.mapContext).to.be.null;
      expect(vm.recorder).to.be.null;
      expect(vm.recording).to.equal(false);
      expect(vm.timerHandle).to.be.null;
      expect(vm.error).to.equal(false);
    });

    afterEach(() => {
      comp.destroy();
    });
  });
});
