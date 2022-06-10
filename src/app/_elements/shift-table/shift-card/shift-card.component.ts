import { Component, Input, OnInit } from '@angular/core';
import { filter, first } from 'rxjs';
import { map } from 'rxjs/operators';
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

  @Input() shift!: Shift;

  shiftHours: ShiftHours|null = null;
  site: Site|null = null;
  crew: UserKey[] = [];
  day: string|null = null;

  constructor(
    private shiftHoursService: ShiftHoursService,
    private sitesService: SitesService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.shiftHoursService.getShiftHoursList().pipe(
      filter(shiftHoursList => shiftHoursList !== null),
      map(shiftHoursList => shiftHoursList as ShiftHours[]),
      first()
    ).subscribe(shiftHoursList => {
      this.shiftHours = shiftHoursList.find(_shiftHours => this.shift.shiftHoursUuid === _shiftHours.uuid) as ShiftHours;
    });
    this.sitesService.getSites().pipe(
      filter(sites => sites !== null),
      map(sites => sites as Site[]),
      first()
    ).subscribe(sites => {
      this.site = sites.find(_site => this.shift.siteUuid === _site.uuid) as Site;
    });
    this.usersService.getUserKeys().pipe(
      filter(userKeys => userKeys !== null),
      map(userKeys => userKeys as UserKey[]),
      first()
    ).subscribe(userKeys => {
      this.crew = this.shift.crewUuids.map(_uuid => userKeys.find(_userKey => _userKey.uuid === _uuid) as UserKey);
    });
    this.day = environment.DAY[new Date(this.shift.date).getDay()];
  }

}
