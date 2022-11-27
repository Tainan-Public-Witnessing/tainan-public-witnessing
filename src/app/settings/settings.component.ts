import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ShiftHoursService } from '../_services/shift-hours.service';
import { CongregationsService } from '../_services/congregations.service';
import { ShiftHour } from '../_interfaces/shift-hours.interface';
import { Congregation } from '../_interfaces/congregation.interface';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(

  ) { }


  title: string = '基本設定'
  ngOnInit(): void {


  }



}
