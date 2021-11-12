import { NotificationType, ErrorType } from '@svv/core/models';
import {
  CREATE_USER,
  CREATE_USER_SUCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER,
  UPDATE_USER_SUCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER,
  DELETE_USER_SUCESS,
  DELETE_USER_FAILURE,
} from '@svv/cms/users/store/actions';
import {
  CREATE_SPONSOR,
  CREATE_SPONSOR_SUCCESS,
  CREATE_SPONSOR_FAILURE,
  UPDATE_SPONSOR,
  UPDATE_SPONSOR_SUCCESS,
  UPDATE_SPONSOR_FAILURE,
  UPLOAD_SPONSOR_IMAGE,
  UPLOAD_SPONSOR_IMAGE_SUCCESS,
  UPLOAD_SPONSOR_IMAGE_FAILURE,
  DELETE_SPONSOR,
  DELETE_SPONSOR_SUCCESS,
  DELETE_SPONSOR_FAILURE,
  SORT_SPONSORS,
  SORT_SPONSORS_SUCCESS,
  SORT_SPONSORS_FAILURE,
  DELETE_SPONSOR_IMAGE,
  DELETE_SPONSOR_IMAGE_SUCCESS,
  DELETE_SPONSOR_IMAGE_FAILURE,
} from '@svv/cms/sponsors/store/actions';
import {
  CREATE_TEAM,
  CREATE_TEAM_SUCCESS,
  CREATE_TEAM_FAILURE,
  UPDATE_TEAM,
  UPDATE_TEAM_SUCCESS,
  UPDATE_TEAM_FAILURE,
  UPLOAD_TEAM_IMAGE,
  UPLOAD_TEAM_IMAGE_SUCCESS,
  UPLOAD_TEAM_IMAGE_FAILURE,
  DELETE_TEAM_IMAGE,
  DELETE_TEAM_IMAGE_SUCCESS,
  DELETE_TEAM_IMAGE_FAILURE,
  DELETE_TEAM,
  DELETE_TEAM_SUCCESS,
  DELETE_TEAM_FAILURE,
  SORT_TEAMS,
  SORT_TEAMS_SUCCESS,
  SORT_TEAMS_FAILURE,
} from '@svv/cms/teams/store/actions';
import {
  DELETE_CLASSES,
  DELETE_CLASSES_FAILURE,
  DELETE_CLASSES_SUCCESS,
  DELETE_GAMES,
  DELETE_GAMES_FAILURE,
  DELETE_GAMES_SUCCESS,
  CREATE_JOB,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_FAILURE,
  UPDATE_JOB,
  UPDATE_JOB_SUCCESS,
  UPDATE_JOB_FAILURE,
  DELETE_JOB,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_FAILURE,
  DELETE_TABLES,
  DELETE_TABLES_SUCCESS,
  DELETE_TABLES_FAILURE,
  DELETE_WEEKS,
  DELETE_WEEKS_SUCCESS,
  DELETE_WEEKS_FAILURE,
} from '@svv/cms/hvw/store/actions';
import {
  CREATE_CONTACT_PERSON,
  CREATE_CONTACT_PERSON_FAILURE,
  CREATE_CONTACT_PERSON_SUCCESS,
  DELETE_CONTACT_PERSON,
  DELETE_CONTACT_PERSON_FAILURE,
  DELETE_CONTACT_PERSON_SUCCESS,
  UPDATE_CONTACT_PERSON,
  SORT_CONTACT_PERSONS,
  SORT_CONTACT_PERSONS_FAILURE,
  SORT_CONTACT_PERSONS_SUCCESS,
  UPDATE_CONTACT_PERSON_FAILURE,
  UPDATE_CONTACT_PERSON_SUCCESS,
  CREATE_CONTACT_PERSON_CATEGORY,
  CREATE_CONTACT_PERSON_CATEGORY_SUCCESS,
  CREATE_CONTACT_PERSON_CATEGORY_FAILURE,
  UPDATE_CONTACT_PERSON_CATEGORY,
  UPDATE_CONTACT_PERSON_CATEGORY_SUCCESS,
  UPDATE_CONTACT_PERSON_CATEGORY_FAILURE,
  DELETE_CONTACT_PERSON_CATEGORY,
  DELETE_CONTACT_PERSON_CATEGORY_SUCCESS,
  DELETE_CONTACT_PERSON_CATEGORY_FAILURE,
  SORT_CONTACT_PERSON_CATEGORIES,
  SORT_CONTACT_PERSON_CATEGORIES_SUCCESS,
  SORT_CONTACT_PERSON_CATEGORIES_FAILURE,
} from '../contact-persons/store/actions';
import {
  CREATE_ARTICLE,
  CREATE_ARTICLE_FAILURE,
  CREATE_ARTICLE_SUCCESS,
  CREATE_CATEGORY,
  CREATE_CATEGORY_FAILURE,
  CREATE_CATEGORY_SUCCESS,
  DELETE_ARTICLE,
  DELETE_ARTICLE_FAILURE,
  DELETE_ARTICLE_SUCCESS,
  DELETE_CATEGORY,
  DELETE_CATEGORY_FAILURE,
  DELETE_CATEGORY_SUCCESS,
  UPDATE_ARTICLE,
  UPDATE_ARTICLE_FAILURE,
  UPDATE_ARTICLE_SUCCESS,
  UPDATE_CATEGORY,
  UPDATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_SUCCESS,
} from '../articles/store/actions';

type Type = 'inital' | 'success' | 'failure';
type Method = 'create' | 'update' | 'delete';

const methodWords: { [key in Method]: string } = {
  create: 'erstellt',
  update: 'aktualisiert',
  delete: 'gelöscht',
};

const buildCreateActionMessage = (object: string, singular = true) => {
  return createMessage('inital', object, 'create', singular);
};

const buildCreateSuccessActionMessage = (object: string, singular = true) => {
  return createMessage('success', object, 'create', singular);
};

const buildCreateFailureActionMessage = (object: string, singular = true) => {
  return createMessage('failure', object, 'create', singular);
};

const buildUpdateActionMessage = (object: string, singular = true) => {
  return createMessage('inital', object, 'update', singular);
};

const buildUpdateSuccessActionMessage = (object: string, singular = true) => {
  return createMessage('success', object, 'update', singular);
};

const buildUpdateFailureActionMessage = (object: string, singular = true) => {
  return createMessage('failure', object, 'update', singular);
};

const buildDeleteActionMessage = (object: string, singular = true) => {
  return createMessage('inital', object, 'delete', singular);
};

const buildDeleteSuccessActionMessage = (object: string, singular = true) => {
  return createMessage('success', object, 'delete', singular);
};

const buildDeleteFailureActionMessage = (object: string, singular = true) => {
  return createMessage('failure', object, 'delete', singular);
};

const createMessage = (
  type: Type,
  object: string,
  method: Method,
  singular = true,
) => {
  if (type === 'inital') {
    return `${object} ${singular ? 'wird' : 'werden'} ${methodWords[method]}`;
  } else if (type === 'failure') {
    return `${object} ${singular ? 'konnte' : 'konnten'} nicht ${
      methodWords[method]
    } werden`;
  } else {
    return `${object} ${singular ? 'wurde' : 'wurden'} ${methodWords[method]}`;
  }
};

export const notifications: {
  [key in ErrorType | string]:
    | string
    | { message: string; type: NotificationType };
} = {
  // Article Notifications
  [CREATE_ARTICLE]: buildCreateActionMessage('Bericht'),
  [CREATE_ARTICLE_SUCCESS]: buildCreateSuccessActionMessage('Bericht'),
  [CREATE_ARTICLE_FAILURE]: buildCreateFailureActionMessage('Bericht'),
  [UPDATE_ARTICLE]: buildUpdateActionMessage('Bericht'),
  [UPDATE_ARTICLE_SUCCESS]: buildUpdateSuccessActionMessage('Bericht'),
  [UPDATE_ARTICLE_FAILURE]: buildUpdateFailureActionMessage('Bericht'),
  [DELETE_ARTICLE]: buildDeleteActionMessage('Bericht'),
  [DELETE_ARTICLE_SUCCESS]: buildDeleteSuccessActionMessage('Bericht'),
  [DELETE_ARTICLE_FAILURE]: buildDeleteFailureActionMessage('Bericht'),
  // Article Category Notifications
  [CREATE_CATEGORY]: buildCreateActionMessage('Kategorie'),
  [CREATE_CATEGORY_SUCCESS]: buildCreateSuccessActionMessage('Kategorie'),
  [CREATE_CATEGORY_FAILURE]: buildCreateFailureActionMessage('Kategorie'),
  [UPDATE_CATEGORY]: buildUpdateActionMessage('Kategorie'),
  [UPDATE_CATEGORY_SUCCESS]: buildUpdateSuccessActionMessage('Kategorie'),
  [UPDATE_CATEGORY_FAILURE]: buildUpdateFailureActionMessage('Kategorie'),
  [DELETE_CATEGORY]: buildDeleteActionMessage('Kategorie'),
  [DELETE_CATEGORY_SUCCESS]: buildDeleteSuccessActionMessage('Kategorie'),
  [DELETE_CATEGORY_FAILURE]: buildDeleteFailureActionMessage('Kategorie'),

  // Conctact Persons Notifications
  [CREATE_CONTACT_PERSON]: buildCreateActionMessage('Ansprechpartner'),
  [CREATE_CONTACT_PERSON_SUCCESS]: buildCreateSuccessActionMessage(
    'Ansprechpartner',
  ),
  [CREATE_CONTACT_PERSON_FAILURE]: buildCreateFailureActionMessage(
    'Ansprechpartner',
  ),
  [UPDATE_CONTACT_PERSON]: buildUpdateActionMessage('Ansprechpartner'),
  [UPDATE_CONTACT_PERSON_SUCCESS]: buildUpdateSuccessActionMessage(
    'Ansprechpartner',
  ),
  [UPDATE_CONTACT_PERSON_FAILURE]: buildUpdateFailureActionMessage(
    'Ansprechpartner',
  ),
  [DELETE_CONTACT_PERSON]: buildDeleteActionMessage('Ansprechpartner'),
  [DELETE_CONTACT_PERSON_SUCCESS]: buildDeleteSuccessActionMessage(
    'Ansprechpartner',
  ),
  [DELETE_CONTACT_PERSON_FAILURE]: buildDeleteFailureActionMessage(
    'Ansprechpartner',
  ),
  [SORT_CONTACT_PERSONS]: 'Sortierung wird geändert',
  [SORT_CONTACT_PERSONS_SUCCESS]: 'Sortierung wurde geändert',
  [SORT_CONTACT_PERSONS_FAILURE]: 'Sortierung konnte nicht geändert werden',

  // Conctact Person Categories Notifications
  [CREATE_CONTACT_PERSON_CATEGORY]: buildCreateActionMessage(
    'Ansprechpartnerkategorie',
  ),
  [CREATE_CONTACT_PERSON_CATEGORY_SUCCESS]: buildCreateSuccessActionMessage(
    'Ansprechpartnerkategorie',
  ),
  [CREATE_CONTACT_PERSON_CATEGORY_FAILURE]: buildCreateFailureActionMessage(
    'Ansprechpartnerkategorie',
  ),
  [UPDATE_CONTACT_PERSON_CATEGORY]: buildUpdateActionMessage(
    'Ansprechpartnerkategorie',
  ),
  [UPDATE_CONTACT_PERSON_CATEGORY_SUCCESS]: buildUpdateSuccessActionMessage(
    'Ansprechpartnerkategorie',
  ),
  [UPDATE_CONTACT_PERSON_CATEGORY_FAILURE]: buildUpdateFailureActionMessage(
    'Ansprechpartnerkategorie',
  ),
  [DELETE_CONTACT_PERSON_CATEGORY]: buildDeleteActionMessage(
    'Ansprechpartnerkategorie',
  ),
  [DELETE_CONTACT_PERSON_CATEGORY_SUCCESS]: buildDeleteSuccessActionMessage(
    'Ansprechpartnerkategorie',
  ),
  [DELETE_CONTACT_PERSON_CATEGORY_FAILURE]: buildDeleteFailureActionMessage(
    'Ansprechpartnerkategorie',
  ),
  [SORT_CONTACT_PERSON_CATEGORIES]: 'Sortierung wird geändert',
  [SORT_CONTACT_PERSON_CATEGORIES_SUCCESS]: 'Sortierung wurde geändert',
  [SORT_CONTACT_PERSON_CATEGORIES_FAILURE]:
    'Sortierung konnte nicht geändert werden',

  // User Notifications
  [CREATE_USER]: buildCreateActionMessage('Nutzer'),
  [CREATE_USER_SUCESS]: buildCreateSuccessActionMessage('Nutzer'),
  [CREATE_USER_FAILURE]: buildCreateFailureActionMessage('Nutzer'),
  [UPDATE_USER]: buildUpdateActionMessage('Nutzer'),
  [UPDATE_USER_SUCESS]: buildUpdateSuccessActionMessage('Nutzer'),
  [UPDATE_USER_FAILURE]: buildUpdateFailureActionMessage('Nutzer'),
  [DELETE_USER]: buildDeleteActionMessage('Nutzer'),
  [DELETE_USER_SUCESS]: buildDeleteSuccessActionMessage('Nutzer'),
  [DELETE_USER_FAILURE]: buildDeleteFailureActionMessage('Nutzer'),

  // Sponsor Notifications
  [CREATE_SPONSOR]: buildCreateActionMessage('Sponsor'),
  [CREATE_SPONSOR_SUCCESS]: buildCreateSuccessActionMessage('Sponsor'),
  [CREATE_SPONSOR_FAILURE]: buildCreateFailureActionMessage('Sponsor'),
  [UPDATE_SPONSOR]: buildUpdateActionMessage('Sponsor'),
  [UPDATE_SPONSOR_SUCCESS]: buildUpdateSuccessActionMessage('Sponsor'),
  [UPDATE_SPONSOR_FAILURE]: buildUpdateFailureActionMessage('Sponsor'),
  [UPLOAD_SPONSOR_IMAGE]: 'Bild wird hochgeladen',
  [UPLOAD_SPONSOR_IMAGE_SUCCESS]: 'Bild wurde hochgeladen',
  [UPLOAD_SPONSOR_IMAGE_FAILURE]: 'Bild wurde nicht hochgeladen',
  [DELETE_SPONSOR]: buildDeleteActionMessage('Sponsor'),
  [DELETE_SPONSOR_SUCCESS]: buildDeleteSuccessActionMessage('Sponsor'),
  [DELETE_SPONSOR_FAILURE]: buildDeleteFailureActionMessage('Sponsor'),
  [DELETE_SPONSOR_IMAGE]: buildDeleteActionMessage('Bild'),
  [DELETE_SPONSOR_IMAGE_SUCCESS]: buildDeleteSuccessActionMessage('Bild'),
  [DELETE_SPONSOR_IMAGE_FAILURE]: buildDeleteFailureActionMessage('Bild'),
  [SORT_SPONSORS]: 'Sortierung wird geändert',
  [SORT_SPONSORS_SUCCESS]: 'Sortierung wurde geändert',
  [SORT_SPONSORS_FAILURE]: 'Sortierung konnte nicht geändert werden',

  // Team Notifications
  [CREATE_TEAM]: buildCreateActionMessage('Mannschaft'),
  [CREATE_TEAM_SUCCESS]: buildCreateSuccessActionMessage('Mannschaft'),
  [CREATE_TEAM_FAILURE]: buildCreateFailureActionMessage('Mannschaft'),
  [UPDATE_TEAM]: buildUpdateActionMessage('Mannschaft'),
  [UPDATE_TEAM_SUCCESS]: buildUpdateSuccessActionMessage('Mannschaft'),
  [UPDATE_TEAM_FAILURE]: buildUpdateFailureActionMessage('Mannschaft'),
  [UPLOAD_TEAM_IMAGE]: 'Bild wird hochgeladen',
  [UPLOAD_TEAM_IMAGE_SUCCESS]: 'Bild wurde hochgeladen',
  [UPLOAD_TEAM_IMAGE_FAILURE]: 'Bild wurde nicht hochgeladen',
  [DELETE_TEAM]: buildDeleteActionMessage('Mannschaft'),
  [DELETE_TEAM_SUCCESS]: buildDeleteSuccessActionMessage('Mannschaft'),
  [DELETE_TEAM_FAILURE]: buildDeleteFailureActionMessage('Mannschaft'),
  [DELETE_TEAM_IMAGE]: buildDeleteActionMessage('Bild'),
  [DELETE_TEAM_IMAGE_SUCCESS]: buildDeleteSuccessActionMessage('Bild'),
  [DELETE_TEAM_IMAGE_FAILURE]: buildDeleteFailureActionMessage('Bild'),
  [SORT_TEAMS]: 'Sortierung wird geändert',
  [SORT_TEAMS_SUCCESS]: 'Sortierung wurde geändert',
  [SORT_TEAMS_FAILURE]: 'Sortierung konnte nicht geändert werden',

  // HVW Notifications
  [DELETE_CLASSES]: buildDeleteSuccessActionMessage('Spieleklassen', false),
  [DELETE_CLASSES_SUCCESS]: buildDeleteSuccessActionMessage(
    'Spieleklassen',
    false,
  ),
  [DELETE_CLASSES_FAILURE]: buildDeleteFailureActionMessage(
    'Spieleklassen',
    false,
  ),
  [DELETE_GAMES]: buildDeleteActionMessage('Spiele', false),
  [DELETE_GAMES_SUCCESS]: buildDeleteSuccessActionMessage('Spiele', false),
  [DELETE_GAMES_FAILURE]: buildDeleteFailureActionMessage('Spiele', false),
  [CREATE_JOB]: buildCreateActionMessage('CronJob'),
  [CREATE_JOB_SUCCESS]: buildCreateSuccessActionMessage('CronJob'),
  [CREATE_JOB_FAILURE]: buildCreateFailureActionMessage('CronJob'),
  [UPDATE_JOB]: buildUpdateActionMessage('CronJob'),
  [UPDATE_JOB_SUCCESS]: buildUpdateSuccessActionMessage('CronJob'),
  [UPDATE_JOB_FAILURE]: buildUpdateFailureActionMessage('CronJob'),
  [DELETE_JOB]: buildDeleteActionMessage('CronJob'),
  [DELETE_JOB_SUCCESS]: buildDeleteSuccessActionMessage('CronJob'),
  [DELETE_JOB_FAILURE]: buildDeleteFailureActionMessage('CronJob'),
  [DELETE_TABLES]: buildDeleteActionMessage('Tabellen', false),
  [DELETE_TABLES_SUCCESS]: buildDeleteSuccessActionMessage('Tabellen', false),
  [DELETE_TABLES_FAILURE]: buildDeleteFailureActionMessage('Tabellen', false),
  [DELETE_WEEKS]: buildDeleteActionMessage('Spielewochen', false),
  [DELETE_WEEKS_SUCCESS]: buildDeleteSuccessActionMessage(
    'Spielewochen',
    false,
  ),
  [DELETE_WEEKS_FAILURE]: buildDeleteFailureActionMessage(
    'Spielewochen',
    false,
  ),
};

export const getDefaultNotification = (key: string) => {
  return notifications[key];
};
