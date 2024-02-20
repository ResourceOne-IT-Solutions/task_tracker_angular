import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './table.reducer';

const featureState = createFeatureSelector<UserState>('tickets');
export const getTableData = createSelector(
  featureState,
  (state) => state.tableData,
);

export const getUserData = createSelector(
  featureState,
  (state) => state.userList,
);
export const getTicketsData = createSelector(
  featureState,
  (state) => state.ticketsData,
);

export const getChatRequests = createSelector(
  featureState,
  (state) => state.chatRequestData,
);
export const isLoading = createSelector(
  featureState,
  (state) => state.isLoading,
);
