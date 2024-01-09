import { Component, HostListener, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Chart, registerables } from 'node_modules/chart.js';
import { from } from 'rxjs';
import { LocationStrategy } from '@angular/common';
Chart.register(...registerables)
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  UserData: any;
  userTickets: any = [];
  Resolved: any;
  Assigned: any;
  pending: any;
  inprogress: any;
  displayColumns = ["client", "status", "user", "technology", "recivedDate"]
  stepper: any;

  constructor(private chatservice: ChatService, private location: LocationStrategy) {
    history.pushState(null, '', window.location.href);
    // check if back or forward button is pressed.
    this.location.onPopState(() => {
      history.pushState(null, '', window.location.href);
      // this.stepper.previous();
    });
  }
  ngOnInit(): void {
    this.chatservice.UserLoginData.subscribe((res) => {
      this.UserData = res;
      console.log(res, '000', this.UserData)
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
    console.log(resolved, '13', assigned)
    new Chart('piechart', {
      type: 'pie',
      data: {
        labels: ["Resolved", "Assigned", "Pending", "In Progress"],
        datasets: [{
          label: this.UserData.firstName,
          data: [resolved, assigned, pending, inprogress],
        }]
      },
      // options: {
      //   scales: {
      //     y: {
      //       beginAtZero: true
      //     }
      //   }
      // }
    });
  }

}
