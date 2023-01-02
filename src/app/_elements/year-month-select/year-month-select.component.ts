import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-year-month-select',
  templateUrl: './year-month-select.component.html',
})
export class YearMonthSelectComponent implements OnInit {
  constructor() {}
  readonly currentMonth = new Date().toJSON().substring(0, 7);
  @Input()
  forwardFormControl: FormControl;

  @Input()
  label: string;

  months: string[] = [];

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
    if (this.forwardFormControl && !this.forwardFormControl.value) {
      this.forwardFormControl.setValue(this.currentMonth);
    }
  }
}
