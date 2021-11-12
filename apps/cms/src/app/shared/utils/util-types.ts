import { Action, ActionCreator } from '@ngrx/store';
import { FunctionWithParametersType } from '@ngrx/store/src/models';

export type UnpackAction<T> = T extends string
  ? Extract<Action, { type: T }>
  : ReturnType<Extract<T, ActionCreator<string, FunctionWithParametersType<any[], object>>>>;
