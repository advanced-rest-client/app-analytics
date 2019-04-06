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
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import {FlattenedNodesObserver} from '../../@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import '../../@advanced-rest-client/uuid-generator/uuid-generator.js';
import '../../@advanced-rest-client/connectivity-state/connectivity-state.js';
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
 * @polymer
 * @demo demo/index.html
 * @memberof ArcElements
 */
class AppAnalytics extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: none;
    }
    </style>
    <uuid-generator id="uuid"></uuid-generator>
    <connectivity-state online="{{isOnline}}"></connectivity-state>
    <slot></slot>
`;
  }

  static get properties() {
    return {
      // If true the app probably is online. See `<connectivity-state>`.
      isOnline: {type: Boolean, observer: '_onlineChanged'},
      // Generated POST parameters based on a params
      baseParams: {
        type: Array,
        readOnly: true,
        value: function() {
          return [];
        }
      },
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
       */
      clientId: {
        type: String,
        observer: '_cidChanged',
        notify: true
      },
      /**
       * This is intended to be a known identifier for a user provided by the site owner/tracking
       * library user. It must not itself be PII (personally identifiable information).
       * The value should never be persisted in GA cookies or other Analytics provided storage.
       *
       * - Parameter: **uid**
       * - Example value: as8eknlll
       * - Example usage: uid=as8eknlll
       *
       */
      userId: {
        type: String,
        observer: '_configureBaseParams'
      },
      /**
       * **Required for all hit types.**
       *
       * The Protocol version. The current value is '1'. This will only change when there
       * are changes made that are not backwards compatible.
       *
       * - Parameter: **v**
       * - Example value: 1
       * - Example usage: v=1
       */
      protocolVersion: {
        type: String,
        value: '1',
        readOnly: true
      },
      /**
       * **Required for all hit types.**
       *
       * The tracking ID / web property ID. The format is UA-XXXX-Y.
       * All collected data is associated by this ID.
       *
       * - Parameter: **tid**
       * - Example value: UA-XXXX-Y
       * - Example usage: tid=UA-XXXX-Y
       */
      trackingId: {
        type: String,
        observer: '_configureBaseParams'
      },
      /**
       * When present, the IP address of the sender will be anonymized.
       * For example, the IP will be anonymized if any of the following parameters are present in
       * the payload: &aip=, &aip=0, or &aip=1
       *
       * - Parameter: **aip**
       * - Example value: 1
       * - Example usage: aip=1
       */
      anonymizeIp: {
        type: Boolean,
        value: false,
        observer: '_configureBaseParams'
      },
      /**
       * Indicates the data source of the hit. Hits sent from analytics.js will have data source
       * set to 'web'; hits sent from one of the mobile SDKs will have data source set to 'app'.
       *
       * - Parameter: **ds**
       * - Example value: call center
       * - Example usage: ds=call%20center
       */
      dataSource: {
        type: String,
        observer: '_configureBaseParams'
      },
      /**
       * Used to send a random number in GET requests to ensure browsers and proxies
       * don't cache hits.
       *
       * - Parameter: **z**
       * - Example value: 289372387623
       * - Example usage: z=289372387623
       */
      useCacheBooster: Boolean,
      /**
       * Specifies which referral source brought traffic to a website. This value is also used to
       * compute the traffic source. The format of this value is a URL.
       *
       * - Parameter: **dr**
       * - Example value: http://example.com
       * - Example usage: dr=http%3A%2F%2Fexample.com
       */
      referrer: {
        type: String,
        observer: '_configureBaseParams'
      },
      /**
       * Specifies the campaign name.
       *
       * - Parameter: **cn**
       * - Example value: (direct)
       * - Example usage: cn=%28direct%29
       */
      campaignName: {
        type: String,
        observer: '_configureBaseParams'
      },
      /**
       * Specifies the campaign source.
       *
       * - Parameter: **cs**
       * - Example value: (direct)
       * - Example usage: cs=%28direct%29
       */
      campaignSource: {
        type: String,
        observer: '_configureBaseParams'
      },
      /**
       * Specifies the campaign medium.
       *
       * - Parameter: **cm**
       * - Example value: organic
       * - Example usage: cm=organic
       */
      campaignMedium: {
        type: String,
        observer: '_configureBaseParams'
      },
      /**
       * Specifies the application version.
       *
       * - Parameter: **av**
       * - Example value: 1.2
       * - Example usage: av=1.2
       */
      appVersion: {
        type: String,
        observer: '_configureBaseParams'
      },
      /**
       * Specifies the application name. This field is required for any hit that has app related
       * data (i.e., app version, app ID, or app installer ID). For hits sent to web properties,
       * this field is optional.
       *
       * - Parameter: **an**
       * - Example My App
       * - Example usage: an=My%20App
       */
      appName: {
        type: String,
        observer: '_configureBaseParams'
      },
      /**
       * Application identifier.
       *
       * - Parameter: **aid**
       * - Example value: com.company.app
       * - Example usage: aid=com.company.app
       */
      appId: {
        type: String,
        observer: '_configureBaseParams'
      },
      /**
       * Application installer identifier.
       *
       * - Parameter: **aiid**
       * - Example value: com.platform.vending
       * - Example usage: aiid=com.platform.vending
       */
      appInstallerId: {
        type: String,
        observer: '_configureBaseParams'
      },
      /**
       * Each custom metric has an associated index. There is a maximum of 20 custom
       * metrics (200 for Analytics 360 accounts). The metric index must be a positive
       * integer between 1 and 200, inclusive.
       *
       * - Parameter: **cm<metricIndex>**
       * - Example value: 47
       * - Example usage: cm1=47
       */
      customMetrics: {
        type: Array,
        readOnly: true,
        value: function() {
          return [];
        }
      },
      /**
       * Each custom dimension has an associated index. There is a maximum of 20 custom
       * dimensions (200 for Analytics 360 accounts). The dimension index must be a positive
       * integer between 1 and 200, inclusive.
       *
       * - Parameter: **cd<dimensionIndex>**
       * - Example value: Sports
       * - Example usage: cd1=Sports
       */
      customDimensions: {
        type: Array,
        readOnly: true,
        value: function() {
          return [];
        }
      },
      /**
       * True if current environment has localStorage suppport.
       * Chrome apps do not have localStorage property.
       */
      hasLocalStorage: {
        type: Boolean,
        readOnly: true,
        value: function() {
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
      },
      /**
       * If set to true it will prints debug messages into the console.
       */
      debug: Boolean,
      /**
       * If set it will send the data to GA's debug endpoint
       * and the request won't be actually saved but only validated
       * and the validation results will be fired in the
       * `aapp-analytics-structure-debug`
       * event in the detail's `debug` property.
       */
      debugEndpoint: Boolean,
      _paramsMap: {
        type: Object,
        readOnly: true,
        value: function() {
          const data = {
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
            data['cd' + i] = 'Custom dimension #' + i;
            data['cm' + i] = 'Custom metric #' + i;
          }
          return data;
        }
      },
      /**
       * If set disables Google Analytics reporting.
       * This information is stored in localStorage. As long as this
       * information is not cleared it is respected and data are not send to GA
       * server.
       */
      disabled: {
        type: Boolean,
        observer: '_disabledChanged'
      },
      /**
       * List of hist to be send when came back from offline state.
       * Note, this is in memory information only.
       * The component do not sotres this information.
       */
      _offlineQueue: Array
    };
  }

  constructor() {
    super();
    this._customPropertyChanged = this._customPropertyChanged.bind(this);
    this._customPropertyRemoved = this._customPropertyRemoved.bind(this);
    this._sendHandler = this._sendHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('app-analytics-custom-changed', this._customPropertyChanged);
    this.addEventListener('app-analytics-custom-removed', this._customPropertyRemoved);
    window.addEventListener('send-analytics', this._sendHandler);
    this._restoreConfiguration();

    this._observer = new FlattenedNodesObserver(this.shadowRoot.querySelector('slot'), (info) => {
      info.addedNodes = info.addedNodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);
      info.removedNodes = info.removedNodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);
      this._processAddedNodes(info.addedNodes);
      this._processRemovedNodes(info.removedNodes);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('app-analytics-custom-changed', this._customPropertyChanged);
    this.removeEventListener('app-analytics-custom-removed', this._customPropertyRemoved);
    window.removeEventListener('send-analytics', this._sendHandler);
    this._observer.disconnect();
  }

  get cidKey() {
    return 'apic.ga.cid';
  }

  get disabledKey() {
    return 'apic.ga.disabled';
  }

  /**
   * Restores data stored in localStorage.
   */
  _restoreConfiguration() {
    if (this.clientId || !this.hasLocalStorage) {
      return;
    }
    let disabled = localStorage.getItem(this.disabledKey);
    if (disabled === 'true') {
      this.disabled = true;
      // No need to restore cid at this point
      return;
    }
    let cid = localStorage.getItem(this.cidKey);
    if (!cid) {
      cid = this.$.uuid.generate();
    }
    this.set('clientId', cid);
  }
  /**
   * Stores cid value in localStorage if the value is different.
   *
   * @param {String} cid New client id value
   */
  _cidChanged(cid) {
    this._configureBaseParams();
    if (!this.hasLocalStorage) {
      return;
    }
    cid = cid || '';
    let localCid = localStorage.getItem(this.cidKey);
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
    if (!this.hasLocalStorage) {
      return;
    }
    let localState = localStorage.getItem(this.disabledKey);
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
    nodes.forEach((i) => {
      if (i.nodeName !== 'APP-ANALYTICS-CUSTOM') {
        return;
      }
      if (i.index && i.type) {
        if (i.type === 'dimension') {
          this.addCustomDimension(i.index, i.value);
        } else if (i.type === 'metric') {
          this.addCustomMetric(i.index, i.value);
        }
      }
    });
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
    nodes.forEach((i) => {
      if (i.nodeName !== 'APP-ANALYTICS-CUSTOM') {
        return;
      }
      if (i.index && i.type) {
        if (i.type === 'dimension') {
          this.removeCustomDimension(i.index);
        } else if (i.type === 'metric') {
          this.removeCustomMetric(i.index);
        }
      }
    });
  }
  // Handler for app-analytics-custom-changed event. Registers a new custom property.
  _customPropertyChanged(e) {
    const d = e.detail;
    switch (d.type) {
      case 'dimension': this.addCustomDimension(d.index, d.value); break;
      case 'metric': this.addCustomMetric(d.index, d.value); break;
    }
  }
  // Handler for app-analytics-custom-removed event. Unregisters a custom property.
  _customPropertyRemoved(e) {
    e.stopPropagation();
    const {type, index} = e.detail;
    switch (type) {
      case 'dimension': this.removeCustomDimension(index); break;
      case 'metric': this.removeCustomMetric(index); break;
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
    index = Number(index);
    if (index !== index) {
      throw new Error('Index is not a number.');
    }
    if (index <= 0 || index > 200) {
      throw new Error('Index out of bounds');
    }
    const cd = this.customDimensions || [];
    const pos = cd.findIndex((i) => i.index === index);
    if (pos !== -1) {
      if (this.customDimensions[pos].value !== value) {
        this.set('customDimensions.' + pos + '.value', value);
      }
    } else {
      this.push('customDimensions', {
        index: index,
        value: value
      });
    }
    this._configureBaseParams();
  }
  /**
   * Removes from this instance custom dimension for given index.
   *
   * @param {Number} index Index of the custom dimension. The index has to be in range 1 - 200.
   */
  removeCustomDimension(index) {
    index = Number(index);
    const cd = this.customDimensions || [];
    const pos = cd.findIndex((i) => i.index === index);
    if (pos === -1) {
      return;
    }
    this.splice('customDimensions', pos, 1);
    this._configureBaseParams();
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
    index = Number(index);
    if (index !== index) {
      throw new Error('Index is not a number.');
    }
    if (index <= 0 || index > 200) {
      throw new Error('Index out of bounds');
    }
    const cm = this.customMetrics || [];
    const pos = cm.findIndex((i) => i.index === index);
    if (pos !== -1) {
      if (this.customMetrics[pos].value !== value) {
        this.set('customMetrics.' + pos + '.value', value);
        this._configureBaseParams();
      }
    } else {
      this.push('customMetrics', {
        index: index,
        value: value
      });
    }
    this._configureBaseParams();
  }
  /**
   * Removes from this instance custom metric for given index.
   *
   * @param {Number} index Index of the custom metric. The index has to be in range 1 - 200.
   */
  removeCustomMetric(index) {
    index = Number(index);
    const cm = this.customMetrics || [];
    const pos = cm.findIndex((i) => i.index === index);
    if (pos === -1) {
      return;
    }
    this.splice('customMetrics', pos, 1);
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
    const post = Object.assign({}, this.baseParams, params);
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
      v: this.protocolVersion,
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
    if (this.customMetrics.length) {
      this.customMetrics.forEach((cm) => {
        data['cm' + cm.index] = this.encodeQueryString(cm.value);
      });
    }
    if (this.customDimensions.length) {
      this.customDimensions.forEach((cd) => {
        data['cd' + cd.index] = this.encodeQueryString(cd.value);
      });
    }
    if (this.debug) {
      console.info('[GA] Configuring base object', data);
    }
    this._setBaseParams(data);
  }

  _printParamsTable(list) {
    const map = {};
    const debugList = [];
    Object.keys(list).forEach((param) => {
      const name = this._paramsMap[param] || param;
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
    const offline = !this.isOnline;
    if (offline) {
      if (!this._offlineQueue) {
        this._offlineQueue = [];
      }
      this._offlineQueue.push(body);
      return Promise.resolve();
    }
    const init = {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
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

    return fetch(url, init)
    .then((response) => {
      if (response.status !== 200) {
        if (!offline) {
          if (!this._offlineQueue) {
            this._offlineQueue = [];
          }
          this._offlineQueue.push(body);
        } else {
          throw new Error('Unable send data.');
        }
      }
      if (this.debugEndpoint) {
        return response.json()
        .then((result) => {
          this.dispatchEvent(new CustomEvent('app-analytics-structure-debug', {
            detail: {
              debug: result
            }
          }));
        });
      }
    })
    .catch(() => {
      if (!navigator.onLine && !offline) {
        if (!this._offlineQueue) {
          this._offlineQueue = [];
        }
        this._offlineQueue.push(body);
        return;
      }
      throw new Error('Unable to send data');
    });
  }

  _onlineChanged(value) {
    if (!value) {
      return;
    }
    if (!this._offlineQueue || !this._offlineQueue.length) {
      return;
    }
    const p = [];
    for (let i = this._offlineQueue.length - 1; i >= 0; i--) {
      const body = this._offlineQueue[i];
      this._offlineQueue.splice(i, 1);
      p[p.length] = this._transport(body);
    }
    return Promise.all(p)
    .catch((cause) => {
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
}
window.customElements.define('app-analytics', AppAnalytics);
