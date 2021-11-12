import { createAction, props } from '@ngrx/store';
import { Notification } from '@svv/core/models';

export const showSnackbar = createAction(
  '[Notifications] Show Snackbar',
  props<{ notification: Notification }>(),
);
