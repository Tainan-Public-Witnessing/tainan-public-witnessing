import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CongregationsComponent } from './congregations.component';
import { AuthorityService } from '../_services/authority.service';
import { TranslateServiceStub } from 'src/app/_stubs/translate.service.stub';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { AuthorityServiceStub } from 'src/app/_stubs/authority.service.stub';

class MatDialogStub {

}

describe('CongregationsComponent', () => {
  let component: CongregationsComponent;
  let fixture: ComponentFixture<CongregationsComponent>;

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
        CongregationsComponent
      ],
      providers: [
        { provide: AuthorityService, useClass: AuthorityServiceStub },
        { provide: TranslateService, useClass: TranslateServiceStub },
        { provide: MatDialog, useClass: MatDialogStub },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CongregationsComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create comgregation.component', () => {
    expect(component).toBeTruthy();
  });
});
