import { Component, Inject } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { HvwGame } from '@svv/core/models';

export interface GymInfoSheetData {
  game: HvwGame;
}

@Component({
  selector: 'gym-info-sheet',
  templateUrl: './gym-info-sheet.component.html',
  styleUrls: ['./gym-info-sheet.component.scss'],
})
export class GymInfoSheet {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<GymInfoSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private data: GymInfoSheetData,
  ) {}

  dismiss() {
    this.bottomSheetRef.dismiss();
  }

  get game() {
    return this.data.game;
  }
}
