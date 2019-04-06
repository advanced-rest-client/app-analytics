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
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
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
class AppAnalyticsCustom extends PolymerElement {
  static get properties() {
    return {
      // Type of custom value. Either metric or dimmension
      type: String,
      // Index of the custom metric. It can be found in Google Analytics admin panel
      index: {
        type: Number,
        observer: '_indexObserver'
      },
      // The value of the metric or dimension. Type of this attribute depends on the `type`.
      value: String,
      // Full name of the metric/dimension.
      fullName: {
        type: String,
        readOnly: true
      }
    };
  }

  static get observers() {
    return [
      '_customChanged(type,index,value)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this._customChanged(this.type, this.index, this.value);
  }

  _indexObserver(index, oldIndex) {
    if (oldIndex) {
      this.dispatchEvent(new CustomEvent('app-analytics-custom-removed', {
        bubbles: true,
        composed: true,
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
    this._setFullName(name);
    this.dispatchEvent(new CustomEvent('app-analytics-custom-changed', {
      bubbles: true,
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
