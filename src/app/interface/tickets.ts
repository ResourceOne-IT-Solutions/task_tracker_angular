interface Client {
  name: string;
  mobile: string;
  id: string;
  email: string;
}

interface User {
  name: string;
  id: string;
}

interface CreatedBy {
  name: string;
  id: string;
}

interface AddOnResource {
  name: string;
  id: string;
}

export interface Task {
  client: Client;
  user: User;
  createdBy: CreatedBy;
  _id: string;
  technology: string;
  addOnResource: AddOnResource[];
  description: string;
  comments: string;
  status: string;
  receivedDate: string;
  assignedDate: string;
  closedDate: string | null;
  targetDate: string;
  conversation: any[]; // assuming this can be any type of array
  isClosed: boolean;
  updates: any[]; // assuming this can be any type of array
  createdAt: string;
  updatedAt: string;
  __v: number;
}
