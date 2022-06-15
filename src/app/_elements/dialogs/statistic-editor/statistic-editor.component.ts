import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, first } from 'rxjs/operators';
import { AuthorityService } from 'src/app/_services/authority.service';
import { StatisticsService } from 'src/app/_services/statistics.service';

@Component({
  selector: 'app-statistic-editor',
  templateUrl: './statistic-editor.component.html',
  styleUrls: ['./statistic-editor.component.scss']
})
export class StatisticEditorComponent implements OnInit, AfterViewInit {

  statisticForm!: FormGroup;

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
      attendance: [{ value: '', disabled}, [Validators.required, Validators.pattern(/[0-9]+/)]],
      tracts: [{ value: '', disabled}, [Validators.required, Validators.pattern(/[0-9]+/)]],
      scriptures: [{ value: '', disabled}, [Validators.required, Validators.pattern(/[0-9]+/)]],
      videos: [{ value: '', disabled}, [Validators.required, Validators.pattern(/[0-9]+/)]],
      acceptReturnVisit: [{ value: '', disabled}, [Validators.required, Validators.pattern(/[0-9]+/)]],
      returnVisits: [{ value: '', disabled}, [Validators.required, Validators.pattern(/[0-9]+/)]],
      experience: [{ value: '', disabled}],
    });
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
            scriptures: _statistic.scriptures,
            videos: _statistic.videos,
            acceptReturnVisit: _statistic.acceptReturnVisit,
            returnVisits: _statistic.returnVisits,
            experience: _statistic.experience,
          }, {emitEvent: false});
        }
      });
    }
  }

  onCancelClick = () => {
    this.dialogRef.close(false);
  }

  onSubmitClick = () => {
    if (this.statisticForm.valid) {
      this.statisticsService.createStatistic({
        uuid: this.data.uuid,
        date: this.data.date,
        createdByUuid: this.authorityService.currentUserUuid$.value as string,
        createdOn: new Date(),
        activate: true,
        attendance: this.statisticForm.get('attendance')?.value,
        tracts: this.statisticForm.get('tracts')?.value,
        scriptures: this.statisticForm.get('scriptures')?.value,
        videos: this.statisticForm.get('videos')?.value,
        acceptReturnVisit: this.statisticForm.get('acceptReturnVisit')?.value,
        returnVisits: this.statisticForm.get('returnVisits')?.value,
        experience: this.statisticForm.get('experience')?.value,
      });
      this.dialogRef.close(true);
    } else {
      this.statisticForm.markAllAsTouched();
    }
  }

}
