import { v5 as uuidv5 } from 'uuid';
import { environment } from 'src/environments/environment';

export interface PersonalShift {
  uuid: string;
  userUuid: string;
  yearMonth: string; // yyyy-MM
  shiftUuids: string[];
}

export function getPersonalShiftUuidByUserUuidAndYearMonth(userUuid: string, yearMonth: string) {
  return uuidv5([userUuid, yearMonth].join('_'), environment.UUID_NAMESPACE);
}