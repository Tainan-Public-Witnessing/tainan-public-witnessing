import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalEventService } from 'src/app/_services/global-event.service';
import { PermissionService } from 'src/app/_services/permission.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  unsubscribe$ = new Subject<void>();

  constructor(
    private permisionService: PermissionService,
    private globalEventService: GlobalEventService
  ) {}

  ngOnInit(): void {

    this.globalEventService.getGlobalEventById('ON_MENU_LINK_CLICK').pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.sidenav.close();
    });

    this.permisionService.permissionTable$.next({ // fake permission table
      home: true,
      users: true
    });
  }

  onMenuButtonClick = () => {
    this.sidenav.toggle();
  }
}
