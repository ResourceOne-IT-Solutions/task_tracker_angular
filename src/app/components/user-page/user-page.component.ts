import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Chart, registerables } from 'node_modules/chart.js';
import { from } from 'rxjs';
import { LocationStrategy } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Column } from '../dash-board/dash-board.component';
import { Router } from '@angular/router';

Chart.register(...registerables)
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  date = new Date();
  @ViewChild('updateModel', { static: false }) updateModel: any;
  userstatus = ['In Progess', 'Pending', 'Resolved'];
  UserData: any;
  userTickets: any = [];
  modelHeader: string = ''
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
    { columnDef: 'client', header: 'client name', cell: (element: any) => `${element['client'].name}`, isText: true },
    { columnDef: 'status', header: 'status', cell: (element: any) => `${element['status']}`, isText: true },
    { columnDef: 'user', header: 'user name', cell: (element: any) => `${element['user'].name || '--'}`, isText: true },
    { columnDef: 'technology', header: 'Technology', cell: (element: any) => `${element['technology']}`, isText: true },
    { columnDef: 'description', header: 'Description', cell: (element: any) => `${element['description']}`, isText: true },
    { columnDef: 'comments', header: 'comments', cell: (element: any) => `${element['comments']}`, isText: true },
    { columnDef: 'receivedDate', header: 'receivedDate', cell: (element: any) => `${new Date(element['receivedDate']).toLocaleString()}`, isText: true },
    { columnDef: 'TicketRaised', header: 'Ticket Rise', cell: (element: any) =>  element === 'btn1' ? 'Update Ticket'  : 'request ticket', isMultiButton: true },
  ];

  displayColumns = ["client", "status", "user", "technology", "recivedDate", "TicketRaised" , "description" ,"comments"]
  clientDetails: any;
  constructor(private chatservice: ChatService,private router :Router , private fb: FormBuilder, private modalService: NgbModal, private location: LocationStrategy) {
    history.pushState(null, '', window.location.href);
    // check if back or forward button is pressed.
    this.location.onPopState(() => {
      history.pushState(null, '', window.location.href);
      // this.stepper.previous();
    });
    this.updateForm = this.fb.group({
      description: ['', Validators.required],
      comments: ['', Validators.required],
      status: ['', Validators.required]


    })
  }
  ngOnInit(): void {
    this.chatservice.UserLoginData.subscribe((res:any) => {
      this.UserData = res;
    })
    this.chatservice.getAllTickets().subscribe((res: any) => {
      this.userTickets = res.filter((item: any) =>
      item.user.id === this.UserData._id
      )
      console.log(this.userTickets,'68::::')
      this.Resolved = this.userTickets.filter((val: any) => val.status === 'Resolved').length,
        this.Assigned = this.userTickets.filter((val: any) => val.status === 'Assigned').length,
        this.pending = this.userTickets.filter((val: any) => val.status === 'Pending').length,
        this.Improper  = this.userTickets.filter((val: any) => val.status === 'Improper').length,
        this.helpedTickets = this.UserData.helpedTickets,
        this.pieChart(this.Resolved, this.Assigned, this.pending, this.inprogress,this.helpedTickets,this.Improper);
        this.inprogress = this.userTickets.filter((val: any) => val.status.toLowerCase() == 'in progress' || val.status.toLowerCase() == 'in progess').length
    })
  }
  pieChart(resolved: any, assigned: any, pending: any, inprogress: any,helped:any,Improper:any) {
    new Chart('piechart', {
      type: 'pie',
      data: {
        labels: ["Resolved", "Assigned", "Pending", "In Progress","HelpedTickets","ImproperRequirement"],
        datasets: [{
          label: this.UserData.firstName,
          data: [resolved, assigned, pending, inprogress,helped,Improper],
        }]
      },
    });
  }
  Logout() {
    this.deleteCookie('token')
    this.router.navigate(['/'])
  }
  deleteCookie(name: string) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  }
  update(userDetails: any) {
    this.modelHeader = 'Update Ticket'
    this.userID = userDetails._id;
    this.clientDetails = userDetails
    this.openPopup(this.updateModel)
    this.updateForm.patchValue({
      description: userDetails.description,
      comments: userDetails.comments,
      status: userDetails.status
    })

  }
  openPopup(content: any): void {
    this.modalService.open(content);
  }
  updateUser(dismiss: any) {
    if (this.updateForm.valid) {
      this.chatservice.updateUsers(this.userID, this.updateForm.value,).subscribe((res: any) => {
        this.userTickets = this.userTickets.map((val: any) => {
          if (val._id === res._id) {
            val = res;
            return res
          }
          return val

        })

        this.updateForm.reset();
      })
      dismiss();

    }

  }
  cancel(dismiss: any) {
    dismiss();
  }

}

