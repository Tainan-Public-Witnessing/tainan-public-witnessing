import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShiftHoursCreatorComponent } from 'src/app/_elements/dialogs/shiftHour-creator/shiftHour-creator.component';
import { ShiftHoursService } from '../../_services/shift-hours.service';
import { ShiftHour } from '../../_interfaces/shift-hours.interface';
import { ShiftHoursEditorComponent } from 'src/app/_elements/dialogs/shiftHour-editor/shiftHour-editor.component';
@Component({
  selector: 'app-shfitHours',
  templateUrl: './shfitHours.component.html',
  styleUrls: ['./shfitHours.component.scss']
})
export class ShfitHoursComponent implements OnInit {
  shifthours: ShiftHour[] | null = [];
  constructor(
    private shifthoursService: ShiftHoursService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.shifthoursService.getShiftHours().subscribe((shifthours) => (this.shifthours = shifthours));
  }
  createShiftHours = () => {
    let creatDiagRef = this.matDialog.open(ShiftHoursCreatorComponent, {
      panelClass: 'dialog-panel',
    });
    creatDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.shifthoursService.getShiftHours().subscribe(shifthours => {
          this.shifthours = shifthours;
        })
    });
  }
  openShiftHourEditor = (shiftHour: ShiftHour) => {
    let editDiagRef = this.matDialog.open(ShiftHoursEditorComponent, {
      panelClass: 'dialog-panel',
      data: {
        shiftHour,
      },
    });
    editDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.shifthoursService.getShiftHours().subscribe(shifthours => {
          this.shifthours = shifthours;
        })
    });
  }
  changeShiftHourActivation = (shifthour: ShiftHour) => {
    let index = this.shifthours?.indexOf(shifthour)
    this.shifthoursService.changeShiftHourActivation(shifthour).then(activation => this.shifthours![index!].activate = activation)
  }

  changeShiftHourDelivery = (shifthour: ShiftHour) => {
    let index = this.shifthours?.indexOf(shifthour)
    this.shifthoursService.changeShiftHourDelivery(shifthour).then(activation => this.shifthours![index!].deliver = activation)
  }
}
