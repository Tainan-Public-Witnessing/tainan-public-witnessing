import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-year-month-select',
  templateUrl: './year-month-select.component.html',
})
export class YearMonthSelectComponent implements OnInit {
  constructor() {}

  @Input('forwardFormControl')
  formControl: FormControl;

  @Input()
  label: string;

  months: string[] = [];

  private _value: string;
  @Input()
  get value(): string {
    return this._value;
  }
  set value(newValue: string) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.valueChange.emit(newValue);
      this.formControl?.setValue(newValue);
    }
  }

  @Output()
  valueChange = new EventEmitter<string>();

  ngOnInit(): void {
    const months = [];
    for (let i = -3; i <= 1; ++i) {
      const d = new Date();
      d.setMonth(d.getMonth() + i);
      months.push(d.toJSON().substring(0, 7));
    }
    this.months = months;
    this.value = new Date().toJSON().substring(0, 7);
  }
}
