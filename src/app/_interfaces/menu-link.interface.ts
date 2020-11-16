import { PermissionKey } from 'src/app/_enums/permission-key.enum';

export interface MenuLink {
  display: string;
  url: string;
  permissionKey: PermissionKey;
}
