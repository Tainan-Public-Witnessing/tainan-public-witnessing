export interface Shift {
  uuid: string;
  activate: boolean;
  date: string; // yyyy-MM-DD
  shiftHoursUuid: string;
  siteUuid: string;
  crewUuids: string[];
  hasStatistic?: boolean;
  attendance: number;
  full: boolean;
  delivers: number;
  weekday: number;
}
