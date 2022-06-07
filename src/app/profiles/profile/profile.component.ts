import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Mode } from 'src/app/_enums/mode.enum';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { Status } from 'src/app/_enums/status.enum';
import { Profile } from 'src/app/_interfaces/profile.interface';
import { ProfilesService } from 'src/app/_services/profiles.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  mode: string;
  uuid: string;
  title: string;
  order: number;
  cancelButtonText: string;
  profileForm: UntypedFormGroup;
  permissionKeys = Object.values(PermissionKey);
  unsubscribe$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private profilesService: ProfilesService,
    private formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.profileForm = this.buildFormGroup();

    this.activatedRoute.params.subscribe(params => {
      this.mode = params.mode;
      this.uuid = params.uuid;

      switch (params.mode) {
        case Mode.CREATE:
          this.title = 'PROFILES.CREATE_TITLE';
          this.cancelButtonText = 'GLOBAL.CANCEL';
          break;

        case Mode.UPDATE:
          this.title = 'PROFILES.EDIT_TITLE';
          this.cancelButtonText = 'GLOBAL.CANCEL';
          this.setFormGroupValueByUuid(params.uuid);
          break;

        case Mode.READ:
          this.title = 'PROFILES.READ_TITLE';
          this.cancelButtonText = 'GLOBAL.BACK';
          this.setFormGroupValueByUuid(params.uuid);
          this.profileForm.disable();
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  onCancelClick = () => {
    this.router.navigate(['profiles']);
  }

  onSubmitClick = () => {
    if ( this.profileForm.status === 'VALID') {

      const profile: Profile = {
        uuid: null,
        name: this.profileForm.value.name.trim(),
        order: 0,
        permissions: []
      };
      for (const key of this.permissionKeys) {
        profile.permissions.push({
          key,
          access: this.profileForm.value[key]
        });
      }

      let response: Promise<Status>;

      if (this.mode === Mode.CREATE) {
        response = this.profilesService.createProfile(profile);
      } else { // update mode
        profile.uuid = this.uuid;
        profile.order = this.order;
        if (this.profileForm.dirty) {
          response = this.profilesService.updateProfile(profile);
        } else {
          response = Promise.resolve(Status.NO_CHANGES);
        }
      }

      response.then(() => {
        this.router.navigate(['profiles']);
      }).catch(reason => {
        if (reason === Status.EXISTED) {
          this.profileForm.controls.name.setErrors({existed: true});
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  private buildFormGroup = (): UntypedFormGroup => {
    const group = {
      name: ['', Validators.required]
    };
    for (const key of this.permissionKeys) {
      group[key] = [false];
    }
    return this.formBuilder.group(group);
  }

  private setFormGroupValueByUuid = (uuid: string) => {
    this.profilesService.getProfileByUuid(uuid).pipe(
      filter(profile => !!profile),
      takeUntil(this.unsubscribe$)
    ).subscribe(profile => {
      this.order = profile.order;
      this.profileForm.controls.name.setValue(profile.name);
      profile.permissions.forEach(permission => {
        this.profileForm.controls[permission.key].setValue(permission.access);
      });
    });
  }
}
