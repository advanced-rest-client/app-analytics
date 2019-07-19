[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/app-analytics.svg)](https://www.npmjs.com/package/@advanced-rest-client/app-analytics)

[![Build Status](https://travis-ci.org/advanced-rest-client/app-analytics.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/app-analytics)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@advanced-rest-client/app-analytics)

# app-analytics

Event based component to support Google Analytics measurement protocol.

The component support both imperative and declarative API so it can be used in regular HTML template using your favourite templating engine and in JavaScript.

The `appname` and `trackingid` attributes (`appName` and `trackingId` properties respectively) are required parameters. Without it the element won't initialize a call to GA endpoint.

If `clientid` attribute (`clientId` property) is not set then it generates one automatically and store is in `localStorage`. Note, that if current environment does not support `localStorage` (like Chrome Apps) you need to provide this property manually or otherwise it will be regenerated each time the user opens the app.

Note, Google Analytics does not allow sending any information that may lead to a user.

Always give the user ability to disable tracking. Under EU laws you need to have permission from the user to store data on local device. To disable analytics simply remove the element from the DOM or set `disabled` property.

Note, the `disabled` state is persistent in `localStorage` and automatically restored when element is initialized. If the environment does not support `localStorage` you need to set this attribute manually each time the element is initialized.

## Using `<app-analytics>`

You can directly call one of `send*()` functions. See API Reference below for more info.

-   <a href="#method-sendEvent">sendEvent</a>
-   <a href="#method-sendException">sendException</a>
-   <a href="#method-sendScreen">sendScreen</a>
-   <a href="#method-sendSocial">sendSocial</a>
-   <a href="#method-sendTimings">sendTimings</a>

You can also use HTML events to send a hit. In this case dispatch a `send-analytics` event with required `type` property on the `detail` object which describes what king of hit should be send. Possible values are: `pageview`, `screenview`, `event`, `social`, `exception` or `timing`.

Other parameters depends on the type.

### Sending `screenview` hit

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

#### Sending `event` hit

```javascript
const event = new CustomEvent('send-analytics', {
 bubbles: true,
 composed: true,
 detail: {
   type: 'event',
   category: 'Some category', // required.
   action: 'Some action', // required.
   label: 'Some label',
   value: 123
 }
});
document.body.dispatchEvent(event);
```

#### Sending `exception` hit

```javascript
const event = new CustomEvent('send-analytics', {
 bubbles: true,
 composed: true,
 detail: {
   type: 'exception',
   description: 'Exception description', // required.
   fatal: true, // default false
 }
});
document.body.dispatchEvent(event);
```

#### Sending `social` hit

```javascript
const event = new CustomEvent('send-analytics', {
 bubbles: true,
 composed: true,
 detail: {
   type: 'social',
   network: 'Facebook', // required.
   action: 'Share', // required
   target: 'https://www.shared.com/resource' // required
 }
});
document.body.dispatchEvent(event);
```

#### Sending `timing` hit

```javascript
const event = new CustomEvent('send-analytics', {
 bubbles: true,
 composed: true,
 detail: {
   type: 'timing',
   category: 'Bootstrap', // required.
   variable: 'databaseInitTime', // required
   value: 123, // required
   label: 'Optional label'
 }
});
document.body.dispatchEvent(event);
```

## Custom metrics and dimensions

Use `<app-analytics-custom>` element as a child of `<app-analytics>` to set custom properties. This metrics / dimensions will be used with every hit as long as this elements exists as a children of the `<app-analytics>` element.

### Example

```html
<app-analytics tracking-id="UA-XXXXXXX">
 <app-analytics-custom type="metric" index="1" value="5"></app-analytics-custom>
</app-analytics>
```

To send custom data with single hit only without creating `<app-analytics-custom>` children, add `customDimensions` or `customMetrics` to the event detail object. Both objects must be an array of custom definition objects that includes index and value.

### Example

```javascript
const event = new CustomEvent('send-analytics', {
 bubbles: true,
 composed: true,
 detail: {
   type: 'event',
   category: 'Engagement',
   action: 'Click',
   label: 'Movie start',
   customDimensions: [{
     index: 1, // index of the custom dimension
     value: 'Author name' // Value of the custom dimension
   }]
 }
});
document.body.dispatchEvent(event);
```
