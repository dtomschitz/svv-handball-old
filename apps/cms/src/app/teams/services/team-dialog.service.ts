import { Injectable, Injector } from '@angular/core';
import { Team } from '@svv/core/models';
import { DialogService } from '@svv/cms/core/services';
import {
  CreateOrEditTeamDialog,
  CreateOrEditTeamDialogData,
  EditTeamCoachesDialogData,
  SortTeamsDialog,
  SortTeamsDialogData,
  EditTeamImageDialog,
  EditTeamCoachesDialog,
  EditTeamTrainingsDialog,
  EditTeamTrainingsDialogData,
} from '@svv/cms/teams/components';
import { TrainingTime } from 'libs/models/src/team/training-time';

/**
 * This dialog service which contains methods for opening every dialog for the
 * `Teams` feature.
 */
@Injectable()
export class TeamDialogService extends DialogService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Opens the dialog which is used to either modify or create a `Team`.
   */
  showCreateOrEditTeamDialog(data: CreateOrEditTeamDialogData) {
    return this.showDialog<
      CreateOrEditTeamDialog,
      CreateOrEditTeamDialogData,
      Partial<Team>
    >(CreateOrEditTeamDialog, {
      width: '512px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to modify the `Coaches` of the respective
   * `Team` from the dialog data.
   *
   * @param data The dialog data which contains the `Team`
   * that should be modified.
   */
  showEditTeamCoachesDialog(data: EditTeamCoachesDialogData) {
    return this.showDialog<
      EditTeamCoachesDialog,
      EditTeamCoachesDialogData,
      string[]
    >(EditTeamCoachesDialog, {
      width: '312px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to modify the `Training Times` of the
   * respective `Team` from the dialog data.
   *
   * @param data The dialog data which contains the `Team`
   * that should be modified.
   */
  showEditTeamTrainingsDialog(data: EditTeamTrainingsDialogData) {
    return this.showDialog<
      EditTeamTrainingsDialog,
      EditTeamTrainingsDialogData,
      TrainingTime[]
    >(EditTeamTrainingsDialog, {
      width: '512px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to modify the image of the respective `Team`
   * from the dialog data.
   */
  showEditTeamImageDialog() {
    return this.showDialog<EditTeamImageDialog, any, File>(
      EditTeamImageDialog,
      {
        width: '512px',
      },
    );
  }

  /**
   * Opens the dialog which is used to enabled or disabled the `Team` from the
   * dialog data.
   *
   * @param team The `Team` which should get enabled or disabled.
   */
  showToggleTeamDialog(team: Team) {
    return this.showDefaultToggleDialog(team.disabled, {
      data: {
        title: `Mannschaft ${team.disabled ? 'aktivieren' : 'deaktivieren'}`,
        callout: {
          type: team.disabled ? 'INFO' : 'WARN',
          message: team.disabled
            ? 'Aktivierte Mannschaft werden auf der Webseite angezeigt!'
            : 'Deaktivierte Mannschaft werden auf der Webseite nicht angezeigt!',
        },
        item: {
          name: 'Mannschaft',
          line: team.name,
        },
      },
    });
  }

  /**
   * Opens the dialog which is used to enabled or disabled the image of the
   * `Team` from the dialog data.
   *
   * @param team The `Team` of which the image should be enabled or disabled.
   */
  showToggleTeamImageDialog(team: Team) {
    return this.showDefaultToggleDialog(team.images.disabled, {
      data: {
        title: `Mannschaftsfoto ${
          team.images.disabled ? 'aktivieren' : 'deaktivieren'
        }`,
        callout: {
          type: team.images.disabled ? 'INFO' : 'WARN',
          message: team.images.disabled
            ? 'Aktivierte Mannschaftsfotos können auf der Homepage von Besuchern gesehen werden!'
            : 'Deaktivierte Mannschaftsfotos können auf der Homepage von Besuchern nicht mehr gesehen werden!',
        },
        item: {
          name: 'Mannschaft',
          line: team.name,
        },
      },
    });
  }

  /**
   * Opens the dialog which is used to delete the image of the `Team` from
   * the dialog data.
   *
   * @param team The `Team` of which the image should be deleted.
   */
  showDeleteTeamImageDialog(team: Team) {
    return this.showDefaultDeleteDialog({
      data: {
        title: 'Mannschaftsfoto löschen',
        callout: {
          type: 'WARN',
          message:
            'Das löschen des Sponsorenfotos kann nicht rückgänig gemacht werden!',
        },
        item: {
          name: 'Mannschaftsfoto',
          line: team.name,
        },
      },
    });
  }

  /**
   * Opens the dialog which is used to delete the `Team` from the dialog data.
   *
   * @param team The `Team` which should get deleted.
   */
  showDeleteTeamDialog(team: Team) {
    return this.showDefaultDeleteDialog({
      data: {
        title: 'Mannschaft löschen',
        callout: {
          type: 'WARN',
          message:
            'Das Löschen einer Mannschaft kann nicht rückgängig gemacht werden!',
        },
        item: {
          name: 'Mannschaft',
          line: team.name,
        },
      },
    });
  }

  /**
   * Opens the dialog which is used to sort the `Teams` from the dialog data.
   *
   * @param data The dialog data which contains the `Teams` that should
   * be sorted.
   */
  showSortTeamsDialog(data: SortTeamsDialogData) {
    return this.showDialog<SortTeamsDialog, SortTeamsDialogData, Team[]>(
      SortTeamsDialog,
      {
        width: '312px',
        data,
      },
    );
  }
}
