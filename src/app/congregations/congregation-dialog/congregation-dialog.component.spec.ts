import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongregationDialogComponent } from './congregation-dialog.component';

describe('CongregationDialogComponent', () => {
  let component: CongregationDialogComponent;
  let fixture: ComponentFixture<CongregationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongregationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongregationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
