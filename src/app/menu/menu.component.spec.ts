import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { AuthorityService } from 'src/app/_services/authority.service';
import { AuthorityServiceStub } from 'src/app/_stubs/authority.service.stub';
import { MatDialog } from '@angular/material/dialog';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuComponent
      ],
      providers: [
        { provide: AuthorityService, useClass: AuthorityServiceStub },
        { provide: MatDialog, useValue: {} },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(MenuComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create menu.component', () => {
    expect(component).toBeTruthy();
  });
});
