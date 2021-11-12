import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ArticleCategory, HvwClass, Team } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models/dialog-mode.model';
import { getGenders, getTeamTypes } from '@svv/cms/shared/constants';
import { CustomValidators } from '@svv/cms/shared/validators';
import * as fromTeams from '@svv/cms/teams/store/reducers';

export interface CreateOrEditTeamDialogData {
  mode: DialogMode;
  classes: HvwClass[];
  articleCategories: ArticleCategory[];
  team?: Team;
}

/**
 * This component is used as an dialog for creating or modifying a `Team`.
 */
@Component({
  selector: 'create-or-edit-team-dialog',
  templateUrl: './create-or-edit-team-dialog.component.html',
  styleUrls: ['./create-or-edit-team-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditTeamDialog {
  teamForm: FormGroup;
  articleCategorySearchControl: FormControl;

  genders = getGenders();
  types = getTeamTypes();
  contactOptions = [
    'jugend@svv-handball.de',
    'sportlicheleitung@svv-handball.de',
  ];

  filteredContactOptions$: Observable<string[]>;
  filteredArticleCategories$: Observable<ArticleCategory[]>;

  constructor(
    private store: Store<fromTeams.State>,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrEditTeamDialog>,
    @Inject(MAT_DIALOG_DATA) private data: CreateOrEditTeamDialogData,
  ) {
    this.teamForm = this.formBuilder.group({
      name: [
        data?.team?.name,
        Validators.required,
        CustomValidators.duplicateValueValidator(
          this.store.pipe(select(fromTeams.selectTeamNames)),
          data?.team?.name,
        ),
      ],
      abbreviation: [
        data?.team?.abbreviation,
        Validators.required,
        CustomValidators.duplicateValueValidator(
          this.store.pipe(select(fromTeams.selectTeamAbbreviations)),
          data?.team?.abbreviation,
        ),
      ],
      gender: [data?.team?.gender, Validators.required],
      type: [data?.team?.type, Validators.required],
      contact: [data?.team?.contact],
      classId: [data?.team?.classId],
      articleCategoryId: [data?.team?.articleCategoryId],
      settings: this.formBuilder.group({
        cacheGames: [
          data?.team?.settings.cacheGames ?? true,
          Validators.required,
        ],
        cacheTable: [
          data?.team?.settings.cacheTable ?? true,
          Validators.required,
        ],
      }),
    });

    this.articleCategorySearchControl = this.formBuilder.control('');

    if (this.classes.length === 0) {
      this.teamForm.get('classId').disable();
    }

    if (this.articleCategories.length === 0) {
      this.teamForm.get('articleCategoryId').disable();
    }

    if (this.data.mode === DialogMode.CREATE) {
      this.teamForm.get('type').disable();
    }

    this.filteredContactOptions$ = this.teamForm
      .get('contact')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterContactOptions(value)),
      );

    this.filteredArticleCategories$ = this.articleCategorySearchControl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value
          ? this.data.articleCategories.filter(category => {
              return category.name.toLowerCase().includes(value.toLowerCase());
            })
          : this.data.articleCategories.slice(),
      ),
    );
  }

  clearSelectedArticleCategory() {
    this.teamForm.get('articleCategoryId').setValue(null);
    this.teamForm.markAsDirty();
  }

  clearSelectedClass() {
    this.teamForm.get('classId').setValue(null);
    this.teamForm.markAsDirty();
  }

  /**
   * Closes the dialog without the changes.
   */
  close() {
    this.dialogRef.close();
  }

  private filterContactOptions(value: string) {
    const filterValue = value.toLowerCase();

    return this.contactOptions.filter(option =>
      option.toLowerCase().includes(filterValue),
    );
  }

  get invalidOrNotDirty() {
    return this.teamForm.invalid || !this.teamForm.dirty;
  }

  get isCreateDialog() {
    return this.data.mode === DialogMode.CREATE;
  }

  get isClassSelected() {
    return this.teamForm.get('classId').value;
  }

  get isArticleCategorySelected() {
    return this.teamForm.get('articleCategoryId').value;
  }

  get classes() {
    return this.data.classes;
  }

  get articleCategories() {
    return this.data.articleCategories;
  }
}
