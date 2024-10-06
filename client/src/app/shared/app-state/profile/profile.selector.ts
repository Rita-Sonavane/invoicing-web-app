import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Profile } from '../../interfaces/profile';

export const loadProfileState = createFeatureSelector<Profile>('profile');

export const selectProfile = createSelector(
    loadProfileState,
    (state: Profile) => state
);
