export enum ErrorType {
  //User
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  USER_DISABLED = 'USER_DISABLED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USERS_NOT_FOUND = 'USERS_NOT_FOUND',
  DUPLICATE_USER = 'DUPLICATE_USER',

  //Team
  TEAM_NOT_FOUND = 'TEAM_NOT_FOUND',
  TEAMS_NOT_FOUND = 'TEAMS_NOT_FOUND',
  DUPLICATE_TEAM = 'DUPLICATE_TEAM',
  TEAM_CLASS_ID_UNDEFINED = 'TEAM_CLASS_ID_UNDEFINED',
  TEAM_IMAGE_DELETION_FAILED = 'TEAM_IMAGE_DELETION_FAILED',

  //Sponsor
  SPONSOR_NOT_FOUND = 'SPONSOR_NOT_FOUND',
  SPONSORS_NOT_FOUND = 'SPONSORS_NOT_FOUND',
  DUPLICATE_SPONSOR = 'DUPLICATE_SPONSOR',

  //Article
  ARTICLE_NOT_FOUND = 'ARTICLE_NOT_FOUND',
  ARTICLES_NOT_FOUND = 'ARTICLES_NOT_FOUND',
  DUPLICATE_ARTICLE = 'DUPLICATE_ARTICLE',
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  CATEGORIES_NOT_FOUND = 'CATEGORIES_NOT_FOUND',
  DUPLICATE_CATEGORY = 'DUPLICATE_CATEGORY',

  //Image
  IMAGE_NOT_FOUND = 'IMAGE_NOT_FOUND',
  IMAGES_NOT_FOUND = 'IMAGES_NOT_FOUND',
  DUPLICATE_IMAGE = 'DUPLICATE_IMAGE',
  IMAGE_TAG_NOT_FOUND = 'IMAGE_TAG_NOT_FOUND',
  IMAGE_TAGS_NOT_FOUND = 'IMAGE_TAGS_NOT_FOUND',
  DUPLICATE_IMAGE_TAG = 'DUPLICATE_IMAGE_TAG',

  //HVW
  JOB_NOT_FOUND = 'JOB_NOT_FOUND',
  JOBS_NOT_FOUND = 'JOBS_NOT_FOUND',
  DUPLICATE_JOB = 'DUPLICATE_JOB',
  JOB_NOT_REGISTERED = 'JOB_NOT_REGISTERED',
  TABLE_NOT_FOUND = 'TABLE_NOT_FOUND',
  SCHEDULE_NOT_FOUND = 'SCHEDULE_NOT_FOUND',
  GAME_WEEK_EMPTY = 'GAME_WEEK_EMPTY',

  // Contact Persons
  CONTACT_PERSONS_NOT_FOUND = 'CONTACT_PERSONS_NOT_FOUND',
  CONTACT_PERSON_NOT_FOUND = 'CONTACT_PERSON_NOT_FOUND',
  DUPLICATE_CONTACT_PERSON = 'DUPLICATE_CONTACT_PERSON',
  CONTACT_PERSON_CATEGORIES_NOT_FOUND = 'CONTACT_PERSON_CATEGORIES_NOT_FOUND',
  CONTACT_PERSON_CATEGORY_NOT_FOUND = 'CONTACT_PERSON_CATEGORY_NOT_FOUND',
  DUPLICATE_CONTACT_PERSON_CATEGORY = 'DUPLICATE_CONTACT_PERSON_CATEGORY',

  //Default
  OBJECT_NOT_FOUND = 'OBJECT_NOT_FOUND',
  UNSUPPORTED_IMAGE_TYPE = 'UNSUPPORTED_IMAGE_TYPE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INVALID_OBJECT_ID = 'INVALID_OBJECT_ID',

  //MongoDB
  UNKNOWN_MONGODB_ERROR = 'UNKNOWN_MONGODB_ERROR',
  DUPLICATE_KEY = 'DUPLICATE_KEY',
}

export enum FeatureType {
  ARTICLES = 'ARTICLES',
  CATEGORIES = 'CATEGORIES',
  AUTHENTICATION = 'AUTHENTICATION',
  HVW = 'HVW',
  SPONSORS = 'SPONSORS',
  TEAMS = 'TEAMS',
  USERS = 'USERS',
}

export interface ErrorResponse {
  type: ErrorType;
  message: string;
  featureType: FeatureType;
  timestamp: string;
  status: number;
  path: string;
}

export const errorMessages: { [key in ErrorType]: string } = {
  // User
  DUPLICATE_EMAIL: 'Die E-Mail-Adresse ist bereits vorhanden!',
  DUPLICATE_USER: 'Es existiert bereits ein Nutzter mit dieser E-Mail-Adresse',
  INVALID_EMAIL: 'Die E-Mail-Adresse ist nicht korrekt!',
  INVALID_PASSWORD: 'Das Passwort ist nicht korrekt!',
  USER_DISABLED:
    'Dieser Nutzer ist deaktiviert und kann nicht zur Anmeldung genutzt werden!',
  USER_NOT_FOUND: 'Es konnte kein Nutzer gefunden werden!',
  USERS_NOT_FOUND: 'Es wurden keine Nutzer gefunden!',
  INVALID_OBJECT_ID: 'Die zur Anfrage genutzte ID ist nicht valide!',

  // Team
  TEAM_NOT_FOUND: 'Es konnte keine Mannschaft gefunden werden!',
  TEAMS_NOT_FOUND: 'Es wurden keine Mannschaften gefunden!',
  DUPLICATE_TEAM: 'Es existiert bereits ein Nutzter mit dieser Abkürzung!',
  TEAM_CLASS_ID_UNDEFINED: 'Die Mannschaft ist keiner Spielklasse zugeordnet!',
  TEAM_IMAGE_DELETION_FAILED:
    'Das Mannschaftsfoto konnte nicht gelöscht werden!',

  // Sponsor
  SPONSOR_NOT_FOUND: 'Es konnte kein Sponsor gefunden werden!',
  SPONSORS_NOT_FOUND: 'Es wurden keine Sponsoren gefunden!',
  DUPLICATE_SPONSOR: 'Es existiert bereits ein Sponsor mit diesem Namen!',

  // Article
  ARTICLE_NOT_FOUND: 'Es konnte kein Artikel gefunden werden!',
  ARTICLES_NOT_FOUND: 'Es wurden keine Artikel gefunden!',
  DUPLICATE_ARTICLE: 'Es exestiert bereits ein Artikel mit diesem Namen!',
  CATEGORY_NOT_FOUND: 'Es konnte keine Kategorie gefunden werden!',
  CATEGORIES_NOT_FOUND: 'Es wurden keine Kategorien gefunden!',
  DUPLICATE_CATEGORY: 'Es exestiert bereits eine Kategorie mit diesem Namen!',

  // Image
  IMAGE_NOT_FOUND: 'Es konnte kein Bild gefunden werden!',
  IMAGES_NOT_FOUND: 'Es wurden keine Bilder gefunden!',
  DUPLICATE_IMAGE: 'Es exestiert bereits ein Bild mit diesem Namen!',
  IMAGE_TAG_NOT_FOUND: 'Es konnte kein Bildtag gefunden werden!',
  IMAGE_TAGS_NOT_FOUND: 'Es wurden keine Bildtags gefunden!',
  DUPLICATE_IMAGE_TAG: 'Es exestiert bereits ein Bildtag mit diesem Namen!',

  // HVW
  JOB_NOT_FOUND: 'Es konnte keine CronJob gefunden werden!',
  JOBS_NOT_FOUND: 'Es wurden keine CronJobs gefunden!',
  DUPLICATE_JOB: 'Es existiert bereits ein CronJob mit diesem Namen!',
  JOB_NOT_REGISTERED: 'Der angegebene Cronjob ist nicht registriert!',
  TABLE_NOT_FOUND: 'Die angeforderte Tabelle wurde nicht gefunden!',
  SCHEDULE_NOT_FOUND: 'Der angeforderte Spielplan wurde nicht gefunden!',
  GAME_WEEK_EMPTY: 'Es konnten keine Begegungen gefunden werden!',

  // Contact Persons
  CONTACT_PERSONS_NOT_FOUND: 'Es wurden keine Ansprechpartner gefunden!',
  CONTACT_PERSON_NOT_FOUND: 'Es konnte kein Ansprechpartner gefunden werden!',
  DUPLICATE_CONTACT_PERSON:
    'Es existiert bereits ein Ansprechpartner mit diesem Namen!',
  CONTACT_PERSON_CATEGORIES_NOT_FOUND:
    'Es wurden keine Ansprechpartnerkategorien gefunden!',
  CONTACT_PERSON_CATEGORY_NOT_FOUND:
    'Es konnte kein Ansprechpartnerkategorie gefunden werden!',
  DUPLICATE_CONTACT_PERSON_CATEGORY:
    'Es existiert bereits ein Ansprechpartnerkategorie mit diesem Namen!',

  // Default
  OBJECT_NOT_FOUND: 'Das angeforderte Objekt wurde nicht gefunden!',
  UNSUPPORTED_IMAGE_TYPE: 'Das gegebene Dateiformat wird nicht unterstützt!',
  UNKNOWN_ERROR: 'Ein unbekannter Fehler ist aufgetreten!',

  // MongoDB
  UNKNOWN_MONGODB_ERROR: 'Unbekannter MongoDB Fehler!',
  DUPLICATE_KEY: 'MongoDB: Duplicate Key!',
};

export const getErrorMessage = (type: ErrorType) => {
  return errorMessages[type];
};
