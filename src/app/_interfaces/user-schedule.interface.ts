export interface UserSchedule {
  availableHours: UserScheduleHours;
  partnerUuid: string | null;
  assign: boolean;
  lineToken?:string
  unavailableDates: string[];
}

export interface UserScheduleHours {
  '0'?: UserScheduleDayData;
  '1'?: UserScheduleDayData;
  '2'?: UserScheduleDayData;
  '3'?: UserScheduleDayData;
  '4'?: UserScheduleDayData;
  '5'?: UserScheduleDayData;
  '6'?: UserScheduleDayData;
}

export interface UserScheduleDayData {
  [ShiftHourUuid: string]: number;
}
