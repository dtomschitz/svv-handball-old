import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { Image, ImageTag } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { CustomValidators } from '@svv/cms/shared/validators';
import * as fromImages from '@svv/cms/images/store/reducers';

export interface CreateOrEditImageDialogData {
  mode: DialogMode;
  image?: Image;
  tags: ImageTag[];
}

@Component({
  selector: 'create-or-edit-image-dialog',
  templateUrl: './create-or-edit-image-dialog.component.html',
  styleUrls: ['./create-or-edit-image-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditImageDialog {
  imageForm: FormGroup;
  tagSearchControl: FormControl;

  filteredTags$: Observable<ImageTag[]>;
  file: File;

  constructor(
    private store: Store<fromImages.State>,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrEditImageDialog>,
    @Inject(MAT_DIALOG_DATA) private data: CreateOrEditImageDialogData,
  ) {
    this.imageForm = this.formBuilder.group({
      name: [
        data?.image?.name,
        Validators.required,
        CustomValidators.duplicateValueValidator(
          this.store.pipe(select(fromImages.selectAllImageNames)),
          data?.image?.name,
        ),
      ],
      tagIds: [data?.image?.tagIds ?? []],
    });

    this.tagSearchControl = this.formBuilder.control('');

    this.filteredTags$ = this.tagSearchControl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value
          ? this.data.tags.filter(tag => {
              return tag.name.toLowerCase().includes(value.toLowerCase());
            })
          : this.data.tags.slice(),
      ),
    );
  }

  save() {
    this.dialogRef.close({
      image: this.imageForm.value,
      file: this.file,
    });
  }

  close() {
    this.dialogRef.close();
  }

  get invalidOrNotDirty() {
    return this.imageForm.invalid || !this.imageForm.dirty;
  }

  get isCreateDialog() {
    return this.data.mode === DialogMode.CREATE;
  }

  get tags() {
    const ids: string[] = this.imageForm.get('tagIds').value;
    return ids.reduce<ImageTag[]>((list, id) => {
      const tag = this.data.tags.find(tag => tag._id === id);
      if (tag) {
        list.push(tag);
      }

      return list;
    }, []);
  }
}
