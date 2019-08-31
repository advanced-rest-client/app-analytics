import { fixture, assert, aTimeout } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
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

  async function debugEndpointFixture() {
    return (await fixture(`<app-analytics
      trackingid="UA-71458341-4"
      appname="app analytics test"
      appversion="dev"
      datasource="app-analytics element"
      debugendpoint></app-analytics>`));
  }

  async function sendingFixture() {
    return (await fixture(`<app-analytics
        trackingid="UA-71458341-4"
        appname="app-analytics-test"
        appversion="dev"
        datasource="app-analytics-test-element">
        <app-analytics-custom type="metric" index="1" value="5"></app-analytics-custom>
      <app-analytics-custom type="metric" index="7" value="105"></app-analytics-custom>
      <app-analytics-custom type="dimension" index="3" value="test"></app-analytics-custom>
      <app-analytics-custom type="dimension" index="10" value="some value"></app-analytics-custom>
    </app-analytics>`));
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
      await aTimeout();
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

    // it('Ignores storing new value if equals existing', () => {
    //   localStorage.setItem(cidKey, 'abc');
    //   const spy = sinon.spy(localStorage, 'setItem');
    //   element._cidChanged('abc');
    //   localStorage.setItem.restore();
    //   assert.isFalse(spy.called);
    // });
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

    // it('Ignores storing new value if equals existing', () => {
    //   localStorage.setItem(disabledKey, 'true');
    //   const spy = sinon.spy(localStorage, 'setItem');
    //   element._disabledChanged(true);
    //   localStorage.setItem.restore();
    //   assert.isFalse(spy.called);
    // });
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

    it('Ignores adding to custom array when type is unknown', () => {
      const node = document.createElement('app-analytics-custom');
      node.index = 1;
      node.value = 'test';
      node.type = 'other';

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

    it('Ignores removing when type is unknown', async () => {
      element = await customMetricsFixture();
      const node = document.createElement('app-analytics-custom');
      node.value = 1;
      node.index = 1;
      node.type = 'other';
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

    it('Does nothing when target\'s index is not a number', () => {
      const target = document.createElement('div');
      target.setAttribute('index', 'test');
      element._processChildAttribute({
        attributeName: 'value',
        target
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

    it('Removes custom metric when type changed', () => {
      const target = document.createElement('div');
      target.setAttribute('index', '1');
      target.setAttribute('type', 'dimension');
      target.setAttribute('value', 'test-1');
      element._customMetrics = [{ index: 1, value: 1 }];
      element._processChildAttribute({
        attributeName: 'type',
        oldValue: 'metric',
        target
      });
      assert.isEmpty(element._customMetrics);
      assert.deepEqual(element._customDimensions, [{ index: 1, value: 'test-1' }]);
    });

    it('Removes custom dimension when type changed', () => {
      const target = document.createElement('div');
      target.setAttribute('index', '1');
      target.setAttribute('type', 'metric');
      target.setAttribute('value', '1');
      element._customDimensions = [{ index: 1, value: 'test-1' }];
      element._processChildAttribute({
        attributeName: 'type',
        oldValue: 'dimension',
        target
      });
      assert.isEmpty(element._customDimensions);
      assert.deepEqual(element._customMetrics, [{ index: 1, value: 1 }]);
    });

    it('Ignores removal of old custom metric when old type is unknown', () => {
      const target = document.createElement('div');
      target.setAttribute('index', '2');
      target.setAttribute('type', 'metric');
      target.setAttribute('value', '1');
      element._customMetrics = [{ index: 1, value: 1 }];
      element._processChildAttribute({
        attributeName: 'type',
        oldValue: 'other',
        target
      });
      assert.deepEqual(element._customMetrics, [{ index: 1, value: 1 }, { index: 2, value: 1 }]);
    });

    it('Removes old custom metric when index changed', () => {
      const target = document.createElement('div');
      target.setAttribute('index', '2');
      target.setAttribute('type', 'metric');
      target.setAttribute('value', '1');
      element._customMetrics = [{ index: 1, value: 1 }];
      element._processChildAttribute({
        attributeName: 'index',
        oldValue: '1',
        target
      });
      assert.deepEqual(element._customMetrics, [{ index: 2, value: 1 }]);
    });

    it('Removes old custom dimension when index changed', () => {
      const target = document.createElement('div');
      target.setAttribute('index', '2');
      target.setAttribute('type', 'dimension');
      target.setAttribute('value', 'test-1');
      element._customDimensions = [{ index: 1, value: 'test-1' }];
      element._processChildAttribute({
        attributeName: 'index',
        oldValue: '1',
        target
      });
      assert.deepEqual(element._customDimensions, [{ index: 2, value: 'test-1' }]);
    });

    it('Ignores removal of old custom dimension when index is not a number', () => {
      const target = document.createElement('div');
      target.setAttribute('index', '1');
      target.setAttribute('type', 'dimension');
      target.setAttribute('value', 'test-1');
      element._customDimensions = [{ index: 1, value: 'test-1' }];
      element._processChildAttribute({
        attributeName: 'index',
        oldValue: 'test',
        target
      });
      assert.deepEqual(element._customDimensions, [{ index: 1, value: 'test-1' }]);
    });

    it('Ignores removal of old custom dimension when child type is unknown', () => {
      const target = document.createElement('div');
      target.setAttribute('index', '1');
      target.setAttribute('type', 'other');
      target.setAttribute('value', 'test-2');
      element._customDimensions = [{ index: 1, value: 'test-1' }];
      element._processChildAttribute({
        attributeName: 'index',
        oldValue: '1',
        target
      });
      assert.deepEqual(element._customDimensions, [{ index: 1, value: 'test-1' }]);
    });
  });

  describe('_addCustom()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Throws error when index is not a number', () => {
      assert.throws(() => {
        element._addCustom('_customMetrics', 'test', 1);
      });
    });

    it('Throws error when index is below 1', () => {
      assert.throws(() => {
        element._addCustom('_customMetrics', 0, 1);
      });
    });

    it('Throws error when index is above 200', () => {
      assert.throws(() => {
        element._addCustom('_customMetrics', 201, 1);
      });
    });

    it('Adds an item to metrics list', () => {
      element._addCustom('_customMetrics', 1, 1);
      assert.deepEqual(element._customMetrics, [{ index: 1, value: 1 }]);
    });

    it('Adds an item to dimensions list', () => {
      element._addCustom('_customDimensions', 1, 'test');
      assert.deepEqual(element._customDimensions, [{ index: 1, value: 'test' }]);
    });

    it('Updates a value at existing index', () => {
      element._customDimensions = [{ index: 1, value: 'test' }];
      element._addCustom('_customDimensions', 1, 'other');
      assert.deepEqual(element._customDimensions, [{ index: 1, value: 'other' }]);
    });

    it('Calls _configureBaseParams()', () => {
      const spy = sinon.spy(element, '_configureBaseParams');
      element._addCustom('_customDimensions', 1, 'other');
      assert.isTrue(spy.called);
    });

    it('Ignores when value for index is not changed', () => {
      element._customDimensions = [{ index: 1, value: 'test' }];
      const spy = sinon.spy(element, '_configureBaseParams');
      element._addCustom('_customDimensions', 1, 'test');
      assert.isFalse(spy.called);
    });
  });

  describe('sendScreen()', () => {
    let element;
    beforeEach(async () => {
      localStorage.setItem(disabledKey, 'true');
      element = await debugEndpointFixture();
    });

    it('Returns a promise', () => {
      const result = element.sendScreen('Test');
      assert.typeOf(result.then, 'function');
      return result;
    });

    it('Calls appendCustomData()', async () => {
      const spy = sinon.spy(element, 'appendCustomData');
      await element.sendScreen('Test');
      assert.isTrue(spy.called);
    });

    it('Calls sendHit()', async () => {
      const spy = sinon.spy(element, 'sendHit');
      await element.sendScreen('Test');
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'screenview');
      assert.deepEqual(spy.args[0][1], {
        cd: 'Test',
        t: 'screenview'
      });
    });
  });

  describe('sendEvent()', () => {
    const category = 'test-cat';
    const action = 'test-act';
    const label = 'test-label';
    const value = 'test-value';

    let element;
    beforeEach(async () => {
      localStorage.setItem(disabledKey, 'true');
      element = await debugEndpointFixture();
    });

    it('Throws when category is missing', () => {
      assert.throws(() => {
        element.sendEvent(undefined, action, label, value);
      });
    });

    it('Throws when action is missing', () => {
      assert.throws(() => {
        element.sendEvent(category, undefined, label, value);
      });
    });

    it('Returns a promise', () => {
      const result = element.sendEvent(category, action, label, value);
      assert.typeOf(result.then, 'function');
      return result;
    });

    it('Calls appendCustomData()', () => {
      const spy = sinon.spy(element, 'appendCustomData');
      return element.sendEvent(category, action, label, value)
      .then(() => {
        assert.isTrue(spy.called);
      });
    });

    it('Calls sendHit()', () => {
      const spy = sinon.spy(element, 'sendHit');
      return element.sendEvent(category, action, label, value)
      .then(() => {
        assert.isTrue(spy.called);
        assert.equal(spy.args[0][0], 'event');
        assert.deepEqual(spy.args[0][1], {
          ec: category,
          ea: action,
          el: label,
          ev: value,
          t: 'event'
        });
      });
    });

    it('Label is optional', () => {
      const spy = sinon.spy(element, 'sendHit');
      return element.sendEvent(category, action, undefined, value)
      .then(() => {
        assert.deepEqual(spy.args[0][1], {
          ec: category,
          ea: action,
          ev: value,
          t: 'event'
        });
      });
    });

    it('Value is optional', () => {
      const spy = sinon.spy(element, 'sendHit');
      return element.sendEvent(category, action, undefined, undefined)
      .then(() => {
        assert.deepEqual(spy.args[0][1], {
          ec: category,
          ea: action,
          t: 'event'
        });
      });
    });
  });

  describe('sendException()', () => {
    const description = 'test-desc';
    const fatal = 'fatal-value';

    let element;
    beforeEach(async () => {
      localStorage.setItem(disabledKey, 'true');
      element = await debugEndpointFixture();
    });

    it('Returns a promise', () => {
      const result = element.sendException(description, fatal);
      assert.typeOf(result.then, 'function');
      return result;
    });

    it('Calls appendCustomData()', () => {
      const spy = sinon.spy(element, 'appendCustomData');
      return element.sendException(description, fatal)
      .then(() => {
        assert.isTrue(spy.called);
      });
    });

    it('Calls sendHit()', () => {
      const spy = sinon.spy(element, 'sendHit');
      return element.sendException(description, fatal)
      .then(() => {
        assert.isTrue(spy.called);
        assert.equal(spy.args[0][0], 'exception');
        assert.deepEqual(spy.args[0][1], {
          exd: description,
          exf: '1',
          t: 'exception'
        });
      });
    });

    it('Respects "fatal" value', () => {
      const spy = sinon.spy(element, 'sendHit');
      return element.sendException(description, false)
      .then(() => {
        assert.deepEqual(spy.args[0][1], {
          exd: description,
          exf: '0',
          t: 'exception'
        });
      });
    });
  });

  describe('sendSocial()', () => {
    const network = 'network-value';
    const action = 'action-value';
    const target = 'target-value';

    let element;
    beforeEach(async () => {
      localStorage.setItem(disabledKey, 'true');
      element = await debugEndpointFixture();
    });

    it('Returns a promise', () => {
      const result = element.sendSocial(network, action, target);
      assert.typeOf(result.then, 'function');
      return result;
    });

    it('Calls appendCustomData()', () => {
      const spy = sinon.spy(element, 'appendCustomData');
      return element.sendSocial(network, action, target)
      .then(() => {
        assert.isTrue(spy.called);
      });
    });

    it('Calls sendHit()', () => {
      const spy = sinon.spy(element, 'sendHit');
      return element.sendSocial(network, action, target)
      .then(() => {
        assert.isTrue(spy.called);
        assert.equal(spy.args[0][0], 'social');
        assert.deepEqual(spy.args[0][1], {
          sn: network,
          sa: action,
          st: target,
          t: 'social'
        });
      });
    });

    it('Throws when no network property', () => {
      assert.throws(() => {
        element.sendSocial(undefined, action, target);
      });
    });

    it('Throws when no action property', () => {
      assert.throws(() => {
        element.sendSocial(network, undefined, target);
      });
    });

    it('Throws when no target property', () => {
      assert.throws(() => {
        element.sendSocial(network, action, undefined);
      });
    });
  });

  describe('sendTimings()', () => {
    const category = 'category-value';
    const variable = 'variable-value';
    const time = 'time-value';
    const label = 'label-value';

    let element;
    beforeEach(async () => {
      localStorage.setItem(disabledKey, 'true');
      element = await debugEndpointFixture();
    });

    it('Returns a promise', () => {
      const result = element.sendTimings(category, variable, time, label);
      assert.typeOf(result.then, 'function');
      return result;
    });

    it('Calls appendCustomData()', () => {
      const spy = sinon.spy(element, 'appendCustomData');
      return element.sendTimings(category, variable, time, label)
      .then(() => {
        assert.isTrue(spy.called);
      });
    });

    it('Calls sendHit()', () => {
      const spy = sinon.spy(element, 'sendHit');
      return element.sendTimings(category, variable, time, label)
      .then(() => {
        assert.isTrue(spy.called);
        assert.equal(spy.args[0][0], 'timing');
        assert.deepEqual(spy.args[0][1], {
          utc: category,
          utv: variable,
          utt: time,
          utl: label,
          t: 'timing'
        });
      });
    });

    it('Label is optional', () => {
      const spy = sinon.spy(element, 'sendHit');
      return element.sendTimings(category, variable, time)
      .then(() => {
        assert.isTrue(spy.called);
        assert.equal(spy.args[0][0], 'timing');
        assert.deepEqual(spy.args[0][1], {
          utc: category,
          utv: variable,
          utt: time,
          t: 'timing'
        });
      });
    });

    it('Throws when no category property', () => {
      assert.throws(() => {
        element.sendTimings(undefined, variable, time);
      });
    });

    it('Throws when no variable property', () => {
      assert.throws(() => {
        element.sendTimings(category, undefined, time);
      });
    });

    it('Throws when no time property', () => {
      assert.throws(() => {
        element.sendTimings(category, variable, undefined);
      });
    });
  });

  describe('appendCustomData()', () => {
    let element;
    beforeEach(async () => {
      element = await debugEndpointFixture();
    });

    it('Does nothing when no options', () => {
      const result = {};
      element.appendCustomData(result);
      assert.lengthOf(Object.keys(result), 0);
    });

    it('Adds custom dimensions', () => {
      const result = {};
      element.appendCustomData(result, {
        customDimensions: [{
          index: 1,
          value: 'test'
        }]
      });
      assert.equal(result.cd1, 'test');
    });

    it('Adds custom metrics', () => {
      const result = {};
      element.appendCustomData(result, {
        customMetrics: [{
          index: 1,
          value: 'test'
        }]
      });
      assert.equal(result.cm1, 'test');
    });
  });

  describe('sendHit()', () => {
    let element;
    beforeEach(async () => {
      localStorage.setItem(disabledKey, 'true');
      element = await debugEndpointFixture();
    });

    it('Throws when unknown type', () => {
      assert.throws(() => {
        element.sendHit('other', {});
      }, 'Unknown hit type.');
    });

    it('Sets type on the parmaeters', () => {
      const params = {};
      element.debug = true;
      element.sendHit('screenview', params);
      assert.equal(params.t, 'screenview');
    });

    it('Calls _processParams()', () => {
      const params = {};
      const spy = sinon.spy(element, '_processParams');
      element.sendHit('screenview', params);
      assert.isTrue(spy.called);
      assert.isTrue(spy.args[0][0] === params);
    });

    it('Calls _createBody()', () => {
      const params = {};
      const spy = sinon.spy(element, '_createBody');
      element.sendHit('screenview', params);
      assert.isTrue(spy.called, 'Function is called');
      assert.typeOf(spy.args[0][0], 'object', 'Sets parameters');
    });

    it('Calls _transport()', () => {
      const params = {};
      const spy = sinon.spy(element, '_transport');
      element.sendHit('screenview', params);
      assert.isTrue(spy.called);
      assert.typeOf(spy.args[0][0], 'string');
    });
  });

  describe('_processParams()', () => {
    let element;
    let opts;
    beforeEach(async () => {
      opts = { a: 'test value', other: 'value' };
      element = await debugEndpointFixture();
    });

    it('Calls encodeQueryString() for each parameter', () => {
      const spy = sinon.spy(element, 'encodeQueryString');
      element._processParams(opts);
      assert.equal(spy.callCount, 2);
    });

    it('Encodes values', () => {
      element._processParams(opts);
      assert.equal(opts.a, 'test+value');
    });
  });

  describe('_createBody()', () => {
    let element;
    let opts;
    beforeEach(async () => {
      opts = { a: 'test value', other: 'value' };
      element = await debugEndpointFixture();
    });

    it('Creates body value for each parameter', () => {
      const result = element._createBody(opts);
      assert.equal(result, 'a=test value&other=value');
    });
  });

  describe('_configureBaseParams()', () => {
    let element;
    beforeEach(async () => {
      localStorage.setItem(disabledKey, 'true');
      element = await debugEndpointFixture();
    });

    it('Sets baseParams object', () => {
      element._configureBaseParams();
      assert.typeOf(element._baseParams, 'object');
    });

    it('Sets all default properties', () => {
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.v, '1');
      assert.equal(p.tid, 'UA-71458341-4');
      assert.equal(p.cid, element.clientId);
      assert.typeOf(p.ul, 'string');
      assert.typeOf(p.sr, 'string');
      assert.typeOf(p.sd, 'string');
    });

    it('Sets vp property', () => {
      element._configureBaseParams();
      const p = element._baseParams;
      assert.typeOf(p.vp, 'string');
    });

    it('Sets uid property', () => {
      element.userId = 'test-uid';
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.uid, element.userId);
    });

    it('Sets aip property', () => {
      element.anonymizeIp = true;
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.aip, '1');
    });

    it('Sets ds property', () => {
      element.dataSource = 'https://domain.com';
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.ds, 'https%3A%2F%2Fdomain.com');
    });

    it('Sets dr property', () => {
      element.referrer = 'https://domain.com/path';
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.dr, 'https%3A%2F%2Fdomain.com%2Fpath');
    });

    it('Sets cn property', () => {
      element.campaignName = 'My name';
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.cn, 'My+name');
    });

    it('Sets cs property', () => {
      element.campaignSource = 'My source';
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.cs, 'My+source');
    });

    it('Sets cm property', () => {
      element.campaignMedium = 'My medium';
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.cm, 'My+medium');
    });

    it('Sets av property', () => {
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.av, 'dev');
    });

    it('Sets an property', () => {
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.an, 'app+analytics+test');
    });

    it('Sets cm property', () => {
      element.appId = 'Test aid';
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.aid, 'Test+aid');
    });

    it('Sets aiid property', () => {
      element.appInstallerId = 'Test id';
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.aiid, 'Test+id');
    });

    it('Sets custom metrics', () => {
      element._customMetrics = [{ index: 2, value: 'x y' }];
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.cm2, 'x+y');
    });

    it('Sets custom metrics', () => {
      element._customDimensions = [{ index: 2, value: 'x y' }];
      element._configureBaseParams();
      const p = element._baseParams;
      assert.equal(p.cd2, 'x+y');
    });
  });

  describe('_sendHandler()', () => {
    let element;
    beforeEach(async () => {
      localStorage.removeItem(disabledKey);
      element = await debugEndpointFixture();
      element.__testRunner = true;
    });

    function fire(detail) {
      const e = new CustomEvent('send-analytics', {
        bubbles: true,
        detail
      });
      document.body.dispatchEvent(e);
    }

    it('Does nothing when event type is unknwon', () => {
      fire({
        type: 'other'
      });
      // no error
    });

    it('Does nothing when disabled', () => {
      element.disabled = true;
      fire({
        type: 'other'
      });
      // no error
      element.disabled = false;
    });

    it('Calls sendScreen()', () => {
      const spy = sinon.spy(element, 'sendScreen');
      fire({
        type: 'screenview',
        name: 'Test'
      });
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'Test');
    });

    it('Calls sendEvent()', () => {
      const spy = sinon.spy(element, 'sendEvent');
      fire({
        type: 'event',
        category: 'ec',
        action: 'ea',
        label: 'el',
        value: 'ev'
      });
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'ec');
      assert.equal(spy.args[0][1], 'ea');
      assert.equal(spy.args[0][2], 'el');
      assert.equal(spy.args[0][3], 'ev');
    });

    it('Calls sendException()', () => {
      const spy = sinon.spy(element, 'sendException');
      fire({
        type: 'exception',
        description: 'ed',
        fatal: true
      });
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'ed');
      assert.equal(spy.args[0][1], true);
    });

    it('Calls sendSocial()', () => {
      const spy = sinon.spy(element, 'sendSocial');
      fire({
        type: 'social',
        network: 'sn',
        action: 'sa',
        target: 'st'
      });
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'sn');
      assert.equal(spy.args[0][1], 'sa');
      assert.equal(spy.args[0][2], 'st');
    });

    it('Calls sendTimings()', () => {
      const spy = sinon.spy(element, 'sendTimings');
      fire({
        type: 'timing',
        category: 'tc',
        variable: 'tvar',
        value: 'tv',
        label: 'tl'
      });
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'tc');
      assert.equal(spy.args[0][1], 'tvar');
      assert.equal(spy.args[0][2], 'tv');
      assert.equal(spy.args[0][3], 'tl');
    });

    it('sendTimings() will not throw error', () => {
      fire({
        type: 'timing',
        variable: 'tvar',
        value: 'tv',
        label: 'tl'
      });
    });

    it('Adds custom dimensions', () => {
      const spy = sinon.spy(element, 'sendHit');
      fire({
        type: 'screenview',
        name: 'Test',
        customDimensions: [{
          index: 1,
          value: 'test-1'
        }]
      });
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][1].cd1, 'test-1');
    });

    it('Adds custom metric', () => {
      const spy = sinon.spy(element, 'sendHit');
      fire({
        type: 'screenview',
        name: 'Test',
        customMetrics: [{
          index: 1,
          value: 1
        }]
      });
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][1].cm1, 1);
    });
  });

  describe('Sending data', function() {
    let element;
    let opts;

    beforeEach(async () => {
      localStorage.removeItem(disabledKey);
      element = await sendingFixture();
      element.__testRunner = true;
      opts = {};
      if (element.customDimensions) {
        opts.customDimensions = element.customDimensions;
      }
      if (element.customMetrics) {
        opts.customMetrics = element.customMetrics;
      }
    });

    function findValue(str, index) {
      if (index === -1) {
        return;
      }
      str = str.substr(index);
      let _pos = str.indexOf('=');
      if (_pos === -1) {
        return ''; // empty string value.
      }
      str = str.substr(_pos + 1);
      _pos = str.indexOf('&');
      if (_pos === -1) {
        return str;
      }
      return str.substr(0, _pos);
    }

    describe('Common', function() {
      let body;
      const params = [{
        n: 'v',
        v: '1'
      }, {
        n: 'tid',
        v: 'UA-71458341-4'
      }, {
        n: 'ds',
        v: 'app-analytics-test-element'
      }, {
        n: 'av',
        v: 'dev'
      }, {
        n: 'an',
        v: 'app-analytics-test'
      }];

      beforeEach(async () => {
        const info = await element.sendScreen('test', opts);
        body = info.body;
      });

      it('Request body should be a string', function() {
        assert.isString(body);
      });

      it(`Body have the ${params[0].n} parameter`, function() {
        const index = body.indexOf(params[0].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[0].n} value is ${params[0].v}`, function() {
        const value = findValue(body, body.indexOf(params[0].n + '='));
        assert.equal(value, params[0].v);
      });

      it(`Body have the ${params[1].n} parameter`, function() {
        const index = body.indexOf(params[1].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[1].n} value is ${params[1].v}`, function() {
        const value = findValue(body, body.indexOf(params[1].n + '='));
        assert.equal(value, params[1].v);
      });

      it(`Body have the ${params[2].n} parameter`, function() {
        const index = body.indexOf(params[2].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[2].n} value is ${params[2].v}`, function() {
        const value = findValue(body, body.indexOf(params[2].n + '='));
        assert.equal(value, params[2].v);
      });

      it(`Body have the ${params[3].n} parameter`, function() {
        const index = body.indexOf(params[3].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[3].n} value is ${params[3].v}`, function() {
        const value = findValue(body, body.indexOf(params[3].n + '='));
        assert.equal(value, params[3].v);
      });

      it(`Body have the ${params[4].n} parameter`, function() {
        const index = body.indexOf(params[4].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[4].n} value is ${params[4].v}`, function() {
        const value = findValue(body, body.indexOf(params[4].n + '='));
        assert.equal(value, params[4].v);
      });
    });

    describe('Variables', function() {
      let body;
      const params = [{
        n: 'ul',
        v: navigator.language
      }, {
        n: 'sr',
        v: screen.width + 'x' + screen.height
      }, {
        n: 'sd',
        v: screen.pixelDepth
      }, {
        n: 'vp',
        v: window.innerWidth + 'x' + window.innerHeight
      }];

      beforeEach(async () => {
        const info = await element.sendScreen('test', opts);
        body = info.body;
      });

      it(`Body have the ${params[0].n} parameter`, function() {
        const index = body.indexOf(params[0].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[0].n} value is ${params[0].v}`, function() {
        const value = findValue(body, body.indexOf(params[0].n + '='));
        assert.equal(value, params[0].v);
      });

      it(`Body have the ${params[1].n} parameter`, function() {
        const index = body.indexOf(params[1].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[1].n} value is ${params[1].v}`, function() {
        const value = findValue(body, body.indexOf(params[1].n + '='));
        assert.equal(value, params[1].v);
      });

      it(`Body have the ${params[2].n} parameter`, function() {
        const index = body.indexOf(params[2].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[2].n} value is ${params[2].v}`, function() {
        const value = findValue(body, body.indexOf(params[2].n + '='));
        assert.equal(value, params[2].v);
      });

      it(`Body have the ${params[3].n} parameter`, function() {
        const index = body.indexOf(params[3].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[3].n} value is ${params[3].v}`, function() {
        const value = findValue(body, body.indexOf(params[3].n + '='));
        assert.equal(value, params[3].v);
      });
    });

    describe('Custom metrics and dimensions', function() {
      let body;
      const params = [{
        n: 'cm1',
        v: 5
      }, {
        n: 'cm7',
        v: 105
      }, {
        n: 'cd3',
        v: 'test'
      }, {
        n: 'cd10',
        v: 'some+value'
      }];

      beforeEach(async () => {
        const info = await element.sendScreen('test', opts);
        body = info.body;
      });

      it(`Body have the ${params[0].n} parameter`, function() {
        const index = body.indexOf(params[0].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[0].n} value is ${params[0].v}`, function() {
        const value = findValue(body, body.indexOf(params[0].n + '='));
        assert.equal(value, params[0].v);
      });

      it(`Body have the ${params[1].n} parameter`, function() {
        const index = body.indexOf(params[1].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[1].n} value is ${params[1].v}`, function() {
        const value = findValue(body, body.indexOf(params[1].n + '='));
        assert.equal(value, params[1].v);
      });

      it(`Body have the ${params[2].n} parameter`, function() {
        const index = body.indexOf(params[2].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[2].n} value is ${params[2].v}`, function() {
        const value = findValue(body, body.indexOf(params[2].n + '='));
        assert.equal(value, params[2].v);
      });

      it(`Body have the ${params[3].n} parameter`, function() {
        const index = body.indexOf(params[3].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[3].n} value is ${params[3].v}`, function() {
        const value = findValue(body, body.indexOf(params[3].n + '='));
        assert.equal(value, params[3].v);
      });
    });

    describe('Send screen hit', function() {
      let body;
      const params = [{
        n: 'cd',
        v: 'test'
      }, {
        n: 't',
        v: 'screenview'
      }];

      beforeEach(async () => {
        const info = await element.sendScreen('test', opts);
        body = info.body;
      });

      it(`Body have the ${params[0].n} parameter`, function() {
        const index = body.indexOf(params[0].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[0].n} value is ${params[0].v}`, function() {
        const value = findValue(body, body.indexOf(params[0].n + '='));
        assert.equal(value, params[0].v);
      });

      it(`Body have the ${params[1].n} parameter`, function() {
        const index = body.indexOf(params[1].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[1].n} value is ${params[1].v}`, function() {
        const value = findValue(body, body.indexOf(params[1].n + '='));
        assert.equal(value, params[1].v);
      });
    });

    describe('Send event hit', function() {
      let body;
      const params = [{
        n: 't',
        v: 'event'
      }, {
        n: 'ec',
        v: 'event+category'
      }, {
        n: 'ea',
        v: 'event+action'
      }, {
        n: 'el',
        v: 'event+label'
      }, {
        n: 'ev',
        v: 5
      }];

      beforeEach(async () => {
        const info = await element.sendEvent('event category', 'event action', 'event label', 5, opts);
        body = info.body;
      });

      it(`Body have the ${params[0].n} parameter`, function() {
        const index = body.indexOf(params[0].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[0].n} value is ${params[0].v}`, function() {
        const value = findValue(body, body.indexOf(params[0].n + '='));
        assert.equal(value, params[0].v);
      });

      it(`Body have the ${params[1].n} parameter`, function() {
        const index = body.indexOf(params[1].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[1].n} value is ${params[1].v}`, function() {
        const value = findValue(body, body.indexOf(params[1].n + '='));
        assert.equal(value, params[1].v);
      });

      it(`Body have the ${params[2].n} parameter`, function() {
        const index = body.indexOf(params[2].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[2].n} value is ${params[2].v}`, function() {
        const value = findValue(body, body.indexOf(params[2].n + '='));
        assert.equal(value, params[2].v);
      });

      it(`Body have the ${params[3].n} parameter`, function() {
        const index = body.indexOf(params[3].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[3].n} value is ${params[3].v}`, function() {
        const value = findValue(body, body.indexOf(params[3].n + '='));
        assert.equal(value, params[3].v);
      });
    });

    describe('Send exception hit', function() {
      let body;
      const params = [{
        n: 'exf',
        v: '1'
      }, {
        n: 'exd',
        v: 'test+exception'
      }];

      beforeEach(async () => {
        const info = await element.sendException('test exception', true, opts);
        body = info.body;
      });

      it(`Body have the ${params[0].n} parameter`, function() {
        const index = body.indexOf(params[0].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[0].n} value is ${params[0].v}`, function() {
        const value = findValue(body, body.indexOf(params[0].n + '='));
        assert.equal(value, params[0].v);
      });

      it(`Body have the ${params[1].n} parameter`, function() {
        const index = body.indexOf(params[1].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[1].n} value is ${params[1].v}`, function() {
        const value = findValue(body, body.indexOf(params[1].n + '='));
        assert.equal(value, params[1].v);
      });
    });

    describe('Send social hit', function() {
      let body;
      const params = [{
        n: 'sn',
        v: 'test+network'
      }, {
        n: 'sa',
        v: 'test+like'
      }, {
        n: 'st',
        v: 'test+screen'
      }];

      beforeEach(async () => {
        const info = await element.sendSocial('test network', 'test like', 'test screen', opts);
        body = info.body;
      });

      it(`Body have the ${params[0].n} parameter`, function() {
        const index = body.indexOf(params[0].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[0].n} value is ${params[0].v}`, function() {
        const value = findValue(body, body.indexOf(params[0].n + '='));
        assert.equal(value, params[0].v);
      });

      it(`Body have the ${params[1].n} parameter`, function() {
        const index = body.indexOf(params[1].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[1].n} value is ${params[1].v}`, function() {
        const value = findValue(body, body.indexOf(params[1].n + '='));
        assert.equal(value, params[1].v);
      });

      it(`Body have the ${params[2].n} parameter`, function() {
        const index = body.indexOf(params[2].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[2].n} value is ${params[2].v}`, function() {
        const value = findValue(body, body.indexOf(params[2].n + '='));
        assert.equal(value, params[2].v);
      });
    });

    describe('Send timings hit', function() {
      let body;
      const params = [{
        n: 'utc',
        v: 'test+category'
      }, {
        n: 'utv',
        v: 'test+variable'
      }, {
        n: 'utt',
        v: 112
      }, {
        n: 'utl',
        v: 'test+label'
      }];

      beforeEach(async () => {
        const info = await element.sendTimings('test category', 'test variable', 112, 'test label', opts);
        body = info.body;
      });

      it(`Body have the ${params[0].n} parameter`, function() {
        const index = body.indexOf(params[0].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[0].n} value is ${params[0].v}`, function() {
        const value = findValue(body, body.indexOf(params[0].n + '='));
        assert.equal(value, params[0].v);
      });

      it(`Body have the ${params[1].n} parameter`, function() {
        const index = body.indexOf(params[1].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[1].n} value is ${params[1].v}`, function() {
        const value = findValue(body, body.indexOf(params[1].n + '='));
        assert.equal(value, params[1].v);
      });

      it(`Body have the ${params[2].n} parameter`, function() {
        const index = body.indexOf(params[2].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[2].n} value is ${params[2].v}`, function() {
        const value = findValue(body, body.indexOf(params[2].n + '='));
        assert.equal(value, params[2].v);
      });

      it(`Body have the ${params[3].n} parameter`, function() {
        const index = body.indexOf(params[3].n + '=');
        assert.isAtLeast(index, 0);
      });

      it(`${params[3].n} value is ${params[3].v}`, function() {
        const value = findValue(body, body.indexOf(params[3].n + '='));
        assert.equal(value, params[3].v);
      });
    });
  });

  describe('a11y', () => {
    it('Adds aria-hidden attribute to app-analytics', async () => {
      const element = await customMetricsFixture();
      await aTimeout();
      assert.equal(element.getAttribute('aria-hidden'), 'true');
    });

    it('Adds aria-hidden attribute to app-analytics-custom', async () => {
      const element = await customMetricsFixture();
      await aTimeout();
      const node = element.querySelector('app-analytics-custom');
      assert.equal(node.getAttribute('aria-hidden'), 'true');
    });

    it('is accessible in regular state', async () => {
      const element = await fixture(`<app-analytics
        trackingid="UA-71458341-4"
        appname="app-analytics-test"
        appversion="dev"
        datasource="app-analytics element"></app-analytics>`);
      await assert.isAccessible(element);
    });

    it('is accessible with children', async () => {
      const element = await fixture(`<app-analytics>
        <app-analytics-custom type="dimension" index="3" value="test-value-3"></app-analytics-custom>
        <app-analytics-custom type="dimension" index="4" value="test-value-4"></app-analytics-custom>
        </app-analytics>`);
      await assert.isAccessible(element);
    });
  });
});
