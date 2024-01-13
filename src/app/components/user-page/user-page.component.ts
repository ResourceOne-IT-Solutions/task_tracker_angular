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

  requestchat = false;
  isupdatestatus = false
  susers = ['Offline', 'Busy', 'Available'];
  selectedstatus: any;
  date = new Date();
  @ViewChild('updateModel', { static: false }) updateModel: any;
  userstatus = ['In Progress', 'Pending', 'Resolved', 'Improper requirement'];
  selectusers = ['user1', 'user2', 'user3',]
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
    { columnDef: 'TicketRaised', header: 'Ticket Rise', cell: (element: any) => element === 'btn1' ? 'Update Ticket' : 'Request ticket', isMultiButton: true },
  ];

  displayColumns = ["client", "status", "user", "technology", "recivedDate", "TicketRaised", "description", "comments"]
  clientDetails: any;
  constructor(private chatservice: ChatService, private router: Router, private fb: FormBuilder, private modalService: NgbModal, private location: LocationStrategy) {
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
    this.chatservice.getNewUser().subscribe(res => {
      alert(`${res.name} set message to you`)
     })
    this.chatservice.UserLoginData.subscribe((res: any) => {
      this.UserData = res;
      console.log(this.UserData, 'userdata')
    })
    this.chatservice.getAllTickets().subscribe((res: any) => {
      console.log(res, '73:::::')
      this.userTickets = res.filter((item: any) =>
        item.user.id === this.UserData._id
      )
      console.log(this.userTickets, '68::::')
      this.Resolved = this.userTickets.filter((val: any) => val.status === 'Resolved').length,
        this.Assigned = this.userTickets.filter((val: any) => val.status === 'Assigned').length,
        this.pending = this.userTickets.filter((val: any) => val.status === 'Pending').length,
        this.Improper = this.userTickets.filter((val: any) => val.status === 'Improper requirement').length,
        this.helpedTickets = this.UserData.helpedTickets,
        this.pieChart(this.Resolved, this.Assigned, this.pending, this.inprogress, this.helpedTickets, this.Improper);
      this.inprogress = this.userTickets.filter((val: any) => val.status.toLowerCase() == 'in progress' || val.status.toLowerCase() == 'in progess').length
    })
  }
  pieChart(resolved: any, assigned: any, pending: any, inprogress: any, helped: any, Improper: any) {
    new Chart('piechart', {
      type: 'pie',
      data: {
        labels: ["Resolved", "Assigned", "Pending", "In Progress", "HelpedTickets", "ImproperRequirement"],
        datasets: [{
          label: this.UserData.firstName,
          data: [resolved, assigned, pending, inprogress, helped, Improper],
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
    console.log('update')
    if (this.updateForm.valid) {

      const ticketpayload = {
        id: this.userID,
        data: this.updateForm.value
      }

      this.chatservice.updateTicket(ticketpayload).subscribe((res: any) => {
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

  requestChat() {
    this.requestchat = !this.requestchat;
    console.log(this.requestchat, '139::::')
  }
  sendadmin() {
    this.requestchat = !this.requestchat;
    alert('request send admin')
    // if(this.requestchat){
    //   console.log('if.....')
    // }
    // else {
    //   this.requestchat = false;
    //   console.log('else')

    // }


  }

  updateStatus() {
    console.log('update status')
    this.isupdatestatus = !this.isupdatestatus
  }

  selectChange(data: any) {
    const updatepayload = {
      id: this.UserData._id,
      data: {
        status: data
      }
    }
    this.chatservice.UpdateUsers(updatepayload).subscribe((res: any) => {
      console.log(res,)
      this.isupdatestatus = !this.isupdatestatus;
    })

  }

  selectuser(data: any) {
    console.log(data, 'selecteduser')

  }


  routeToTickets(data: any) {
    this.router.navigate(['/tickets'])
  }

}

