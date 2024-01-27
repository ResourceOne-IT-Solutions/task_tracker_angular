import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chart, registerables } from 'node_modules/chart.js';
import { from } from 'rxjs';
import { LocationStrategy } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Column } from '../dash-board/dash-board.component';
import { Router } from '@angular/router';

Chart.register(...registerables);
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  requestchat = false;
  isupdatestatus = false;
  Userstatus = true;
  selectedstatus: any;
  date = new Date();
  @ViewChild('updateModel', { static: false }) updateModel: any;
  userstatus = ['In Progress', 'Pending', 'Resolved', 'Improper Requirment'];
  UserData: any;
  userTickets: any = [];
  // selectedIndex:any
  modelHeader: string = '';
  userID: any = [];
  updateForm: FormGroup;
  Resolved: any;
  Assigned: any;
  pending: any;
  inprogress: any;
  stepper: any;
  Improper: any;
  helpedTickets: any;
  ticketColumns: Array<Column> = [
    {
      columnDef: 'client',
      header: 'client Name',
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
        `${new Date(element['receivedDate']).toLocaleString()}`,
      isText: true,
    },
    {
      columnDef: 'assignedDate',
      header: 'Assigned Date',
      cell: (element: any) =>
        `${new Date(element['assignedDate']).toLocaleString()}`,
      isText: true,
    },
    {
      columnDef: 'description',
      header: 'Description',
      cell: (element: any) => `${element['description']}`,
      isText: true,
    },
    {
      columnDef: 'comments',
      header: 'Comments',
      cell: (element: any) => `${element['comments']}`,
      isText: true,
    },
    {
      columnDef: 'closedDate',
      header: 'Closed Date',
      cell: (element: any) =>
        `${new Date(element['closedDate']).toLocaleString()}`,
      isText: true,
    },
    {
      columnDef: 'targetDate',
      header: 'Target Date',
      cell: (element: any) =>
        `${new Date(element['targetDate']).toLocaleString()}`,
      isText: true,
    },
    {
      columnDef: 'status',
      header: 'status',
      cell: (element: any) => `${element['status']}`,
      isText: true,
    },
    {
      columnDef: 'TicketRaised',
      header: 'Ticket Rise',
      cell: (element: any) =>
        element === 'btn1' ? 'Update Ticket' : 'Request ticket',
      isMultiButton: true,
    },
  ];

  displayColumns = [
    'client',
    'status',
    'user',
    'technology',
    'recivedDate',
    'TicketRaised',
    'description',
    'comments',
  ];
  clientDetails: any;
  currentUser: any;
  userList: any;
  SelectedUserdata: any;
  statuschange: any;
  resourceAssigned: any;
  constructor(
    private chatservice: ChatService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private location: LocationStrategy,
  ) {
    history.pushState(null, '', window.location.href);
    // check if back or forward button is pressed.
    this.location.onPopState(() => {
      history.pushState(null, '', window.location.href);
      // this.stepper.previous();
    });
    this.updateForm = this.fb.group({
      description: ['', Validators.required],
      comments: ['', Validators.required],
      status: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.currentUser = res;
    });
    //AllUserList.....
    this.chatservice.getAllUsers().subscribe((res) => {
      this.userList = res;
    });
    this.chatservice.getSocketData('adminMessageToAll').subscribe((res) => {
      alert(
        `Send By AdminName: ${res.sender.name} ,    Admin message  : ${res.content}`,
      );
    });
    this.chatservice.getSocketData('statusUpdate').subscribe((res) => {
      this.UserData = res;
    });

    this.chatservice.getTicketSocketData('ticketAssigned').subscribe((data) => {
      alert(`${data.sender.name} assigned you a ticket`);
    });
    this.chatservice
      .getSocketData('resourceAssigned')
      .subscribe(({ resource, sender, ticket, user }) => {
        if (this.currentUser._id === resource.id) {
          alert(
            `${user.name} is  needs ur help for the ${ticket.name} ticket, ${sender.name} assigned you as a resource`,
          );
        } else if (this.currentUser._id === user.id) {
          alert(
            `${sender.name} assigned  ${resource.name} as a resource for your ${ticket.name} ticket`,
          );
        }
      });

    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.UserData = res;
    });

    this.chatservice.getAllTickets().subscribe((res: any) => {
      this.userTickets = res.filter(
        (item: any) => item.user.id === this.currentUser._id,
      );

      (this.Resolved = this.userTickets.filter(
        (val: any) => val.status == 'Resolved',
      ).length),
        (this.Assigned = this.userTickets.filter(
          (val: any) => val.status == 'Assigned',
        ).length),
        (this.pending = this.userTickets.filter(
          (val: any) => val.status == 'Pending',
        ).length),
        (this.Improper = this.userTickets.filter(
          (val: any) => val.status == 'Improper Requirment',
        ).length),
        (this.helpedTickets = this.UserData.helpedTickets),
        (this.inprogress = this.userTickets.filter(
          (val: any) => val.status == 'In Progress',
        ).length);
      this.pieChart(
        this.Resolved,
        this.Assigned,
        this.pending,
        this.inprogress,
        this.helpedTickets,
        this.Improper,
      );
    });
  }
  pieChart(
    resolved: any,
    assigned: any,
    pending: any,
    inprogress: any,
    helped: any,
    Improper: any,
  ) {
    new Chart('piechartdemo', {
      type: 'pie',
      data: {
        labels: [
          'Resolved',
          'Assigned',
          'Pending',
          'InProgress',
          'HelpedTickets',
          'ImproperRequirement',
        ],
        datasets: [
          {
            label: this.chatservice.getFullName(this.UserData),
            data: [resolved, assigned, pending, inprogress, helped, Improper],
          },
        ],
      },
    });
  }

  deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  }
  update(userDetails: any) {
    this.modelHeader = 'Update Ticket';
    this.userID = userDetails._id;
    this.clientDetails = userDetails;
    this.openPopup(this.updateModel);
    this.updateForm.patchValue({
      description: userDetails.description,
      comments: userDetails.comments,
      status: userDetails.status,
    });
  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  updateUser(dismiss: any) {
    if (this.updateForm.valid) {
      const ticketpayload = {
        id: this.userID,
        data: {
          ...this.updateForm.value,
          updatedBy: {
            name: this.chatservice.getFullName(this.UserData),
            id: this.UserData._id,
          },
        },
      };
      this.chatservice.updateTicket(ticketpayload).subscribe((res: any) => {
        this.userTickets = this.userTickets.map((val: any) => {
          if (val._id === res._id) {
            val = res;
            return res;
          }
          return val;
        });

        this.updateForm.reset();
      });
      dismiss();
    }
  }
  cancel(dismiss: any) {
    dismiss();
  }

  requestChat() {
    this.requestchat = !this.requestchat;
  }
  sendadmin() {
    this.requestchat = !this.requestchat;
    this.chatservice.sendSocketData({
      key: 'requestChat',
      data: {
        user: {
          name: this.chatservice.getFullName(this.currentUser),
          id: this.currentUser._id,
        },
        opponent: {
          name: this.chatservice.getFullName(this.SelectedUserdata),
          id: this.SelectedUserdata._id,
        },
      },
    });
    alert('request send admin');
  }

  updateStatus() {
    this.isupdatestatus = !this.isupdatestatus;
  }
  selectuser(data: any) {
    this.SelectedUserdata = data;
  }

  routeToTickets(data: any) {
    this.chatservice.getuserTicketById(data);
    const CilentPayload = {
      client: {
        name: data.client.name,
        id: data.client.id,
      },
      sender: {
        name: this.chatservice.getFullName(this.currentUser),
        id: this.currentUser._id,
      },
    };
    this.chatservice.sendSocketData({
      key: 'requestTickets',
      data: CilentPayload,
    });
    alert('Request Sent Successfully............');
  }
}
