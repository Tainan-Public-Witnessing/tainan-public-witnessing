import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Mode } from "src/app/_enums/mode.enum";
import { UserKey } from "src/app/_interfaces/user.interface";
import { AuthorityService } from "src/app/_services/authority.service";
import { UsersService } from "src/app/_services/users.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit, OnDestroy {
  userPrimarykeys$ = new BehaviorSubject<UserKey[] | null>(null);
  unsubscribe$ = new Subject<void>();

  constructor(
    private authorityService: AuthorityService,
    private translateService: TranslateService,
    private router: Router,
    private matDialog: MatDialog,
    public usersService: UsersService // public for checking immortal user
  ) {}

  ngOnInit(): void {
    this.usersService
      .getUserKeys()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.userPrimarykeys$);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // onAddButtonClick = () => {
  //   this.router.navigate(["user", Mode.CREATE]);
  // };

  onInfoButtonClick = (userKey: UserKey) => {
    this.router.navigate(["user", Mode.READ, { uuid: userKey.uuid }]);
  };
}
