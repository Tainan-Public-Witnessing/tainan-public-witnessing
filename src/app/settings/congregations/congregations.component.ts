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
  createCongregation=()=>{
    this.congregationService.createCongregation({name:'新會眾',order:this.congregations$!.length}).then(cong=>this.congregations$?.push(cong))
  }
  changeCongregationActivation=(cong:Congregation)=>{
    let index=this.congregations$?.indexOf(cong)
    this.congregationService.changeCongregationsActivation(cong).then(activation=>this.congregations$![index!].activate=activation)
  }
}
