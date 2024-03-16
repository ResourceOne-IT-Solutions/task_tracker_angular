import { createReducer, on } from '@ngrx/store';
import {
  EmptyChatRequests,
  chatRequests,
  delete_user_client,
  loadTable,
  loadTableSuccess,
  loadTicketsSuccess,
  loadUpdateSuccess,
  loadUserData,
  startLoading,
  stopLoading,
  ticketClosed,
} from './table.actions';
import { Task } from '../interface/tickets';
import { state } from '@angular/animations';
import { User } from '../interface/users';

export interface UserState {
  isLoading: boolean;
  tableConfig: { data: any; columns: any };
  userList: User[];
  ticketsData: Task[];
  chatRequestData: any[];
  updateData: any;
}

export const initialState: UserState = {
  isLoading: false,
  tableConfig: { data: [], columns: [] },
  userList: [],
  ticketsData: [],
  chatRequestData: [],
  updateData: {},
};

export const ticketsRuducer = createReducer(
  initialState,
  on(loadTable, (state, { params }) => ({
    ...state,
    tableConfig: { data: [], columns: [] },
  })),
  on(loadTableSuccess, (state, { data, columns }) => ({
    ...state,
    tableConfig: { data, columns },
  })),
  on(loadUserData, (state, { userList }) => ({
    ...state,
    userList,
  })),
  on(loadTicketsSuccess, (state, { ticketsData }) => ({
    ...state,
    ticketsData,
  })),
  on(chatRequests, (state, { chatRequest }) => ({
    ...state,
    chatRequestData: [...state.chatRequestData, chatRequest],
  })),
  on(EmptyChatRequests, (state) => ({
    ...state,
    chatRequestData: [],
  })),
  on(startLoading, (state) => ({ ...state, isLoading: true })),
  on(stopLoading, (state) => ({ ...state, isLoading: false })),
  on(delete_user_client, (state, { element }) => ({
    ...state,
    tableConfig: {
      data: state.tableConfig.data.filter(
        (val: any) => val._id !== element._id,
      ),
      columns: state.tableConfig.columns,
    },
  })),
  on(loadUpdateSuccess, (state, { element }) => ({
    ...state,
    updateData: element,
  })),
);
