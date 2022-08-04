export interface ShiftHours {
  uuid: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  activate: boolean;
  deliver:boolean;
}
