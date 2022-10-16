import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthorityService } from 'src/app/_services/authority.service';
import { LinenotifyService } from '../_services/linenotify.service';
import { Permission } from '../_enums/permission.enum';
import { LoginDialogComponent } from 'src/app/_elements/dialogs/login-dialog/login-dialog.component';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  UserOnly$ = new BehaviorSubject<boolean>(false);
  currentUserUuid: string;
  searchParams = new URLSearchParams({
    response_type: 'code',
    client_id: 'CumN52DojP7D7fMERzuV5o',
    redirect_uri: 'http://localhost:4200/callback',
    scope: 'notify',
    response_mode: 'form_post',
  });
  constructor(
    private matDiolog: MatDialog,
    private authorityService: AuthorityService,
    private linenotifyService: LinenotifyService
  ) {}

  ngOnInit(): void {
    this.authorityService.canAccess(Permission.USER).subscribe(this.UserOnly$);

    this.authorityService.currentUserUuid$.subscribe((uuid) => {
      this.currentUserUuid = uuid!;
      this.searchParams.set('state', this.currentUserUuid);
    });

    if (!this.UserOnly$) {
      this.matDiolog.open(LoginDialogComponent, {
        disableClose: true,
        panelClass: 'dialog-panel',
      });
    }
  }

  // onSubscibe = () => {
  //   this.linenotifyService.registerLineToken(this.currentUserUuid);
  // };
}
