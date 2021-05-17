import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { TranslateServiceStub } from 'src/app/_stubs/translate.service.stub';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
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
        ProfileComponent
      ],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: FormBuilder, useValue: {} },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(ProfileComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create profile component', () => {
    expect(component).toBeTruthy();
  });
});
