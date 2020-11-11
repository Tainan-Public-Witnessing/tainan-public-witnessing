import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagFormDialogComponent } from './tag-form-dialog.component';

describe('TagFormDialogComponent', () => {
  let component: TagFormDialogComponent;
  let fixture: ComponentFixture<TagFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
