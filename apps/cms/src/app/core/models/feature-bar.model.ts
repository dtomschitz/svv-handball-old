import { FeatureTab } from './feature-tab.model';

export interface FeatureBar {
  title: string;
  path: string;
  tabs: FeatureTab[];
  disableFeatureBar: boolean;
  currentTab: number;
}
