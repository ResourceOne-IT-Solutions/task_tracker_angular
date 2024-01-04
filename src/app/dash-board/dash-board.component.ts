import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { JsonPipe } from '@angular/common';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'mahesh', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'emmanuel', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'naresh', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'bhaskar', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: '', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent {
  displayedColumns: string[] = ['firstName', 'designation', 'empId', 'dob', 'action'];
  dataSource: any;
  user: any;
  constructor(private chatservice: ChatService) { }
  ngOnInit() {
    this.user = localStorage.getItem('userData')
    console.log(this.user)
    this.chatservice.getAllUsers().subscribe(res => {
      this.dataSource = res
    })

  }
}
