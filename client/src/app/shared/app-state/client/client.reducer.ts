import { createReducer, on } from '@ngrx/store';
import { setClientSuccess, setClientFailure } from './client.actions';
import { Client } from '../../interfaces/client';

export const initialState: Client = {
  _id: '',
  name: '',
  email: '',
  password: '',
  confirmpassword: ''
};

export const clientReducer = createReducer(
  initialState,
  on(setClientSuccess, (state, { client }) => ({ ...state, ...client })),
  on(setClientFailure, (state, { error }) => {
    console.error('Client loading failed:', error);
    return state;
  })
);
