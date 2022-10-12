import { TypeofExpr } from '@angular/compiler';
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

type FormMode = {
  mode: string;
  title: string;
  cancelText: string;
  userDataForm: boolean | null;
  scheduleForm: boolean | null;
};

const FORM_MODES: { [mode: string]: FormMode } = {
  [Mode.READ]: {
    mode: Mode.READ,
    title: 'USERS.READ_TITLE',
    cancelText: 'GLOBAL.BACK',
    userDataForm: false,
    scheduleForm: false,
  },
  [Mode.CREATE]: {
    mode: Mode.CREATE,
    title: 'USERS.CREATE_TITLE',
    cancelText: 'GLOBAL.CANCEL',
    userDataForm: true,
    scheduleForm: null,
  },
  [Mode.UPDATE]: {
    mode: Mode.UPDATE,
    title: 'USERS.EDIT_TITLE',
    cancelText: 'GLOBAL.CANCEL',
    userDataForm: true,
    scheduleForm: true,
  },
  profile: {
    mode: 'profile',
    title: 'USERS.PROFILE_TITLE',
    cancelText: 'GLOBAL.CANCEL',
    userDataForm: false,
    scheduleForm: true,
  },
};

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit, OnDestroy {
  mode: FormMode;
  uuid: string;
  unsubscribe$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authorityService: AuthorityService,
    // private tagService: TagsService,
    public usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.uuid = params.uuid;
        switch (true) {
          case !!params.mode:
            this.mode = FORM_MODES[params.mode];
            break;
          case this.router.url === '/profile':
            this.mode = FORM_MODES.profile;
            this.uuid = this.authorityService.currentUserUuid$.value!;
            break;
          case this.router.url === '/users/create':
            this.mode = FORM_MODES.create;
            break;
          default:
            this.router.navigate(['/home']);
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
