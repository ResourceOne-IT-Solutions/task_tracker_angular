import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ChatService } from '../services/chat.service';
import {
  ApiErrror,
  complete,
  loadDeleteApi,
  openDialog,
  delete_user_client,
  raiseTicket,
  loadUpdateUser,
  loadUpdateSuccess,
  loadUpdateTicketApi,
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
            return complete();
          }),
        );
      }),
    ),
  );

  riseTicket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(raiseTicket),
        tap(({ user, content }) => {
          const raisePayload = {
            sender: {
              name: this.chatservice.getFullName(user),
              id: user._id,
            },
            content,
          };
          this.chatservice.sendSocketData({
            key: 'raiseTicket',
            data: raisePayload,
          });
        }),
      ),
    { dispatch: false },
  );

  loadUpdateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUpdateUser),
      mergeMap(({ formData, user }) => {
        const Data = {
          firstName: formData.fname,
          lastName: formData.lname,
          email: formData.email,
          mobile: formData.phone,
        };
        const payload = {
          id: user._id,
          data: Data,
        };
        return this.chatservice.UpdateUsers(payload).pipe(
          map((res: any) => {
            this.store.dispatch(
              openDialog({
                message: 'User Update Successfully',
                title: 'User Update',
              }),
            );
            return loadUpdateSuccess({ element: res });
          }),
        );
      }),
    ),
  );
  loadUpdateUserTicket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUpdateTicketApi),
      mergeMap(({ formData, userId, admindetails }) => {
        const ticketpayload = {
          id: userId,
          data: {
            ...formData,
            updatedBy: {
              name: this.chatservice.getFullName(admindetails),
              id: admindetails._id,
            },
          },
        };
        return this.chatservice.put('/tickets/update', ticketpayload).pipe(
          map((res) => {
            this.store.dispatch(
              openDialog({
                message: 'Ticket Update Successfully',
                title: 'Ticket Update',
              }),
            );
            return loadUpdateSuccess({ element: res });
          }),
          catchError((error) => {
            this.store.dispatch(
              openDialog({ message: error.error.error, title: 'Api Error' }),
            );
            ApiErrror({ error: error.error.error });
            return throwError(error);
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
              this.store.dispatch(delete_user_client({ element: data }));
            }),
            catchError((error) => {
              console.log(error, 'error');
              this.store.dispatch(
                openDialog({ message: error.error.error, title: 'Api Error' }),
              );
              ApiErrror({ error });
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
