import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, race, Subject, timer } from 'rxjs';
import { map, switchAll, takeUntil } from 'rxjs/operators';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { CongregationsService } from 'src/app/_services/congregations.service';
import { CongregationFormDialogData } from './congregation-form-dialog/congregation-form-dialog-data.interface';
import { CongregationFormDialogComponent } from './congregation-form-dialog/congregation-form-dialog.component';

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
    this.congregationService.congregations$.pipe(takeUntil(this.unsubscribe$)).subscribe(this.congregations$);
    this.congregationService.loadCongregations();
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
    this.matDialog.open(CongregationFormDialogComponent, {
      disableClose: false,
      data: {
        mode: 'CREATE'
      } as CongregationFormDialogData
    }).afterClosed().subscribe(data => console.log('dialog data', data));
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
