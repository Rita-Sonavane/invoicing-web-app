import { createAction, props } from '@ngrx/store';
import { Client } from '../../interfaces/client';


// Action to trigger fetching the current user
export const loadClient = createAction('[Client] Load Client');

// Success action for when the client is successfully loaded
export const setClientSuccess = createAction(
  '[Client] Set Client Success',
  props<{ client: Client }>()
);

// Failure action for when the client fails to load
export const setClientFailure = createAction(
  '[Client] Set Client Failure',
  props<{ error: any }>()
);
