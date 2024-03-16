import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ChatService } from '../services/chat.service';
import {
  loadDeleteApi,
  loadTable,
  loadTableSuccess,
  loadTickets,
  loadTicketsSuccess,
  openDialog,
} from './table.actions';
import { map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../reusable/dialog-info/dialog-info.component';
import {
  Tickets,
  adminTicketColumns,
  clientColumns,
  description,
  footerColumns,
  ticketColumns,
  userColumns,
  userTicketColumns,
} from '../components/userlist/tabledata';

@Injectable()
export class TicketsEffect {
  tableData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTable),
      withLatestFrom(this.chatservice.UserLoginData),
      mergeMap(([{ params }, userId]) => {
        return this.getTableData(params, userId?._id).pipe(
          map(({ data, columns }) => {
            return loadTableSuccess({ data, columns });
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

  openDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openDialog),
        tap(({ message, title }) => {
          this.dialog.open(DialogInfoComponent, {
            data: {
              title: title,
              class: 'info',
              message: message,
              btn1: 'Close',
            },
          });
        }),
      ),
    { dispatch: false },
  );
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
        return this.chatservice.getAllUsers().pipe(
          map((users) => ({
            data: users.filter((user: any) => !user.isAdmin),
            columns: userColumns,
          })),
        );
      case 'helped tickets':
        const columns: any = [...ticketColumns, ...description];
        return this.chatservice
          .get(`/tickets/helped-tickets/${userId}`)
          .pipe(map((res) => ({ data: res, columns })));
      case 'today tickets':
        return this.chatservice.get('/tickets/pending-tickets').pipe(
          map((data) => ({
            data,
            columns: [...Tickets, ...adminTicketColumns],
          })),
        );
      case 'client list':
        return this.chatservice
          .getAllClients()
          .pipe(map((data) => ({ data, columns: clientColumns })));
      case 'user tickets':
        return this.chatservice
          .get(`/tickets/user/pending-tickets/${userId}`)
          .pipe(
            map((data) => ({
              data,
              columns: [
                ...ticketColumns,
                ...footerColumns,
                ...userTicketColumns,
              ],
            })),
          );
      default:
        return of({ data: [], columns: [] });
    }
  }
  constructor(
    private chatservice: ChatService,
    private actions$: Actions,
    private dialog: MatDialog,
  ) {}
}
