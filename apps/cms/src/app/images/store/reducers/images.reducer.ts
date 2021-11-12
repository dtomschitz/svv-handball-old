import { createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Image, ImageType } from '@svv/core/models';
import { ImageActions, ImagesActions } from '@svv/cms/images/store/actions';

/**
 * The global feature key of the `Images` state.
 */
export const featureKey = 'images';

export const adapter = createEntityAdapter<Image>({
  selectId: article => article._id,
});

/**
 * Interface used to describe the `Images` state.
 */
export interface State extends EntityState<Image> {
  loading: boolean;
  loaded: boolean;
}

/**
 * Creates the reducer function for managing the `Images` feature slice of
 * the root state.
 */
export const reducer = createReducer(
  adapter.getInitialState({
    loading: false,
    loaded: false,
  }),
  on(ImagesActions.refreshImages, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(ImagesActions.loadImages, state => ({ ...state, loading: true })),
  on(ImagesActions.loadImagesSuccess, (state, { images }) =>
    adapter.setAll(images, { ...state, loading: false, loaded: true }),
  ),
  on(ImageActions.createImageSuccess, (state, { image }) =>
    adapter.addOne(image, state),
  ),
  on(ImageActions.updateImageSuccess, (state, { update }) =>
    adapter.updateOne(update, state),
  ),
  on(ImageActions.deleteImageSuccess, (state, { id }) =>
    adapter.removeOne(id, state),
  ),
  on(ImagesActions.loadImagesCache, ImagesActions.loadImagesFailure, state => ({
    ...state,
    loading: false,
  })),
);

/**
 * Default selectors for the `Images` state.
 */
export const {
  selectEntities: selectImageEntities,
  selectAll: selectAllImages,
} = adapter.getSelectors();

/**
 * Selects all names of the stored `Images`.
 */
export const selectAllImageNames = createSelector(selectAllImages, images =>
  images.map(image => image.name),
);

/**
 * Selects all `Images` by their type.
 */
export const selectAllImagesByType = createSelector(
  selectAllImages,
  (images: Image[], type: ImageType) =>
    images.filter(image => image.type == type),
);

/**
 * Selects the loading property of the `Images` state which shows if an loading
 * process is ongoing or not.
 *
 * @param state The `Images` state.
 */
export const selectIsLoading = (state: State) => state.loading;

/**
 * Selects the loaded property of the `Images` state which shows if the `Images`
 * have been loaded or not.
 *
 * @param state The `Images` state.
 */
export const selectIsLoaded = (state: State) => state.loaded;
