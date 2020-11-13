import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, timer, race } from 'rxjs';
import { map, switchAll, takeUntil } from 'rxjs/operators';
import { Tag } from 'src/app/_interfaces/tag.interface';
import { TagsService } from 'src/app/_services/tags.service';
import { ConfirmDialogData } from '../_elements/dialogs/confirm-dialog/confirm-dialog-data.interface';
import { ConfirmDialogComponent } from '../_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { TagDialogData } from './tag-dialog/tag-dialog-data.interface';
import { TagDialogComponent } from './tag-dialog/tag-dialog.component';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkDropList) cdkDropList: CdkDropList;

  tags$ = new BehaviorSubject<Tag[]>(null);
  exitComponent$ = new Subject<void>();
  unsubscribe$ = new Subject<void>();

  constructor(
    private tagService: TagsService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.tagService.tags$.pipe(takeUntil(this.unsubscribe$)).subscribe(this.tags$);
    this.tagService.loadTags();
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
    this.matDialog.open(TagDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
      data: {
        mode: 'CREATE'
      } as TagDialogData
    });
  }

  onEditButtonClick = (tag: Tag) => {
    this.matDialog.open(TagDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
      data: {
        mode: 'EDIT',
        tag
      } as TagDialogData
    });
  }

  onDeleteButtonClick = (tag: Tag) => {
    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
      data: {
        title: 'Delete tag',
        message: 'Are you sure to delete ' + tag.name + '?'
      } as ConfirmDialogData
    }).afterClosed().subscribe(result => {
      if (result) {
        this.tagService.deleteTag(tag.uuid);
      }
    });
  }

  private subscribeDrop = (): void => {
    this.cdkDropList.dropped.pipe(takeUntil(this.unsubscribe$)).subscribe(e => {
      const tags = this.tags$.getValue();
      moveItemInArray(tags, e.previousIndex, e.currentIndex);
      this.tags$.next(tags);
    });
  }

  private subscribeSort = (): void => {
    this.cdkDropList.sorted.pipe(
      map(() => race(timer(5000), this.exitComponent$)),
      switchAll()
    ).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.tagService.sortTags(this.tags$.getValue());
    });
  }
}
