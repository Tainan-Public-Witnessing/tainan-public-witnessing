export interface Statistic {
  uuid: string; // shiftUuid
  createdByUuid: string; // userUuid
  createdOn: Date;
  date: string; // yyyy-MM-dd
  attendance: number;
  tracts: number;
  scriptures: number;
  videos: number;
  acceptReturnVisit: number;
  returnVisits: number;
  experience: string;
  activate: boolean;
}