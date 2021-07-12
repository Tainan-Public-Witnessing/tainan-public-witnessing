import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { HttpLoaderFactory } from './app.module';
import { HttpClient } from '@angular/common/http';
import { AngularMaterialModule } from './_modules/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateServiceStub } from 'src/app/_stubs/translate.service.stub';

class DateAdapterStub {
  setLocale = (locale: any): void => {};
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: DateAdapter, useClass: DateAdapterStub }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create app.component', () => {
    expect(component).toBeTruthy();
  });

  it('should set en and zh as defualt languages', () => {
    expect(component.languages).toEqual(['en', 'zh']);
  });
});
