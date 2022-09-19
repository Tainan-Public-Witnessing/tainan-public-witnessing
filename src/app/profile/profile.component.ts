import { filter, takeUntil } from 'rxjs/operators';
import { Gender } from 'src/app/_enums/gender.enum';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CongregationsService } from 'src/app/_services/congregations.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Congregation } from '../_interfaces/congregation.interface';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  genders = Object.values(Gender);
  congregations$ = new BehaviorSubject<Congregation[] | undefined | null>(null);

  profileForm: FormGroup;

  unsubscribe$ = new Subject<void>();
  constructor(
    private congregationsService: CongregationsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.congregationsService
      .getCongregationList()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((congs) => !!congs)
      )
      .subscribe(this.congregations$);

    this.profileForm = this.formBuilder.group({
      username: [''],
      name: [''],
      gender: [''],
      congregationUuid: [''],
      baptizeDate: [''],
      cellphone: [''],
      phone: [''],
    });
    this.profileForm.disable();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
