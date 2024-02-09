export interface Client {
  createdBy: {
    name: string;
    id: string;
  };
  _id: string;
  firstName: string;
  mobile: string;
  email: string;
  location: {
    area: string;
    zone: string;
  };
  technology: string;
  ticketsCount: number;
  companyName: string;
  applicationType: string;
  history: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
