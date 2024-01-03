import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WellComePageComponent } from './well-come-page/well-come-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashBoardComponent } from './dash-board/dash-board.component';

const routes: Routes = [
  {path:'',component:WellComePageComponent},
  {path:'login_page',component:LoginPageComponent},
  {path:'dashboard', component:DashBoardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
