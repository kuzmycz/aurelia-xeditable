import {bindable, bindingMode, inject, PLATFORM, computedFrom} from 'aurelia-framework';
import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules,
  FluentRuleCustomizer,
  FluentRules
} from 'aurelia-validation';

@inject(Element, ValidationControllerFactory)
export class EditableBoolean {
  @bindable required: boolean = false;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) value: number;
  @bindable name: string = "Value";
  @bindable empty: string = "Empty";
  @bindable css: string = "";
  @bindable save: (string) => Promise<any>;

  copy: number;

  isEditing = false;

  controller: ValidationController;

  constructor(private element: Element, factory: ValidationControllerFactory) {
    this.controller = factory.createForCurrentScope();
  }

  private addCustomRules() {
  }

  private hasRule() {
    if (this.required) return true;

    return false;
  }

  private buildRules(){

    var fluent = ValidationRules.ensure((m: EditableBoolean) => m.copy).displayName(this.name).satisfies(value => true);

    if (this.required) fluent = fluent.required();

    return(fluent.rules);

  }

  doEdit() {
    this.isEditing = true;
  }

  doSave() {

    this.controller.validate({object: this}).then(result => {
      if(result.valid) {
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
    if (this.hasRule()) {
      this.controller.addObject(this, this.buildRules());
    }

    this.copy = this.value;
  }
}
