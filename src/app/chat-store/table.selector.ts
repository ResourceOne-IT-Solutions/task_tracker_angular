import { createSelector, createFeatureSelector } from '@ngrx/store';

const featureState = createFeatureSelector<any>('tickets');
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
