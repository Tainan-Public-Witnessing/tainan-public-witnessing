import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogComponent } from './login-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { TranslateServiceStub } from 'src/app/_stubs/translate.service.stub';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [
        LoginDialogComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: FormBuilder, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: TranslateService, useClass: TranslateServiceStub },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(LoginDialogComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create login dialog component', () => {
    expect(component).toBeTruthy();
  });
});
