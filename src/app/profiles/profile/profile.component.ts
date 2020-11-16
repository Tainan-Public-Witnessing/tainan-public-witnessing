import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { Profile } from 'src/app/_interfaces/profile.interface';
import { ProfilesService } from 'src/app/_services/profiles.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  mode: string;
  uuid: string;
  title: string;
  profileForm: FormGroup;
  permissionKeys = Object.values(PermissionKey);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private profilesService: ProfilesService
  ) { }

  ngOnInit(): void {
    this.profileForm = this.buildFormGroup();

    this.activatedRoute.params.subscribe(params => {
      this.mode = params.mode;
      this.uuid = params.uuid;

      switch (params.mode) {
        case 'create':
          this.title = 'Create profile';
          break;

        case 'edit':
          this.title = 'Edit profile';
          this.setFormGroupValueByUuid(params.uuid);
          break;

        case 'read':
          this.title = 'Profile';
          this.setFormGroupValueByUuid(params.uuid);
          this.profileForm.disable();
          break;
      }
    });
  }

  onCancelClick = () => {
    this.router.navigate(['profiles']);
  }

  onSubmitClick = () => {
    if ( this.profileForm.status === 'VALID') {
      const profile: Profile = {
        uuid: null,
        name: this.profileForm.value.name,
        permissions: []
      };
      for (const key of this.permissionKeys) {
        profile.permissions.push({
          key,
          access: this.profileForm.value[key]
        });
      }

      let response: Promise<string>;

      if (this.mode === 'create') {
        response = this.profilesService.createProfile(profile);
      } else { // edit mode
        profile.uuid = this.uuid;
        response = this.profilesService.updateProfile(profile);
      }

      response.then(data => {
        this.router.navigate(['profiles']);
      }).catch(reasion => {
        if (reasion === 'PROFILE_NAME_EXISTED') {
          this.profileForm.controls.name.setErrors({existed: true});
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  private buildFormGroup = (): FormGroup => {
    const group = {
      name: new FormControl('', Validators.required)
    };
    for (const key of this.permissionKeys) {
      group[key] = new FormControl(false);
    }
    return new FormGroup(group);
  }

  private setFormGroupValueByUuid = (uuid: string) => {
    this.profilesService.loadProfileByUuid(uuid).subscribe(profile => {
      this.profileForm.controls.name.setValue(profile.name);
      profile.permissions.forEach(permission => {
        this.profileForm.controls[permission.key].setValue(permission.access);
      });
    });
  }
}
