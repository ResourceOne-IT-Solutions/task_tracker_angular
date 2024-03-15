import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ChatService } from '../services/chat.service';
import {
  closeTicket,
  loadDeleteApi,
  loadTicketsSuccess,
  openDialog,
  updateTableData,
} from './table.actions';
import {
  EMPTY,
  Observable,
  catchError,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogModelComponent } from '../reusable/dialog-model/dialog-model.component';
import { Store } from '@ngrx/store';

@Injectable()
export class UserListEffects {
  loadDeleteCall$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDeleteApi),
      mergeMap(({ data, name }) => {
        return this.deleteCall(data, name).pipe(
          map((ticketsData: any) => {
            return loadTicketsSuccess({ ticketsData });
          }),
        );
      }),
    ),
  );
  private deleteCall(data: any, name: any): Observable<any> {
    const dialogRef = this.dialog.open(DialogModelComponent, {
      data: {
        message: `Are you sure you want to delete this ${name}?`,
        btn1: 'Yes',
        btn2: 'No',
      },
    });

    return dialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (result) {
          return this.chatservice.delete(`/${name}s/${data._id}`).pipe(
            tap(() => {
              this.store.dispatch(
                openDialog({
                  message: `${name} Deleted Successfully`,
                  title: `${name} deleted`,
                }),
              );
              this.store.dispatch(updateTableData({ element: data }));
            }),
            catchError((error) => {
              console.log(error, 'error');
              this.store.dispatch(
                openDialog({ message: error.error.error, title: 'Api Error' }),
              );
              return throwError(error);
            }),
          );
        } else {
          return EMPTY;
        }
      }),
    );
  }

  constructor(
    private chatservice: ChatService,
    private actions$: Actions,
    private dialog: MatDialog,
    private store: Store,
  ) {}
}
