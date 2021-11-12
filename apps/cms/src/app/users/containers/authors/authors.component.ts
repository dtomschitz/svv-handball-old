import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User, UserRole } from '@svv/core/models';
import * as fromUsers from '@svv/cms/users/store/reducers';

/**
 * This component is used to display the `Authors` data table.
 */
@Component({
  selector: 'authors',
  templateUrl: './authors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorsComponent {
  users$: Observable<User[]>;
  defaultUserRole = UserRole.AUTHOR;

  constructor(private store: Store<fromUsers.State>) {
    this.users$ = this.store.pipe(select(fromUsers.selectAllAuthors));
  }
}
