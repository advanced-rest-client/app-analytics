import { html, render } from 'lit-html';
import { paramsMap } from '../app-analytics.js';

class DemoPage {
  constructor() {
    this.trackingId = 'UA-71458341-4';
    this.debugEndpoint = true;
    this.debug = true;
    this.disabled = false;
    this.isOnline = true;
    this.appName = 'app-analytics demo app';
    this.appVersion = '1.0.0';
    this.hitType = '';
    this.screenName = 'Main screen';
    this.eventCategory = 'Engagement';
    this.eventAction = 'Click';
    this.eventLabel = 'Test event in app-analytics';
    this.socialNetwork = 'Google +';
    this.socialAction = 'Share';
    this.socialTarget = window.location.href;
    this.exceptionDescription = 'The database has crashed and app become unstable.';
    this.exceptionFatal = true;
    this.timingCategory = 'Database initialization';
    this.timingVariable = 'connectionTime';
    this.timingLabel = '';
    this.hasCustomData = false;
    this.customMetrics = [];
    this.customDimensions = [];
    let d = new Date();
    d = d.toISOString();
    d = d.substr(0, d.lastIndexOf('.'));
    this.timingTime = d;
    this.logs = [];

    this._hitDebugHandler = this._hitDebugHandler.bind(this);
    this._structureDebugHandler = this._structureDebugHandler.bind(this);
    this.addCustomMetric = this.addCustomMetric.bind(this);
    this.addCustomDimension = this.addCustomDimension.bind(this);
    this._checkedOptionChanged = this._checkedOptionChanged.bind(this);
    this._inputHandler = this._inputHandler.bind(this);
    this._selectedPageChanged = this._selectedPageChanged.bind(this);
    this._customIndexChanged = this._customIndexChanged.bind(this);
    this._customValueChanged = this._customValueChanged.bind(this);
    this._removeMetric = this._removeMetric.bind(this);
    this._removeDimension = this._removeDimension.bind(this);
    this._connectivityHandler = this._connectivityHandler.bind(this);
    this.send = this.send.bind(this);

    window.addEventListener('app-analytics-hit-debug', this._hitDebugHandler);
    window.addEventListener('app-analytics-structure-debug', this._structureDebugHandler);

    if (localStorage.getItem('apic.ga.disabled') === 'true') {
      this.disabled = true;
    }
  }

  get debug() {
    return this._debug;
  }

  set debug(value) {
    this._setObservableProperty('debug', value);
  }

  get debugEndpoint() {
    return this._debugEndpoint;
  }

  set debugEndpoint(value) {
    this._setObservableProperty('debugEndpoint', value);
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this._setObservableProperty('disabled', value);
  }

  get isOnline() {
    return this._isOnline;
  }

  set isOnline(value) {
    this._setObservableProperty('isOnline', value);
  }

  get trackingId() {
    return this._trackingId;
  }

  set trackingId(value) {
    this._setObservableProperty('trackingId', value);
  }

  get appName() {
    return this._appName;
  }

  set appName(value) {
    this._setObservableProperty('appName', value);
  }

  get appVersion() {
    return this._appVersion;
  }

  set appVersion(value) {
    this._setObservableProperty('appVersion', value);
  }

  get hitType() {
    return this._hitType;
  }

  set hitType(value) {
    this._setObservableProperty('hitType', value);
  }

  get screenName() {
    return this._screenName;
  }

  set screenName(value) {
    this._setObservableProperty('screenName', value);
  }

  get eventCategory() {
    return this._eventCategory;
  }

  set eventCategory(value) {
    this._setObservableProperty('eventCategory', value);
  }

  get eventAction() {
    return this._eventAction;
  }

  set eventAction(value) {
    this._setObservableProperty('eventAction', value);
  }

  get eventLabel() {
    return this._eventLabel;
  }

  set eventLabel(value) {
    this._setObservableProperty('eventLabel', value);
  }

  get socialNetwork() {
    return this._socialNetwork;
  }

  set socialNetwork(value) {
    this._setObservableProperty('socialNetwork', value);
  }

  get socialAction() {
    return this._socialAction;
  }

  set socialAction(value) {
    this._setObservableProperty('socialAction', value);
  }

  get socialTarget() {
    return this._socialTarget;
  }

  set socialTarget(value) {
    this._setObservableProperty('socialTarget', value);
  }

  get exceptionDescription() {
    return this._exceptionDescription;
  }

  set exceptionDescription(value) {
    this._setObservableProperty('exceptionDescription', value);
  }

  get exceptionFatal() {
    return this._exceptionFatal;
  }

  set exceptionFatal(value) {
    this._setObservableProperty('exceptionFatal', value);
  }

  get timingCategory() {
    return this._timingCategory;
  }

  set timingCategory(value) {
    this._setObservableProperty('timingCategory', value);
  }

  get timingVariable() {
    return this._timingVariable;
  }

  set timingVariable(value) {
    this._setObservableProperty('timingVariable', value);
  }

  get timingTime() {
    return this._timingTime;
  }

  set timingTime(value) {
    this._setObservableProperty('timingTime', value);
  }

  get timingLabel() {
    return this._timingLabel;
  }

  set timingLabel(value) {
    this._setObservableProperty('timingLabel', value);
  }

  get customMetrics() {
    return this._customMetrics;
  }

  set customMetrics(value) {
    this._setObservableProperty('customMetrics', value);
  }

  get customDimensions() {
    return this._customDimensions;
  }

  set customDimensions(value) {
    this._setObservableProperty('customDimensions', value);
  }

  get logs() {
    return this._logs;
  }

  set logs(value) {
    this._setObservableProperty('logs', value);
  }

  _setObservableProperty(prop, value) {
    const key = '_' + prop;
    if (this[key] === value) {
      return;
    }
    this[key] = value;
    this.render();
  }

  send() {
    const detail = {
      type: this.hitType
    };
    switch (this.hitType) {
      case 'screenview':
        detail.name = this.screenName;
        break;
      case 'event':
        detail.category = this.eventCategory;
        detail.action = this.eventAction;
        detail.label = this.eventLabel;
        break;
      case 'social':
        detail.network = this.socialNetwork;
        detail.action = this.socialAction;
        detail.target = this.socialTarget;
        break;
      case 'exception':
        detail.fatal = this.exceptionFatal;
        detail.description = this.exceptionDescription;
        break;
      case 'timing':
        detail.category = this.timingCategory;
        detail.variable = this.timingVariable;
        detail.label = this.timingLabel;
        detail.value = new Date(this.timingTime).getTime();
        break;
    }
    document.body.dispatchEvent(new CustomEvent('send-analytics', {
      bubbles: true,
      composed: true,
      detail: detail
    }));
  }

  render() {
    if (this._rendering) {
      return;
    }
    this._rendering = true;
    setTimeout(() => {
      this._rendering = false;
      this._render();
    });
  }

  _connectivityHandler(e) {
    const { online } = e.target;
    this.isOnline = online;
  }

  _checkedOptionChanged(e) {
    const prop = e.target.dataset.prop;
    if (!prop) {
      throw new Error('Unknown event target');
    }
    this[prop] = e.detail.value;
  }

  _inputHandler(e) {
    const prop = e.target.dataset.prop;
    if (!prop) {
      throw new Error('Unknown event target');
    }
    this[prop] = e.target.value;
  }

  _selectedPageChanged(e) {
    if (!e.target.selectedItem) {
      return;
    }
    this.hitType = e.target.selectedItem.dataset.value;
  }

  _customIndexChanged(e) {
    const type = e.target.dataset.type;
    const index = Number(e.target.dataset.index);
    const value = Number(e.target.value);
    if (type === 'metric') {
      this.customMetrics[index].index = value;
    } else {
      this.customDimensions[index].index = value;
    }
    this.render();
  }

  _customValueChanged(e) {
    const type = e.target.dataset.type;
    const index = Number(e.target.dataset.index);
    const value = String(e.target.value);
    if (type === 'metric') {
      this.customMetrics[index].value = value;
    } else {
      this.customDimensions[index].value = value;
    }
    this.render();
  }

  _removeMetric(e) {
    const index = Number(e.target.dataset.index);
    this.customMetrics.splice(index, 1);
    if (!this.customMetrics.length && !this.customDimensions.length) {
      this.hasCustomData = false;
    }
    this.render();
  }

  _removeDimension(e) {
    const index = Number(e.target.dataset.index);
    this.customDimensions.splice(index, 1);
    if (!this.customMetrics.length && !this.customDimensions.length) {
      this.hasCustomData = false;
    }
    this.render();
  }

  _getParamName(parameter) {
    return paramsMap[parameter] || 'unknown name';
  }

  addCustomMetric() {
    this.hasCustomData = true;
    this.customMetrics = [...this.customMetrics, {
      index: '',
      value: ''
    }];
  }

  addCustomDimension() {
    this.hasCustomData = true;
    this.customDimensions = [...this.customDimensions, {
      index: '',
      value: ''
    }];
  }

  _hitDebugHandler(e) {
    this.logs = [...this.logs, {
      isHit: true,
      value: e.detail.debug
    }];
  }

  _structureDebugHandler(e) {
    if (e.detail.debug && e.detail.debug.hitParsingResult &&
      e.detail.debug.hitParsingResult[0] && !e.detail.debug.hitParsingResult[0].valid) {
      document.querySelector('#errorStatus').removeAttribute('hidden');
      setTimeout(function() {
        document.querySelector('#errorStatus').setAttribute('hidden', true);
      }, 3000);
    }
    this.logs = [...this.logs, {
      isValidation: true,
      value: e.detail.debug
    }];
  }

  _render() {
    const { debug, debugEndpoint, disabled, appName, appVersion, trackingId, hitType,
      screenName, eventCategory, eventAction, eventLabel, socialNetwork, socialAction,
      socialTarget, exceptionDescription, exceptionFatal, timingCategory, timingVariable,
      timingTime, timingLabel, hasCustomData, customMetrics, customDimensions, logs, isOnline } = this;
    render(html`
      <div class="vertical-section-container centered">
        <h3>The app-analytics</h3>
        <section card="">
          <h4>Bacsic configuration</h4>
          <paper-toggle-button .checked="${debug}" data-prop="debug" @checked-changed="${this._checkedOptionChanged}">
            Debug (output to console)
          </paper-toggle-button>
          <paper-toggle-button .checked="${debugEndpoint}" data-prop="debugEndpoint"
            @checked-changed="${this._checkedOptionChanged}">
            Debug endponit (request parser)
          </paper-toggle-button>
          <paper-toggle-button .checked="${disabled}" data-prop="disabled"
            @checked-changed="${this._checkedOptionChanged}">
            Disable analytics
          </paper-toggle-button>
          <paper-input label="Tracking ID (UA-XXXX-Y)" .value="${trackingId}" data-prop="trackingId"
            @input="${this._inputHandler}"></paper-input>
          <div class="row">
            <paper-input label="App name" .value="${appName}" data-prop="appName"
              @input="${this._inputHandler}"></paper-input>
            <paper-input label="App version" .value="${appVersion}" data-prop="appVersion"
              pattern="^\\d+\\.\\d+\\.\\d+([\\-a-zA-Z0-9]+)?\$" auto-validate
              @input="${this._inputHandler}"></paper-input>
          </div>
        </section>

        <section card="">
          <h4>Hit type</h4>
          <paper-dropdown-menu label="Select hit type">
            <paper-listbox slot="dropdown-content" .selected="${hitType}"
              @selected-changed="${this._selectedPageChanged}" attr-for-selected="data-value">
              <paper-item data-value="screenview">Screen view</paper-item>
              <paper-item data-value="event">Event</paper-item>
              <paper-item data-value="social">Social</paper-item>
              <paper-item data-value="exception">Exception</paper-item>
              <paper-item data-value="timing">Timing data</paper-item>
            </paper-listbox>
          </paper-dropdown-menu>

          <iron-pages .selected="${hitType}" attr-for-selected="data-value">
            <section data-value="screenview">
              <paper-input label="Screen name" .value="${screenName}" data-prop="screenName"
                @input="${this._inputHandler}"></paper-input>
            </section>
            <section data-value="event">
              <paper-input label="Category" .value="${eventCategory}" data-prop="eventCategory"
                @input="${this._inputHandler}"></paper-input>
              <paper-input label="Action" .value="${eventAction}" data-prop="eventAction"
                @input="${this._inputHandler}"></paper-input>
              <paper-input label="Label" .value="${eventLabel}" data-prop="eventLabel"
                @input="${this._inputHandler}"></paper-input>
            </section>
            <section data-value="social">
              <paper-input label="Network" .value="${socialNetwork}" data-prop="socialNetwork"
                @input="${this._inputHandler}"></paper-input>
              <paper-input label="Action" .value="${socialAction}" data-prop="socialAction"
                @input="${this._inputHandler}"></paper-input>
              <paper-input label="Target" .value="${socialTarget}" data-prop="socialTarget"
                @input="${this._inputHandler}"></paper-input>
            </section>
            <section data-value="exception">
              <paper-input label="Description" .value="${exceptionDescription}" data-prop="exceptionDescription"
                @input="${this._inputHandler}"></paper-input>
              <paper-checkbox .value="${exceptionFatal}" data-prop="exceptionFatal"
                @input="${this._checkedOptionChanged}"">The exception is fatal</paper-checkbox>
            </section>
            <section data-value="timing">
              <paper-input label="Category" .value="${timingCategory}" data-prop="timingCategory"
                @input="${this._inputHandler}"></paper-input>
              <paper-input label="variable" .value="${timingVariable}" data-prop="timingVariable"
                @input="${this._inputHandler}"></paper-input>
              <paper-input label="time" type="datetime-local" .value="${timingTime}" data-prop="timingTime"
                @input="${this._inputHandler}"></paper-input>
              <paper-input label="label" .value="${timingLabel}" data-prop="timingLabel"
                @input="${this._inputHandler}"></paper-input>
            </section>
          </iron-pages>
        </section>

        <section card ?hidden="${!hasCustomData}">
          <h4>Custom data</h4>
          ${customMetrics.length ? html`
            <h4>Custom metrics</h4>
            ${customMetrics.map((item, index) => html`
              <div class="metric-row">
                <paper-input label="Index (1-200)" data-index="${index}" data-type="metric" .value="${item.index}"
                  type="number" min="1" max="200" step="1" @input="${this._customIndexChanged}"></paper-input>
                <paper-input data-index="${index}" label="Value" data-type="metric"
                  .value="${item.value}" type="number" @input="${this._customValueChanged}"></paper-input>
                <paper-icon-button data-index="${index}" @click="${this._removeMetric}"
                  icon="remove" title="Remove custom metric"></paper-icon-button>
              </div>`)}
          `: undefined}
          ${customDimensions.length ? html`
            <h4>Custom dimensions</h4>
            ${customDimensions.map((item, index) => html`
              <div class="metric-row">
                <paper-input label="Index (1-200)" data-index="${index}" data-type="dimension" .value="${item.index}"
                  type="number" min="1" max="200" step="1" @input="${this._customIndexChanged}"></paper-input>
                <paper-input label="Value" data-index="${index}" data-type="dimension"
                  .value="${item.value}" @input="${this._customValueChanged}"></paper-input>
                <paper-icon-button data-index="${index}" @click="${this._removeDimension}"
                  icon="remove" title="Remove custom dimension"></paper-icon-button>
              </div>
              `)}
          `: undefined}
        </section>

        <section card="" ?hidden="${!logs.length}">
          <h4>Log</h4>
          ${logs.map((item) => html`
            ${item.isHit ? html`
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Param</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  ${item.value.map((item) => html`<tr>
                    <td>${item.name}</td>
                    <td>${item.param}</td>
                    <td>${item.value}</td>
                  </tr>`)}
                </tbody>
              </table>` : undefined}
            ${item.isValidation ? html`
              ${item.value.hitParsingResult.map((item) => html`
                <p class="error" ?hidden="${item.valid}">The hit <code>${item.hit}</code> is invalid</p>
                ${item.parserMessage.map((item) => html`
                  <div class="error-info">
                    <label>${item.parameter} (${this._getParamName(item.parameter)})</label>
                    <p>${item.description}</p>
                  </div>
                  `)}
              `)};
            ` : undefined}
          `)}
        </section>

        <paper-fab-menu icon="add">
          <paper-fab color="#9C27B0" title="Custom metric" @click="${this.addCustomMetric}" label="12"></paper-fab>
          <paper-fab color="#2196F3" title="Custom dimension"
            @click="${this.addCustomDimension}" icon="timeline"></paper-fab>
        </paper-fab-menu>

        <form-action-bar elevation="5">
          <div id="errorStatus" prefix hidden>Issue found in last hit</div>
          <paper-button raised ?disabled="${!hitType}" @click="${this.send}">Send hit</paper-button>
        </form-action-bar>
      </div>

      <app-analytics id="analytics"
        .trackingId="${trackingId}"
        .appName="${appName}"
        .appVersion="${appVersion}"
        .disabled="${disabled}"
        datasource="app-analytics element"
        ?debug="${debug}"
        ?debugendpoint="${debugEndpoint}"
        ?offline="${!isOnline}">
        ${customMetrics && customMetrics.length ? customMetrics.map((item) => html`
          <app-analytics-custom type="metric" .index="${item.index}"
            .value="${item.value}"></app-analytics-custom>`) : undefined}
        ${customDimensions && customDimensions.length ? customDimensions.map((item) => html`
          <app-analytics-custom type="dimension" .index="${item.index}"
            .value="${item.value}"></app-analytics-custom>`) : undefined}
      </app-analytics>

      <connectivity-state @change="${this._connectivityHandler}"></connectivity-state>
    `, document.querySelector('#demo'));
  }
}
const instance = new DemoPage();
instance.render();
window._demo = instance;

window.customElements.whenDefined('app-analytics').then(() => {
  const detail = {
    type: 'screenview',
    name: 'Init'
  };
  document.body.dispatchEvent(new CustomEvent('send-analytics', {
    bubbles: true,
    composed: true,
    detail: detail
  }));
});
