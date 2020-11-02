import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { PermissionService } from './_services/permission.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private permisionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.permisionService.currentPermissionTable$.next({ // fake permission table
      home: true
    });
  }

  onMenuButtonClick = () => {
    this.sidenav.toggle();
  }
}
