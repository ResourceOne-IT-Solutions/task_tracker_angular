import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ChatService } from '../services/chat.service';
import {
  loadTable,
  loadTableSuccess,
  loadTickets,
  loadTicketsSuccess,
} from './table.actions';
import { combineLatest, filter, map, mergeMap, of, withLatestFrom } from 'rxjs';

@Injectable()
export class TicketsEffect {
  tableData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTable),
      mergeMap(({ params, userId }) => {
        return this.getTableData(params, userId).pipe(
          map((tableData: any) => {
            console.log(params, userId, tableData, 'data');
            return loadTableSuccess({ tableData });
          }),
        );
      }),
    ),
  );

  // loadTickets$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(loadTickets),
  //     mergeMap(({ params }) => {
  // return this.getTickes(params).pipe(
  //   map((ticketsData: any) => {
  //     return loadTicketsSuccess({ ticketsData });
  //   }),
  // );
  //     }),
  //   ),
  // );

  loadTickets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTickets),
      withLatestFrom(this.chatservice.UserLoginData),
      mergeMap(([{ params }, userDetails]) => {
        console.log(params, userDetails, 'tickets effect')
        return this.getTickes(params, userDetails).pipe(
          map((ticketsData: any) => {
            console.log('api data', ticketsData)
            return loadTicketsSuccess({ ticketsData });
          }),
        );
      })
    ),

  )

  private getTickes(params: any, userDetails: any) {
    console.log(params, userDetails, 'get tickets')
    if (!userDetails.isAdmin && !params) {
      return this.chatservice.get(`/tickets/user/${userDetails._id}`);
    } else if (params) {
      console.log('helloo')
      return this.chatservice.get(`/tickets/client/${params}`);
    } else {
      return this.chatservice.get(`/tickets`);
    }
  }
  private getTableData(params: string | undefined, userId: string) {
    switch (params) {
      case 'user list':
        return this.chatservice.getAllUsers();
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
  ) { }
}
