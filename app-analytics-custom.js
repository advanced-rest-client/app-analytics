/**
@license
Copyright 2016 The Advanced REST client authors <arc@mulesoft.com>
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
/**
 * `<app-analytics-custom>` Sets a custom metric/dimmenstion for `<app-analytics>`.
 * Simply put this element as a child of the `<app-analytics>` element and all hits sent
 * to the GA server will contain this metric.
 *
 * ### Example
 *
 * ```html
 * <app-analytics tracking-id="UA-XXXXXXX">
 *  <app-analytics-custom type="metric" index="1" value="5"></app-analytics-custom>
 * </app-analytics>
 * ```
 *
 * It will set a custom metric of index 1 to every hit with value 5.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ArcElements
 */
class AppAnalyticsCustom extends HTMLElement {
  static get observedAttributes() {
    return [
      'type',
      'index',
      'value'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }
  /**
   * @return {String} Type of custom value. Either `metric` or `dimension`.
   */
  get type() {
    return this._type;
  }

  set type(value) {
    const old = this._type;
    if (old === value) {
      return;
    }
    if (value) {
      value = String(value);
    } else {
      this.removeAttribute('type');
    }
    this._type = value;
    if (value) {
      this.setAttribute('type', value);
    }
    this._customChanged();
  }
  /**
   * @return {Number} Index of the custom metric. It can be found in Google Analytics admin panel.
   */
  get index() {
    return this._index;
  }

  set index(value) {
    const old = this._index;
    if (isNaN(value)) {
      this._index = undefined;
      this.removeAttribute('index');
    } else {
      value = Number(value);
      if (old === value) {
        return;
      }
      this._index = value;
      this.setAttribute('index', String(value));
    }
    this._indexObserver(value, old);
    this._customChanged();
  }
  /**
   * Type of this attribute depends on the `type` property. It can be numeric or string value.
   * Internally the element keeps all values as string and the value is cast to
   * a number if represents numeric value.
   * @return {String|Number} The value of the metric or dimension.
   */
  get value() {
    const v = this._value;
    if (isNaN(v)) {
      return v;
    }
    return Number(v);
  }

  set value(value) {
    const old = this._value;
    if (old === value) {
      return;
    }
    if (value || value === 0) {
      value = String(value);
    } else {
      this.removeAttribute('value');
    }
    this._value = value;
    if (value) {
      this.setAttribute('value', value);
    }
    this._customChanged();
  }
  /**
   * @return {String} Full name of the metric/dimension.
   */
  get fullName() {
    return this._fullName;
  }

  connectedCallback() {
    this._customChanged(this.type, this.index, this.value);
  }

  _indexObserver(index, oldIndex) {
    if (oldIndex || oldIndex === 0) {
      this.dispatchEvent(new CustomEvent('app-analytics-custom-removed', {
        composed: true,
        bubbles: true,
        detail: {
          index: oldIndex,
          type: this.type
        }
      }));
    }
  }

  _customChanged(type, index, value) {
    if (!index) {
      return;
    }
    let name = '';
    if (type === 'metric') {
      name += 'metric';
    } else if (type === 'dimension') {
      name += 'dimension';
    } else {
      return;
    }
    name += String(index);
    this._fullName = name;
    this.dispatchEvent(new CustomEvent('app-analytics-custom-changed', {
      composed: true,
      detail: {
        name,
        value,
        type,
        index
      }
    }));
  }
  /**
   * Fires when the metric/dimension has been set and should inform the app-analytics that it
   * should use this data in hits.
   *
   * @event app-analytics-custom-changed
   * @param {String} name Name of the custom property. It will be string of `metric` or `dimension`
   * with it's index.
   * @param {String|Number} value The value of the custom property.
   */
  /**
   * Fires when the element is removed from the DOM and `<app-analytics>` should unregister
   * custom property.
   *
   * @event app-analytics-custom-removed
   * @param {String} name Name of the custom property to be removed.
   */
}
window.customElements.define('app-analytics-custom', AppAnalyticsCustom);
