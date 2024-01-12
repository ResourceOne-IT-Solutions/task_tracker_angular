import { Component } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Column } from '../dash-board/dash-board.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent {
  searchText: string = '';
  selectedStatus: string = '';
  ticketsData: any = [];
  ticketColumns: Array<Column> = [
    { columnDef: 'client', header: 'client name', cell: (element: any) => `${element['client'].name}`, isText: true },
    { columnDef: 'status', header: 'status', cell: (element: any) => `${element['status']}`, isText: true },
    { columnDef: 'user', header: 'user name', cell: (element: any) => `${element['user'].name || '--'}`, isText: true },
    { columnDef: 'technology', header: 'Technology', cell: (element: any) => `${element['technology']}`, isText: true },
    { columnDef: 'receivedDate', header: 'receivedDate', cell: (element: any) => `${new Date(element['receivedDate']).toLocaleString()}`, isText: true },
    { columnDef: 'addOnResource', header: 'Helped By', cell: (element: any) => `${element['addOnResource']?.map((res: any) => res.name)?.toString() || '--'}`, isText: true },
    { columnDef: 'assignTicket', header: 'assignTicket', cell: (element: any) => element['user']?.name ? 'Add Resource' : 'Assign User', isButton: true },
  ];
  dateData: any = ['today', 'month', '3months', 'year']
  mockTicketsData: any = [];
  seletedDate: string = ''
  statusData: any;
  constructor(private chatservice: ChatService) {

  }
  ngOnInit() {
    this.chatservice.getAllTickets().subscribe((res: any) => {
      this.mockTicketsData = res
      this.ticketsData = res
      this.statusData = [...new Set(this.ticketsData.map((val: any) => val.status))]
    })
  }
  searchFilter() {
    this.ticketsData = this.mockTicketsData.filter((res: any) => res.client.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 || res.user.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1)
  }
  filterByStatus(evt:any) {
    this.ticketsData = this.mockTicketsData.filter((res: any) => res.status.toLowerCase() === this.selectedStatus.toLowerCase())
  }
  filterByDate(evt :any) {
    this.ticketsData = this.filterDates(this.seletedDate)
  }
  filterDates(selection: string) {
    const currentDate = new Date();

    switch (selection) {
      case 'today':
        return this.mockTicketsData.filter((val: any) => this.isToday(new Date(val.receivedDate), currentDate));
      case 'month':
        return this.mockTicketsData.filter((val: any) => this.isSameMonth(new Date(val.receivedDate), currentDate));
      case '3months':
        return this.mockTicketsData.filter((val: any) => this.isLastThreeMonths(new Date(val.receivedDate), currentDate));
      case 'year':
        return this.mockTicketsData.filter((val: any) => this.isSameYear(new Date(val.receivedDate), currentDate));
      default:
        return this.mockTicketsData;
    }
  }

  private isToday(date: Date, currentDate: Date): boolean {
    return date.toDateString() === currentDate.toDateString();
  }

  private isSameMonth(date: Date, currentDate: Date): boolean {
    return (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear());
  }

  private isLastThreeMonths(date: Date, currentDate: Date): boolean {
    const threeMonthsAgo = new Date(currentDate);
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
    return date >= threeMonthsAgo && date <= currentDate;
  }

  private isSameYear(date: Date, currentDate: Date): boolean {
    return date.getFullYear() === currentDate.getFullYear();
  }
}
