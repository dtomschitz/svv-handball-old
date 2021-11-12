export enum HvwCachingType {
  GAMES = 'games',
  CLASSES = 'classes',
  TABLES = 'tables',
  WEEKS = 'weeks',
}

export const cachingTypes = [
  {
    name: 'Begegnungen',
    value: HvwCachingType.GAMES,
  },
  {
    name: 'Spielklassen',
    value: HvwCachingType.CLASSES,
  },
  {
    name: 'Spielwochen',
    value: HvwCachingType.WEEKS,
  },
  {
    name: 'Tabellen',
    value: HvwCachingType.TABLES,
  },
];
