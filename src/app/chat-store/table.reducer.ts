import { createReducer, on } from '@ngrx/store';
import {
  EmptyChatRequests,
  chatRequests,
  loadTable,
  loadTableSuccess,
  loadTicketsSuccess,
  loadUserData,
  startLoading,
  stopLoading,
} from './table.actions';
import { Task } from '../interface/tickets';
import { state } from '@angular/animations';
import { User } from '../interface/users';

export interface UserState {
  isLoading: boolean;
  tableData: Task[];
  userList: User[];
  ticketsData: Task[];
  chatRequestData: any[];
}

export const initialState: UserState = {
  isLoading: false,
  tableData: [],
  userList: [],
  ticketsData: [],
  chatRequestData: [],
};

export const ticketsRuducer = createReducer(
  initialState,
  on(loadTable, (state, { params }) => ({
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
  on(startLoading, (state) => ({ ...state, isLoading: true })),
  on(stopLoading, (state) => ({ ...state, isLoading: false })),
);
