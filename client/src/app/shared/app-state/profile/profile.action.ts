import { createAction, props } from "@ngrx/store"
import { Profile } from "../../interfaces/profile";


export const loadProfile = createAction(
    '[Profile] Load Profile',
    props<{ id: string }>()
);

export const loadProfileSuccess = createAction(
    '[Profile] Load Profile Success',
    props<{ profile: Profile }>()
);


export const loadProfileFailure = createAction(
    '[Profile] Load Profile Failure',
    props<{ error: any }>()
);



