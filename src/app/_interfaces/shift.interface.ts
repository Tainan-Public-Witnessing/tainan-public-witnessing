export interface ShiftKey {
  uuid: string;
  date: string; // yyyy-MM-DD
  day: string;
  shiftHoursUuid: string;
  siteUuid: string; // yyyy-MM-DD
  activate: boolean;
}

export interface Shift {
  crewUuids: string[];
}