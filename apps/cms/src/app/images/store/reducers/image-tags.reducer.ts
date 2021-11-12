import { createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ImageTag } from '@svv/core/models';
import {
  ImageTagActions,
  ImageTagsActions,
} from '@svv/cms/images/store/actions';

/**
 * The global feature key of the `Image Tags` state.
 */
export const featureKey = 'tags';

export const adapter = createEntityAdapter<ImageTag>({
  selectId: article => article._id,
});

/**
 * Interface used to describe the `Image Tags` state.
 */
export interface State extends EntityState<ImageTag> {
  loading: boolean;
  loaded: boolean;
}

/**
 * Creates the reducer function for managing the `Image Tags` feature slice of
 * the root state.
 */
export const reducer = createReducer(
  adapter.getInitialState({
    loading: false,
    loaded: false,
  }),
  on(ImageTagsActions.refreshImageTags, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(ImageTagsActions.loadImageTags, state => ({ ...state, loading: true })),
  on(ImageTagsActions.loadImageTagsSuccess, (state, { tags }) =>
    adapter.setAll(tags, { ...state, loading: false, loaded: true }),
  ),
  on(ImageTagActions.createImageTagSuccess, (state, { tag }) =>
    adapter.addOne(tag, state),
  ),
  on(ImageTagActions.updateImageTagSuccess, (state, { update }) =>
    adapter.updateOne(update, state),
  ),
  on(ImageTagActions.deleteImageTagSuccess, (state, { id }) =>
    adapter.removeOne(id, state),
  ),
  on(
    ImageTagsActions.loadCachedImageTags,
    ImageTagsActions.loadImageTagsFailure,
    state => ({
      ...state,
      loading: false,
    }),
  ),
);

/**
 * Default selectors for the `Image Tags` state.
 */
export const {
  selectEntities: selectImageTagEntities,
  selectAll: selectAllImageTags,
} = adapter.getSelectors();

/**
 * Selects all names of the stored `Image Tags`.
 */
export const selectAllImageTagNames = createSelector(selectAllImageTags, tags =>
  tags.map(tag => tag.name),
);

/**
 * Selects all `Image Tags` if they are tagged as seaons specific tags.
 */
export const selectAllSeasonTags = createSelector(selectAllImageTags, tags =>
  tags.filter(tag => tag.isSeasonTag),
);

/**
 * Selects the loading property of the `Image Tags` state which shows if an
 * loading process is ongoing or not.
 *
 * @param state The `Image Tags` state.
 */
export const selectIsLoading = (state: State) => state.loading;

/**
 * Selects the loaded property of the `Image Tags` state which shows if the
 * `Image Tags` have been loaded or not.
 *
 * @param state The `Image Tags` state.
 */
export const selectIsLoaded = (state: State) => state.loaded;
