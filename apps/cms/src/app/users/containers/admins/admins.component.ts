import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, UserRole } from '@svv/core/models';
import * as fromUsers from '@svv/cms/users/store/reducers';

/**
 * This component is used to display the `Admins` data table.
 */
@Component({
  selector: 'admins',
  templateUrl: './admins.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminsComponent {
  users$: Observable<User[]>;
  defaultUserRole = UserRole.ADMIN;

  constructor(private store: Store<fromUsers.State>) {
    this.users$ = this.store.pipe(select(fromUsers.selectAllAdmins));
  }
}
