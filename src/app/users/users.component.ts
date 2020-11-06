import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  cncontrol = new FormControl();
  ugcontrol = new FormControl();
  uncontrol = new FormControl();
  dgcontrol = new FormControl();

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.loadUserUuidMap();
    this.userService.userUuidMap$.subscribe(data => console.log('user uuid map', data));
  }

  create = () => {
    this.userService.createUserUuidMapItem({
      uuid: null,
      username: this.cncontrol.value
    });
  }

  update = () => {
    this.userService.updateUserUuidMapItem({
      uuid: this.ugcontrol.value,
      username: this.uncontrol.value
    });
  }

  delete = () => {
    this.userService.deleteUserUuidMapItem(this.dgcontrol.value);
  }

}
