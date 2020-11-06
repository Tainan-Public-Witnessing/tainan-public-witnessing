import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  cgcontrol = new FormControl();
  cncontrol = new FormControl();
  ugcontrol = new FormControl();
  uncontrol = new FormControl();
  dgcontrol = new FormControl();

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.loadUserGuidMap();
    this.userService.userGuidMap$.subscribe(data => console.log('user guid map', data));
  }

  create = () => {
    this.userService.createUserGuidMapItem({
      guid: this.cgcontrol.value,
      username: this.cncontrol.value
    });
  }

  update = () => {
    this.userService.updateUserGuidMapItem({
      guid: this.ugcontrol.value,
      username: this.uncontrol.value
    });
  }

  delete = () => {
    this.userService.deleteUserGuidMapItem(this.dgcontrol.value);
  }

}
