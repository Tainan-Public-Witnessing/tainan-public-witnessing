import { AfterViewInit, Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { Permission } from 'src/app/_enums/permission.enum';
import { Statistic } from 'src/app/_interfaces/statistic.interface';
import { AuthorityService } from 'src/app/_services/authority.service';
import { StatisticsService } from 'src/app/_services/statistics.service';

@Component({
  selector: 'app-statistic-editor',
  templateUrl: './statistic-editor.component.html',
  styleUrls: ['./statistic-editor.component.scss']
})
export class StatisticEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  statisticForm!: FormGroup;
  managerAccess$!: Observable<boolean>;
  destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<StatisticEditorComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {mode: string, uuid: string, date: string},
    private statisticsService: StatisticsService,
    private authorityService: AuthorityService,
  ) { }

  ngOnInit(): void {
    const disabled = this.data.mode === 'view';
    this.statisticForm = this.formBuilder.group({
      attendance: [{ value: '', disabled}, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      tracts: [{ value: '', disabled}, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      videos: [{ value: '', disabled}, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      returnVisits: [{ value: '', disabled}, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      startingBibleStudies: [{ value: '', disabled}, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });

    this.managerAccess$ = this.authorityService.canAccess(Permission.MANAGER);
  }

  ngAfterViewInit(): void {
    if (this.data.mode !== 'create') {
      const yearMonth = this.data.date.slice(0, 7);
      this.statisticsService.getStatistic(yearMonth, this.data.uuid).pipe(
        filter(_statistic => _statistic !== null),
        first(),
      ).subscribe(_statistic => {
        if (_statistic) {
          this.statisticForm.setValue({
            attendance: _statistic.attendance,
            tracts: _statistic.tracts,
            videos: _statistic.videos,
            returnVisits: _statistic.returnVisits,
            startingBibleStudies: _statistic.startingBibleStudies
          }, {emitEvent: false});
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEditClick = () => {
    this.data.mode = 'edit';
    Object.values(this.statisticForm.controls).forEach(_control => _control.enable());
  }

  onCancelClick = () => {
    this.dialogRef.close(false);
  }

  onSubmitClick = () => {
    if (this.statisticForm.valid) {
      const statistic: Statistic = {
        uuid: this.data.uuid,
        date: this.data.date,
        createdByUuid: this.authorityService.currentUserUuid$.value as string,
        createdOn: new Date(),
        activate: true,
        attendance: this.statisticForm.get('attendance')?.value,
        tracts: this.statisticForm.get('tracts')?.value,
        videos: this.statisticForm.get('videos')?.value,
        returnVisits: this.statisticForm.get('returnVisits')?.value,
        startingBibleStudies: this.statisticForm.get('startingBibleStudies')?.value,
      }

      if (this.data.mode === 'create') {
        this.statisticsService.createStatistic(statistic);
      } else { // this.data.mode === 'edit'
        this.statisticsService.updateStatistic(statistic);
      }

      this.dialogRef.close(true);
    } else {
      this.statisticForm.markAllAsTouched();
    }
  }

}
