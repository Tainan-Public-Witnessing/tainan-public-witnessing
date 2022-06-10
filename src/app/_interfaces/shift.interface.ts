export interface Shift {
  uuid: string;
  date: string; // yyyy-MM-DD
  shiftHoursUuid: string;
  siteUuid: string;
  crewUuids: string[];
  activate: boolean;
}
