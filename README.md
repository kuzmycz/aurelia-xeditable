# aurelia-xeditable
Aurelia version of xeditable

The aim of this project is to produce xeditable like functionality to Aurelia. The aim is
not to be a port but to use aurelia functionality to implement the functionality. 

Why is this project useful?
The project allows Aurelia developers to implement inline editing in their application

How do I get started?
Add the files to your project (place them in resources/elements and then add the following to the resources index

```
  config.globalResources([PLATFORM.moduleName('./elements/editable-boolean')]);
  config.globalResources([PLATFORM.moduleName('./elements/editable-number')]);
  config.globalResources([PLATFORM.moduleName('./elements/editable-text')]);
```

Sample usage:
```
<div class="col-12"><strong>Address</strong></div>
<div class="col">
  <div class="row">
    <div class="col-12">
      <editable-text value.bind="customer.address.street" maxlength="256" required="true" save.call="update('address.street', value)"></editable-text>
    </div>
    <div class="col-8">
      <editable-text value.bind="customer.address.city" maxlength="256" required="true" save.call="update('address.city', value)"></editable-text>
    </div>
    <div class="col-4">
      <editable-text value.bind="customer.address.state" maxlength="256" required="true" save.call="update('address.state', value)"></editable-text>
    </div>
    <div class="col-8">
      <editable-text value.bind="customer.address.country" maxlength="256" required="true" save.call="update('address.country', value)"></editable-text>
    </div>
    <div class="col-4">
      <editable-text value.bind="customer.address.postcode" maxlength="256" required="true" save.call="update('address.postcode', value)"></editable-text>
    </div>
  </div>
</div>
```
Current Plan
- Add more editables
- Create an Aurelia Module

Where can I get more help, if I need it?
