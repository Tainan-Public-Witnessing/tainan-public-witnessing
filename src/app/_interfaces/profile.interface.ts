import { PermissionKey } from 'src/app/_enums/permission-key.enum';

export interface ProfilePrimarykey {
  uuid: string;
  name: string;
  order: number;
}
export interface PermissionData {
  key: PermissionKey;
  urlKey: string;
  description: string;
}
