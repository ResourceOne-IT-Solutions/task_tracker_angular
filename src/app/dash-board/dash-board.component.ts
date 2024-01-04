import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';


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
