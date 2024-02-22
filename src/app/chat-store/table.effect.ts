import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ChatService } from '../services/chat.service';
import {
  loadDeleteApi,
  loadTable,
  loadTableSuccess,
  loadTickets,
  loadTicketsSuccess,
  loadUserApi,
  loadUserApiSuccess,
  openDialog,
} from './table.actions';
import { combineLatest, filter, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../reusable/dialog-info/dialog-info.component';

@Injectable()
export class TicketsEffect {
  tableData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTable),
      withLatestFrom(this.chatservice.UserLoginData),
      mergeMap(([{ params }, userId]) => {
        return this.getTableData(params, userId?._id).pipe(
          map((tableData: any) => {
            return loadTableSuccess({ tableData });
          }),
        );
      }),
    ),
  );

  loadDeleteCall$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDeleteApi),
      mergeMap(({ data }) => {
        return this.deleteCall(data).pipe(
          map((ticketsData: any) => {
            return loadTicketsSuccess({ ticketsData });
          }),
        );
      }),
    ),
  );
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserApi),
      mergeMap(({ httpOptions }) => {
        return this.chatservice.getLoginSetup(httpOptions).pipe(
          map((user: any) => {
            this.chatservice.UserLogin(user);
            return loadUserApiSuccess({ userLoginData: user });
          }),
        );
      }),
    ),
  );
  loadTickets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTickets),
      withLatestFrom(this.chatservice.UserLoginData),
      mergeMap(([{ params }, userDetails]) => {
        return this.getTickes(params, userDetails).pipe(
          map((ticketsData: any) => {
            return loadTicketsSuccess({ ticketsData });
          }),
        );
      }),
    ),
  );

  private deleteCall(data: any) {
    return of([[]]);
  }
  openDialog$ = createEffect(() => this.actions$.pipe(
    ofType(openDialog),
    tap(({ message , title }) => {
      this.dialog.open(DialogInfoComponent, {
        data: {
          title: title,
          class: 'info',
          message: message,
          btn1: 'Close',
        },
      });
    })
  ), { dispatch: false });
  private getTickes(params: any, userDetails: any) {
    if (!userDetails.isAdmin && !params) {
      return this.chatservice.get(`/tickets/user/${userDetails._id}`);
    } else if (params) {
      return this.chatservice.get(`/tickets/client/${params}`);
    } else {
      return this.chatservice.get(`/tickets`);
    }
  }
  private getTableData(params: string | undefined, userId: string | undefined) {
    switch (params) {
      case 'user list':
        return this.chatservice
          .getAllUsers()
          .pipe(map((users) => users.filter((user: any) => !user.isAdmin)));
      case 'helped tickets':
        return this.chatservice.get(`/tickets/helped-tickets/${userId}`);
      case 'today tickets':
        return this.chatservice.get('/tickets/pending-tickets');
      case 'client list':
        return this.chatservice.getAllClients();
      case 'user tickets':
        return this.chatservice.get(`/tickets/user/pending-tickets/${userId}`);
      default:
        return of([]);
    }
  }
  constructor(
    private chatservice: ChatService,
    private actions$: Actions,
    private dialog : MatDialog
  ) {}
}
