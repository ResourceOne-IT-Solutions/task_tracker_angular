import { createAction, props } from '@ngrx/store';
import { Column } from '../components/dash-board/dash-board.component';

// load table data

export const loadTable = createAction(
  'load table api [Tickets Component]',
  props<{ params: string | undefined }>(),
);

export const loadTableSuccess = createAction(
  'load table api success [Tickets Component]',
  props<{ data: any; columns: any }>(),
);

export const loadUserData = createAction(
  'load user api success [dashBoard Component]',
  props<{ userList: any }>(),
);

// tickets api call

export const loadTickets = createAction(
  'load tickets api  [Tickets Component]',
  props<{ params: any }>(),
);
export const loadTicketsSuccess = createAction(
  'load tickets api success [Tickets Component]',
  props<{ ticketsData: any }>(),
);

// chat requests count

export const chatRequests = createAction(
  'chat request increament [ChatBox Component]',
  props<{ chatRequest: any }>(),
);
export const EmptyChatRequests = createAction(
  'chat request decreament [ChatBox Component]',
);

// delete user or client

export const loadDeleteApi = createAction(
  'user list load delete api [UserList Component]',
  props<{ data: any; name: any }>(),
);
export const delete_user_client = createAction(
  'update user client table [UserList Component]',
  props<{ element: any }>(),
);

// close tickets

export const closeTicket = createAction(
  'close ticket [UserList Component]',
  props<{ payload: any }>(),
);
export const ticketClosed = createAction(
  'ticket closed successfully [UserList Component]',
  props<{ element: any }>(),
);

// open dialog component

export const openDialog = createAction(
  'open dialog [DialogInfo Component]',
  props<{ message: any; title: any }>(),
);
// raise Ticket

export const raiseTicket = createAction(
  'raise ticket [UserList component]',
  props<{ user: any; content: any }>(),
);

// loader
export const startLoading = createAction('start loading [App Component]');

export const stopLoading = createAction('stop loading [App Component]');

// update user

export const loadUpdateUser = createAction(
  'load update user [UserList component]',
  props<{ formData: any; user: any }>(),
);
export const loadUpdateSuccess = createAction(
  'load update Success [UserList component]',
  props<{ element: any }>(),
);

// update user ticket

export const loadUpdateTicketApi = createAction(
  'load update user ticket api [UserList Component]',
  props<{ formData: any; userId: any; admindetails: any }>(),
);

// user list api completion

export const complete = createAction('complate [App Component]');
export const ApiErrror = createAction(
  'UserList Api Error [App Component]',
  props<{ error: any }>(),
);
