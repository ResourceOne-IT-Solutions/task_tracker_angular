import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  UserData: any;
  ngOnInit(): void {
   const local:any =  localStorage.getItem('userData');
   this.UserData = JSON.parse(local);
   console.log(this.UserData , 'user')
  }

}
