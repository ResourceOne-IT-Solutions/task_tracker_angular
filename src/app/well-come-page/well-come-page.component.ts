import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-well-come-page',
  templateUrl: './well-come-page.component.html',
  styleUrls: ['./well-come-page.component.scss']
})
export class WellComePageComponent {
  constructor(private route:Router){}
  User_Login_page(){
    this.route.navigate(['login_page'])
  }
}
