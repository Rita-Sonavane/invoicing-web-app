import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadProfile, loadProfileFailure, loadProfileSuccess } from "./profile.action";
import { catchError, map, mergeMap, of } from "rxjs";
import { ProfileService } from "src/app/service/profile.service";
import { Profile } from "../../interfaces/profile";


@Injectable()
export class ProfileEffects {
    loadProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadProfile),
            mergeMap((action) =>
                this.profileService.getProfile(action.id).pipe(
                    map((profile: Profile) => loadProfileSuccess({ profile })),
                    catchError((error) => of(loadProfileFailure({ error })))
                )
            )
        )
    );

    constructor(private actions$: Actions, private profileService: ProfileService) {
        console.log("Inside Profile Effect");
    }
}