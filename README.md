[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/app-analytics.svg)](https://www.npmjs.com/package/@advanced-rest-client/app-analytics)

[![Build Status](https://travis-ci.org/advanced-rest-client/app-analytics.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/app-analytics)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/app-analytics)

## &lt;app-analytics&gt;

Event based component to support Google Analystics measurement protocols


```html
<app-analytics
 tracking-id="UA-XXXXXXX-Y"
 app-name="my app"
 app-version="1.0.0"
 data-source="app-analytics element"></app-analytics>
```

```javascript
const event = new CustomEvent('send-analytics', {
 bubbles: true,
 composed: true,
 detail: {
   type: 'screenview',
   name: 'Some scree name' // required
 }
});
document.body.dispatchEvent(event);
```

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/app-analytics
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/app-analytics/app-analytics.js';
    </script>
  </head>
  <body>
    <app-analytics></app-analytics>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import '@advanced-rest-client/app-analytics/app-analytics.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`
    <app-analytics></app-analytics>
    `;
  }

  _authChanged(e) {
    console.log(e.detail);
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/app-analytics
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
