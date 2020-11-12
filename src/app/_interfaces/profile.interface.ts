import { PermissionKey } from 'src/app/_enums/permission-key.enum';

export interface Profile {
  uuid: string;
  name: string;
  permissions: Permission[];
}

export interface ProfilePrimarykey {
  uuid: string;
  name: string;
}

export interface Permission {
  key: PermissionKey;
  access: boolean;
}
