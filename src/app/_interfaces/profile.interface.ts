import { PermissionKey } from 'src/app/_enums/permission-key.enum';

export interface ProfilePrimarykey {
  uuid: string;
  name: string;
  order: number;
}

export interface Profile extends ProfilePrimarykey {
  permissions: Permission[];
}

export interface Permission {
  key: PermissionKey;
  access: boolean;
}

export interface PermissionData {
  key: PermissionKey;
  urlKey: string;
  description: string;
}
