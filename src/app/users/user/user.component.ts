import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Mode } from 'src/app/_enums/mode.enum';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  mode: string;
  uuid: string;
  title: string;
  userForm: FormGroup;
  unsubscribe$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.userForm = this.buildFormGroup();

    this.activatedRoute.params.subscribe(params => {
      this.mode = params.mode;
      this.uuid = params.uuid;

      switch (params.mode) {
        case Mode.CREATE:
          this.title = 'Create User';
          break;

        case Mode.UPDATE:
          this.title = 'Edit User';
          break;

        case Mode.READ:
          this.title = 'User';
          break;
      }
    });
  }

  onCancelClick = () => {
    this.router.navigate(['users']);
  }

  onSubmitClick = () => {

  }

  private buildFormGroup = (): FormGroup => {
    return this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      congregation: ['', Validators.required],
      profile: ['', Validators.required],
      cellphone: [''],
      phone: [''],
      address: [''],
      note: [''],
      tags: [''],
    });
  }

}
