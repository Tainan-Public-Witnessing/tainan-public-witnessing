export interface UserScheduleHours {
  '0': UserScheduleDayData;
  '1': UserScheduleDayData;
  '2': UserScheduleDayData;
  '3': UserScheduleDayData;
  '4': UserScheduleDayData;
  '5': UserScheduleDayData;
  '6': UserScheduleDayData;
}

export interface UserScheduleDayData {
  day: number;
  [ShiftHourUuid: string]: number;
}
