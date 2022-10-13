import { Component, OnInit } from '@angular/core';
import { CongregationsService } from '../../_services/congregations.service';
import { Congregation } from '../../_interfaces/congregation.interface';

@Component({
  selector: 'app-congregations',
  templateUrl: './congregations.component.html',
  styleUrls: ['./congregations.component.scss']
})
export class CongregationsComponent implements OnInit {

  constructor(
    private congregationService: CongregationsService,
  ) { }
  congregations$: Congregation[] | null| undefined = [];
  ngOnInit(): void {
    this.congregationService.getCongregationList().subscribe((congs) => (this.congregations$ = congs));
  }

}
