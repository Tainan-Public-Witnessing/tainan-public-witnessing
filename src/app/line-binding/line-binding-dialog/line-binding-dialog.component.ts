import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthorityService } from 'src/app/_services/authority.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './line-binding-dialog.component.html',
  styleUrls: ['./line-binding-dialog.component.scss'],
})
export class LineBindingDialogComponent implements OnInit {
  bindingForm: FormGroup;
  constructor(
    formBuilder: FormBuilder,
    private http: HttpClient,
    private auth: AuthorityService,
    private router: Router,
    private dialogRef: MatDialogRef<LineBindingDialogComponent>
  ) {
    this.bindingForm = formBuilder.group({
      bind_code: ['', Validators.required],
      line_token: [''],
    });
  }

  ngOnInit(): void {
    const lineToken = window.location.hash.substring(1);
    this.bindingForm.patchValue({ line_token: lineToken });
  }

  onBind = () => {
    if (this.bindingForm.valid) {
      this.http
        .post(`${environment.BACKEND_URL}/bind-user`, this.bindingForm.value)
        .subscribe((payload: any) => {
          if (payload.token) {
            const query = new URLSearchParams(
              window.location.search.substring(1)
            );
            this.auth
              .customLogin(payload.token)
              .then(() => this.closeThis(query.get('return')));
          } else {
            this.bindingForm.setErrors({ bind_code: true });
          }
        });
    } else {
      this.bindingForm.setErrors({ bind_code_required: true });
    }
  };

  closeThis = (returnUrl?: string | null) => {
    this.dialogRef.close();
    this.router.navigateByUrl(returnUrl || '/', { replaceUrl: true });
  };
}
