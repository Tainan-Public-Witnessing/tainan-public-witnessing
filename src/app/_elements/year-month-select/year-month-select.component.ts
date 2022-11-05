import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCalendarView, MatDatepicker } from '@angular/material/datepicker';
import { Moment } from 'moment';

@Component({
  selector: 'app-year-month-select',
  templateUrl: './year-month-select.component.html',
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['YYYY-MM'],
        },
        display: {
          dateInput: 'YYYY-MM',
          monthYearLabel: 'MM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MM YYYY',
        },
      },
    },
  ],
})
export class YearMonthSelectComponent implements OnInit {
  constructor() {}

  @ViewChild('yearMonthPicker')
  picker: MatDatepicker<Moment>;

  @Input('forwardFormControl')
  formControl: FormControl;

  @Input()
  label: string;

  @Input()
  startMonth: Moment;

  @Input()
  endMonth: Moment;

  private _value: string;
  @Input()
  get value(): string {
    return this._value;
  }
  set value(newValue: string) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.valueChange.emit(newValue);
    }
  }

  @Output()
  valueChange = new EventEmitter<string>();

  ngOnInit(): void {}

  setMonthAndYear(normalizedMonthAndYear: Moment) {
    const controlValue = this.formControl?.value;
    if (controlValue !== null) {
      controlValue.year(normalizedMonthAndYear.year());
      controlValue.month(normalizedMonthAndYear.month());
      this.formControl.setValue(controlValue);
    }
    this.picker.close();
  }

  onViewChanged(view: MatCalendarView) {}
}
