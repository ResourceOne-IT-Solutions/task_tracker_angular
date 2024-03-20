import { getBreakTimings } from 'src/app/utils/util';
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
    columnDef: 'addOnResource',
    header: 'Helped By',
    cell: (element: any) =>
      `${element['addOnResource']?.map((res: any) => res.name)?.toString() || '--'}`,
    isText: true,
  },
  {
    columnDef: 'comments',
    header: 'comments',
    cell: (element: any) => `${element['comments'] || '--'} `,
    isText: true,
  },
];

export const footerColumns = [
  {
    columnDef: 'description',
    header: 'description',
    cell: (element: any) => `${element['description']}`,
    isText: true,
    isLink: true,
  },
  {
    columnDef: 'status',
    header: 'status',
    cell: (element: any) => `${element['status']}`,
    isText: true,
  },
];
export const Tickets: Array<Column> = [
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
    columnDef: 'addOnResource',
    header: 'Helped By',
    cell: (element: any) =>
      `${element['addOnResource']?.map((res: any) => res.name)?.toString() || '--'}`,
    isText: true,
  },
  {
    columnDef: 'description',
    header: 'description',
    cell: (element: any) => `${element['description'].substring(0, 20) + '..'}`,
    isText: true,
    isLink: true,
  },
  {
    columnDef: 'comments',
    header: 'comments',
    cell: (element: any) => {
      const description = element['comments'];
      return description.length > 20
        ? `${description.substring(0, 20)}..`
        : description || '--';
    },
    isText: true,
  },
  {
    columnDef: 'status',
    header: 'status',
    cell: (element: any) => `${element['status']}`,
    isText: true,
  },
];

export const description = [
  {
    columnDef: 'description',
    header: 'Description',
    cell: (element: any) => `${element['description']}`,
    isText: true,
    isLink: true,
  },
];
export const description2 = [
  {
    columnDef: 'description',
    header: 'description',
    cell: (element: any) => `${element['description']}`,
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
    cell: (element: any) => (element.isClosed ? 'ReOpen' : 'Close'),
    isButton: true,
  },
];

// user and client columns

export const clientColumns = [
  {
    columnDef: 'firstName',
    header: 'Client Name',
    cell: (element: any) => `${element['firstName']}`,
    // isText: true,
    isMouseOver: true,
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
    isTemplate: true,
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
export const usersStatusColumns = [
  {
    columnDef: 'available',
    header: 'Name',
    cell: (element: any) => `${getFullName(element)}`,
    isMouseOver: true,
  },
  {
    columnDef: 'designation',
    header: 'Designation',
    cell: (element: any) => `${element['designation']}`,
    isText: true,
  },
  {
    columnDef: 'profileImageUrl',
    header: 'profile pic',
    cell: (element: any) => `${element['profileImageUrl']}`,
    isImage: true,
  },
];
export const UserBreaksTimings = [
  {
    columnDef: 'startDate',
    header: 'Date',
    cell: (element: any) => `${element[0]}`,
    isText: true,
  },
  {
    columnDef: 'Breaks',
    header: 'Breaks',
    cell: (element: any) => `${element[1].length}`,
    isMouseOver: true,
  },
  {
    columnDef: 'duration',
    header: 'Duration',
    cell: (element: any) =>
      `${getBreakTimings(
        element[1].reduce(
          (acc: number, obj: any) => acc + (obj?.duration || 0),
          0,
        ),
      )}`,
    isText: true,
  },
];

export const UserLoginTimings = [
  {
    columnDef: 'date',
    header: 'Date',
    cell: (element: any) => {
      const date = new Date(element['date']);
      return `${date.toLocaleDateString()}`;
    },
    isText: true,
  },
  {
    columnDef: 'inTime',
    header: 'Login',
    cell: (element: any) => `${element['inTime']}`,
    isText: true,
  },
  {
    columnDef: 'outTime',
    header: 'Logout',
    cell: (element: any) =>
      `${element['outTime']}` ? `${element['outTime']}` : '--',
    isText: true,
  },
  {
    columnDef: 'Active',
    header: 'Active',
    cell: (element: any) => {
      const inTime = new Date('2000-01-01 ' + `${element['inTime']}`);
      const outTime = element['outTime']
        ? new Date('2000-01-01 ' + `${element['outTime']}`)
        : null;
      if (outTime) {
        const timeDifferenceMs = outTime.getTime() - inTime.getTime();
        const hours = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
        const minutes = Math.floor(
          (timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((timeDifferenceMs % (1000 * 60)) / 1000);
        return `${hours}:${minutes}:${seconds}`;
      } else {
        return 'Invalid';
      }
    },
    isText: true,
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

export const BreaksTimings = [
  {
    columnDef: 'status',
    header: 'Break Type',
    cell: (element: any) => `${element['status']}`,
    isText: true,
  },
  {
    columnDef: 'startTime',
    header: 'Start',
    cell: (element: any) => {
      const startTime = new Date(element['startTime']);
      const timeString = startTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return timeString;
    },
    isText: true,
  },
  {
    columnDef: 'endTime',
    header: 'End',
    cell: (element: any) => {
      const startTime = new Date(element['endTime']);
      const timeString = startTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return timeString;
    },
    isText: true,
  },
  {
    columnDef: 'duration',
    header: 'Duration',
    cell: (element: any) => `${getBreakTimings(element['duration'])}`,
    isText: true,
  },
];
