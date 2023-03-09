import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-week-table',
  templateUrl: './week-table.component.html',
  styleUrls: ['./week-table.component.scss'],
})
export class WeekTableComponent implements OnInit {
  days = [0, 1, 2, 3, 4, 5, 6];
  constructor() {}

  ngOnInit(): void {}
}
