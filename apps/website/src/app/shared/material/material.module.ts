import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatChipOptionsModule } from '@svv/common-components/mat-chip-options';

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatRippleModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTabsModule,
    MatBottomSheetModule,
    MatChipOptionsModule,
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTabsModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatChipOptionsModule,
  ],
})
export class MaterialModule {}
