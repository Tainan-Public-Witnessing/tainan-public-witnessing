import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CongregationsComponent } from './congregations.component';

class AuthorityServiceStub {
  
}

describe('CongregationsComponent', () => {
  let component: CongregationsComponent;
  let fixture: ComponentFixture<CongregationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongregationsComponent ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CongregationsComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create comgregation.component', () => {
    expect(component).toBeTruthy();
  });
});
