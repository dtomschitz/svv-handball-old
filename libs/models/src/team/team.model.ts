import { HvwClass } from '../hvw';
import { Gender } from './gender.model';
import { TeamCoach } from './team-coach.model';
import { TeamImages } from './team-images.model';
import { TeamSettings } from './team-settings.model';
import { TeamType } from './team-type.model';
import { TrainingTime } from './training-time';

export interface Team {
  _id: string;
  abbreviation: string;
  name: string;
  gender: Gender;
  type: TeamType;
  position: number;
  settings?: TeamSettings;
  images?: TeamImages;
  contact?: string;
  priority?: number;
  classId?: string;
  class?: Pick<HvwClass, '_id' | 'id' | 'longName' | 'shortName'>;
  coachIds?: string[];
  coaches?: TeamCoach[];
  trainingTimes?: TrainingTime[];
  articleCategoryId?: string;
  disabled?: boolean;
}
