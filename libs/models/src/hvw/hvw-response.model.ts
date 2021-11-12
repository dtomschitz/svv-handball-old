import { HvwScore } from './hvw-table.model';

export interface HvwResponse {
  header: {
    version: string;
  };
  menu: {
    org: {
      list: { [key: string]: string };
      selectedID: string;
    };
    period: {
      list: { [key: string]: string };
      selectedID: string;
    };
    dt: {
      list: { [key: string]: string };
      selected: string;
    };
  };
  head: {
    name: string;
    sname: string;
    headline1: string;
    headline2: string;
    actualized: string;
    live: number;
    repURL: string;
  };
  content: {
    classes?: HvwClass[];
    actualGames?: HvwClass;
    score?: {
      liveTeam: boolean;
      tabScore: number;
      pointsPlus: number;
      numGoalsGot: number;
      numWonGames: number;
      pointsMinus: number;
      tabTeamname: string;
      numGoalsShot: number;
      numLostGames: number;
      numEqualGames: number;
      numPlayedGames: number;
    }[];
    scoreComments?: string[];
    futureGames?: HvwClass;
    scoreShowDataPerGame?: boolean;
  };
  footer: any;
  error: any;
  debug: any;
}

interface HvwClass {
  gClassAGsDesc: string;
  gClassAGsYear: string;
  gClassGender: string;
  gClassID: string;
  gClassLname: string;
  gClassSname: string;
  gRefAllocType: string;
  gRefRespOrg: string;
  games?: [
    {
      gAppID: number;
      gClassID: string;
      gComment: string;
      gDate: string;
      gGroupsortTxt: string;
      gGuestGoals: string;
      gGuestGoals_1: string;
      gGuestPoints: number;
      gGuestTeam: string;
      gGymnasiumID: number;
      gGymnasiumName: string;
      gGymnasiumNo: number;
      gGymnasiumPostal: number;
      gGymnasiumStreet: string;
      gGymnasiumTown: string;
      gHomeGoals: string;
      gHomeGoals_1: string;
      gHomePoints: number;
      gHomeTeam: string;
      gID: number;
      gNo: number;
      gReferee: string;
      gTime: string;
      gToken: number;
      gWDay: string;
      gWeek: string;
      live: number;
      sGID: number;
    }
  ];
}
