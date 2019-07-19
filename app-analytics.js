/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import '@advanced-rest-client/uuid-generator/uuid-generator.js';
/**
 * **Required for all hit types.**
 *
 * The Protocol version. The current value is '1'. This will only change when there
 * are changes made that are not backwards compatible.
 *
 * - Parameter: **v**
 * - Example value: 1
 * - Example usage: v=1
 *
 * @type {Number}
 */
const protocolVersion = 1;
/**
 * A map of parameter names to its descriptions.
 * @type {Object}
 */
export const paramsMap = {
  v: 'Protocol Version',
  tid: 'Tracking ID / Web Property ID',
  aip: 'Anonymize IP',
  ds: 'Data Source',
  qt: 'Queue Time',
  z: 'Cache Buster',
  cid: 'Client ID',
  uid: 'User ID',
  sc: 'Session Control',
  uip: 'IP Override',
  ua: 'User Agent Override',
  geoip: 'Geographical Override',
  dr: 'Document Referrer',
  cn: 'Campaign Name',
  cs: 'Campaign Source',
  cm: 'Campaign Medium',
  ck: 'Campaign Keyword',
  cc: 'Campaign Content',
  ci: 'Campaign ID',
  gclid: 'Google AdWords ID',
  dclid: 'Google Display Ads ID',
  sr: 'Screen Resolution',
  vp: 'Viewport size',
  de: 'Document Encoding',
  sd: 'Screen Colors',
  ul: 'User Language',
  je: 'Java Enabled',
  fl: 'Flash Version',
  t: 'Hit type',
  ni: 'Non-Interaction Hit',
  dl: 'Document location URL',
  dh: 'Document Host Name',
  dp: 'Document Path',
  dt: 'Document Title',
  cd: 'Screen Name',
  linkid: 'Link ID',
  an: 'Application Name',
  aid: 'Application ID',
  av: 'Application Version',
  aiid: 'Application Installer ID',
  ec: 'Event Category',
  ea: 'Event Action',
  el: 'Event Label',
  ev: 'Event Value',
  sn: 'Social Network',
  sa: 'Social Action',
  st: 'Social Action Target',
  utc: 'User timing category',
  utv: 'User timing variable name',
  utt: 'User timing time',
  utl: 'User timing label',
  plt: 'Page Load Time',
  dns: 'DNS Time',
  pdt: 'Page Download Time',
  rrt: 'Redirect Response Time',
  tcp: 'TCP Connect Time',
  srt: 'Server Response Time',
  dit: 'DOM Interactive Time',
  clt: 'Content Load Time',
  exd: 'Exception Description',
  exf: 'Is Exception Fatal?',
  xid: 'Experiment ID',
  xvar: 'Experiment Variant'
};
for (let i = 1; i < 201; i++) {
  paramsMap['cd' + i] = 'Custom dimension #' + i;
  paramsMap['cm' + i] = 'Custom metric #' + i;
}

function detectLocalStorage() {
  /* global chrome */
  if (typeof chrome !== 'undefined' && chrome.i18n) {
    // Chrome apps have `chrome.i18n` property, regular website doesn't.
    // This is to avoid annoying warning message in Chrome app.
    return false;
  }
  try {
    localStorage.getItem('test');
    return true;
  } catch (_) {
    return false;
  }
}
/**
 * True if current environment has localStorage suppport.
 * Chrome apps do not have localStorage property.
 *
 * @type {Boolean}
 */
export const hasLocalStorage = detectLocalStorage();
/**
 * List of hist to be send when came back from offline state.
 * Note, this is in memory information only.
 * The component do not sotres this information.
 *
 * @type {Array<Object>}
 */
export const offlineQueue = [];
/**
 * `<app-analytics>` An element that support Google Analytics analysis
 *
 * ### Example
 *
 * ```html
 * <app-analytics
 *  tracking-id="UA-XXXXXXX-Y"
 *    app-name="my app"
 *    app-version="1.0.0"
 *    data-source="app-analytics element"></app-analytics>
 * ```
 *
 * The `app-name` and `tracking-id` are required parameters in order to run the element properly.
 *
 * This element initalize its own database where config data are stored (cid parameter).
 *
 * If `clientId` attribute is not set it will be generated automatically. There's no need to set
 * it manually if there's no need.
 *
 * Google Analytics does not allow sending any information that may lead to a user.
 *
 * Always give the user ability to disable tracking. Under EU laws you need to have
 * permission from the user to store data on his device. To disable analytics simply
 * remove the element from the DOM.
 *
 * ### Using `<app-analytics>`
 *
 * You can directly call one of `send*()` functions. See API Reference below for more info.
 * - <a href="#method-sendEvent">sendEvent</a>
 * - <a href="#method-sendException">sendException</a>
 * - <a href="#method-sendScreen">sendScreen</a>
 * - <a href="#method-sendSocial">sendSocial</a>
 * - <a href="#method-sendTimings">sendTimings</a>
 *
 * You can also use event system to send a hit. In this case fire a `send-analytics` event
 * with required `type` property on the `detail` object which describes what king of hit
 * should be send. Possible values are: `pageview`, `screenview`, `event`, `social`,
 * `exception` or `timing`.
 *
 * Other parameters depends on the type.
 *
 * #### Sending `screenview` hit
 *
 * ```javascript
 * const event = new CustomEvent('send-analytics', {
 *  bubbles: true,
 *  composed: true,
 *  detail: {
 *    type: 'screenview',
 *    name: 'Some scree name' //required
 *  }
 * });
 * document.dispatchEvent(event);
 * ```
 *
 * #### Sending `event` hit
 *
 * ```javascript
 * const event = new CustomEvent('send-analytics', {
 *  bubbles: true,
 *  composed: true,
 *  detail: {
 *    type: 'event',
 *    category: 'Some category', //required.
 *    action: 'Some action', //required.
 *    label: 'Some label',
 *    value: 123
 *  }
 * });
 * document.dispatchEvent(event);
 * ```
 *
 * #### Sending `exception` hit
 *
 * ```javascript
 * const event = new CustomEvent('send-analytics', {
 *  bubbles: true,
 *  composed: true,
 *  detail: {
 *    type: 'exception',
 *    description: 'Exception description', // required.
 *    fatal: true, // default false
 *  }
 * });
 * document.dispatchEvent(event);
 * ```
 *
 * #### Sending `social` hit
 *
 * ```javascript
 * const event = new CustomEvent('send-analytics', {
 *  bubbles: true,
 *  composed: true,
 *  detail: {
 *    type: 'social',
 *    network: 'Google +', // required.
 *    action: 'Share', // required
 *    target: 'https://www.shared.com/resource' // required
 *  }
 * });
 * document.dispatchEvent(event);
 * ```
 *
 * #### Sending `timing` hit
 *
 * ```javascript
 * const event = new CustomEvent('send-analytics', {
 *  bubbles: true,
 *  composed: true,
 *  detail: {
 *    type: 'timing',
 *    category: 'Bootstrap', // required.
 *    variable: 'databaseInitTime', // required
 *    value: 123, // required
 *    label: 'Optional label'
 *  }
 * });
 * document.dispatchEvent(event);
 * ```
 *
 * ## Custom metrics and dimensions
 *
 * Use `<app-analytics-custom>` element as a child of `<app-analytics>` to set custom properties.
 * This metrics / dimensions will be used with every hit as long as this elements exists as a
 * children of the `<app-analytics>` element.

 * ### Example
 *
 * ```html
 * <app-analytics tracking-id="UA-XXXXXXX">
 *  <app-analytics-custom type="metric" index="1" value="5"></app-analytics-custom>
 * </app-analytics>
 * ```
 *
 * To send custom data with single hit only without creating `<app-analytics-custom>` children,
 * add `customDimensions` or `customMetrics` to the event detail object. Both objects must be
 * an array of custom definition objects that includs index and value.
 *
 * ### Example
 *
 * ```javascript
 * const event = new CustomEvent('send-analytics', {
 *  bubbles: true,
 *  composed: true,
 *  detail: {
 *    type: 'event',
 *    category: 'Engagement',
 *    action: 'Click',
 *    label: 'Movie start',
 *    customDimensions: [{
 *      index: 1, // index of the custom dimension
 *      value: 'Author name' // Value of the custom dimension
 *    }]
 *  }
 * });
 * document.dispatchEvent(event);
 * ```
 *
 * @customElement
 * @demo demo/index.html
 * @memberof LogicElements
 */
class AppAnalytics extends HTMLElement {
  /**
   * Note, UUID generator is used only during the initialization and when
   * client id is not set and there's no coirresponding entry in local storage.
   * Otherwise it is unused.
   * @return {Element} A reference to `uuid-generator` element.
   */
  get _uuid() {
    if (!this.__uuid) {
      this.__uuid = document.createElement('uuid-generator');
    }
    return this.__uuid;
  }

  static get observedAttributes() {
    return [
      'clientid',
      'userid',
      'trackingid',
      'anonymizeip',
      'datasource',
      'usecachebooster',
      'referrer',
      'campaignname',
      'campaignsource',
      'campaignmedium',
      'appversion',
      'appname',
      'appid',
      'appinstallerid',
      'debug',
      'debugendpoint',
      'disabled',
      'offline'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'clientid': this._setStringProperty('clientId', newValue); break;
      case 'userid': this._setStringProperty('userId', newValue); break;
      case 'trackingid': this._setStringProperty('trackingId', newValue); break;
      case 'datasource': this._setStringProperty('dataSource', newValue); break;
      case 'campaignname': this._setStringProperty('campaignName', newValue); break;
      case 'campaignsource': this._setStringProperty('campaignSource', newValue); break;
      case 'campaignmedium': this._setStringProperty('campaignMedium', newValue); break;
      case 'appversion': this._setStringProperty('appVersion', newValue); break;
      case 'appname': this._setStringProperty('appName', newValue); break;
      case 'appid': this._setStringProperty('appId', newValue); break;
      case 'appinstallerid': this._setStringProperty('appInstallerId', newValue); break;
      case 'referrer': this._setStringProperty(name, newValue); break;
      case 'anonymizeip': this._setBooleanProperty('anonymizeIp', newValue); break;
      case 'usecachebooster': this._setBooleanProperty('useCacheBooster', newValue); break;
      case 'debugendpoint': this._setBooleanProperty('debugEndpoint', newValue); break;
      case 'debug':
      case 'disabled':
      case 'offline':
        this._setBooleanProperty(name, newValue);
        break;
    }
  }

  _setStringProperty(name, value) {
    if (value === null) {
      this[name] = undefined;
    } else {
      this[name] = value;
    }
  }

  _setBooleanProperty(name, value) {
    if (value === null) {
      this[name] = false;
    } else {
      this[name] = true;
    }
  }
  /**
   * The Client ID for the mearusement protocol.
   *
   * **It is required for all types of calls.**
   *
   * The value of this field should be a random UUID (version 4) as described
   * in http://www.ietf.org/rfc/rfc4122.txt
   *
   * - Parameter: **cid**
   * - Example value: 35009a79-1a05-49d7-b876-2b884d0f825b
   * - Example usage: cid=35009a79-1a05-49d7-b876-2b884d0f825b
   *
   * @return {String}
   */
  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this._clientId = value;
    this._cidChanged(value);
    this._configureBaseParams();
  }
  /**
   * This is intended to be a known identifier for a user provided by the site owner/tracking
   * library user. It must not itself be PII (personally identifiable information).
   * The value should never be persisted in GA cookies or other Analytics provided storage.
   *
   * - Parameter: **uid**
   * - Example value: as8eknlll
   * - Example usage: uid=as8eknlll
   *
   * @return {String}
   */
  get userId() {
    return this._userId;
  }

  set userId(value) {
    this._userId = value;
    this._configureBaseParams();
  }
  /**
   * **Required for all hit types.**
   *
   * The tracking ID / web property ID. The format is UA-XXXX-Y.
   * All collected data is associated by this ID.
   *
   * - Parameter: **tid**
   * - Example value: UA-XXXX-Y
   * - Example usage: tid=UA-XXXX-Y
   *
   * @return {String}
   */
  get trackingId() {
    return this._trackingId;
  }

  set trackingId(value) {
    this._trackingId = value;
    this._configureBaseParams();
  }
  /**
   * When present, the IP address of the sender will be anonymized.
   * For example, the IP will be anonymized if any of the following parameters are present in
   * the payload: &aip=, &aip=0, or &aip=1
   *
   * - Parameter: **aip**
   * - Example value: 1
   * - Example usage: aip=1
   * @return {Boolean}
   */
  get anonymizeIp() {
    return this._anonymizeIp;
  }

  set anonymizeIp(value) {
    this._anonymizeIp = value;
    this._configureBaseParams();
  }
  /**
   * Indicates the data source of the hit. Hits sent from analytics.js will have data source
   * set to 'web'; hits sent from one of the mobile SDKs will have data source set to 'app'.
   *
   * - Parameter: **ds**
   * - Example value: call center
   * - Example usage: ds=call%20center
   *
   * @return {String}
   */
  get dataSource() {
    return this._dataSource;
  }

  set dataSource(value) {
    this._dataSource = value;
    this._configureBaseParams();
  }
  /**
   * Used to send a random number in GET requests to ensure browsers and proxies
   * don't cache hits.
   *
   * - Parameter: **z**
   * - Example value: 289372387623
   * - Example usage: z=289372387623
   *
   * @return {Boolean}
   */
  get useCacheBooster() {
    return this._useCacheBooster;
  }

  set useCacheBooster(value) {
    this._useCacheBooster = value;
  }
  /**
   * Specifies which referral source brought traffic to a website. This value is also used to
   * compute the traffic source. The format of this value is a URL.
   *
   * - Parameter: **dr**
   * - Example value: http://example.com
   * - Example usage: dr=http%3A%2F%2Fexample.com
   *
   * @return {String}
   */
  get referrer() {
    return this._referrer;
  }

  set referrer(value) {
    this._referrer = value;
    this._configureBaseParams();
  }
  /**
   * Specifies the campaign name.
   *
   * - Parameter: **cn**
   * - Example value: (direct)
   * - Example usage: cn=%28direct%29
   *
   * @return {String}
   */
  get campaignName() {
    return this._campaignName;
  }

  set campaignName(value) {
    this._campaignName = value;
    this._configureBaseParams();
  }
  /**
   * Specifies the campaign source.
   *
   * - Parameter: **cs**
   * - Example value: (direct)
   * - Example usage: cs=%28direct%29
   *
   * @return {String}
   */
  get campaignSource() {
    return this._campaignSource;
  }

  set campaignSource(value) {
    this._campaignSource = value;
    this._configureBaseParams();
  }
  /**
   * Specifies the campaign medium.
   *
   * - Parameter: **cm**
   * - Example value: organic
   * - Example usage: cm=organic
   *
   * @return {String}
   */
  get campaignMedium() {
    return this._campaignMedium;
  }

  set campaignMedium(value) {
    this._campaignMedium = value;
    this._configureBaseParams();
  }
  /**
   * Specifies the application version.
   *
   * - Parameter: **av**
   * - Example value: 1.2
   * - Example usage: av=1.2
   *
   * @return {String}
   */
  get appVersion() {
    return this._appVersion;
  }

  set appVersion(value) {
    this._appVersion = value;
    this._configureBaseParams();
  }
  /**
   * Specifies the application name. This field is required for any hit that has app related
   * data (i.e., app version, app ID, or app installer ID). For hits sent to web properties,
   * this field is optional.
   *
   * - Parameter: **an**
   * - Example My App
   * - Example usage: an=My%20App
   *
   * @return {String}
   */
  get appName() {
    return this._appName;
  }

  set appName(value) {
    this._appName = value;
    this._configureBaseParams();
  }
  /**
   * Application identifier.
   *
   * - Parameter: **aid**
   * - Example value: com.company.app
   * - Example usage: aid=com.company.app
   *
   * @return {String}
   */
  get appId() {
    return this._appId;
  }

  set appId(value) {
    this._appId = value;
    this._configureBaseParams();
  }
  /**
   * Application installer identifier.
   *
   * - Parameter: **aiid**
   * - Example value: com.platform.vending
   * - Example usage: aiid=com.platform.vending
   *
   * @return {String}
   */
  get appInstallerId() {
    return this._appInstallerId;
  }

  set appInstallerId(value) {
    this._appInstallerId = value;
    this._configureBaseParams();
  }
  /**
   * If set to true it will prints debug messages into the console.
   *
   * @return {Boolean}
   */
  get debug() {
    return this._debug;
  }

  set debug(value) {
    this._debug = value;
  }
  /**
   * If set it will send the data to GA's debug endpoint
   * and the request won't be actually saved but only validated
   * and the validation results will be fired in the
   * `aapp-analytics-structure-debug`
   * event in the detail's `debug` property.
   *
   * @return {Boolean}
   */
  get debugEndpoint() {
    return this._debugEndpoint;
  }

  set debugEndpoint(value) {
    this._debugEndpoint = value;
  }
  /**
   * If set disables Google Analytics reporting.
   * This information is stored in localStorage. As long as this
   * information is not cleared it is respected and data are not send to GA
   * server.
   *
   * @return {Boolean}
   */
  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this._disabled = value;
    this._disabledChanged(value);
  }
  /**
   * When set it queues requests to GA in memory and attempts to send the requests
   * again when this flag is removed.
   *
   * @return {Boolean}
   */
  get offline() {
    return this._offline;
  }

  set offline(value) {
    this._offline = value;
    this._offlineChanged(value);
  }
  /**
   * Generated POST parameters based on a params
   * @return {Object}
   */
  get _baseParams() {
    return this.__baseParams;
  }

  set _baseParams(value) {
    this.__baseParams = value;
  }
  /**
   * Each custom metric has an associated index. There is a maximum of 20 custom
   * metrics (200 for Analytics 360 accounts). The metric index must be a positive
   * integer between 1 and 200, inclusive.
   *
   * - Parameter: **cm<metricIndex>**
   * - Example value: 47
   * - Example usage: cm1=47
   *
   * @return {Array<Object>}
   */
  get _customMetrics() {
    return this.__customMetrics;
  }

  set _customMetrics(value) {
    this.__customMetrics = value;
  }
  /**
   * Each custom dimension has an associated index. There is a maximum of 20 custom
   * dimensions (200 for Analytics 360 accounts). The dimension index must be a positive
   * integer between 1 and 200, inclusive.
   *
   * - Parameter: **cd<dimensionIndex>**
   * - Example value: Sports
   * - Example usage: cd1=Sports
   *
   * @return {Array<Object>}
   */
  get _customDimensions() {
    return this.__customDimensions;
  }

  set _customDimensions(value) {
    this.__customDimensions = value;
  }
  /**
   * @return {String} Local storage key for clientId.
   */
  get cidKey() {
    return 'apic.ga.cid';
  }
  /**
   * @return {String} Local storage key for disabled.
   */
  get disabledKey() {
    return 'apic.ga.disabled';
  }

  constructor() {
    super();
    this._sendHandler = this._sendHandler.bind(this);

    this._baseParams = {};
    this._customMetrics = [];
    this._customDimensions = [];

    const config = {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true
    };
    this._observer = new MutationObserver((mutations) => this._childrenUpdated(mutations));
    this._observer.observe(this, config);

    this._restoreConfiguration();
  }

  connectedCallback() {
    if (!this.hasAttribute('aria-hidden')) {
      this.setAttribute('aria-hidden', 'true');
    }
    window.addEventListener('send-analytics', this._sendHandler);

    if (!this.__initialized) {
      this.__initialized = true;
      setTimeout(() => {
        this._processInitialNodes();
      });
    }
  }

  disconnectedCallback() {
    window.removeEventListener('send-analytics', this._sendHandler);
    this.__uuid = undefined;
  }
  /**
   * A mutation observer callback function called when children or attributes changed.
   * It processes child nodes depending on mutation type and change record.
   * @param {Array<MutationRecord>} mutations
   */
  _childrenUpdated(mutations) {
    for (const mutation of mutations) {
      if (mutation.target === this && mutation.type === 'childList') {
        this._processAddedNodes(mutation.addedNodes);
        this._processRemovedNodes(mutation.removedNodes);
      } else if (mutation.target !== this && mutation.type === 'attributes') {
        this._processChildAttribute(mutation);
      }
    }
  }

  /**
   * Restores data stored in localStorage.
   */
  _restoreConfiguration() {
    /* istanbul ignore if */
    if (this.clientId || !hasLocalStorage) {
      return;
    }
    const disabled = localStorage.getItem(this.disabledKey);
    if (disabled === 'true') {
      this.disabled = true;
      // No need to restore cid at this point
      return;
    }
    let cid = localStorage.getItem(this.cidKey);
    if (!cid) {
      cid = this._uuid.generate();
    }
    this.clientId = cid;
  }
  /**
   * Stores cid value in localStorage if the value is different.
   *
   * @param {String} cid New client id value
   */
  _cidChanged(cid) {
    this._configureBaseParams();
    /* istanbul ignore if */
    if (!hasLocalStorage) {
      return;
    }
    cid = cid || '';
    const localCid = localStorage.getItem(this.cidKey);
    if (cid !== localCid) {
      localStorage.setItem(this.cidKey, cid);
    }
  }
  /**
   * Updates state of `disabled` property in local storage.
   * If the state changes to enabled (false) then it reinitializes
   * configuration.
   *
   * @param {Boolean} state
   */
  _disabledChanged(state) {
    if (!state) {
      this._restoreConfiguration();
      this._configureBaseParams();
    }
    /* istanbul ignore if */
    if (!hasLocalStorage) {
      return;
    }
    const localState = localStorage.getItem(this.disabledKey);
    if (localState !== String(state)) {
      localStorage.setItem(this.disabledKey, state);
    }
  }
  /**
   * Adds custom metric / dimension from a child node observer.
   * @param {NodeList} nodes
   */
  _processAddedNodes(nodes) {
    if (!nodes || !nodes.length) {
      return;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      if (node.nodeName !== 'APP-ANALYTICS-CUSTOM') {
        continue;
      }
      node.setAttribute('aria-hidden', 'true');
      if (node.index && node.type) {
        if (node.type === 'dimension') {
          this.addCustomDimension(node.index, node.value);
        } else if (node.type === 'metric') {
          this.addCustomMetric(node.index, node.value);
        }
      }
    }
  }
  /**
   * Remove custom dimensions.
   * Child elements can't send event here when they are already detached from the document
   * so the parent element must observe child and determine if custom dimenstion should
   * be removed.
   *
   * @param {NodeList} nodes
   */
  _processRemovedNodes(nodes) {
    if (!nodes || !nodes.length) {
      return;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      if (node.nodeName !== 'APP-ANALYTICS-CUSTOM') {
        return;
      }
      if (node.index && node.type) {
        if (node.type === 'dimension') {
          this.removeCustomDimension(node.index);
        } else if (node.type === 'metric') {
          this.removeCustomMetric(node.index);
        }
      }
    }
  }
  /**
   * Processes `MutationRecord` for attribute change
   * @param {MutationRecord} mutation A mutation record that triggered the callback
   */
  _processChildAttribute(mutation) {
    if (['index', 'value', 'type'].indexOf(mutation.attributeName) === -1) {
      return;
    }
    const target = mutation.target;
    const type = target.getAttribute('type');
    const index = Number(target.getAttribute('index'));
    if (isNaN(index)) {
      return;
    }
    if (mutation.attributeName === 'type' && mutation.oldValue) {
      // Removes old type from the corresponding array.
      if (mutation.oldValue === 'dimension') {
        this.removeCustomDimension(index);
      } else if (mutation.oldValue === 'metric') {
        this.removeCustomMetric(index);
      }
    } else if (mutation.attributeName === 'index' && mutation.oldValue) {
      // Removes previously used index from the corresponding array.
      const index = Number(mutation.oldValue);
      if (!isNaN(index)) {
        if (type === 'dimension') {
          this.removeCustomDimension(index);
        } else if (type === 'metric') {
          this.removeCustomMetric(index);
        }
      }
    }
    const value = target.getAttribute('value');
    if (type === 'dimension') {
      this.addCustomDimension(index, value);
    } else if (type === 'metric') {
      this.addCustomMetric(index, value);
    }
  }
  /**
   * Sets custom dimension to be send with the hit.
   * Set dimension will be used in all hits until `removeCustomDimension()` is called
   * with the same `index`.
   *
   * Custom dimensions can be set in GA admin interface an its index will be displayed there.
   *
   * @param {Number} index Index of the custom dimension. Free version of GA allows up to 20
   * custom dimensions and up to 200 in premium. The index has to be in range 1 - 200.
   * @param {Strnig} value Value of the custom dimension to set.
   */
  addCustomDimension(index, value) {
    this._addCustom('_customDimensions', index, value);
  }
  /**
   * Removes from this instance custom dimension for given index.
   *
   * @param {Number} index Index of the custom dimension. The index has to be in range 1 - 200.
   */
  removeCustomDimension(index) {
    this._removeCustom('_customDimensions', index);
  }
  /**
   * Sets custom metric to be send with the hit.
   * Set metric will be used in all hits until `removeCustomMetric()` is called
   * with the same `index`.
   *
   * Custom metrics can be set in GA admin interface an its index will be displayed there.
   *
   * @param {Number} index Index of the custom metric. Free version of GA allows up to 20
   * custom metrics and up to 200 in premium. The index has to be in range 1 - 200.
   * @param {Strnig} value Value of the custom metric to set.
   */
  addCustomMetric(index, value) {
    if (!isNaN(value)) {
      value = Number(value);
    }
    this._addCustom('_customMetrics', index, value);
  }
  /**
   * Removes from this instance custom metric for given index.
   *
   * @param {Number} index Index of the custom metric. The index has to be in range 1 - 200.
   */
  removeCustomMetric(index) {
    this._removeCustom('_customMetrics', index);
  }
  /**
   * Adds custom metric / dimension to the corresponding array.
   * @param {String} prop The name of the property with the array of custom items.
   * @param {Number} index Index of the custom property. Free version of GA allows up to 20
   * custom metrics/dimensions and up to 200 in premium. The index has to be in range 1 - 200.
   * @param {Strnig} value Value of the custom property to set.
   */
  _addCustom(prop, index, value) {
    index = Number(index);
    if (index !== index) {
      throw new TypeError('Index is not a number.');
    }
    if (index <= 0 || index > 200) {
      throw new RangeError('Index out of bounds');
    }
    const custom = this[prop];
    const pos = custom.findIndex((i) => i.index === index);
    if (pos !== -1) {
      if (this[prop][pos].value !== value) {
        this[prop][pos].value = value;
      } else {
        return;
      }
    } else {
      this[prop].push({
        index: index,
        value: value
      });
    }
    this._configureBaseParams();
  }
  /**
   * Removes from this instance custom metric/dimension for given index.
   *
   * @param {String} prop The name of the property with the array of custom items.
   * @param {Number} index Index of the custom metric. The index has to be in range 1 - 200.
   */
  _removeCustom(prop, index) {
    index = Number(index);
    const custom = this[prop];
    const pos = custom.findIndex((i) => i.index === index);
    if (pos === -1) {
      return;
    }
    this[prop].splice(pos, 1);
    this._configureBaseParams();
  }
  /**
   * Sends the screenview hit to the GA.
   *
   * @param {String} name Screen name.
   * @param {Object} opts Custom data definition. It should be an object that may contain two
   * keys: `customDimensions` and `customMetrics`. Both as an array of objects. Each object must
   * contain `index` property - representing custom data index in GA - and `value` property -
   * representing value of the property.
   * @return {Promise}
   */
  sendScreen(name, opts) {
    const data = {
      cd: name
    };
    this.appendCustomData(data, opts);
    return this.sendHit('screenview', data);
  }
  /**
   * Sends event tracking.
   *
   * @param {String} category Specifies the event category. Must not be empty.
   * @param {String} action Specifies the event action. Must not be empty.
   * @param {String?} label Specifies the event label. Optional value.
   * @param {Number?} value Specifies the event value. Values must be non-negative. Optional.
   * @param {Object} opts Custom data definition. It should be an object that may contain two
   * keys: `customDimensions` and `customMetrics`. Both as an array of objects. Each object must
   * contain `index` property - representing custom data index in GA - and `value` property -
   * representing value of the property.
   * @return {Promise}
   */
  sendEvent(category, action, label, value, opts) {
    const missing = [];
    if (!category) {
      missing.push('category');
    }
    if (!action) {
      missing.push('action');
    }
    if (missing.length) {
      throw new Error('Missing required parameters: ' + missing.join(', '));
    }
    const data = {
      ec: category,
      ea: action
    };
    if (label) {
      data.el = label;
    }
    if (value) {
      data.ev = value;
    }
    this.appendCustomData(data, opts);
    return this.sendHit('event', data);
  }
  /**
   * Sends the exception hit to GA.
   *
   * @param {String} description A description of the exception.
   * @param {Boolean} fatal Specifies whether the exception was fatal.
   * @param {Object} opts Custom data definition. It should be an object that may contain two
   * keys: `customDimensions` and `customMetrics`. Both as an array of objects. Each object must
   * contain `index` property - representing custom data index in GA - and `value` property -
   * representing value of the property.
   * @return {Promise}
   */
  sendException(description, fatal, opts) {
    fatal = fatal ? '1' : '0';
    const data = {
      exd: description,
      exf: fatal
    };
    this.appendCustomData(data, opts);
    return this.sendHit('exception', data);
  }
  /**
   * Track social interaction
   *
   * @param {String} network Specifies the social network, for example Facebook or Google Plus.
   * @param {String} action Specifies the social interaction action. For example on Google Plus
   * when a user clicks the +1 button, the social action is 'plus'.
   * @param {String} target Specifies the target of a social interaction. This value is
   * typically a URL but can be any text.
   * @param {Object} opts Custom data definition. It should be an object that may contain two
   * keys: `customDimensions` and `customMetrics`. Both as an array of objects. Each object must
   * contain `index` property - representing custom data index in GA - and `value` property -
   * representing value of the property.
   * @return {Promise}
   */
  sendSocial(network, action, target, opts) {
    const missing = [];
    if (!network) {
      missing.push('network');
    }
    if (!action) {
      missing.push('action');
    }
    if (!target) {
      missing.push('target');
    }
    if (missing.length) {
      throw new Error('Missing required parameters: ' + missing.join(', '));
    }
    const data = {
      sn: network,
      sa: action,
      st: target
    };
    this.appendCustomData(data, opts);
    return this.sendHit('social', data);
  }
  /**
   * Track timings in the app.
   *
   * @param {String} category Specifies the user timing category. **required**
   * @param {String} variable Specifies the user timing variable. **required**
   * @param {Number} time Specifies the user timing value. The value is in milliseconds.
   * **required**
   * @param {String} label Specifies the user timing label.
   * @param {Object} cmOpts Custom data definition. It should be an object that may contain two
   * keys: `customDimensions` and `customMetrics`. Both as an array of objects. Each object must
   * contain `index` property - representing custom data index in GA - and `value` property -
   * representing value of the property.
   * @return {Promise}
   */
  sendTimings(category, variable, time, label, cmOpts) {
    const missing = [];
    if (!category) {
      missing.push('category');
    }
    if (!variable) {
      missing.push('variable');
    }
    if (!time) {
      missing.push('time');
    }
    if (missing.length) {
      throw new Error('Missing required parameters: ' + missing.join(', '));
    }
    const opts = {
      utc: category,
      utv: variable,
      utt: time
    };
    if (label) {
      opts.utl = label;
    }
    this.appendCustomData(opts, cmOpts);
    return this.sendHit('timing', opts);
  }
  /**
   * Append custom metrics / dimensions definitions to the
   * parameters list.
   *
   * @param {Object} data The data to send
   * @param {?Object} opts
   */
  appendCustomData(data, opts) {
    if (!opts) {
      return;
    }
    if (opts.customDimensions && opts.customDimensions.length) {
      opts.customDimensions.forEach((item) => {
        data['cd' + item.index] = item.value;
      });
    }
    if (opts.customMetrics && opts.customMetrics.length) {
      opts.customMetrics.forEach((item) => {
        data['cm' + item.index] = item.value;
      });
    }
  }
  /**
   * Send a hit to the GA server.
   * The `type` parameter is required for all types of hits.
   *
   * @param {String} type The type of hit. Must be one of 'pageview', 'screenview', 'event',
   * 'transaction', 'item', 'social', 'exception', 'timing'.
   * @param {Array<String,String>} params Map of params to send wit this hit.
   * @return {Promise}
   */
  sendHit(type, params) {
    if (['pageview', 'screenview', 'event', 'transaction', 'item', 'social', 'exception',
      'timing'].indexOf(type) === -1) {
      throw new Error('Unknown hit type.');
    }
    params.t = type;
    this._processParams(params);
    const post = Object.assign({}, this._baseParams, params);
    const body = this._createBody(post);
    if (this.debug) {
      console.group('Running command for ', type);
      this._printParamsTable(post);
      console.groupEnd();
    }
    return this._transport(body);
  }

  /**
   * An event handler for `send-analytics`
   * @param {CustomEvent} e
   */
  _sendHandler(e) {
    if (!e.detail || this.disabled) {
      return;
    }
    const d = e.detail;
    const opts = {};
    if (d.customDimensions) {
      opts.customDimensions = d.customDimensions;
    }
    if (d.customMetrics) {
      opts.customMetrics = d.customMetrics;
    }
    switch (d.type) {
      case 'screenview':
        this.sendScreen(d.name, opts);
        break;
      case 'event':
        this.sendEvent(d.category, d.action, d.label, d.value, opts);
        break;
      case 'exception':
        this.sendException(d.description, d.fatal, opts);
        break;
      case 'social':
        this.sendSocial(d.network, d.action, d.target, opts);
        break;
      case 'timing':
        try {
          this.sendTimings(d.category, d.variable, d.value, d.label, opts);
        } catch (e) {
          console.warn(e);
        }
        break;
      default:
        console.warn('Unknown type [' + d.type + ']');
        break;
    }
  }
  /**
   * Encodes parameters.
   * @param {Object} params
   */
  _processParams(params) {
    Object.keys(params).forEach((param) => {
      params[param] = this.encodeQueryString(params[param]);
    });
  }
  /**
   * Creates a post body from the params.
   * @param {Object} params List of parameters to send
   * @return {Stirng} Request body
   */
  _createBody(params) {
    let result = '';
    Object.keys(params).forEach((param) => {
      if (result) {
        result += '&';
      }
      result += param + '=' + params[param];
    });
    return result;
  }

  encodeQueryString(str) {
    if (!str) {
      return str;
    }
    const regexp = /%20/g;
    return encodeURIComponent(str).replace(regexp, '+');
  }

  _configureBaseParams() {
    const data = {
      v: protocolVersion,
      tid: this.trackingId,
      cid: this.clientId,
      ul: navigator.language,
      sr: screen.width + 'x' + screen.height,
      sd: String(screen.pixelDepth)
    };
    const iw = window.innerWidth;
    const ih = window.innerHeight;
    if (iw && ih) {
      data.vp = iw + 'x' + ih;
    }

    if (this.userId) {
      data.uid = this.userId;
    }
    if (this.anonymizeIp) {
      data.aip = '1';
    }
    if (this.dataSource) {
      data.ds = this.encodeQueryString(this.dataSource);
    }
    if (this.referrer) {
      data.dr = this.encodeQueryString(this.referrer);
    }
    if (this.campaignName) {
      data.cn = this.encodeQueryString(this.campaignName);
    }
    if (this.campaignSource) {
      data.cs = this.encodeQueryString(this.campaignSource);
    }
    if (this.campaignMedium) {
      data.cm = this.encodeQueryString(this.campaignMedium);
    }
    if (this.appVersion) {
      data.av = this.encodeQueryString(this.appVersion);
    }
    if (this.appName) {
      data.an = this.encodeQueryString(this.appName);
    }
    if (this.appId) {
      data.aid = this.encodeQueryString(this.appId);
    }
    if (this.appInstallerId) {
      data.aiid = this.encodeQueryString(this.appInstallerId);
    }
    if (this._customMetrics.length) {
      this._customMetrics.forEach((cm) => {
        data['cm' + cm.index] = this.encodeQueryString(cm.value);
      });
    }
    if (this._customDimensions.length) {
      this._customDimensions.forEach((cd) => {
        data['cd' + cd.index] = this.encodeQueryString(cd.value);
      });
    }
    if (this.debug) {
      console.info('[GA] Configuring base object', data);
    }
    this._baseParams = data;
  }

  _printParamsTable(list) {
    const map = {};
    const debugList = [];
    Object.keys(list).forEach((param) => {
      const name = paramsMap[param] || param;
      const value = decodeURIComponent(list[param]);
      map[param] = {
        value: value,
        name: name
      };
      debugList.push({
        param: param,
        value: value,
        name: name
      });
    });
    console.table(map, ['name', 'value']);
    this.dispatchEvent(new CustomEvent('app-analytics-hit-debug', {
      detail: {
        debug: debugList
      }
    }));
  }

  _transport(body) {
    if (this.disabled) {
      return Promise.resolve();
    }
    const offline = this.offline;
    if (offline) {
      offlineQueue.push(body);
      return Promise.resolve();
    }
    const init = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body
    };
    let url = 'https://www.google-analytics.com';
    if (this.debugEndpoint) {
      url += '/debug';
    }
    url += '/collect';
    if (this.useCacheBooster) {
      url += '?z=' + Date.now();
    }

    if (this.__testRunner) {
      // For test cases.
      return Promise.resolve(init);
    }

    return fetch(url, init).then((response) => {
      if (response.status !== 200) {
        if (!offline) {
          offlineQueue.push(body);
        } else {
          throw new Error('Unable send data.');
        }
      }
      if (this.debugEndpoint) {
        return response.json().then((result) => {
          this.dispatchEvent(new CustomEvent('app-analytics-structure-debug', {
            detail: {
              debug: result
            }
          }));
        });
      }
    }).catch(() => {
      if (!navigator.onLine && !offline) {
        offlineQueue.push(body);
        return;
      }
      throw new Error('Unable to send data');
    });
  }

  _offlineChanged(value) {
    if (value || !offlineQueue.length) {
      // Nothing to do when offline of no panding tasks.
      return;
    }
    const p = [];
    for (let i = offlineQueue.length - 1; i >= 0; i--) {
      const body = offlineQueue[i];
      offlineQueue.splice(i, 1);
      p[p.length] = this._transport(body);
    }
    return Promise.all(p).catch((cause) => {
      console.warn(cause);
    });
  }

  __printError(e) {
    let msg = 'The <app-analytics> element encountered a problem. ';
    msg += 'Please, repor an isse at ';
    msg += 'https://github.com/advanced-rest-client/app-analytics/issues';
    console.info(msg, e);
    console.trace();
  }
  /**
   * MutationObserver initialized in the constructor does not
   * triggers changes when the element is initialized. This
   * function processes nodes set up declaratively when the element is still
   * initializing.
   */
  _processInitialNodes() {
    this._processAddedNodes(this.children);
  }
}
window.customElements.define('app-analytics', AppAnalytics);
