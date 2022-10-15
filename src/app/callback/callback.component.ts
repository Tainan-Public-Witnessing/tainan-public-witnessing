import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from 'src/app/_elements/dialogs/login-dialog/login-dialog.component';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(
    private matDiolog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.matDiolog.open(LoginDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
    });
  }

}
