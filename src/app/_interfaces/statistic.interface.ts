export interface Statistic {
  uuid: string; // shiftUuid
  createdByUuid: string; // userUuid
  createdOn: Date;
  date: string; // yyyy-MM-dd
  attendance: number;
  tracts: number;
  videos: number;
  returnVisits: number;
  startingBibleStudies: number;
  activate: boolean;
}