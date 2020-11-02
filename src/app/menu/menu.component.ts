import { Component, OnInit } from '@angular/core';
import { IMenuLink } from 'src/app/_interfaces/menu-link.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  menuLinks: IMenuLink[];

  constructor() { }

  ngOnInit(): void {
    this.menuLinks = [
      { display: 'Home', url: 'home'}
    ];
  }

}
