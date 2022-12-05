import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CongregationsService } from '../../_services/congregations.service';
import { Congregation } from '../../_interfaces/congregation.interface';
import { CongregationCreatorComponent } from 'src/app/_elements/dialogs/congregation-creator/congregation-creator.component';
import { CongregationEditorComponent } from 'src/app/_elements/dialogs/congregation-editor/congregation-editor.component';

@Component({
  selector: 'app-congregations',
  templateUrl: './congregations.component.html',
  styleUrls: ['./congregations.component.scss']
})
export class CongregationsComponent implements OnInit {
  congregations: Congregation[] | null | undefined = [];
  constructor(
    private congregationService: CongregationsService,
    private matDialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.congregationService.getCongregations().subscribe((congs) => (this.congregations = congs));
  }
  createCongregation = () => {
    let creatDiagRef = this.matDialog.open(CongregationCreatorComponent, {
      panelClass: 'dialog-panel',
    });
    creatDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.congregationService.getCongregations().subscribe(congs => {
          this.congregations = congs;
        })
    });
  }
  openCongregationEditor = (congregation: Congregation) => {
    let editDiagRef = this.matDialog.open(CongregationEditorComponent, {
      panelClass: 'dialog-panel',
      data: {
        congregation,
      },
    });
    editDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.congregationService.getCongregations().subscribe(congs => {
          this.congregations = congs;
        })
    });
  }
  changeCongregationActivation = (cong: Congregation) => {
    let index = this.congregations?.indexOf(cong)
    this.congregationService.changeCongregationsActivation(cong).then(activation => this.congregations![index!].activate = activation)
  }
}
