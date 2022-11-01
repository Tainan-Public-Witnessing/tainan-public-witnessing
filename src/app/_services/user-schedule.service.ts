import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Api } from '../_api';
import { Permission } from '../_enums/permission.enum';
import { UserSchedule } from '../_interfaces/user-schedule.interface';
import { AuthorityService } from './authority.service';

@Injectable({
  providedIn: 'root',
})
export class UserScheduleService {
  constructor(private authService: AuthorityService, private api: Api) {}

  getUserSchedule = (userUuid: string) => {
    return this.api.readUserSchedule(userUuid);
  };

  patchUserSchedule = async (userUuid: string, data: Partial<UserSchedule>) => {
    const saveData = { ...data };
    const requireAdmin = await firstValueFrom(
      this.authService.canAccess(Permission.ADMINISTRATOR)
    );

    if (!requireAdmin) {
      delete saveData.assign;
      delete saveData.partnerUuid;
    }
    await this.api.patchUserSchedule(userUuid, saveData);
  };

  cancelLineToken = async (userUuid: string) => {
    this.api.cancelLineToken(userUuid)
  };
}
