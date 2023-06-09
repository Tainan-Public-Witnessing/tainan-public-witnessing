import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { BehaviorSubject } from 'rxjs';
import { Gender } from 'src/app/_enums/gender.enum';
import { Permission } from 'src/app/_enums/permission.enum';
import { Congregation } from 'src/app/_interfaces/congregation.interface';
import { CongregationsService } from 'src/app/_services/congregations.service';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss'],
})
export class UserFilterComponent implements OnInit {
  @Input() filterValue: FormGroup;

  @Output() applyFilter = new EventEmitter<void>();

  permissions = Object.values(Permission).filter(
    (p) =>
      /\d+/.test(p.toString()) && (p as number) < (Permission.GUEST as number)
  );

  genders = Object.values(Gender);
  @AutoUnsubscribe()
  congregations$ = new BehaviorSubject<Congregation[] | null>(null);

  constructor(private congService: CongregationsService) {}

  ngOnInit(): void {
    this.congService.getCongregations().subscribe(this.congregations$);
  }

  onSubmit = () => {
    this.applyFilter.emit();
  };
}
