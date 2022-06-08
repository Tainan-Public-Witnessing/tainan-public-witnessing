import { Permission } from '../_enums/permission.enum';

export interface MenuLink {
  display: string;
  url: string;
  permission: Permission;
}
