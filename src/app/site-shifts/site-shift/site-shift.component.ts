import { Component, Input, OnInit } from '@angular/core';
import { ShiftHour } from '../../_interfaces/shift-hours.interface';

@Component({
  selector: 'app-site-shift',
  templateUrl: './site-shift.component.html',
  styleUrls: ['./site-shift.component.scss'],
})
export class SiteShiftComponent implements OnInit {
  @Input() shiftHour: ShiftHour;
  constructor() {}

  ngOnInit(): void {}
}
