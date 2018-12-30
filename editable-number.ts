import {bindable, bindingMode, inject, PLATFORM, computedFrom} from 'aurelia-framework';
import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules,
  FluentRuleCustomizer,
  FluentRules
} from 'aurelia-validation';
import {MenuItem} from "../../services/menu-service";

@inject(Element, ValidationControllerFactory)
export class EditableNumber {
  @bindable required: boolean = false;
  @bindable min: number;
  @bindable max: number;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) value: number | string;
  @bindable name: string = "Value";
  @bindable empty: string = "Empty";
  @bindable css: string = "";
  @bindable save: (string) => Promise<any>;

  copy: number | string;

  isEditing = false;

  controller: ValidationController;

  constructor(private element: Element, factory: ValidationControllerFactory) {
    this.controller = factory.createForCurrentScope();
  }

  private requiresValidation() {
    if (this.required) return true;
    if (this.min) return true;
    if (this.max) return true;

    return false;
  }

  private buildRules(){

    var fluent = ValidationRules.ensure((m: EditableNumber) => m.copy).displayName(this.name).satisfies(value => true);

    if (this.required) fluent = fluent.required();
    fluent = fluent.satisfies(value => value == undefined || value == null || !isNaN(value));  // Ensure that we have a number
    if (this.min) fluent = fluent.satisfies(value => value === null || value === undefined || Number(value) >= this.min).withMessage(`\${$displayName} must be at least ${this.min}.`);
    if (this.max) fluent = fluent.satisfies(value => value === null || value === undefined || Number(value) <= this.max).withMessage(`\${$displayName} must be at most ${this.max}.`);

    return(fluent.rules);

  }

  doEdit() {
    this.isEditing = true;
  }

  doSave() {

    this.controller.validate({object: this}).then(result => {
      if(result.valid) {
        // Coerce the value into a number
        this.copy =  (this.copy == undefined || this.copy == '') ? undefined : Number(this.copy);

        this.save({value: this.copy}).then(result => {
          this.value = this.copy;
          this.isEditing = false;
        }).catch(error => {
          if (error instanceof Error) {
            this.controller.addError(error.message, this, "copy");
          } else {
            this.controller.addError(error.toString(), this, "copy");
          }
        });
      } else {
        // has errors
      }
    })


  }

  doCancel() {
    this.isEditing = false;
    this.copy = this.value;
  }

  attached() {
    if (this.requiresValidation()) {
      this.controller.addObject(this, this.buildRules());
    }

    this.copy = this.value;
  }
}
