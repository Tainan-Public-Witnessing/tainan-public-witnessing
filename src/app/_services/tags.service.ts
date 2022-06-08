import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tag } from 'src/app/_interfaces/tag.interface';
import { Api } from 'src/app/_api/mock.api';
import { Status } from 'src/app/_enums/status.enum';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  private tags$ = new BehaviorSubject<Tag[]>(null);

  constructor(
    private api: Api
  ) { }

  // getTags = (): BehaviorSubject<Tag[]> => {
  //   if (!this.tags$.getValue()) {
  //     this.api.readTags().subscribe(this.tags$);
  //   }
  //   return this.tags$;
  // }

  // sortTags = (tags: Tag[]): Promise<Status> => {
  //   return this.api.updateTags(tags);
  // }

  // createTag = (tag: Tag): Promise<Status> => {
  //   const tags = this.tags$.getValue();
  //   if (tags) {
  //     if (!tags.find(c => c.name === tag.name)) {
  //       return this.api.createTag(tag).then(() => Promise.resolve(Status.SUCCESS));
  //     } else {
  //       return Promise.reject(Status.EXISTED);
  //     }
  //   } else {
  //     return Promise.reject(Status.NOT_LOADED);
  //   }
  // }

  // updateTag = (tag: Tag): Promise<Status> => {
  //   const tags = this.tags$.getValue();
  //   if (tags) {
  //     if (!tags.find(object => object.name === tag.name)) {
  //       return this.api.updateTag(tag);
  //     } else {
  //       return Promise.reject(Status.EXISTED);
  //     }
  //   } else {
  //     return Promise.reject(Status.NOT_LOADED);
  //   }
  // }

  // deleteTag = (uuid: string): Promise<Status> => {
  //   return this.api.deleteTag(uuid);
  // }
}
