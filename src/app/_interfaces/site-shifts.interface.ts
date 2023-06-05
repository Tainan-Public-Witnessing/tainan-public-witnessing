import { ShiftHour } from './shift-hours.interface';

export interface SiteShifts {
  activate: boolean;
  attendence: number;
  delivers: number;
  shiftHoursUuid: string;
  siteUuid: string;
  uuid: string;
  weekday: number;
}

export interface SiteShiftFull {
  siteShift: SiteShifts | undefined;
  shiftHour: ShiftHour;
}
