import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthorityService } from '../_services/authority.service';
import { LineBindingDialogComponent } from './line-binding-dialog/line-binding-dialog.component';

@Component({
  selector: 'app-line-binding',
  templateUrl: './line-binding.component.html',
  styleUrls: ['./line-binding.component.scss'],
})
export class LineBindingComponent implements OnInit {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private auth: AuthorityService
  ) {}

  ngOnInit(): void {
    const lineToken = window.location.hash.substring(1);

    if (!this.auth.currentUserUuid$.value && lineToken) {
      this.dialog.open(LineBindingDialogComponent, { disableClose: true });
    } else {
      this.router.navigateByUrl(`/`, { replaceUrl: true });
    }
  }
}
