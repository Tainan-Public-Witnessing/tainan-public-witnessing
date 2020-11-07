import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { CongregationsService } from 'src/app/_services/congregations.service';

@Component({
  selector: 'app-congregations',
  templateUrl: './congregations.component.html',
  styleUrls: ['./congregations.component.scss']
})
export class CongregationsComponent implements OnInit {

  congregations$: BehaviorSubject<Congregation[]>;

  constructor(
    private congregationService: CongregationsService
  ) { }

  ngOnInit(): void {
    this.congregations$ = this.congregationService.congregations$;
    this.congregationService.loadCongregations();
  }

  drop(event: CdkDragDrop<string[]>) {
    const congregations = this.congregations$.getValue();
    moveItemInArray(congregations, event.previousIndex, event.currentIndex);
    this.congregationService.sortCongregations(congregations);
  }

}
