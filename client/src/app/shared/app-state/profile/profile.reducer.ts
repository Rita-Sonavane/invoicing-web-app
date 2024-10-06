import { createReducer, on } from "@ngrx/store";
import { Profile } from "../../interfaces/profile";
import { loadProfileFailure, loadProfileSuccess } from "./profile.action";


export const initialState: Profile = {
    name: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    contactAddress: "",
    logo: "",
    website: ""
};

export const profileReducer = createReducer(
    initialState,
    on(loadProfileSuccess, (state, { profile }) => ({ ...state, ...profile })),
    on(loadProfileFailure, (state, { error }) => {
        console.error('Profile loading failed:', error);
        return state;
    })
);
