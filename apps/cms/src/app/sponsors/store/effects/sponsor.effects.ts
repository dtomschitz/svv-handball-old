import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions } from '@ngrx/effects';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { SponsorsService } from '@svv/cms/sponsors/services';
import { SponsorActions } from '@svv/cms/sponsors/store/actions';

@Injectable()
export class SponsorEffects {
  /**
   * This effect listens to the `createSponsor` action and will try to create a
   * new `Sponsor` based on the payload of the action.
   *
   * In case the `Sponsor` has been created successfully by the respective
   * endpoint in the API, the action `createSponsorSuccess` containg the newly
   * created `Sponsor` will be dispatched. Otherwise if an error occured while
   * creating, the `createSponsorFailure` action gets dispatched.
   */
  createSponsor$ = createGenericEffect(
    this.actions$,
    SponsorActions.createSponsor,
    action => this.sponsorsService.createSponsor(action.sponsor),
    () => ({
      success: sponsor => SponsorActions.createSponsorSuccess({ sponsor }),
      failure: () => SponsorActions.createSponsorFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `updateSponsor` action and will try to update a
   * existing `Sponsor` with the changes stored inside the payload of the action.
   *
   * In case the `Sponsor` has been updated successfully by the respective
   * endpoint in the API, the action `updateSponsorSuccess` containg the update
   * from the `updateSponsor` action will be dispatched. Otherwise if an error
   * occured while updating, the `updateSponsorFailure` action gets dispatched.
   */
  updateSponsor$ = createGenericEffect(
    this.actions$,
    SponsorActions.updateSponsor,
    action => this.sponsorsService.updateSponsor(action.update),
    action => ({
      success: () =>
        SponsorActions.updateSponsorSuccess({ update: action.update }),
      failure: () => SponsorActions.updateSponsorFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `uploadSponsorImage` action and will try to
   * upload the image from the payload of the action.
   *
   * In case the specific `Sponsor` has been updated and the image has been
   * stored successfully on the backend by the respective endpoint in the API,
   * the action `uploadSponsorImageSuccess` containg the received update will be
   * dispatched. Otherwise if an error occured, the `uploadSponsorImageFailure`
   * action gets dispatched.
   */
  uploadSponsorImage$ = createGenericEffect(
    this.actions$,
    SponsorActions.uploadSponsorImage,
    ({ id, image }) => this.sponsorsService.uploadSponsorImage(id, image),
    () => ({
      success: update =>
        SponsorActions.uploadSponsorImageSuccess({
          update,
        }),
      failure: () => SponsorActions.uploadSponsorImageFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteSponsorImage` action and will try to
   * start the deletion process of the `Sponsor` image in the backend.
   *
   * In case the image of the specific `Sponsor` has been deleted by the
   * respective endpoint in the API, the action `deleteSponsorImageSuccess`
   * containg the id from the `deleteSponsorImage` action will be dispatched.
   * Otherwise if an error occured, the `deleteSponsorImageFailure` action
   * gets dispatched.
   */
  deleteSponsorImage$ = createGenericEffect(
    this.actions$,
    SponsorActions.deleteSponsorImage,
    ({ id }) => this.sponsorsService.deleteSponsorImage(id),
    ({ id }) => ({
      success: () =>
        SponsorActions.deleteSponsorImageSuccess({
          update: {
            id,
            changes: {
              img: undefined,
            },
          },
        }),
      failure: () => SponsorActions.deleteSponsorImageFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteSponsor` action and will try to delete a
   * existing `Sponsor` based on the id which stored in the payload of the action.
   *
   * In case the `Sponsor` has been deleted successfully by the respective
   * endpoint in the API, the action `deleteSponsorSuccess` containg the id from
   * the `deleteSponsor` action will be dispatched. Otherwise if an error
   * occured while deleting, the `deleteSponsorFailure` action gets dispatched.
   */
  deleteSponsor$ = createGenericEffect(
    this.actions$,
    SponsorActions.deleteSponsor,
    action => this.sponsorsService.deleteSponsor(action.id),
    action => ({
      success: () => SponsorActions.deleteSponsorSuccess({ id: action.id }),
      failure: () => SponsorActions.deleteSponsorFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private sponsorsService: SponsorsService,
    private toastService: HotToastService,
  ) {}
}
