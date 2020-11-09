import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongregationFormDialogComponent } from './congregation-form-dialog.component';

describe('CongregationFormDialogComponent', () => {
  let component: CongregationFormDialogComponent;
  let fixture: ComponentFixture<CongregationFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongregationFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongregationFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
