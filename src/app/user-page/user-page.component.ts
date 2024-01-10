import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Chart, registerables } from 'node_modules/chart.js';
import { from } from 'rxjs';
import { LocationStrategy } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Column } from '../dash-board/dash-board.component';

Chart.register(...registerables)
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
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
  ticketColumns: Array<Column> = [
    { columnDef: 'client', header: 'client name', cell: (element: any) => `${element['client'].name}`, isText: true },
    { columnDef: 'status', header: 'status', cell: (element: any) => `${element['status']}`, isText: true },
    { columnDef: 'user', header: 'user name', cell: (element: any) => `${element['user'].name || '--'}`, isText: true },
    { columnDef: 'technology', header: 'Technology', cell: (element: any) => `${element['technology']}`, isText: true },
    { columnDef: 'receivedDate', header: 'receivedDate', cell: (element: any) => `${element['receivedDate']}`, isText: true  },
    { columnDef: 'TicketRaised', header: 'Ticket Rise', cell: (element: any) => 'Update Ticket', isButton : true },
  ];
  displayColumns = ["client", "status", "user", "technology", "recivedDate", "TicketRaised"]
  constructor(private chatservice: ChatService, private fb: FormBuilder, private modalService: NgbModal, private location: LocationStrategy) {
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
    this.chatservice.UserLoginData.subscribe((res) => {
      this.UserData = res;
      console.log(res,'555555555', this.UserData)
    })
    this.chatservice.getAllTickets().subscribe((res: any) => {
      this.userTickets = res.filter((item: any) =>
        item.user.id === this.UserData._id
      )
      console.log(res, '239:::', this.userTickets)
      this.Resolved = this.userTickets.filter((val: any) => val.status === 'Resolved').length,
        this.Assigned = this.userTickets.filter((val: any) => val.status === 'Assigned').length,
        this.pending = this.userTickets.filter((val: any) => val.status === 'Pending').length,
        this.inprogress = this.userTickets.filter((val: any) => val.status === 'In Progress').length
      console.log(this.Resolved, '30000', this.Assigned)
      this.pieChart(this.Resolved, this.Assigned, this.pending, this.inprogress);
    })
  }
  pieChart(resolved: any, assigned: any, pending: any, inprogress: any) {
    new Chart('piechart', {
      type: 'pie',
      data: {
        labels: ["Resolved", "Assigned", "Pending", "In Progress"],
        datasets: [{
          label: this.UserData.firstName,
          data: [resolved, assigned, pending, inprogress],
        }]
      },
  
    });
  }
  
  update(userDetails: any) {
    // console.log(userDetails , '666')
    this.userID = userDetails._id;
  
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
      this.chatservice.updateUsers(this.userID, this.updateForm.value,).subscribe(res => {
  
        console.log(res, '83')
      })
      dismiss();
      this.updateForm.reset();
  
    }
  
  }
  cancel(dismiss: any){
    dismiss();
  
  }
  
}

