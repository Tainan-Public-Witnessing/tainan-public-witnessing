import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CongregationDialogComponent } from './congregation-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { TranslateServiceStub } from 'src/app/_stubs/translate.service.stub';

describe('CongregationDialogComponent', () => {
  let component: CongregationDialogComponent;
  let fixture: ComponentFixture<CongregationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [
        CongregationDialogComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: TranslateService, useClass: TranslateServiceStub },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CongregationDialogComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create congregation dialog component', () => {
    expect(component).toBeTruthy();
  });
});
