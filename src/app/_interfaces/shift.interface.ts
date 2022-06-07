import { Day } from "../_enums/day.enum";

export interface ShiftKey {
  uuid: string;
  date: string; // yyyy-MM-DD
  day: Day,
  shiftHoursUuid: string;
  siteUuid: string;
  activate: boolean;
}

export interface Shift extends ShiftKey {
  crewUuids: string[];
}