import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Client } from '../../interfaces/client';

export const selectClientState = createFeatureSelector<Client>('client');

export const selectClient = createSelector(
    selectClientState,
    (state: Client) => state
);
