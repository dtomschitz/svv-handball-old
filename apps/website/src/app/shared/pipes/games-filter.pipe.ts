import { Pipe, PipeTransform } from '@angular/core';
import { GamesFilterType, HvwGame, TeamType } from '@svv/core/models';

@Pipe({ name: 'gamesFilter' })
export class GamesFilterPipe implements PipeTransform {
  transform(games: HvwGame[], type: GamesFilterType = GamesFilterType.ALL) {
    if (type === GamesFilterType.ACTIVE) {
      games = games.filter(game => game.team?.type === TeamType.ACTIVE);
    } else if (type === GamesFilterType.YOUTH) {
      games = games.filter(game => game.team?.type === TeamType.YOUTH);
    } else if (type === GamesFilterType.WIN) {
      games = games.filter(({ teams: { home, guest } }) => {
        if (this.includesClubName(home.name)) {
          return home.goals > guest.goals;
        } else if (this.includesClubName(guest.name)) {
          return home.goals < guest.goals;
        }
      });
    } else if (type === GamesFilterType.LOST) {
      games = games.filter(({ teams: { home, guest } }) => {
        if (this.includesClubName(home.name)) {
          return home.goals < guest.goals;
        } else if (this.includesClubName(guest.name)) {
          return home.goals > guest.goals;
        }
      });
    } else if (type === GamesFilterType.TIE) {
      games = games.filter(({ teams }) => {
        return teams.home.goals === teams.guest.goals;
      });
    }

    return games;
  }

  includesClubName(name: string) {
    return name.includes('SV Vaihingen');
  }
}
