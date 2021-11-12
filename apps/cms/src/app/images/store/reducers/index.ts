import {
  Action,
  combineReducers,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromRoot from '@svv/cms/reducers';
import * as fromImages from './images.reducer';
import * as fromImageTags from './image-tags.reducer';

/**
 * The global feature key of the `Image` state.
 */
export const featureKey = 'image';

/**
 * Interface used to describe the `Image` state.
 */
export interface ImageState {
  [fromImages.featureKey]: fromImages.State;
  [fromImageTags.featureKey]: fromImageTags.State;
}

export interface State extends fromRoot.State {
  [featureKey]: ImageState;
}

/**
 * Creates an combined reducer function for managing the `Image` feature slice
 * of the root state.
 */
export function reducers(state: ImageState | undefined, action: Action) {
  return combineReducers<ImageState, Action>({
    [fromImages.featureKey]: fromImages.reducer,
    [fromImageTags.featureKey]: fromImageTags.reducer,
  })(state, action);
}

/**
 * Selects the `Image` state.
 */
export const selectArticleState = createFeatureSelector<State, ImageState>(
  featureKey,
);

/**
 * Selects the `Images` state.
 */
export const selectImagesState = createSelector(
  selectArticleState,
  state => state[fromImages.featureKey],
);

/**
 * Selects the `Image Tags` state.
 */
export const selectImageTagsState = createSelector(
  selectArticleState,
  state => state[fromImageTags.featureKey],
);

// Images

/**
 * Selects all `Images` and sorts them by their date.
 */
export const selectAllImages = createSelector(
  selectImagesState,
  fromImages.selectAllImages,
);

/**
 * Selects all `Images` and returns them as an dictionary.
 */
export const selectArticleEntities = createSelector(
  selectImagesState,
  fromImages.selectImageEntities,
);

/**
 * Selects all `Images` by their type.
 */
export const selectAllImagesByType = createSelector(
  selectImagesState,
  fromImages.selectAllImagesByType,
);

/**
 * Selects all titles of the stored `Images`.
 */
export const selectAllImageNames = createSelector(
  selectImagesState,
  fromImages.selectAllImageNames,
);

/**
 * Selects the loading property of the `Images` state which shows if an loading
 * process is ongoing or not.
 */
export const selectIsImagesLoading = createSelector(
  selectImagesState,
  fromImages.selectIsLoading,
);

/**
 * Selects the loaded property of the `Images` state which shows if the
 * `Images` have been loaded or not.
 */
export const selectIsImagesLoaded = createSelector(
  selectImagesState,
  fromImages.selectIsLoaded,
);

// Image Tags

/**
 * Selects all `Image Tags`.
 */
export const selectAllImageTags = createSelector(
  selectImageTagsState,
  fromImageTags.selectAllImageTags,
);

/**
 * Selects all names of the stored `Image Tags`.
 */
export const selectAllImageTagNames = createSelector(
  selectImageTagsState,
  fromImageTags.selectAllImageTagNames,
);

/**
 * Selects all `Image Tags` if they are tagged as seaons specific tags.
 */
export const selectAllSeasonTags = createSelector(
  selectImageTagsState,
  fromImageTags.selectAllSeasonTags,
);

/**
 * Selects the loading property of the `Image Tags` state which shows if an
 * loading process is ongoing or not.
 */
export const selectIsImageTagsLoading = createSelector(
  selectImageTagsState,
  fromImageTags.selectIsLoading,
);

/**
 * Selects the loaded property of the `Image Tags` state which shows if the
 * `Image Tags` have been loaded or not.
 */
export const selectIsImageTagsLoaded = createSelector(
  selectImageTagsState,
  fromImageTags.selectIsLoaded,
);
