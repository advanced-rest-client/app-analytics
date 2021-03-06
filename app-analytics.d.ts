/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   app-analytics.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

declare namespace LogicElements {

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
   *
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
   */
  class AppAnalytics extends HTMLElement {

    /**
     * Note, UUID generator is used only during the initialization and when
     * client id is not set and there's no coirresponding entry in local storage.
     * Otherwise it is unused.
     */
    readonly _uuid: Element|null;

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
    clientId: String|null;

    /**
     * This is intended to be a known identifier for a user provided by the site owner/tracking
     * library user. It must not itself be PII (personally identifiable information).
     * The value should never be persisted in GA cookies or other Analytics provided storage.
     *
     * - Parameter: **uid**
     * - Example value: as8eknlll
     * - Example usage: uid=as8eknlll
     */
    userId: String|null;

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
    trackingId: String|null;

    /**
     * When present, the IP address of the sender will be anonymized.
     * For example, the IP will be anonymized if any of the following parameters are present in
     * the payload: &aip=, &aip=0, or &aip=1
     *
     * - Parameter: **aip**
     * - Example value: 1
     * - Example usage: aip=1
     */
    anonymizeIp: Boolean|null;

    /**
     * Indicates the data source of the hit. Hits sent from analytics.js will have data source
     * set to 'web'; hits sent from one of the mobile SDKs will have data source set to 'app'.
     *
     * - Parameter: **ds**
     * - Example value: call center
     * - Example usage: ds=call%20center
     */
    dataSource: String|null;

    /**
     * Used to send a random number in GET requests to ensure browsers and proxies
     * don't cache hits.
     *
     * - Parameter: **z**
     * - Example value: 289372387623
     * - Example usage: z=289372387623
     */
    useCacheBooster: Boolean|null;

    /**
     * Specifies which referral source brought traffic to a website. This value is also used to
     * compute the traffic source. The format of this value is a URL.
     *
     * - Parameter: **dr**
     * - Example value: http://example.com
     * - Example usage: dr=http%3A%2F%2Fexample.com
     */
    referrer: String|null;

    /**
     * Specifies the campaign name.
     *
     * - Parameter: **cn**
     * - Example value: (direct)
     * - Example usage: cn=%28direct%29
     */
    campaignName: String|null;

    /**
     * Specifies the campaign source.
     *
     * - Parameter: **cs**
     * - Example value: (direct)
     * - Example usage: cs=%28direct%29
     */
    campaignSource: String|null;

    /**
     * Specifies the campaign medium.
     *
     * - Parameter: **cm**
     * - Example value: organic
     * - Example usage: cm=organic
     */
    campaignMedium: String|null;

    /**
     * Specifies the application version.
     *
     * - Parameter: **av**
     * - Example value: 1.2
     * - Example usage: av=1.2
     */
    appVersion: String|null;

    /**
     * Specifies the application name. This field is required for any hit that has app related
     * data (i.e., app version, app ID, or app installer ID). For hits sent to web properties,
     * this field is optional.
     *
     * - Parameter: **an**
     * - Example My App
     * - Example usage: an=My%20App
     */
    appName: String|null;

    /**
     * Application identifier.
     *
     * - Parameter: **aid**
     * - Example value: com.company.app
     * - Example usage: aid=com.company.app
     */
    appId: String|null;

    /**
     * Application installer identifier.
     *
     * - Parameter: **aiid**
     * - Example value: com.platform.vending
     * - Example usage: aiid=com.platform.vending
     */
    appInstallerId: String|null;

    /**
     * True if current environment has localStorage suppport.
     * Chrome apps do not have localStorage property.
     */
    readonly hasLocalStorage: boolean|null|undefined;

    /**
     * If set to true it will prints debug messages into the console.
     */
    debug: Boolean|null;

    /**
     * If set it will send the data to GA's debug endpoint
     * and the request won't be actually saved but only validated
     * and the validation results will be fired in the
     * `aapp-analytics-structure-debug`
     * event in the detail's `debug` property.
     */
    debugEndpoint: Boolean|null;

    /**
     * If set disables Google Analytics reporting.
     * This information is stored in localStorage. As long as this
     * information is not cleared it is respected and data are not send to GA
     * server.
     */
    disabled: Boolean|null;

    /**
     * When set it queues requests to GA in memory and attempts to send the requests
     * again when this flag is removed.
     */
    offline: Boolean|null;

    /**
     * Generated POST parameters based on a params
     */
    _baseParams: object|null;

    /**
     * Each custom metric has an associated index. There is a maximum of 20 custom
     * metrics (200 for Analytics 360 accounts). The metric index must be a positive
     * integer between 1 and 200, inclusive.
     *
     * - Parameter: **cm<metricIndex>**
     * - Example value: 47
     * - Example usage: cm1=47
     */
    _customMetrics: Array<object|null>|null;

    /**
     * Each custom dimension has an associated index. There is a maximum of 20 custom
     * dimensions (200 for Analytics 360 accounts). The dimension index must be a positive
     * integer between 1 and 200, inclusive.
     *
     * - Parameter: **cd<dimensionIndex>**
     * - Example value: Sports
     * - Example usage: cd1=Sports
     */
    _customDimensions: Array<object|null>|null;
    readonly cidKey: String|null;
    readonly disabledKey: String|null;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    _setStringProperty(name: any, value: any): void;
    _setBooleanProperty(name: any, value: any): void;
    connectedCallback(): void;
    disconnectedCallback(): void;

    /**
     * A mutation observer callback function called when children or attributes changed.
     * It processes child nodes depending on mutation type and change record.
     */
    _childrenUpdated(mutations: Array<MutationRecord|null>|null): void;

    /**
     * Restores data stored in localStorage.
     */
    _restoreConfiguration(): void;

    /**
     * Stores cid value in localStorage if the value is different.
     *
     * @param cid New client id value
     */
    _cidChanged(cid: String|null): void;

    /**
     * Updates state of `disabled` property in local storage.
     * If the state changes to enabled (false) then it reinitializes
     * configuration.
     */
    _disabledChanged(state: Boolean|null): void;

    /**
     * Adds custom metric / dimension from a child node observer.
     */
    _processAddedNodes(nodes: NodeList|null): void;

    /**
     * Remove custom dimensions.
     * Child elements can't send event here when they are already detached from the document
     * so the parent element must observe child and determine if custom dimenstion should
     * be removed.
     */
    _processRemovedNodes(nodes: NodeList|null): void;

    /**
     * Processes `MutationRecord` for attribute change
     *
     * @param mutation A mutation record that triggered the callback
     */
    _processChildAttribute(mutation: MutationRecord|null): void;

    /**
     * Sets custom dimension to be send with the hit.
     * Set dimension will be used in all hits until `removeCustomDimension()` is called
     * with the same `index`.
     *
     * Custom dimensions can be set in GA admin interface an its index will be displayed there.
     *
     * @param index Index of the custom dimension. Free version of GA allows up to 20
     * custom dimensions and up to 200 in premium. The index has to be in range 1 - 200.
     * @param value Value of the custom dimension to set.
     */
    addCustomDimension(index: Number|null, value: Strnig|null): void;

    /**
     * Removes from this instance custom dimension for given index.
     *
     * @param index Index of the custom dimension. The index has to be in range 1 - 200.
     */
    removeCustomDimension(index: Number|null): void;

    /**
     * Sets custom metric to be send with the hit.
     * Set metric will be used in all hits until `removeCustomMetric()` is called
     * with the same `index`.
     *
     * Custom metrics can be set in GA admin interface an its index will be displayed there.
     *
     * @param index Index of the custom metric. Free version of GA allows up to 20
     * custom metrics and up to 200 in premium. The index has to be in range 1 - 200.
     * @param value Value of the custom metric to set.
     */
    addCustomMetric(index: Number|null, value: Strnig|null): void;

    /**
     * Removes from this instance custom metric for given index.
     *
     * @param index Index of the custom metric. The index has to be in range 1 - 200.
     */
    removeCustomMetric(index: Number|null): void;

    /**
     * Adds custom metric / dimension to the corresponding array.
     *
     * @param prop The name of the property with the array of custom items.
     * @param index Index of the custom property. Free version of GA allows up to 20
     * custom metrics/dimensions and up to 200 in premium. The index has to be in range 1 - 200.
     * @param value Value of the custom property to set.
     */
    _addCustom(prop: String|null, index: Number|null, value: Strnig|null): void;

    /**
     * Removes from this instance custom metric/dimension for given index.
     *
     * @param prop The name of the property with the array of custom items.
     * @param index Index of the custom metric. The index has to be in range 1 - 200.
     */
    _removeCustom(prop: String|null, index: Number|null): void;

    /**
     * Sends the screenview hit to the GA.
     *
     * @param name Screen name.
     * @param opts Custom data definition. It should be an object that may contain two
     * keys: `_customDimensions` and `_customMetrics`. Both as an array of objects. Each object must
     * contain `index` property - representing custom data index in GA - and `value` property -
     * representing value of the property.
     */
    sendScreen(name: String|null, opts: object|null): Promise<any>|null;

    /**
     * Sends event tracking.
     *
     * @param category Specifies the event category. Must not be empty.
     * @param action Specifies the event action. Must not be empty.
     * @param label Specifies the event label. Optional value.
     * @param value Specifies the event value. Values must be non-negative. Optional.
     * @param opts Custom data definition. It should be an object that may contain two
     * keys: `_customDimensions` and `_customMetrics`. Both as an array of objects. Each object must
     * contain `index` property - representing custom data index in GA - and `value` property -
     * representing value of the property.
     */
    sendEvent(category: String|null, action: String|null, label: String|null, value: Number|null, opts: object|null): Promise<any>|null;

    /**
     * Sends the exception hit to GA.
     *
     * @param description A description of the exception.
     * @param fatal Specifies whether the exception was fatal.
     * @param opts Custom data definition. It should be an object that may contain two
     * keys: `_customDimensions` and `_customMetrics`. Both as an array of objects. Each object must
     * contain `index` property - representing custom data index in GA - and `value` property -
     * representing value of the property.
     */
    sendException(description: String|null, fatal: Boolean|null, opts: object|null): Promise<any>|null;

    /**
     * Track social interaction
     *
     * @param network Specifies the social network, for example Facebook or Google Plus.
     * @param action Specifies the social interaction action. For example on Google Plus
     * when a user clicks the +1 button, the social action is 'plus'.
     * @param target Specifies the target of a social interaction. This value is
     * typically a URL but can be any text.
     * @param opts Custom data definition. It should be an object that may contain two
     * keys: `_customDimensions` and `_customMetrics`. Both as an array of objects. Each object must
     * contain `index` property - representing custom data index in GA - and `value` property -
     * representing value of the property.
     */
    sendSocial(network: String|null, action: String|null, target: String|null, opts: object|null): Promise<any>|null;

    /**
     * Track timings in the app.
     *
     * @param category Specifies the user timing category. **required**
     * @param variable Specifies the user timing variable. **required**
     * @param time Specifies the user timing value. The value is in milliseconds.
     * **required**
     * @param label Specifies the user timing label.
     * @param cmOpts Custom data definition. It should be an object that may contain two
     * keys: `_customDimensions` and `_customMetrics`. Both as an array of objects. Each object must
     * contain `index` property - representing custom data index in GA - and `value` property -
     * representing value of the property.
     */
    sendTimings(category: String|null, variable: String|null, time: Number|null, label: String|null, cmOpts: object|null): Promise<any>|null;

    /**
     * Append custom metrics / dimensions definitions to the
     * parameters list.
     *
     * @param data The data to send
     */
    appendCustomData(data: object|null, opts: object|null): void;

    /**
     * Send a hit to the GA server.
     * The `type` parameter is required for all types of hits.
     *
     * @param type The type of hit. Must be one of 'pageview', 'screenview', 'event',
     * 'transaction', 'item', 'social', 'exception', 'timing'.
     * @param params Map of params to send wit this hit.
     */
    sendHit(type: String|null, params: any[]|null): Promise<any>|null;

    /**
     * An event handler for `send-analytics`
     */
    _sendHandler(e: CustomEvent|null): void;

    /**
     * Encodes parameters.
     */
    _processParams(params: object|null): void;

    /**
     * Creates a post body from the params.
     *
     * @param params List of parameters to send
     * @returns Request body
     */
    _createBody(params: object|null): Stirng|null;
    encodeQueryString(str: any): any;
    _configureBaseParams(): void;
    _printParamsTable(list: any): void;
    _transport(body: any): any;
    _offlineChanged(value: any): any;

    /**
     * MutationObserver initialized in the constructor does not
     * triggers changes when the element is initialized. This
     * function processes nodes set up declaratively when the element is still
     * initializing.
     */
    _processInitialNodes(): void;
  }
}

declare global {

  interface HTMLElementTagNameMap {
    "app-analytics": LogicElements.AppAnalytics;
  }
}

export {};
