import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { HvwGame } from '@svv/core/models';
import { GymInfoDialog, GymInfoDialogData } from '../gym-info-dialog';
import { GymInfoSheet } from '../gym-info-sheet';

@Component({
  selector: 'game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
  @Input() game: HvwGame;

  @Input() isMobile: boolean;
  @Input() loading: boolean;
  @Input() showClass: boolean;

  constructor(private dialog: MatDialog, private bottomSheet: MatBottomSheet) {}

  openGameInfo() {
    if (this.game.sGId !== 0) {
      window.open(
        `http://spo.handball4all.de/misc/sboPublicReports.php?sGID=${this.game.sGId}`,
      );

      return;
    }

    if (this.isMobile) {
      this.bottomSheet.open(GymInfoSheet, {
        panelClass: 'gym-info-sheet',
        data: {
          game: this.game,
        },
      });
      return;
    }

    this.dialog.open<GymInfoDialog, GymInfoDialogData>(GymInfoDialog, {
      maxWidth: '724px',
      width: '100%',
      data: {
        game: this.game,
      },
    });
  }

  isHomeTeam(name: string): boolean {
    return name.includes('SV Vaihingen');
  }

  isGamePostponed(game: HvwGame) {
    return game.comment === 'abgesetzt' || game.comment === 'abgesagt';
  }

  isValidDate(date: string) {
    return date !== 'Invalid Date';
  }

  hasReport(game: HvwGame) {
    return game.sGId !== 0;
  }

  getScoreClass(game: HvwGame) {
    const tie = '#757575';
    const win = '#2e7d32';
    const lost = '#c62828';

    if (game.teams.home.goals === game.teams.guest.goals) {
      return tie;
    }

    if (game.teams.home.name.includes('SV Vaihingen')) {
      return game.teams.home.goals > game.teams.guest.goals ? win : lost;
    } else if (game.teams.guest.name.includes('SV Vaihingen')) {
      return game.teams.home.goals < game.teams.guest.goals ? win : lost;
    }
  }
}
