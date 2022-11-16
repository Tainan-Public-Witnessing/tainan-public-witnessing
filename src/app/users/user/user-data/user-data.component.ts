import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
})
export class UserDataComponent implements OnInit, OnDestroy, OnChanges {
  @Input() title: string;
  @Input() cancelButtonText: string;
  @Input() disabled: boolean;
  @Input() uuid: string;

  userForm: FormGroup;
  user: any;
  genders = Object.values(Gender);
  permissions = Object.values(Permission).filter(
    (p) => /\d+/.test(p.toString()) && p < Permission.GUEST
  );

  congregations$ = new BehaviorSubject<Congregation[] | undefined | null>(null);
  // tags$ = new BehaviorSubject<Tag[]>(null);
  unsubscribe$ = new Subject<void>();
  AdminOnly$ = new BehaviorSubject<boolean>(false);
  constructor(
    private router: Router,
    formBuilder: UntypedFormBuilder,
    private congregationsService: CongregationsService,
    private authorityService: AuthorityService,
    // private tagService: TagsService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    public usersService: UsersService
  ) {
    this.userForm = formBuilder.group({
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
      note: [''],
      assign: [true],
      // email: [""],
      // tags: [""],
    });
  }

  ngOnInit(): void {
    this.congregationsService
      .getCongregationList()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((congs) => !!congs)
      )
      .subscribe(this.congregations$);

    this.authorityService
      .canAccess(Permission.ADMINISTRATOR)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.AdminOnly$);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.uuid.previousValue !== changes.uuid.currentValue) {
      this.setFormGroupValueByUuid(this.uuid);
    }
    if (!!changes.disabled.currentValue) {
      this.userForm.disable();
    } else {
      this.userForm.enable();
    }
  }

  onCancelClick = () => {
    this.router.navigate(['users']);
  };

  onSubmit = async () => {
    if (this.userForm.status === 'VALID' && this.userForm.dirty) {
      const baptizeDateValue = this.userForm.value.baptizeDate;
      const baptizeDate =
        typeof baptizeDateValue === 'string'
          ? baptizeDateValue
          : baptizeDateValue.format('YYYY-MM-DD');

      const user: Omit<User, 'uuid' | 'activate' | 'bindcode'> = {
        username: this.userForm.value.username.trim(),
        name: this.userForm.value.name.trim(),
        gender: this.userForm.value.gender,
        congregationUuid: this.userForm.value.congregationUuid,
        baptizeDate,
        note: this.userForm.value.note,
        cellphone: this.userForm.value.cellphone.trim(),
        phone: this.userForm.value.phone.trim(),
        permission: this.userForm.value.permission,
      };
      try {
        if (!this.uuid) {
          const newUuid = await this.usersService.createUser(user);
          this.router.navigate(['/users', Mode.UPDATE, newUuid]);
        } else {
          // update mode
          await this.usersService.patchUser({
            ...user,
            uuid: this.uuid,
          });
          this.router.navigate(['/users']);
        }
        this.snackBar.open(this.translateService.instant('GLOBAL.SAVED'));
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
        this.user = user!;
        this.userForm.patchValue(values);
      });
  };
}
