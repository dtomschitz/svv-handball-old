import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import {
  ArticleCategory,
  TeamCoach,
  HvwClass,
  NotificationType,
  Team,
  TeamType,
} from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import { getGenders } from '@svv/cms/shared/constants';
import { ClassesActions } from '@svv/cms/hvw/store/actions';
import { UsersActions } from '@svv/cms/users/store/actions';
import { CategoriesActions } from '@svv/cms/articles/store/actions';
import { TeamActions, TeamsActions } from '@svv/cms/teams/store/actions';
import { TeamDialogService } from '@svv/cms/teams/services';
import * as fromTeams from '@svv/cms/teams/store/reducers';
import * as fromUsers from '@svv/cms/users/store/reducers';
import * as fromHvw from '@svv/cms/hvw/store/reducers';
import * as fromArticles from '@svv/cms/articles/store/reducers';

/**
 * This component is used to display the `Teams` data table.
 */
@Component({
  selector: 'teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  /**
   * The list of `Teams` that should be displayed in the data table.
   */
  @Input() teams: Team[];

  /**
   * The default `Team Type` that will be used.
   */
  @Input() defaultTeamType: TeamType;

  /**
   * The columns which are displayed in the data table.
   */
  @Input() displayedColumns = [
    'name',
    'abbreviation',
    'gender',
    'class',
    '_id',
    'actions',
  ];

  coaches$: Observable<TeamCoach[]>;
  classes$: Observable<HvwClass[]>;
  articleCategories$: Observable<ArticleCategory[]>;
  loading$: Observable<boolean>;
  imageUploading$: Observable<boolean>;

  genders = getGenders();
  expandedTeam: Team;

  constructor(
    private store: Store<
      fromUsers.State & fromHvw.State & fromTeams.State & fromArticles.State
    >,
    private teamDialogService: TeamDialogService,
  ) {
    this.coaches$ = this.store.pipe(select(fromUsers.selectAllCoaches));
    this.classes$ = this.store.pipe(select(fromHvw.selectAllClasses));
    this.articleCategories$ = this.store.pipe(
      select(fromArticles.selectAllCategories),
    );
    this.loading$ = this.store.pipe(select(fromTeams.selectIsLoading));
  }

  ngOnInit() {
    this.store.dispatch(TeamsActions.loadTeams());
    this.store.dispatch(UsersActions.loadUsers());
    this.store.dispatch(ClassesActions.loadClasses());
    this.store.dispatch(CategoriesActions.loadCategories());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Updates the currently selected `Team` in order to display it in the
   * expanded details component.
   *
   * @param team The selected `Team`.
   */
  onRowExpanded(team: Team) {
    if (team) {
      this.expandedTeam = team;
    }
  }

  /**
   * Opens the dialog for creating a new `Team`. After the dialog has been
   * closed the `createTeam` action will be dispatched which will create the new
   * `Team` based on the given form values. The `Team Type` will be set
   * according to the given default `Team Type`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param length The current `Teams` total.
   *
   * @param classes The list of `Classes` of which one can be selected.
   *
   * @param articleCategories The list of `Article Categories` of which one can
   * get selected.
   */
  createTeam(
    length: number,
    classes: HvwClass[],
    articleCategories: ArticleCategory[],
  ) {
    this.teamDialogService
      .showCreateOrEditTeamDialog({
        mode: DialogMode.CREATE,
        classes,
        articleCategories,
      })
      .pipe(
        filter(team => !!team),
        map(team => ({
          ...team,
          position: length++,
          type: this.defaultTeamType,
        })),
        takeUntil(this.destroy$),
      )
      .subscribe(team => this.store.dispatch(TeamActions.createTeam({ team })));
  }

  /**
   * Opens the dialog for modifying a existing `Team`. After the dialog has been
   * closed the `updateTeam` action will be dispatched which will update the
   * specific `Team` based on the given changes.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param team The `Team` which gets modified.
   *
   * @param classes The list of `Classes` of which one can be selected.
   *
   * @param articleCategories The list of `Article Categories` of which one can
   * get selected.
   */
  editTeam(
    team: Team,
    classes: HvwClass[],
    articleCategories: ArticleCategory[],
  ) {
    this.teamDialogService
      .showCreateOrEditTeamDialog({
        mode: DialogMode.EDIT,
        team,
        classes,
        articleCategories,
      })
      .pipe(
        filter(details => !!details),
        takeUntil(this.destroy$),
      )
      .subscribe(changes => {
        this.store.dispatch(
          TeamActions.updateTeam({
            update: {
              id: team._id,
              changes,
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for modifying the image of the given `Team`. After the
   * dialog has been closed the `uploadTeamImage` action will be dispatched
   * which will upload the selected image for the `Team`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param team The `Team` which gets modified.
   */
  editTeamImage(team: Team) {
    this.teamDialogService
      .showEditTeamImageDialog()
      .pipe(
        filter(image => !!image),
        takeUntil(this.destroy$),
      )
      .subscribe(image => {
        this.store.dispatch(
          TeamActions.uploadTeamImage({ id: team._id, image }),
        );
      });
  }

  /**
   * Opens the dialog for modifying the `Coaches` of the given `Team`. After the
   * dialog has been closed the `updateTeam` action will be dispatched which
   * will uppdate the `Coaches` based on the selected `Users`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param team The `Team` which gets modified.
   * @param classes The list of `Classes` from which the `User` can select.
   */
  editTeamCoaches(team: Team, coaches: TeamCoach[]) {
    this.teamDialogService
      .showEditTeamCoachesDialog({ team, coaches })
      .pipe(
        filter(changes => !!changes),
        takeUntil(this.destroy$),
      )
      .subscribe(coachIds => {
        this.store.dispatch(
          TeamActions.updateTeam({
            update: {
              id: team._id,
              changes: {
                coachIds,
              },
            },
          }),
        );
      });
  }

  editTrainingTimes(team: Team) {
    this.teamDialogService
      .showEditTeamTrainingsDialog({ team })
      .pipe(
        filter(changes => !!changes),
        takeUntil(this.destroy$),
      )
      .subscribe(trainingTimes => {
        this.store.dispatch(
          TeamActions.updateTeam({
            update: {
              id: team._id,
              changes: {
                trainingTimes,
              },
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for sorting all `Teams` of the given default `Team Type`.
   * After the dialog has been closed the `updateTeams` action will be
   * dispatched which will update the positions of all `Teams`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param teams The list of currently existing `Teams`.
   */
  sortTeams(teams: Team[]) {
    this.teamDialogService
      .showSortTeamsDialog({ teams })
      .pipe(
        filter(sortedTeams => !!sortedTeams),
        map(sortedTeams =>
          sortedTeams.map(team => ({ _id: team._id, position: team.position })),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(sortedTeams => {
        this.store.dispatch(
          TeamsActions.sortTeams({
            updates: sortedTeams.map((team, position) => ({
              id: team._id,
              changes: {
                position,
              },
            })),
          }),
        );
      });
  }

  /**
   * Opens the dialog for enabling or disabling the given `Team`. After the
   * dialog has been closed the `updateTeam` action will be dispatched which
   * will either enable or disable the `Team` based on the previous value.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param team The `Team` which gets modified.
   */
  toggleTeam(team: Team) {
    this.teamDialogService
      .showToggleTeamDialog(team)
      .pipe(
        filter(toggled => !!toggled),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.store.dispatch(
          TeamActions.updateTeam({
            update: {
              id: team._id,
              changes: {
                disabled: !team.disabled,
              },
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for enabling or disabling the image of the given `Team`.
   * After the dialog has been closed the `updateTeam` action will be dispatched
   * which  will either enable or disable the image of the `Team` based on the
   * previous value.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param team The `Team` which gets modified.
   */
  toggleTeamImage(team: Team) {
    this.teamDialogService
      .showToggleTeamImageDialog(team)
      .pipe(
        filter(toggled => !!toggled),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.store.dispatch(
          TeamActions.updateTeam({
            update: {
              id: team._id,
              changes: {
                images: {
                  ...team.images,
                  disabled: !team.images.disabled,
                },
              },
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for deleting the image of the given `Team`. After the
   * dialog has been closed the `deleteTeamImage` action will be dispatched
   * which will start the deletion process for the image of the `Team`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param team The `Team` which gets modified.
   */
  deleteTeamImage(team: Team) {
    this.teamDialogService
      .showDeleteTeamImageDialog(team)
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(TeamActions.deleteTeamImage({ id: team._id })),
      );
  }

  /**
   * Opens the dialog for deleting the given `Team`. After the dialog has been
   * closed the `deleteTeam` action will be dispatched which will start the
   * deletion process for the `Team`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param team The `Team` which gets modified.
   */
  deleteTeam(team: Team) {
    this.teamDialogService
      .showDeleteTeamDialog(team)
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(TeamActions.deleteTeam({ id: team._id })),
      );
  }

  /**
   * Dispatches the `refreshTeams` action in order to reload the `Teams` from
   * the API.
   */
  refreshTeams() {
    this.store.dispatch(TeamsActions.refreshTeams());
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `Team` of the row has been copied successfully
   * to the clipboard.
   */
  copyTeamId(event: MouseEvent) {
    this.preventDefault(event);
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Mannschafts-ID in Zwischenablage kopiert',
        },
      }),
    );
  }

  preventDefault(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  emptyArray(n: number): any[] {
    return Array(n);
  }

  getGender(team: Team) {
    return this.genders.find(gender => gender.value === team.gender).name;
  }

  getClass(team: Team, classes: HvwClass[]) {
    return classes.find(hvwClass => hvwClass._id === team.classId)?.shortName;
  }
}
