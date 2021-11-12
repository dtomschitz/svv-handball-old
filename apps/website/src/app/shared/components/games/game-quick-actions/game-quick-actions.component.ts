import { Component, Inject } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { HvwGame } from '@svv/core/models';

export function openGameQuickActions(bottomSheet: MatBottomSheet, data: GameQuickActionsData) {
  return bottomSheet.open<GameQuickActionsComponent, GameQuickActionsData>(
    GameQuickActionsComponent,
    { data },
  );
}

interface GameQuickActionsData {
  game: HvwGame;
}

@Component({
  selector: 'game-quick-actions',
  templateUrl: './game-quick-actions.component.html',
  styleUrls: ['./game-quick-actions.component.scss'],
})
export class GameQuickActionsComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<GameQuickActionsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: GameQuickActionsData,
  ) {}

  close(event: MouseEvent) {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  openGymInfo(event: MouseEvent) {
    this.close(event);
  }

  get hasGameReport() {
    return this.data.game.sGId !== 0;
  }
}
