import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConfirmDialogData } from '../_elements/dialogs/confirm-dialog/confirm-dialog-data.interface';
import { ConfirmDialogComponent } from '../_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { AuthorityService } from '../_services/authority.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private auth: AuthorityService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const token = window.location.hash.substring(1);
    if (token) {
      this.auth
        .customLogin(token)
        .then(() => {
          this.router.navigateByUrl('/');
        })
        .catch(() => {
          this.dialog
            .open(ConfirmDialogComponent, {
              data: {
                title: 'LOGIN.ERROR_TITLE',
                message: 'LOGIN.FIREBASE_TOKEN_INVALID_ERROR',
                hideCancelButton: true,
              } as ConfirmDialogData,
            })
            .afterClosed()
            .subscribe(this.redirectToLineLogin);
        });
    } else {
      this.redirectToLineLogin();
    }
  }

  private redirectToLineLogin() {
    window.location.href = environment.LINE_LOGIN;
  }
}
