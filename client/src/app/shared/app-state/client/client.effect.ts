import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { loadClient, setClientSuccess, setClientFailure } from './client.actions';
import { Client } from '../../interfaces/client';
import { AuthService } from 'src/app/service/auth.service';


@Injectable()
export class ClientEffects {
    loadClient$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadClient),
            mergeMap(() =>
                this.clientService.getCurrentUser().pipe(
                    map((client: Client) => setClientSuccess({ client })),
                    catchError((error) => of(setClientFailure({ error })))
                )
            )
        )
    );

    constructor(private actions$: Actions, private clientService: AuthService) { }
}
