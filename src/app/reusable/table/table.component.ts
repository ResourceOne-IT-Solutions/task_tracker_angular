import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() data: any;
  dataSource = new MatTableDataSource();
  @Input() displayedColumns: any
  @ViewChild(MatPaginator) 'paginator': MatPaginator;
  @ViewChild(MatSort) 'sort': MatSort;
  @Output() editData = new EventEmitter();
  @Output() updateData = new EventEmitter();
  @Output() userDetails = new EventEmitter()

  ngOnInit() {
    this.dataSource.data = this.data
  }
  ngOnChanges(change: SimpleChanges) {
    if (change['data']) {
      this.dataSource.data = this.data
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  edit(data: any) {
    this.editData.emit(data)
  }
  update(data: any) {
    this.updateData.emit(data);
  }
  Delete(data: any) {

  }
  openUserDetails(userDetails:any) {
    this.userDetails.emit(userDetails)
  }
}
