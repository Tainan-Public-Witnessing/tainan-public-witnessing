import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShiftHoursCreatorComponent } from 'src/app/_elements/dialogs/shiftHour-creator/shiftHour-creator.component';
import { ShiftHoursService } from '../../_services/shift-hours.service';
import { ShiftHour } from '../../_interfaces/shift-hours.interface';
import { ShiftHoursEditorComponent } from 'src/app/_elements/dialogs/shiftHour-editor/shiftHour-editor.component';
import { Subject, BehaviorSubject, startWith, switchMap, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-shfitHours',
  templateUrl: './shfitHours.component.html',
  styleUrls: ['./shfitHours.component.scss']
})
export class ShfitHoursComponent implements OnInit, OnDestroy {
  reloadList$ = new BehaviorSubject<void>(undefined);
  shifthours$ = new BehaviorSubject<ShiftHour[] | null>(null);
  unsubscribe$ = new Subject<void>();
  constructor(
    private shifthoursService: ShiftHoursService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.reloadList$.pipe(
      startWith(undefined),
      switchMap(() => {
        return this.shifthoursService
          .getShiftHours().pipe(
            filter((f) => f !== null),
            takeUntil(this.unsubscribe$)
            )
      })
    ).subscribe(shifthours => {
      this.shifthours$.next(shifthours);
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  createShiftHour = () => {
    let creatDiagRef = this.matDialog.open(ShiftHoursCreatorComponent, {
      panelClass: 'dialog-panel',
    });
    creatDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.reloadList$.next(undefined);
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
        this.reloadList$.next(undefined);
    });
  }
  changeShiftHourActivation = async (shifthour: ShiftHour) => {
    await this.shifthoursService.changeShiftHourActivation(shifthour);
    this.reloadList$.next(undefined);   
  }

  changeShiftHourDelivery = async (shifthour: ShiftHour) => {
    await this.shifthoursService.changeShiftHourDelivery(shifthour);
    this.reloadList$.next(undefined);
  }
}
