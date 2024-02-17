import { Data } from '@angular/router';
import { createAction, props } from '@ngrx/store';

export const loadTable = createAction(
  'load table api [Tickets Component]',
  props<{ params: string | undefined; userId: string }>(),
);
export const loadTableSuccess = createAction(
  'load table api success [Tickets Component]',
  props<{ tableData: any }>(),
);

export const loadUserData = createAction(
  'load user api success [dashBoard Component]',
  props<{ userList: any }>(),
);
export const loadTickets = createAction(
  'load tickets api  [Tickets Component]',
  props<{ params: any }>(),
);
export const loadTicketsSuccess = createAction(
  'load tickets api success [Tickets Component]',
  props<{ ticketsData: any }>(),
);
export const chatRequests = createAction(
  'chat request increament [ChatBox Component]',
  props<{ chatRequest: any }>(),
);
export const EmptyChatRequests = createAction(
  'chat request decreament [ChatBox Component]',
);
export const loadDeleteApi = createAction(
  'user list load delete api [UserList Component]',
  props<{ data: any }>(),
);
