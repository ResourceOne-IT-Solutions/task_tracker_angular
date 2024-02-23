import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { getTicketsData } from 'src/app/chat-store/table.selector';
import { Tickets, description } from '../userlist/tabledata';

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
  ClientPieChart: any = [];
  pieChartColors: string[] = [
    'blue',
    'gray',
    'yellow',
    'green',
    'red',
    'purple',
  ];
  pieChartLabels: string[] = [
    'Closed',
    'Assigned',
    'Pending',
    'In Progress',
    'Not Assigned',
    'Improper Requirment',
  ];
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
        if (this.clientTicketById.length) {
          const statusData = this.chatservice.getPieChartData(
            this.clientTicketById,
          );
          const sortedValues: number[] = this.pieChartLabels.map(
            (label) => statusData[label] || 0,
          );
          this.ClientPieChart = {
            colors: this.pieChartColors,
            labels: this.pieChartLabels,
            data: sortedValues,
          };
        }
      });
    }
  }
  goback() {
    this.location.back();
  }
}
