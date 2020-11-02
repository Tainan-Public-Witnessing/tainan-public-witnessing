import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IMenuLink } from 'src/app/_interfaces/menu-link.interface';
import { PermissionService } from 'src/app/_services/permission.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  MENU_LINKS: IMenuLink[] = [
    { display: 'Home', url: 'home'}
  ];

  currentMenuLinks$: Observable<IMenuLink[]>;

  constructor(
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.currentMenuLinks$ = this.permissionService.currentPermissionTable$.pipe(
      map(permissionTable => this.MENU_LINKS.filter(menuLink => permissionTable[menuLink.url]))
    );
  }

}
