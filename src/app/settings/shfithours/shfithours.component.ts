import { Component, OnInit } from '@angular/core';
import { ShiftHoursService } from '../../_services/shift-hours.service';
import { ShiftHours } from '../../_interfaces/shift-hours.interface';
@Component({
  selector: 'app-shfithours',
  templateUrl: './shfithours.component.html',
  styleUrls: ['./shfithours.component.scss']
})
export class ShfithoursComponent implements OnInit {

  constructor(
    private shifthoursService: ShiftHoursService,
  ) { }
  shifthours$: ShiftHours[] | null = [];
  ngOnInit(): void {
    this.shifthoursService.getShiftHoursList().subscribe((shifthours) => (this.shifthours$ = shifthours));
  }
  createShiftHours=()=>{
    this.shifthoursService.createShiftHours({name:'新時段',startTime:'09:00',endTime:'12:00',deliver:false}).then(shifthour=>this.shifthours$?.push(shifthour))
  }
}
