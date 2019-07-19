import { fixture, assert, aTimeout } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
// import { a11ySuite } from '@advanced-rest-client/a11y-suite/index.js';
import '../app-analytics.js';
import '../app-analytics-custom.js';

describe('<app-analytics>', function() {
  const disabledKey = 'apic.ga.disabled';
  const cidKey = 'apic.ga.cid';

  async function basicFixture() {
    return (await fixture(`<app-analytics
      trackingid="UA-71458341-4"
      appname="app-analytics-test"
      appversion="dev"
      datasource="app-analytics element"></app-analytics>`));
  }

  async function noPropertiesFixture() {
    return (await fixture(`<app-analytics></app-analytics>`));
  }

  async function customMetricsFixture() {
    return (await fixture(`<app-analytics>
      <app-analytics-custom type="metric" index="1" value="1"></app-analytics-custom>
      <app-analytics-custom type="metric" index="2" value="2"></app-analytics-custom>
      </app-analytics>`));
  }

  async function customDimensionFixture() {
    return (await fixture(`<app-analytics>
      <app-analytics-custom type="dimension" index="3" value="test-value-3"></app-analytics-custom>
      <app-analytics-custom type="dimension" index="4" value="test-value-4"></app-analytics-custom>
      </app-analytics>`));
  }

  async function clientIdFixture() {
    return (await fixture(`<app-analytics
      trackingid="UA-71458341-4"
      clientid="test-id"></app-analytics>`));
  }

  describe('Setterns and getters', () => {
    let element;
    beforeEach(async () => {
      localStorage.removeItem(disabledKey);
      localStorage.removeItem(cidKey);
      element = await noPropertiesFixture();
    });

    [
      ['clientid', 'clientId', 'test-client-id-1234', ['_cidChanged', '_configureBaseParams']],
      ['userid', 'userId', 'test-user-id-1234', ['_configureBaseParams']],
      ['trackingid', 'trackingId', 'test-tracking-id-1234', ['_configureBaseParams']],
      ['datasource', 'dataSource', 'test-data-source', ['_configureBaseParams']],
      ['campaignname', 'campaignName', 'test-campaign-name', ['_configureBaseParams']],
      ['campaignsource', 'campaignSource', 'test-campaign-source', ['_configureBaseParams']],
      ['campaignmedium', 'campaignMedium', 'test-campaign-medium', ['_configureBaseParams']],
      ['appversion', 'appVersion', 'test-app-version', ['_configureBaseParams']],
      ['appname', 'appName', 'test-app-name', ['_configureBaseParams']],
      ['appid', 'appId', 'test-app-id', ['_configureBaseParams']],
      ['appinstallerid', 'appInstallerId', 'test-app-installer-id', ['_configureBaseParams']],
      ['referrer', 'referrer', 'test-referrer', ['_configureBaseParams']]
    ].forEach((item) => {
      it(`Sets ${item[1]} property via ${item[0]} attribute`, () => {
        element.setAttribute(item[0], item[2]);
        assert.equal(element[item[1]], item[2], 'Value is set');
      });

      it(`Property ${item[0]} can be changed`, () => {
        element.setAttribute(item[0], item[2]);
        element[item[1]] = 'other-value';
        assert.equal(element[item[1]], 'other-value', 'Value is updated');
      });

      it(`Removed ${item[1]} attribute sets property value undefined`, () => {
        element.setAttribute(item[0], item[2]);
        element.removeAttribute(item[0]);
        assert.isUndefined(element[item[1]]);
      });

      if (item[3] && item[3] instanceof Array) {
        item[3].forEach((fn) => {
          it(`Property ${item[0]} setter calls ${fn}()`, () => {
            const spy = sinon.spy(element, fn);
            element[item[1]] = item[2];
            assert.isTrue(spy.called);
          });
        });
      }
    });

    [
      ['anonymizeip', 'anonymizeIp', ['_configureBaseParams']],
      ['usecachebooster', 'useCacheBooster', []],
      ['debugendpoint', 'debugEndpoint', []],
      ['debug', 'debug', []],
      ['disabled', 'disabled', ['_disabledChanged']],
      ['offline', 'offline', ['_offlineChanged']],
    ].forEach((item) => {
      it(`Sets ${item[1]} property via ${item[0]} attribute`, () => {
        element.setAttribute(item[0], '');
        assert.isTrue(element[item[1]], 'Value is set');
      });

      it(`Removed ${item[1]} attribute sets property value "false"`, () => {
        element.setAttribute(item[0], '');
        element.removeAttribute(item[0]);
        assert.isFalse(element[item[1]], 'Value is updated');
      });
      if (item[2] && item[2] instanceof Array) {
        item[2].forEach((fn) => {
          it(`Property ${item[0]} setter calls ${fn}()`, () => {
            const spy = sinon.spy(element, fn);
            element[item[1]] = true;
            assert.isTrue(spy.called);
          });
        });
      }
    });

    it('_uuid returns uuid-generator refeence', () => {
      const node = element._uuid;
      assert.equal(node.nodeName, 'UUID-GENERATOR');
    });

    it('cidKey returns client id storage key', () => {
      assert.equal(element.cidKey, cidKey);
    });

    it('disabledKey returns disabled storage key', () => {
      assert.equal(element.disabledKey, disabledKey);
    });

    it('cidKey has only a getter', () => {
      assert.throws(() => {
        element.cidKey = 'test';
      });
    });

    it('disabledKey has only a getter', () => {
      assert.throws(() => {
        element.disabledKey = 'test';
      });
    });
  });

  describe('Initialization', () => {
    let element;
    beforeEach(() => {
      localStorage.removeItem(disabledKey);
      localStorage.removeItem(cidKey);
    });

    it('Sets _baseParams', async () => {
      element = await noPropertiesFixture();
      assert.isNotEmpty(element._baseParams);
    });

    it('Sets _customMetrics', async () => {
      element = await noPropertiesFixture();
      assert.deepEqual(element._customMetrics, []);
    });

    it('Sets _customDimensions', async () => {
      element = await noPropertiesFixture();
      assert.deepEqual(element._customDimensions, []);
    });

    it('Sets autogenerated clientId', async () => {
      element = await noPropertiesFixture();
      assert.typeOf(element.clientId, 'string');
    });

    it('Restores clientId from local storage', async () => {
      element = await noPropertiesFixture();
      const id = element.clientId;
      assert.typeOf(id, 'string');
      const other = await noPropertiesFixture();
      assert.equal(other.clientId, id);
    });

    it('Added children are processed', async () => {
      element = await customMetricsFixture();
      await aTimeout();
      const node = element.querySelector('app-analytics-custom');
      assert.equal(node.getAttribute('aria-hidden'), 'true');
    });

    it('Sets __initialized flag', async () => {
      element = await customMetricsFixture();
      assert.isTrue(element.__initialized);
    });
  });

  describe('Adding and removing child nodes', () => {
    let element;

    it('Calls _processAddedNodes() when adding a node', async () => {
      element = await basicFixture();
      const node = document.createElement('app-analytics-custom');
      node.index = 1;
      node.value = 1;
      node.type = 'metric';
      const spy = sinon.spy(element, '_processAddedNodes');
      element.appendChild(node);
      await aTimeout();
      assert.isTrue(spy.called);
    });

    it('Calls _processRemovedNodes() when removing a node', async () => {
      element = await customMetricsFixture();
      const spy = sinon.spy(element, '_processRemovedNodes');
      const node = element.querySelector('app-analytics-custom');
      element.removeChild(node);
      await aTimeout();
      assert.isTrue(spy.called);
    });

    it('Calls _processChildAttribute() when attrbute is changed on a child', async () => {
      element = await customMetricsFixture();
      const spy = sinon.spy(element, '_processChildAttribute');
      const node = element.querySelector('app-analytics-custom');
      node.setAttribute('index', '10');
      await aTimeout();
      assert.isTrue(spy.called);
    });

    it('Do not calls _processChildAttribute() when attrbute is changed on element', async () => {
      element = await customMetricsFixture();
      const spy = sinon.spy(element, '_processChildAttribute');
      element.setAttribute('datasource', 'abc');
      await aTimeout();
      assert.isFalse(spy.called);
    });

    it('Adds custom metric to the _customMetrics array', async () => {
      element = await customMetricsFixture();
      await aTimeout();
      assert.deepEqual(element._customMetrics, [
        { index: 1, value: 1 },
        { index: 2, value: 2 }
      ]);
    });

    it('Removes custom metric from the _customMetrics array', async () => {
      element = await customMetricsFixture();
      await aTimeout();
      const node = element.querySelector('app-analytics-custom');
      element.removeChild(node);
      await aTimeout();
      assert.deepEqual(element._customMetrics, [
        { index: 2, value: 2 }
      ]);
    });

    it('Adds custom dimension to the _customDimensions array', async () => {
      element = await customDimensionFixture();
      await aTimeout();
      assert.deepEqual(element._customDimensions, [
        { index: 3, value: 'test-value-3' },
        { index: 4, value: 'test-value-4' }
      ]);
    });

    it('Removes custom dimension from the _customDimensions array', async () => {
      element = await customDimensionFixture();
      await aTimeout();
      const node = element.querySelector('app-analytics-custom');
      element.removeChild(node);
      await aTimeout();
      assert.deepEqual(element._customDimensions, [
        { index: 4, value: 'test-value-4' }
      ]);
    });
  });

  describe('Custom data manipulation', () => {
    let element;

    it('Changes type of custom metric', async () => {
      element = await customDimensionFixture();
      await aTimeout();
      const node = element.querySelector('app-analytics-custom');
      node.value = 1;
      node.type = 'metric';
      await aTimeout();
      assert.deepEqual(element._customDimensions, [
        { index: 4, value: 'test-value-4' }
      ]);
      assert.deepEqual(element._customMetrics, [
        { index: 3, value: 1 }
      ]);
    });

    it('Changes index of custom metric', async () => {
      element = await customMetricsFixture();
      await aTimeout();
      const node = element.querySelector('app-analytics-custom');
      node.index = 6;
      await aTimeout();
      assert.deepEqual(element._customMetrics, [
        { index: 2, value: 2 },
        { index: 6, value: 1 }
      ]);
    });
  });

  describe('_restoreConfiguration()', () => {
    let element;
    beforeEach(() => {
      localStorage.removeItem(disabledKey);
      localStorage.removeItem(cidKey);
    });

    it('Generates client id when missing', async () => {
      element = await noPropertiesFixture();
      assert.typeOf(element.clientId, 'string');
    });

    it('Stores generated client id to local storage', async () => {
      element = await noPropertiesFixture();
      assert.equal(localStorage.getItem(cidKey), element.clientId);
    });

    it('Restores client id from local store', async () => {
      const value = 'test-cid';
      localStorage.setItem(cidKey, value);
      element = await noPropertiesFixture();
      assert.equal(element.clientId, value);
    });

    it('Sets "disabled" when diabled state is stored in local storage', async () => {
      localStorage.setItem(disabledKey, 'true');
      element = await noPropertiesFixture();
      assert.isTrue(element.disabled);
    });

    it('Do not restores client id when diabled state is stored in local storage', async () => {
      localStorage.setItem(disabledKey, 'true');
      element = await noPropertiesFixture();
      assert.isUndefined(element.clientId);
    });

    it('Ignores restoration when "clientId" is already set', async () => {
      element = await clientIdFixture();
      assert.equal(element.clientId, 'test-id');
    });
  });

  describe('_cidChanged()', () => {
    let element;
    beforeEach(async () => {
      localStorage.removeItem(cidKey);
      element = await basicFixture();
    });

    after(() => {
      localStorage.removeItem(cidKey);
    });

    it('Calls _configureBaseParams()', () => {
      const spy = sinon.spy(element, '_configureBaseParams');
      element._cidChanged('abc');
      assert.isTrue(spy.called);
    });

    it('Stores client id in local storage', () => {
      element._cidChanged('abc');
      assert.equal(localStorage.getItem(cidKey), 'abc');
    });

    it('Ignores storing new value if equals existing', () => {
      localStorage.setItem(cidKey, 'abc');
      const spy = sinon.spy(localStorage, 'setItem');
      element._cidChanged('abc');
      localStorage.setItem.restore();
      assert.isFalse(spy.called);
    });
  });

  describe('_disabledChanged()', () => {
    let element;
    beforeEach(async () => {
      localStorage.removeItem(disabledKey);
      element = await basicFixture();
    });

    after(() => {
      localStorage.removeItem(disabledKey);
    });

    it('Calls _configureBaseParams() when not disabled', () => {
      const spy = sinon.spy(element, '_configureBaseParams');
      element._disabledChanged(false);
      assert.isTrue(spy.called);
    });

    it('Calls _configureBaseParams() when not disabled', () => {
      const spy = sinon.spy(element, '_configureBaseParams');
      element._disabledChanged(false);
      assert.isTrue(spy.called);
    });

    it('Stores state in local storage', () => {
      element._disabledChanged(true);
      assert.equal(localStorage.getItem(disabledKey), 'true');
    });

    it('Ignores storing new value if equals existing', () => {
      localStorage.setItem(disabledKey, 'true');
      const spy = sinon.spy(localStorage, 'setItem');
      element._disabledChanged(true);
      localStorage.setItem.restore();
      assert.isFalse(spy.called);
    });
  });

  describe('_processAddedNodes()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Does nothing when no argument', () => {
      element._processAddedNodes();
      // no error
    });

    it('Does nothing when empty argument', () => {
      element._processAddedNodes([]);
      // no error, coverage
    });

    it('Adds custom dimension', () => {
      const node = document.createElement('app-analytics-custom');
      node.index = 2;
      node.value = 'test-1';
      node.type = 'dimension';

      element._processAddedNodes([node]);
      assert.deepEqual(element._customDimensions, [{
        index: 2,
        value: 'test-1'
      }]);
    });

    it('Adds custom metric', () => {
      const node = document.createElement('app-analytics-custom');
      node.index = 1;
      node.value = 1;
      node.type = 'metric';

      element._processAddedNodes([node]);
      assert.deepEqual(element._customMetrics, [{
        index: 1,
        value: 1
      }]);
    });

    it('Adds aria-hidden attribute', () => {
      const node = document.createElement('app-analytics-custom');
      node.index = 1;
      node.value = 1;
      node.type = 'metric';

      element._processAddedNodes([node]);
      assert.equal(node.getAttribute('aria-hidden'), 'true');
    });

    it('Ignores other elements', () => {
      const node = document.createElement('div');
      node.index = 1;
      node.value = 1;
      node.type = 'metric';

      element._processAddedNodes([node]);
      assert.equal(node.getAttribute('aria-hidden'), null);
    });

    it('Ignores adding to custom array when no index', () => {
      const node = document.createElement('app-analytics-custom');
      node.value = 1;
      node.type = 'metric';
      element._processAddedNodes([node]);
      assert.isEmpty(element._customMetrics);
    });

    it('Ignores adding to custom array when no type', () => {
      const node = document.createElement('app-analytics-custom');
      node.index = 1;
      node.value = 'test';

      element._processAddedNodes([node]);
      assert.isEmpty(element._customDimensions);
    });
  });

  describe('_processRemovedNodes()', () => {
    let element;

    it('Does nothing when no argument', async () => {
      element = await customMetricsFixture();
      element._processRemovedNodes();
      // no error
    });

    it('Does nothing when empty argument', async () => {
      element = await customMetricsFixture();
      element._processRemovedNodes([]);
      // no error, coverage
    });

    it('Removes custom dimension', async () => {
      element = await customDimensionFixture();
      const node = element.querySelector('app-analytics-custom');
      element._processRemovedNodes([node]);
      assert.deepEqual(element._customDimensions, [
        { index: 4, value: 'test-value-4' }
      ]);
    });

    it('Removes custom metric', async () => {
      element = await customMetricsFixture();
      const node = element.querySelector('app-analytics-custom');
      element._processRemovedNodes([node]);
      assert.deepEqual(element._customMetrics, [
        { index: 2, value: 2 }
      ]);
    });

    it('Ignores other elements', async () => {
      element = await customMetricsFixture();
      const node = document.createElement('div');
      node.index = 1;
      node.value = 1;
      node.type = 'metric';

      element._processRemovedNodes([node]);
      assert.deepEqual(element._customMetrics, [
        { index: 1, value: 1 },
        { index: 2, value: 2 }
      ]);
    });

    it('Ignores removing when no index', async () => {
      element = await customMetricsFixture();
      const node = document.createElement('app-analytics-custom');
      node.value = 1;
      node.type = 'metric';
      element._processRemovedNodes([node]);
      assert.deepEqual(element._customMetrics, [
        { index: 1, value: 1 },
        { index: 2, value: 2 }
      ]);
    });

    it('Ignores removing when no type', async () => {
      element = await customMetricsFixture();
      const node = document.createElement('app-analytics-custom');
      node.value = 1;
      node.index = 1;
      element._processRemovedNodes([node]);
      assert.deepEqual(element._customMetrics, [
        { index: 1, value: 1 },
        { index: 2, value: 2 }
      ]);
    });
  });

  describe('_processChildAttribute()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Does nothing when attributeName is not supported', () => {
      element._processChildAttribute({
        attributeName: 'other'
      });
      // no error
    });

    it('Does nothing when target\'s index is not set', () => {
      element._processChildAttribute({
        attributeName: 'value',
        target: document.createElement('div')
      });
      // no error
    });

    it('Calls addCustomDimension()', () => {
      const target = document.createElement('div');
      target.setAttribute('index', '1');
      target.setAttribute('type', 'dimension');
      target.setAttribute('value', 'test-value');
      const spy = sinon.spy(element, 'addCustomDimension');
      element._processChildAttribute({
        attributeName: 'value',
        target
      });
      assert.isTrue(spy.called);
    });

    it('Adds custom dimension', () => {
      const target = document.createElement('div');
      target.setAttribute('index', '1');
      target.setAttribute('type', 'dimension');
      target.setAttribute('value', 'test-value');
      element._processChildAttribute({
        attributeName: 'value',
        target
      });
      assert.deepEqual(element._customDimensions, [
        { index: 1, value: 'test-value' }
      ]);
    });

    it('Calls addCustomMetric()', () => {
      const target = document.createElement('div');
      target.setAttribute('index', '1');
      target.setAttribute('type', 'metric');
      target.setAttribute('value', '1');
      const spy = sinon.spy(element, 'addCustomMetric');
      element._processChildAttribute({
        attributeName: 'value',
        target
      });
      assert.isTrue(spy.called);
    });

    it('Adds custom dimension', () => {
      const target = document.createElement('div');
      target.setAttribute('index', '1');
      target.setAttribute('type', 'metric');
      target.setAttribute('value', '1');
      element._processChildAttribute({
        attributeName: 'value',
        target
      });
      assert.deepEqual(element._customMetrics, [
        { index: 1, value: 1 }
      ]);
    });
  });
});
