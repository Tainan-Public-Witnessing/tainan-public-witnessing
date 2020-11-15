import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  uuid: string;
  mode: string;
  title: string;
  profileForm: FormGroup;
  permissionKeys = Object.values(PermissionKey);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.profileForm = this.buildFormGroup();

    this.activatedRoute.params.subscribe(params => {
      switch (params.mode) {
        case 'create':
          this.title = 'Create profile';
          break;

        case 'update':
          this.title = 'Edit profile';
          break;

        case 'read':
          this.title = 'Profile';
          break;
      }
    });
  }

  onCancelClick = () => {
    this.router.navigate(['profiles']);
  }

  onSubmitClick = () => {
    console.log(this.profileForm.value);
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

}
