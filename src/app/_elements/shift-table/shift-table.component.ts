import { Component, Input, OnInit } from '@angular/core';
import { Shift } from 'src/app/_interfaces/shift.interface';

@Component({
  selector: 'app-shift-table',
  templateUrl: './shift-table.component.html',
  styleUrls: ['./shift-table.component.scss']
})
export class ShiftTableComponent implements OnInit {

  @Input() shifts: Shift[]|null;

  constructor() { }

  ngOnInit(): void {
  }

}
