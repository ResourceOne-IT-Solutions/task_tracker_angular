import { Column } from '../dash-board/dash-board.component';

export const ticketColumns: Array<Column> = [
  {
    columnDef: 'client',
    header: 'client name',
    cell: (element: any) => `${element['client'].name}`,
    isText: true,
  },
  {
    columnDef: 'user',
    header: 'user name',
    cell: (element: any) => `${element['user'].name || '--'}`,
    isText: true,
  },
  {
    columnDef: 'technology',
    header: 'Technology',
    cell: (element: any) => `${element['technology']}`,
    isText: true,
  },
  {
    columnDef: 'receivedDate',
    header: 'received Date',
    cell: (element: any) =>
      element['receivedDate']
        ? `${new Date(element['receivedDate']).toLocaleString()}`
        : '',
    isText: true,
  },
  {
    columnDef: 'assignedDate',
    header: 'assigned Date',
    cell: (element: any) =>
      element['assignedDate']
        ? `${new Date(element['assignedDate']).toLocaleString()}`
        : '',
    isText: true,
  },
  {
    columnDef: 'description',
    header: 'description',
    cell: (element: any) => `${element['description']}`,
    isText: true,
  },
  {
    columnDef: 'comments',
    header: 'comments',
    cell: (element: any) => `${element['comments']}`,
    isText: true,
  },
  {
    columnDef: 'closedDate',
    header: 'closed date',
    cell: (element: any) =>
      element['closedDate']
        ? `${new Date(element['closedDate']).toLocaleString()}`
        : '--',
    isText: true,
  },
  {
    columnDef: 'targetDate',
    header: 'Target Date',
    cell: (element: any) =>
      element['targetDate']
        ? `${new Date(element['targetDate']).toLocaleString()}`
        : '',
    isText: true,
  },

  {
    columnDef: 'status',
    header: 'status',
    cell: (element: any) => `${element['status']}`,
    isText: true,
  },
  {
    columnDef: 'addOnResource',
    header: 'Helped By',
    cell: (element: any) =>
      `${element['addOnResource']?.map((res: any) => res.name)?.toString() || '--'}`,
    isText: true,
  },
];

export const userTicketColumns = [
  {
    columnDef: 'TicketRaised',
    header: 'Ticket Rise',
    cell: (element: any) =>
      element === 'btn1' ? 'Update Ticket' : 'Request ticket',
    isMultiButton: true,
  },
];
export const adminTicketColumns = [
  {
    columnDef: 'assignTicket',
    header: 'assign Ticket',
    cell: (element: any) =>
      element['user']?.name ? 'Add Resource' : 'Assign User',
    isButton: true,
  },
  {
    columnDef: 'Update',
    header: 'update',
    cell: (element: any) => 'Send Mail',
    isButton: true,
  },
  {
    columnDef: 'Closed',
    header: 'Closed',
    cell: (element: any) => (element.isClosed ? 'Closed' : 'Close'),
    isButton: true,
  },
];

export const clientColumns = [
  {
    columnDef: 'firstName',
    header: 'Client Name',
    cell: (element: any) => `${element['firstName']}`,
    // isText: true,
    isMouseOver:true,
  },
  {
    columnDef: 'email',
    header: 'Email',
    cell: (element: any) => `${element['email']}`,
    isText: true,
  },
  {
    columnDef: 'mobile',
    header: 'Mobile',
    cell: (element: any) => `${element['mobile']}`,
    isText: true,
  },
  {
    columnDef: 'technology',
    header: 'Technology',
    cell: (element: any) => `${element['technology']}`,
    isText: true,
  },
 
  {
    columnDef: 'location',
    header: 'Location',
    cell: (element: any) =>
      `${element['location'].area} - ${element['location'].zone}`,
    isText: true,
  },
  {
    columnDef: 'action',
    header: 'Action',
    cell: (element: any) => (element === 'btn1' ? 'Edit' : 'Delete'),
    isMultiButton: true,
  },
];

export const userColumns = [
  {
    columnDef: 'firstName',
    header: 'User Name',
    cell: (element: any) => `${getFullName(element)}`,
    isText: true,
  },
  {
    columnDef: 'email',
    header: 'Email',
    cell: (element: any) => `${element['email']}`,
    isText: true,
  },
  {
    columnDef: 'mobile',
    header: 'Mobile',
    cell: (element: any) => `${element['mobile']}`,
    isText: true,
  },
  {
    columnDef: 'designation',
    header: 'Designation',
    cell: (element: any) => `${element['designation']}`,
    isText: true,
  },
  {
    columnDef: 'empId',
    header: 'Employee Id',
    cell: (element: any) => `${element['empId']}`,
    isText: true,
  },
  {
    columnDef: 'profileImageUrl',
    header: 'Profile Pic',
    cell: (element: any) => `${element['profileImageUrl']}`,
    isImage: true,
  },
  {
    columnDef: 'dob',
    header: 'Date of Birth',
    cell: (element: any) => `${new Date(element['dob']).toLocaleString()}`,
    isText: true,
  },
  {
    columnDef: 'action',
    header: 'Action',
    cell: (element: any) => (element === 'btn1' ? 'Edit' : 'Delete'),
    isMultiButton: true,
  },
];

export function getFullName(data: any) {
  if (data.firstName && data.lastName) {
    return data.firstName + ' ' + data.lastName;
  }
  if (data.firstName) {
    return data.firstname;
  }
  if (data.name) {
    return data.name;
  }
  return 'Invalid Name';
}
