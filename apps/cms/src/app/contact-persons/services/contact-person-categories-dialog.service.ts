import { Injectable, Injector } from '@angular/core';
import { ContactPerson, ContactPersonCategory } from '@svv/core/models';
import { DialogService } from '@svv/cms/core/services';
import {
  CreateOrEditContactPersonCategoryDialog,
  CreateOrEditContactPersonCategoryDialogData,
  SortContactPersonCategoriesDialog,
  SortContactPersonCategoriesDialogData,
} from '@svv/cms/contact-persons/components';

@Injectable()
export class ContactPersonCategoriesDialogService extends DialogService {
  constructor(injector: Injector) {
    super(injector);
  }

  showCreateOrEditContactPersonCategoryDialog(
    data: CreateOrEditContactPersonCategoryDialogData,
  ) {
    return this.showDialog<
      CreateOrEditContactPersonCategoryDialog,
      CreateOrEditContactPersonCategoryDialogData,
      Partial<ContactPerson>
    >(CreateOrEditContactPersonCategoryDialog, {
      width: '512px',
      data,
    });
  }

  showSortContactPersonCategoriesDialog(
    data: SortContactPersonCategoriesDialogData,
  ) {
    return this.showDialog<
      SortContactPersonCategoriesDialog,
      SortContactPersonCategoriesDialogData,
      ContactPerson[]
    >(SortContactPersonCategoriesDialog, {
      width: '512px',
      data,
    });
  }

  showDeleteContactPersonCategoryDialog(category: ContactPersonCategory) {
    return this.showDefaultDeleteDialog({
      data: {
        title: 'Ansprechpartner löschen',
        callout: {
          type: 'WARN',
          message:
            'Wenn Sie einen Ansprechpartner löschen, wird dieser endgültig entfernt. Das Löschen von Ansprechpartner kann nicht rückgängig gemacht werden!',
        },
        item: {
          name: 'Ansprechpartner',
          line: category.name,
        },
      },
    });
  }
}
