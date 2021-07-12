import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { AuthorityService } from 'src/app/_services/authority.service';
import { AuthorityServiceStub } from 'src/app/_stubs/authority.service.stub';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { TranslateServiceStub } from 'src/app/_stubs/translate.service.stub';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

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
        UsersComponent
      ],
      providers: [
        { provide: AuthorityService, useClass: AuthorityServiceStub },
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: MatDialog, useValue: {} },
        { provide: Router, useValue: {} },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(UsersComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create users component', () => {
    expect(component).toBeTruthy();
  });
});
