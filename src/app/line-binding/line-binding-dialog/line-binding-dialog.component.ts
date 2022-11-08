import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private router: Router
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
    this.http
      .post(environment.LINE_BINDING, this.bindingForm.value)
      .subscribe((payload: any) => {
        if (payload.token) {
          this.auth.customLogin(payload.token).then(() => {
            this.router.navigateByUrl('/');
          });
        } else {
          this.bindingForm.setErrors({ bind_code: true });
        }
      });
  };
}
