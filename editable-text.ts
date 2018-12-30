import {bindable, bindingMode, inject, PLATFORM, computedFrom} from 'aurelia-framework';
import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules,
  FluentRuleCustomizer,
  FluentRules
} from 'aurelia-validation';

@inject(Element, ValidationControllerFactory)
export class EditableText {
  @bindable isRequired: boolean = false;
  @bindable minLength: number;
  @bindable maxlength: number;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) value: string;
  @bindable name: string = "Value";
  @bindable empty: string = "Empty";
  @bindable save: (string) => Promise<any>;

  text: string = "";

  isEditing = false;

  controller: ValidationController;

  constructor(private element: Element, factory: ValidationControllerFactory) {
    this.controller = factory.createForCurrentScope();
  }

  private requiresValidation() {
    console.log("in has rules!!! " + this.maxlength + " " + this.value);

    if (this.isRequired) return true;
    if (this.minLength) return true;
    if (this.maxlength) return true;

    return false;
  }

  private buildRules(){
    var fluent: (FluentRules<EditableText, string> | FluentRuleCustomizer<EditableText, string>) = ValidationRules.ensure((m: EditableText) => m.text);

    if (this.name) fluent = fluent.displayName(this.name);


    if (this.isRequired) fluent = fluent.required();
    if (this.minLength) fluent = fluent.minLength(this.minLength);
    if (this.maxlength) fluent = fluent.maxLength(this.maxlength);

    return((<FluentRuleCustomizer<EditableText, string>>fluent).rules);

  }

  doEdit() {
    this.isEditing = true;
  }

  doSave() {

    this.controller.validate({object: this}).then(result => {
      if(result.valid) {
        this.save({value: this.text}).then(result => {
          this.value = this.text;
          this.isEditing = false;
        }).catch(error => {
          if (error instanceof Error) {
            this.controller.addError(error.message, this, "text");
          } else {
            this.controller.addError(error.toString(), this, "text");
          }
        });
      } else {
        // has errors
      }
    })


  }

  doCancel() {
    this.isEditing = false;
    this.text = this.value;
  }

  attached() {
    if (this.requiresValidation()) {
      this.controller.addObject(this, this.buildRules());
    }

    this.text = this.value;
  }
}
