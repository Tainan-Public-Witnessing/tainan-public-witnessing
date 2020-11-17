import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, race, Subject, timer } from 'rxjs';
import { map, switchAll, takeUntil } from 'rxjs/operators';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { CongregationsService } from 'src/app/_services/congregations.service';
import { ConfirmDialogData } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog-data.interface';
import { ConfirmDialogComponent } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { CongregationDialogData } from './congregation-dialog/congregation-dialog-data.interface';
import { CongregationDialogComponent } from './congregation-dialog/congregation-dialog.component';
import { Mode } from 'src/app/_enums/mode.enum';

@Component({
  selector: 'app-congregations',
  templateUrl: './congregations.component.html',
  styleUrls: ['./congregations.component.scss']
})
export class CongregationsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(CdkDropList) cdkDropList: CdkDropList;

  congregations$ = new BehaviorSubject<Congregation[]>(null);
  exitComponent$ = new Subject<void>();
  unsubscribe$ = new Subject<void>();

  constructor(
    private congregationService: CongregationsService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.congregationService.getCongregations().pipe(takeUntil(this.unsubscribe$)).subscribe(this.congregations$);
  }

  ngAfterViewInit(): void {
    this.subscribeDrop();
    this.subscribeSort();
  }

  ngOnDestroy(): void {
    this.exitComponent$.next();
    this.unsubscribe$.next();
  }

  onAddButtonClick = () => {
    this.matDialog.open(CongregationDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
      data: {
        mode: Mode.CREATE
      } as CongregationDialogData
    });
  }

  onEditButtonClick = (congregation: Congregation) => {
    this.matDialog.open(CongregationDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
      data: {
        mode: Mode.UPDATE,
        congregation
      } as CongregationDialogData
    });
  }

  onDeleteButtonClick = (congregation: Congregation) => {
    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
      data: {
        title: 'Delete congregation',
        message: 'Are you sure to delete ' + congregation.name + '?'
      } as ConfirmDialogData
    }).afterClosed().subscribe(result => {
      if (result) {
        this.congregationService.deleteCongregation(congregation.uuid);
      }
    });
  }

  private subscribeDrop = (): void => {
    this.cdkDropList.dropped.pipe(takeUntil(this.unsubscribe$)).subscribe(e => {
      const congregations = this.congregations$.getValue();
      moveItemInArray(congregations, e.previousIndex, e.currentIndex);
      this.congregations$.next(congregations);
    });
  }

  private subscribeSort = (): void => {
    this.cdkDropList.sorted.pipe(
      map(() => race(timer(5000), this.exitComponent$)),
      switchAll()
    ).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.congregationService.sortCongregations(this.congregations$.getValue());
    });
  }
}
