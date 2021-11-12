import { Injectable, Injector } from '@angular/core';
import { HvwJob } from '@svv/core/models';
import { DialogService } from '@svv/cms/core/services';
import {
  CacheClassesDialog,
  CacheGamesDialog,
  CacheTablesDialog,
  CacheWeeksDialog,
  CreateOrEditJobDialog,
  CreateOrEditJobDialogData,
} from '@svv/cms/hvw/components';

@Injectable()
export class HvwDialogService extends DialogService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Shows
   */
  showCacheGamesDialog() {
    return this.showDialog<CacheGamesDialog, any, boolean>(CacheGamesDialog, {
      width: '512px',
    });
  }

  showCacheClassesDialog() {
    return this.showDialog<CacheClassesDialog, any, boolean>(
      CacheClassesDialog,
      {
        width: '512px',
      },
    );
  }

  showCacheWeeksDialog() {
    return this.showDialog<CacheWeeksDialog, any, boolean>(CacheWeeksDialog, {
      width: '512px',
    });
  }

  showCacheTablesDialog() {
    return this.showDialog<CacheTablesDialog, any, boolean>(CacheTablesDialog, {
      width: '512px',
    });
  }

  showCreateOrEditJobDialog(data: CreateOrEditJobDialogData) {
    return this.showDialog<
      CreateOrEditJobDialog,
      CreateOrEditJobDialogData,
      Partial<HvwJob>
    >(CreateOrEditJobDialog, {
      width: '312px',
      data,
    });
  }

  showToggleJobDialog(job: HvwJob) {
    return this.showDefaultToggleDialog(job.disabled, {
      data: {
        title: `CronJob ${job.disabled ? 'aktivieren' : 'deaktivieren'}`,
        callout: {
          type: job.disabled ? 'INFO' : 'WARN',
          message: job.disabled
            ? 'Aktivierte Cronjobs werden automatisch gestartet und zum definierten Zeitpunkt ausgeführt.'
            : 'Deaktivierte Cronjobs werden sofort gestoppt und nicht länger ausgeführt.',
        },
        item: {
          name: 'CronJob',
          line: job.name,
        },
      },
    });
  }

  showDeleteJobDialog(job: HvwJob) {
    return this.showDefaultDeleteDialog({
      data: {
        title: 'CronJob löschen',
        callout: {
          type: 'WARN',
          message:
            'Das Löschen des Cronjobs ist endgültig und kann nicht rückgängig gemacht werden!',
        },
        item: {
          name: 'CronJob',
          line: job.name,
        },
      },
    });
  }
}
