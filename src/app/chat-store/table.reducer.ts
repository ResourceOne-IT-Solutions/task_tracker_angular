import { createReducer, on } from '@ngrx/store';
import {
  EmptyChatRequests,
  chatRequests,
  loadTable,
  loadTableSuccess,
  loadTicketsSuccess,
  loadUserData,
} from './table.actions';
import { Task } from '../interface/tickets';
import { state } from '@angular/animations';
import { User } from '../interface/users';

export interface UserState {
  tableData: Task[];
  userList: User[];
  ticketsData: Task[];
  chatRequestData: any[];
}

export const initialState: UserState = {
  tableData: [],
  userList: [],
  ticketsData: [],
  chatRequestData: [],
};

export const ticketsRuducer = createReducer(
  initialState,
  on(loadTable, (state, { params, userId }) => ({
    ...state,
    tableData: [],
  })),
  on(loadTableSuccess, (state, { tableData }) => ({
    ...state,
    tableData,
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
);
