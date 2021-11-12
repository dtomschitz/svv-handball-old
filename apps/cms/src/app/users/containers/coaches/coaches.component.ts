import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, UserRole } from '@svv/core/models';
import * as fromUsers from '@svv/cms/users/store/reducers';

/**
 * This component is used to display the `Coaches` data table.
 */
@Component({
  selector: 'coaches',
  templateUrl: './coaches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoachesComponent {
  users$: Observable<User[]>;
  defaultUserRole = UserRole.TRAINER;

  constructor(private store: Store<fromUsers.State>) {
    this.users$ = this.store.pipe(select(fromUsers.selectAllCoaches));
  }
}
