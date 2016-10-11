[![Build Status](https://travis-ci.org/advanced-rest-client/..svg?branch=master)](https://travis-ci.org/advanced-rest-client/.)  [![Dependency Status](https://dependencyci.com/github/advanced-rest-client/./badge)](https://dependencyci.com/github/advanced-rest-client/.)  

# app-analytics

`<app-analytics>` An element that support Google Analytics analysis

### Example
```
<app-analytics tracking-id="UA-XXXXXXX"></app-analytics>
```



### Events
| Name | Description | Params |
| --- | --- | --- |
| app-analytics-permitted-changed | Firwed when Library `permitted` state changed. | permitted **Boolean** - Current state. |
| app-analytics-ready | An event fired when the Google Analytics configuration is set and ready to rock. It doesn't matter if tracking is permitted. The tracking object will be ready to enable tracking on user demand. | trackingId **String** - A tracking ID related to this configuration. |
# app-analytics-custom

`<app-analytics-custom>` Sets a custom metric/dimmenstion for `<app-analytics>`.
Simply put this element as a child of the `<app-analytics>` element and all hits sent
to the GA server will contain this metric.

### Example
```
<app-analytics tracking-id="UA-XXXXXXX">
  <app-analytics-custom type="metric" index="1" value="5"></app-analytics-custom>
</app-analytics>
```
It will set a custom metric of index 1 to every hit with value 5.



### Events
| Name | Description | Params |
| --- | --- | --- |
| app-analytics-custom-changed | Fires when the metric/dimension has been set and should inform the app-analytics that it should use this data in hits. | name **String** - Name of the custom property. It will be string of `metric` or `dimension` with it's index. |
value **(String&#124;Number)** - The value of the custom property. |
| app-analytics-custom-removed | Fires when the element is removed from the DOM and `<app-analytics>` should unregister custom property. | name **String** - Name of the custom property to be removed. |
