import cronstrue from 'cronstrue/i18n';
import {
  genders,
  teamTypes,
  cachingTypes,
  CronExpression,
  contactPersonTypes,
  imageSizes,
} from '@svv/core/models';

/**
 * @returns A list of all image sizes.
 */
export const getImageSizes = () => {
  return imageSizes;
};

/**
 * @returns A list of all gender types.
 */
export const getGenders = () => {
  return genders;
};

/**
 * @returns A list of all `Team` types.
 */
export const getTeamTypes = () => {
  return teamTypes;
};

/**
 * @returns A list of all `Contact Person` types.
 */
export const getContactPersonTypes = () => {
  return contactPersonTypes;
};

/**
 * @returns A list of all caching types.
 */
export const getCachingTypes = () => {
  return cachingTypes;
};

/**
 * @returns A list of all selactable cron expressions.
 */
export const getCronExpressions = () => {
  return Object.values(CronExpression).map(key => ({
    key,
    text: cronstrue.toString(key, { locale: 'de' }),
  }));
};
