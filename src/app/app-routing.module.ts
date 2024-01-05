import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WellComePageComponent } from './well-come-page/well-come-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { guardGuard } from './services/auth/guard.guard';
import { UserPageComponent } from './user-page/user-page.component';

const routes: Routes = [
  { path: '', component: WellComePageComponent },
  { path: 'login_page', component: LoginPageComponent },
  { path: 'dashboard', component: DashBoardComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'User-page', component: UserPageComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
