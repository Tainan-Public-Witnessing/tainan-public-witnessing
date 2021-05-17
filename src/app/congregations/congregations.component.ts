import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, race, Subject, timer } from 'rxjs';
import { first, map, switchAll, takeUntil } from 'rxjs/operators';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { CongregationsService } from 'src/app/_services/congregations.service';
import { ConfirmDialogData } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog-data.interface';
import { ConfirmDialogComponent } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { CongregationDialogData } from './congregation-dialog/congregation-dialog-data.interface';
import { CongregationDialogComponent } from './congregation-dialog/congregation-dialog.component';
import { Mode } from 'src/app/_enums/mode.enum';
import { AuthorityService } from 'src/app/_services/authority.service';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-congregations',
  templateUrl: './congregations.component.html',
  styleUrls: ['./congregations.component.scss']
})
export class CongregationsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(CdkDropList) cdkDropList: CdkDropList;

  congregations$ = new BehaviorSubject<Congregation[]>(null);
  congregationsSortAccess$: Observable<boolean>;
  congregationCreateAccess$: Observable<boolean>;
  congregationUpdateAccess$: Observable<boolean>;
  congregationDeleteAccess$: Observable<boolean>;
  savedata$ = new Subject<void>();
  unsubscribe$ = new Subject<void>();

  constructor(
    private authorityService: AuthorityService,
    private congregationService: CongregationsService,
    private translateService: TranslateService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.congregationService.getCongregations().pipe(takeUntil(this.unsubscribe$)).subscribe(this.congregations$);

    this.congregationsSortAccess$ = this.authorityService.getPermissionByKey(PermissionKey.CONGREGATIONS_SORT);
    this.congregationCreateAccess$ = this.authorityService.getPermissionByKey(PermissionKey.CONGREGATION_CREATE);
    this.congregationUpdateAccess$ = this.authorityService.getPermissionByKey(PermissionKey.CONGREGATION_UPDATE);
    this.congregationDeleteAccess$ = this.authorityService.getPermissionByKey(PermissionKey.CONGREGATION_DELETE);
  }

  ngAfterViewInit(): void {
    this.subscribeDrop();
    this.subscribeSort();
  }

  ngOnDestroy(): void {
    this.savedata$.next();
    this.savedata$.complete();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
        title: 'CONGREGATIONS.DELETE_TITLE',
        message: this.translateService.instant('GLOBAL.DELETE_MESSAGE', {value: congregation.name})
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
      map(() => race(timer(10000).pipe(first()), this.savedata$)),
      switchAll(),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.congregationService.sortCongregations(this.congregations$.getValue());
    });
  }
}
