import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SitesService } from '../_services/sites.service';
import { ShiftHoursService } from '../_services/shift-hours.service';
import { Site } from '../_interfaces/site.interface';
import { ShiftHours } from '../_interfaces/shift-hours.interface';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(
    private sitesService: SitesService,
    private shifthoursService: ShiftHoursService
    ) {}
  sites$: Site[] | null = [];
  shifthours$: ShiftHours[] | null = [];
  title:string='基本設定'
  ngOnInit(): void {
    this.sitesService.getSites().subscribe((sites) => (this.sites$ = sites));
    this.shifthoursService.getShiftHoursList().subscribe((shifthours) => (this.shifthours$ = shifthours));
  }

  createSite=()=>{
    this.sitesService.createSites({name:'新地點',order:this.sites$!.length}).then(site=>this.sites$?.push(site))
  }

  createShiftHours=()=>{
    this.shifthoursService.createShiftHours({name:'新時段',startTime:'09:00',endTime:'12:00',deliver:false}).then(shifthour=>this.shifthours$?.push(shifthour))
  }
  
}
