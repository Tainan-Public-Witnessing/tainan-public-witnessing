import { ViewEncapsulation } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { EXISTED_ERROR } from 'src/app/_classes/errors/EXISTED_ERROR';
import { Gender } from 'src/app/_enums/gender.enum';
import { Mode } from 'src/app/_enums/mode.enum';
import { Permission } from 'src/app/_enums/permission.enum';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { User } from 'src/app/_interfaces/user.interface';
import { AuthorityService } from 'src/app/_services/authority.service';
import { CongregationsService } from 'src/app/_services/congregations.service';
import { UsersService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit, OnDestroy {
  mode: string;
  uuid: string;
  title: string;
  cancelButtonText: string;
  userForm: FormGroup;
  genders = Object.values(Gender);
  permissions = Object.values(Permission).filter(
    (p) => /\d+/.test(p.toString()) && p < Permission.GUEST
  );
  congregations$ = new BehaviorSubject<Congregation[] | undefined | null>(null);
  // profilePrimarykeys$ = new BehaviorSubject<Profile[]>(null);
  // tags$ = new BehaviorSubject<Tag[]>(null);
  unsubscribe$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private congregationsService: CongregationsService,
    // private tagService: TagsService,
    public usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.congregationsService
      .getCongregationList()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((congs) => !!congs)
      )
      .subscribe(this.congregations$);
    // this.profilesService.getProfilePrimarykeys().pipe(takeUntil(this.unsubscribe$)).subscribe(this.profilePrimarykeys$);

    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      congregationUuid: ['', Validators.required],
      baptizeDate: ['', Validators.required],
      // birthDate: [""],
      cellphone: [''],
      phone: [''],
      permission: [Permission.USER, Validators.required],
      activate: [true],
      // note: [""],
      // email: [""],
      // tags: [""],
    });

    this.activatedRoute.params.subscribe((params) => {
      this.mode = params.mode;
      this.uuid = params.uuid;

      switch (params.mode) {
        case undefined:
          if (!this.uuid) {
            this.title = 'USERS.CREATE_TITLE';
            this.cancelButtonText = 'GLOBAL.CANCEL';
            this.mode = Mode.CREATE;
          } else {
            this.router.navigate(['users']);
          }

          break;

        case Mode.UPDATE:
          this.title = 'USERS.EDIT_TITLE';
          this.cancelButtonText = 'GLOBAL.CANCEL';
          this.setFormGroupValueByUuid(params.uuid);
          break;

        case Mode.READ:
          this.title = 'USERS.READ_TITLE';
          this.cancelButtonText = 'GLOBAL.BACK';
          this.setFormGroupValueByUuid(params.uuid);
          this.userForm.disable();
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  onCancelClick = () => {
    this.router.navigate(['users']);
  };

  onSubmit = async () => {
    if (this.userForm.status === 'VALID') {
      const baptizeDateValue = this.userForm.value.baptizeDate;
      const baptizeDate =
        typeof baptizeDateValue === 'string'
          ? baptizeDateValue
          : baptizeDateValue.format('YYYY-MM-DD');

      const user: Omit<User, 'uuid' | 'activate'> = {
        username: this.userForm.value.username.trim(),
        name: this.userForm.value.name.trim(),
        gender: this.userForm.value.gender,
        congregationUuid: this.userForm.value.congregationUuid,
        baptizeDate,
        cellphone: this.userForm.value.cellphone.trim(),
        phone: this.userForm.value.phone.trim(),
        permission: this.userForm.value.permission,
      };
      try {
        if (this.mode === Mode.CREATE) {
          await this.usersService.createUser(user);
        } else {
          // update mode
          if (this.userForm.dirty) {
            await this.usersService.patchUser({
              ...user,
              uuid: this.uuid,
            });
          }
        }
        this.router.navigate(['users']);
      } catch (err) {
        console.log('reason', err);
        if (err instanceof EXISTED_ERROR) {
          this.userForm.controls[err.field].setErrors({ existed: true });
        }
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  };

  private setFormGroupValueByUuid = (uuid: string): void => {
    this.usersService
      .getUserByUuid(uuid)
      .pipe(
        filter((user) => !!user),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((user) => {
        const values = { ...user };
        this.userForm.patchValue(values);
      });
  };
}
