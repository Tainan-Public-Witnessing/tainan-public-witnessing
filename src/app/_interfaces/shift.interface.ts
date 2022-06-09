import { Day } from "../_enums/day.enum";

export interface ShiftKey {
  uuid: string;
  date: string; // yyyy-MM-DD
  activate: boolean;
}

export interface Shift extends ShiftKey {
  shiftHoursUuid: string;
  siteUuid: string;
  crewUuids: string[];
}
