import { CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, timer, race, Observable } from 'rxjs';
import { map, switchAll, takeUntil } from 'rxjs/operators';
import { Tag } from 'src/app/_interfaces/tag.interface';
import { TagsService } from 'src/app/_services/tags.service';
import { ConfirmDialogData } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog-data.interface';
import { ConfirmDialogComponent } from 'src/app/_elements/dialogs/confirm-dialog/confirm-dialog.component';
import { Mode } from 'src/app/_enums/mode.enum';
import { AuthorityService } from 'src/app/_services/authority.service';
import { TagDialogData } from './tag-dialog/tag-dialog-data.interface';
import { TagDialogComponent } from './tag-dialog/tag-dialog.component';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkDropList) cdkDropList: CdkDropList;

  tags$ = new BehaviorSubject<Tag[]>(null);
  tagsSortAccess$: Observable<boolean>;
  tagCreateAccess$: Observable<boolean>;
  tagUpdateAccess$: Observable<boolean>;
  tagDeleteAccess$: Observable<boolean>;
  exitComponent$ = new Subject<void>();
  unsubscribe$ = new Subject<void>();

  constructor(
    private authorityService: AuthorityService,
    private tagService: TagsService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.tagService.getTags().pipe(takeUntil(this.unsubscribe$)).subscribe(this.tags$);

    this.tagsSortAccess$ = this.authorityService.getPermissionByKey(PermissionKey.TAGS_SORT);
    this.tagCreateAccess$ = this.authorityService.getPermissionByKey(PermissionKey.TAG_CREATE);
    this.tagUpdateAccess$ = this.authorityService.getPermissionByKey(PermissionKey.TAG_UPDATE);
    this.tagDeleteAccess$ = this.authorityService.getPermissionByKey(PermissionKey.TAG_DELETE);
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
        mode: Mode.CREATE
      } as TagDialogData
    });
  }

  onEditButtonClick = (tag: Tag) => {
    this.matDialog.open(TagDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
      data: {
        mode: Mode.UPDATE,
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
