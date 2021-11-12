import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@svv/cms/material';
import {
  SearchBarComponent,
  DataTableComponent,
  DataTableActionsComponent,
  DataTableNoDataComponent,
  CmsImageComponent,
  CmsHistoryComponent,
  CmsHistoryListComponent,
  CmsHistoryItemComponent,
  CmsHistoryContentComponent,
  DataTableDetailsComponent,
  EditableListComponent,
} from './components';
import { FileDragAndDropDirective } from './directives';
import { FileSizePipe, OxfordJoinPipe } from './pipes';

@NgModule({
  declarations: [
    SearchBarComponent,
    DataTableComponent,
    DataTableActionsComponent,
    DataTableNoDataComponent,
    DataTableDetailsComponent,
    EditableListComponent,
    FileDragAndDropDirective,
    CmsImageComponent,
    FileSizePipe,
    OxfordJoinPipe,
    CmsHistoryComponent,
    CmsHistoryListComponent,
    CmsHistoryItemComponent,
    CmsHistoryContentComponent,
  ],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  exports: [
    SearchBarComponent,
    DataTableComponent,
    DataTableActionsComponent,
    DataTableNoDataComponent,
    DataTableDetailsComponent,
    EditableListComponent,
    FileDragAndDropDirective,
    CmsImageComponent,
    FileSizePipe,
    OxfordJoinPipe,
    CmsHistoryComponent,
    CmsHistoryListComponent,
    CmsHistoryItemComponent,
    CmsHistoryContentComponent,
  ],
})
export class SharedModule {}
