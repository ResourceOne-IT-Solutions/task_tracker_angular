import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-well-come-page',
  templateUrl: './well-come-page.component.html',
  styleUrls: ['./well-come-page.component.scss']
})
export class WellComePageComponent {

  constructor(private Router: Router) {
  }
  userDash() {
    this.Router.navigate(['/login_page']);
  }
  adminDash() {
    this.Router.navigate(['/login_page']);
  }
}
