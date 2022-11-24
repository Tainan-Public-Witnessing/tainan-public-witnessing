import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShifthoursCreatorComponent } from 'src/app/_elements/dialogs/shifthours-creator/shifthours-creator.component';
import { ShiftHoursService } from '../../_services/shift-hours.service';
import { ShiftHours } from '../../_interfaces/shift-hours.interface';
import { ShifthoursEditorComponent } from 'src/app/_elements/dialogs/shifthours-editor/shifthours-editor.component';
@Component({
  selector: 'app-shfithours',
  templateUrl: './shfithours.component.html',
  styleUrls: ['./shfithours.component.scss']
})
export class ShfithoursComponent implements OnInit {
  shifthours: ShiftHours[] | null = [];
  constructor(
    private shifthoursService: ShiftHoursService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.shifthoursService.getShiftHoursList().subscribe((shifthours) => (this.shifthours = shifthours));
  }
  createShiftHours = () => {
    let creatDiagRef = this.matDialog.open(ShifthoursCreatorComponent, {
      panelClass: 'dialog-panel',
    });
    creatDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.shifthoursService.getShiftHoursList().subscribe(shifthours => {
          this.shifthours = shifthours;
        })
    });
  }
  openShiftHourEditor = (shiftHour: ShiftHours) => {
    let editDiagRef = this.matDialog.open(ShifthoursEditorComponent, {
      panelClass: 'dialog-panel',
      data: {
        shiftHour,
      },
    });
    editDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.shifthoursService.getShiftHoursList().subscribe(shifthours => {
          this.shifthours = shifthours;
        })
    });
  }
  changeShiftHourActivation = (shifthour: ShiftHours) => {
    let index = this.shifthours?.indexOf(shifthour)
    this.shifthoursService.changeShiftHourActivation(shifthour).then(activation => this.shifthours![index!].activate = activation)
  }

  changeShiftHourDelivery = (shifthour: ShiftHours) => {
    let index = this.shifthours?.indexOf(shifthour)
    this.shifthoursService.changeShiftHourDelivery(shifthour).then(activation => this.shifthours![index!].deliver = activation)
  }
}
