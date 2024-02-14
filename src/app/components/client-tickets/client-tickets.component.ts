import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';
import { Chart, registerables } from 'node_modules/chart.js';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { getTicketsData } from 'src/app/chat-store/table.selector';
import { Tickets, description } from '../userlist/tabledata';
Chart.register(...registerables);

@Component({
  selector: 'app-client-tickets',
  templateUrl: './client-tickets.component.html',
  styleUrls: ['./client-tickets.component.scss'],
})
export class ClientTicketsComponent implements OnInit {
  clientDataTable: any = {};
  clientTicketById: any = [];
  Closed: any;
  NotAssigned: any;
  Assigned: any;
  Pending: any;
  Improper: any;
  inprogress: any;
  paramId: any;
  clientChart: any;
  constructor(
    private chatservice: ChatService,
    private location: Location,
    private route: ActivatedRoute,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.paramId = this.route.snapshot.paramMap.get('id');

    if (this.paramId) {
      this.chatservice.get(`/clients/${this.paramId}`).subscribe((res) => {
        this.clientDataTable = res;
      });
      this.store.select(getTicketsData).subscribe((res: any) => {
        this.clientTicketById = res;
        if (this.clientTicketById) {
          const resolvedTickets = this.chatservice.getTicketStatus(
            this.clientTicketById,
            'resolved',
          );
          const pendingTickets = this.chatservice.getTicketStatus(
            this.clientTicketById,
            'pending',
          );
          const inprogressTickets = this.chatservice.getTicketStatus(
            this.clientTicketById,
            'in progress',
          );
          const assigned = this.chatservice.getTicketStatus(
            this.clientTicketById,
            'assigned',
          );
          const improper = this.chatservice.getTicketStatus(
            this.clientTicketById,
            'improper requirment',
          );
          const notAssigned = this.chatservice.getTicketStatus(
            this.clientTicketById,
            'not assigned',
          );
          this.pieChart(
            resolvedTickets,
            notAssigned,
            assigned,
            pendingTickets,
            improper,
            inprogressTickets,
          );
        }
      });
    }
  }

  pieChart(
    resolved: any,
    notassigned: any,
    assigned: any,
    pending: any,
    improper: any,
    inprogress: any,
  ) {
    if (this.clientChart) {
      this.clientChart.destroy();
    }
    this.clientChart = new Chart('piechart', {
      type: 'pie',
      data: {
        labels: [
          'Resoved',
          'NotAssigned',
          'Assigned',
          'Pending',
          'Improper',
          'InProgress',
        ],
        datasets: [
          {
            label: this.clientDataTable.firstName,
            data: [
              resolved,
              notassigned,
              assigned,
              pending,
              improper,
              inprogress,
            ],
          },
        ],
      },
    });
  }
  goback() {
    this.location.back();
  }
}
