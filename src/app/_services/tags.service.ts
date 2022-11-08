import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Api } from 'src/app/_api';
import { Tag } from 'src/app/_interfaces/tag.interface';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  private tags$: BehaviorSubject<Tag[]> | undefined = undefined;

  constructor(
    private api: Api
  ) { }
}
