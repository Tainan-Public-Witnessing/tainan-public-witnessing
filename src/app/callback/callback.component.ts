import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../_elements/dialogs/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  currentUserUuid: string;
  
  constructor(private matDiolog: MatDialog) {}

  ngOnInit(): void {
    this.matDiolog.open(ConfirmDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
      data:{
        title:'訂閱通知服務',
        message:'已成功訂閱，請關閉此頁面',
        hideCancelButton:true,
      }
    });
  }
}
