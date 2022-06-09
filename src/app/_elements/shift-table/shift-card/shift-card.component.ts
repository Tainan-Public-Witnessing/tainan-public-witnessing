import { Component, Input, OnInit } from '@angular/core';
import { filter, first } from 'rxjs';
import { ShiftHours } from 'src/app/_interfaces/shift-hours.interface';
import { Shift } from 'src/app/_interfaces/shift.interface';
import { Site } from 'src/app/_interfaces/site.interface';
import { UserKey } from 'src/app/_interfaces/user.interface';
import { ShiftHoursService } from 'src/app/_services/shift-hours.service';
import { SitesService } from 'src/app/_services/sites.service';
import { UsersService } from 'src/app/_services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shift-card',
  templateUrl: './shift-card.component.html',
  styleUrls: ['./shift-card.component.scss']
})
export class ShiftCardComponent implements OnInit {

  @Input() shift: Shift;

  shiftHours: ShiftHours = null;
  site: Site = null;
  crew: UserKey[] = [];
  day: string = null;

  constructor(
    private shiftHoursService: ShiftHoursService,
    private sitesService: SitesService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.shiftHoursService.getShiftHoursList().pipe(filter(shiftHoursList => shiftHoursList !== null), first()).subscribe(shiftHoursList => {
      this.shiftHours = shiftHoursList.find(_shiftHours => this.shift.shiftHoursUuid === _shiftHours.uuid);
    });
    this.sitesService.getSites().pipe(filter(sites => sites !== null), first()).subscribe(sites => {
      this.site = sites.find(_site => this.shift.siteUuid === _site.uuid);
    });
    this.usersService.getUserKeys().pipe(filter(userKeys => userKeys !== null), first()).subscribe(userKeys => {
      this.crew = this.shift.crewUuids.map(_uuid => userKeys.find(_userKey => _userKey.uuid === _uuid));
    });
    this.day = environment.DAY[new Date(this.shift.date).getDay()];
  }

}
