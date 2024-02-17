import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chart, registerables } from 'node_modules/chart.js';
import { from } from 'rxjs';
import { LocationStrategy, formatDate } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Column } from '../dash-board/dash-board.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogInfoComponent } from 'src/app/reusable/dialog-info/dialog-info.component';
import { MatDialog } from '@angular/material/dialog';

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
  userTickets: any = [];
  Closed: any;
  Assigned: any;
  pending: any;
  inprogress: any;
  stepper: any;
  Improper: any;
  helpedTickets: any;
  currentUser: any;
  userList: any;
  SelectedUserdata: any;
  statusByDate: any;
  loginTime: any;
  isAdminView: boolean = false;
  paramId: any;
  breakTimes: any;
  loginTiming: any;
  'cstDate': string;
  'pstDate': string;
  'est': string;
  //ToolTip.
  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right',
  ];
  position = new FormControl(this.positionOptions[0]);
  pieChartLabels: string[] = [
    'resolved',
    'Pending',
    'In Progress',
    'Improper Requirment',
    'Closed',
    'Assigned',
    'Not Assigned',
  ];
  pieChartColors: string[] = [
    'blue',
    'gray',
    'yellow',
    'green',
    'red',
    'purple',
  ];
  url: any;
  UserPiechart: any = [];
  constructor(
    public chatservice: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private location: LocationStrategy,
    private http: HttpClient,
    private dialog: MatDialog,
  ) {
    history.pushState(null, '', window.location.href);
    // check if back or forward button is pressed.
    this.location.onPopState(() => {
      history.pushState(null, '', window.location.href);
      // this.stepper.previous();
    });
  }
  ngOnInit(): void {
    this.url = this.chatservice.BE_URL;
    this.chatservice.getSocketData('ticketRaiseStatus').subscribe((res) => {
      this.dialog.open(DialogInfoComponent, {
        data: {
          title: 'Ticket Raise Status',
          class: 'info',
          message: res,
          btn1: 'Close',
        },
      });
    });
    setInterval(() => {
      let Estdate = new Date();
      this.est = Estdate.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
      });
      var myDate = new Date();
      this.pstDate = myDate.toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
      });
      var myDate = new Date();
      this.cstDate = myDate.toLocaleTimeString('en-US', {
        timeZone: 'America/Chicago',
      });
    }, 1000);
    this.paramId = this.route.snapshot.paramMap.get('id');
    this.chatservice.UserLoginData.subscribe((res: any) => {
      if (this.paramId) {
        this.isAdminView = true;
      } else {
        this.currentUser = res;
        this.breakLoginTimeings(this.currentUser);
        this.statusByDate = this.statusGroupedByDate();
      }
    });
    //AllUserList.....
    this.chatservice.getAllUsers().subscribe((res) => {
      this.userList = res.filter((val: any) => {
        return !val.isAdmin;
      });
      if (this.paramId) {
        this.currentUser = this.userList.find(
          (val: any) => val._id === this.paramId,
        );
        this.breakLoginTimeings(this.currentUser);
      }
    });
    this.chatservice.getSocketData('adminMessageToAll').subscribe((res) => {
      const message = `Send By AdminName: ${res.sender.name} ,  Admin message  : ${res.content}`;

      this.dialog.open(DialogInfoComponent, {
        data: {
          title: 'Admin Message',
          class: 'info',
          message: message,
          btn1: 'Close',
        },
      });
      const payload = {
        status: 'DELIVERY',
        messageId: res._id,
        userId: this.currentUser._id,
      };
      this.chatservice.sendSocketData({
        key: 'updateAdminMessageStatus',
        data: payload,
      });
    });

    this.chatservice.getSocketData('statusUpdate').subscribe((res) => {
      this.currentUser = res;
    });

    this.chatservice.getTicketSocketData('ticketAssigned').subscribe((data) => {
      const message = `${data.sender.name} assigned you a ticket`;
      this.dialog.open(DialogInfoComponent, {
        data: {
          title: 'Admin Message',
          class: 'info',
          message: message,
          btn1: 'Close',
        },
      });
    });
    this.chatservice
      .getSocketData('resourceAssigned')
      .subscribe(({ resource, sender, ticket, user }) => {
        if (this.currentUser._id === resource.id) {
          const message = `${user.name} is  needs ur help for the ${ticket.name} ticket, ${sender.name} assigned you as a resource`;
          this.dialog.open(DialogInfoComponent, {
            data: {
              title: 'Admin Message',
              class: 'info',
              message: message,
              btn1: 'Close',
            },
          });
        } else if (this.currentUser._id === user.id) {
          const message = `${sender.name} assigned  ${resource.name} as a resource for your ${ticket.name} ticket`;

          this.dialog.open(DialogInfoComponent, {
            data: {
              title: 'Admin Message',
              class: 'info',
              message: message,
              btn1: 'Close',
            },
          });
        }
      });

    this.chatservice
      .getUsertickets(this.currentUser._id)
      .subscribe((res: any) => {
        if (this.currentUser) {
          this.userTickets = res.filter(
            (item: any) => item.user.id === this.currentUser._id,
          );
          const resolvedTickets = this.chatservice.getTicketStatus(
            this.userTickets,
            'resolved',
          );
          const pendingTickets = this.chatservice.getTicketStatus(
            this.userTickets,
            'pending',
          );
          const inprogressTickets = this.chatservice.getTicketStatus(
            this.userTickets,
            'in progress',
          );
          const improper = this.chatservice.getTicketStatus(
            this.userTickets,
            'improper requirment',
          );
          const Closed = this.chatservice.getTicketStatus(
            this.userTickets,
            'closed',
          );
          const Assigned = this.chatservice.getTicketStatus(
            this.userTickets,
            'assigned',
          );
          const notAssigned = this.chatservice.getTicketStatus(
            this.userTickets,
            'Not Assigned',
          );
          const data = [
            resolvedTickets,
            pendingTickets,
            inprogressTickets,
            improper,
            Closed,
            Assigned,
            notAssigned,
          ];
          this.UserPiechart = {
            colors: this.pieChartColors,
            labels: this.pieChartLabels,
            data: data,
          };
        }
      });
  }
  breakLoginTimeings(user: any) {
    const statusByBreak = this.statusGroupedByDate();
    const loginTime = this.loginTimeGroupedByDate();
    this.breakTimes = statusByBreak ? statusByBreak[0] : undefined;
    this.loginTiming = loginTime ? loginTime : undefined;
  }
  loginTimeGroupedByDate() {
    const groupByTime = this.chatservice.groupByDate(
      this.currentUser.loginTimings,
      'date',
    );
    return Object.keys(groupByTime)
      .map((date) => ({
        date: this.formatDate(date),
        loginTime: groupByTime[date].map((time: any) => {
          time.inTime = time.inTime
            ? new Date(time.inTime).toLocaleTimeString()
            : '';
          time.outTime = time.outTime
            ? new Date(time.outTime).toLocaleTimeString()
            : '';
          return time;
        }),
      }))
      .sort((a: any, b: any) => (a.date < b.date ? 1 : -1));
  }
  statusGroupedByDate() {
    const groupedStatus = this.chatservice.groupByDate(
      this.currentUser.breakTime,
      'startDate',
    );
    return Object.keys(groupedStatus)
      .map((date) => ({
        date: this.formatDate(date),
        status: groupedStatus[date],
      }))
      .sort((a: any, b: any) => (a.date < b.date ? 1 : -1));
  }
  private formatDate(date: string): string {
    const today = new Date();
    const statusdate = new Date(date);
    if (today.toLocaleDateString() === statusdate.toLocaleDateString()) {
      return 'Today';
    } else {
      return formatDate(date, 'dd/MM/yyyy', 'en-US');
    }
  }

  deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
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
  }

  updateStatus() {
    this.isupdatestatus = !this.isupdatestatus;
  }
  selectuser(data: any) {
    this.SelectedUserdata = data;
  }
}
