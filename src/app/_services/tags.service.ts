import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tag } from 'src/app/_interfaces/tag.interface';
import { MockApi } from 'src/app/_api/mock.api';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  tags$ = new BehaviorSubject<Tag[]>(null);

  constructor(
    private mockApi: MockApi
  ) { }

  loadTags = () => {
    if (!this.tags$.getValue()) {
      this.mockApi.readTags().subscribe(this.tags$);
    }
  }

  sortTags = (tags: Tag[]) => {
    return this.mockApi.sortTags(tags);
  }

  createTag = (tag: Tag): Promise<any> => {
    const tags = this.tags$.getValue();
    if (tags) {
      if (!tags.find(c => c.name === tag.name)) {
        return this.mockApi.createTag(tag);
      } else {
        return Promise.reject('TAG_NAME_EXISTED');
      }
    } else {
      return Promise.reject('TAGS_NOT_LOADED');
    }
  }

  updateTag = (tag: Tag) => {
    const tags = this.tags$.getValue();
    if (tags) {
      if (!tags.find(c => c.name === tag.name)) {
        return this.mockApi.updateTag(tag);
      } else {
        return Promise.reject('TAG_NAME_EXISTED');
      }
    } else {
      return Promise.reject('TAGS_NOT_LOADED');
    }
  }

  deleteTag = (uuid: string) => {
    return this.mockApi.deleteTag(uuid);
  }
}
